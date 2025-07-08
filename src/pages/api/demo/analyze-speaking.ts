import { NextApiRequest, NextApiResponse } from 'next';
import sequelize from '@/lib/db';
import { AIFeedback } from '@/models/AIFeedback';

interface SpeakingRequest {
  question: string;
  transcription: string;
  recordingTime: number;
  user_id?: number; // Optional for demo
}

interface DeepSeekSpeakingResponse {
  feedback_text: string;
  suggestions: string;
  strengths: string;
  weaknesses: string;
  // Keep original format for frontend compatibility
  score?: number;
  pronunciation_score?: number;
  fluency_score?: number;
  content_score?: number;
  transcription?: string;
  pronunciation_analysis?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, transcription, recordingTime, user_id }: SpeakingRequest = req.body;

    if (!question || !transcription) {
      return res.status(400).json({ error: 'Question and transcription are required' });
    }

    // Check API key
    if (!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
      return res.status(500).json({ error: 'DEEPSEEK_API_KEY is not configured' });
    }

    // Construct prompt for DeepSeek to analyze speaking
    const prompt = `You are an expert TOEIC speaking examiner. Analyze the following speaking sample and provide detailed feedback in JSON format.

QUESTION: ${question}

STUDENT'S RESPONSE (transcribed): ${transcription}

SPEAKING TIME: ${recordingTime} seconds

Return a JSON response with exactly this structure:
{
  "feedback_text": "Overall detailed feedback about the speaking performance (in Vietnamese)",
  "suggestions": "Specific actionable suggestions for improvement (in Vietnamese)", 
  "strengths": "What the student did well (in Vietnamese)",
  "weaknesses": "Areas that need improvement (in Vietnamese)",
  "score": (overall score from 1-10),
  "pronunciation_score": (estimated pronunciation score from 1-10 based on text analysis),
  "fluency_score": (fluency score from 1-10 based on response length and coherence),
  "content_score": (content relevance score from 1-10),
  "transcription": "${transcription}",
  "pronunciation_analysis": "Analysis of likely pronunciation issues based on word choice and grammar patterns (in Vietnamese)"
}

Focus on these areas for TOEIC Speaking assessment:
1. Content - How well the response addresses the question
2. Fluency - Flow and natural speech patterns (estimate from text length and structure)
3. Vocabulary - Range and appropriateness of word choice
4. Grammar - Accuracy and complexity of sentence structures
5. Pronunciation - Estimate based on grammar patterns and word choices
6. Time management - Appropriate length for the time given

Consider that:
- Recommended speaking time is 45-60 seconds
- Current response time: ${recordingTime} seconds
- Shorter responses may indicate hesitation or lack of content
- Longer responses may indicate good fluency but check for relevance

Provide all feedback in Vietnamese. Be specific and constructive in your analysis. 
For pronunciation analysis, base your assessment on grammar complexity, word choice sophistication, and likely pronunciation challenges for Vietnamese speakers.`;

    // Call DeepSeek API
    const deepSeekResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!deepSeekResponse.ok) {
      const errorText = await deepSeekResponse.text();
      console.error('DeepSeek API error:', {
        status: deepSeekResponse.status,
        statusText: deepSeekResponse.statusText,
        response: errorText
      });
      return res.status(500).json({
        error: `DeepSeek API error: ${deepSeekResponse.status} - ${deepSeekResponse.statusText}`
      });
    }

    const deepSeekData = await deepSeekResponse.json();
    
    if (!deepSeekData.choices || !deepSeekData.choices[0] || !deepSeekData.choices[0].message) {
      console.error('Invalid DeepSeek response:', deepSeekData);
      return res.status(500).json({ error: 'Invalid response from DeepSeek API' });
    }

    let analysis: DeepSeekSpeakingResponse;
    try {
      analysis = JSON.parse(deepSeekData.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse DeepSeek response:', deepSeekData.choices[0].message.content);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    // Save to database
    try {
      await sequelize.authenticate();
      console.log('Database connection established');
      
      const feedback = await AIFeedback.create({
        content_type: 'speaking_submission' as any,
        content_id: user_id || 1,
        feedback_text: analysis.feedback_text,
        suggestions: analysis.suggestions || '',
        strengths: analysis.strengths || '',
        weaknesses: analysis.weaknesses || '',
        created_at: new Date(),
      } as any);

      console.log('Feedback saved to database:', feedback.id);
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Continue without saving to database but log the error
    }

    console.log('AI Analysis completed for speaking sample');
    return res.status(200).json(analysis);

  } catch (error) {
    console.error('Error analyzing speaking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}