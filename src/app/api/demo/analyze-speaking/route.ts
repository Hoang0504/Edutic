import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/db';
import { AIFeedback } from '@/models/AIFeedback';

interface SpeakingRequest {
  question: string;
  transcription: string;
  recordingTime: number;
  user_id?: number; // Optional for demo
}

interface DeepSeekResponse {
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

export async function POST(request: NextRequest) {
  try {
    const { question, transcription, recordingTime, user_id }: SpeakingRequest = await request.json();

    if (!question || !transcription) {
      return NextResponse.json(
        { error: 'Question and transcription are required' },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DEEPSEEK_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Construct prompt for DeepSeek to match AIFeedback table structure
    const prompt = `You are an expert TOEIC speaking examiner. Analyze the following speaking sample and provide detailed feedback in JSON format.

QUESTION: ${question}

STUDENT'S TRANSCRIBED ANSWER: ${transcription}

SPEAKING TIME: ${recordingTime} seconds

Return a JSON response with exactly this structure:
{
  "feedback_text": "Overall detailed feedback about the speaking performance (in Vietnamese)",
  "suggestions": "Specific actionable suggestions for improvement (in Vietnamese)", 
  "strengths": "What the student did well (in Vietnamese)",
  "weaknesses": "Areas that need improvement (in Vietnamese)",
  "score": (overall score from 1-10),
  "pronunciation_score": (pronunciation score from 1-10, estimated based on transcription quality),
  "fluency_score": (fluency score from 1-10, based on speech flow and time),
  "content_score": (content score from 1-10),
  "transcription": "The cleaned-up version of what the student said",
  "pronunciation_analysis": "Analysis of pronunciation based on transcription accuracy (in Vietnamese)"
}

Focus on these areas for TOEIC Speaking assessment:
1. Content relevance and completeness
2. Fluency and coherence (based on speaking time and transcript flow)
3. Vocabulary range and accuracy
4. Grammar structure
5. Estimated pronunciation quality (based on transcription clarity)

Consider that:
- Target speaking time was 60 seconds
- Actual speaking time was ${recordingTime} seconds
- Speech-to-text quality can indicate pronunciation clarity

Provide all feedback in Vietnamese. Be specific and constructive in your analysis.`;

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
      return NextResponse.json(
        { error: `DeepSeek API error: ${deepSeekResponse.status} - ${deepSeekResponse.statusText}` },
        { status: 500 }
      );
    }

    const deepSeekData = await deepSeekResponse.json();
    
    if (!deepSeekData.choices || !deepSeekData.choices[0] || !deepSeekData.choices[0].message) {
      console.error('Invalid DeepSeek response:', deepSeekData);
      return NextResponse.json(
        { error: 'Invalid response from DeepSeek API' },
        { status: 500 }
      );
    }

    let analysis: DeepSeekResponse;
    try {
      analysis = JSON.parse(deepSeekData.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse DeepSeek response:', deepSeekData.choices[0].message.content);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Save to database
    try {
      await sequelize.authenticate();
      console.log('Database connection established');
      
      const feedback = await AIFeedback.create({
        content_type: 'voice_recording' as any,
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
    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error analyzing speaking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 