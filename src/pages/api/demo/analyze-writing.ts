import { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/lib/db";
import { AIFeedback } from "@/models/AIFeedback";

interface WritingRequest {
  question: string;
  answer: string;
  user_id?: number; // Optional for demo
}

interface DeepSeekResponse {
  feedback_text: string;
  suggestions: string;
  strengths: string;
  weaknesses: string;
  // Keep original format for frontend compatibility
  score?: number;
  grammar_score?: number;
  vocabulary_score?: number;
  coherence_score?: number;
  content_analysis?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question, answer, user_id }: WritingRequest = req.body;

    if (!question || !answer) {
      return res
        .status(400)
        .json({ error: "Question and answer are required" });
    }

    // Check API key
    if (!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
      return res
        .status(500)
        .json({ error: "DEEPSEEK_API_KEY is not configured" });
    }

    // Construct prompt for DeepSeek to match AIFeedback table structure
    const prompt = `You are an expert TOEIC writing examiner. Analyze the following writing sample and provide detailed feedback in JSON format.

QUESTION: ${question}

STUDENT'S ANSWER: ${answer}

Return a JSON response with exactly this structure:
{
  "feedback_text": "Overall detailed feedback about the writing performance (in Vietnamese)",
  "suggestions": "Specific actionable suggestions for improvement (in Vietnamese)", 
  "strengths": "What the student did well (in Vietnamese)",
  "weaknesses": "Areas that need improvement (in Vietnamese)",
  "score": (overall score from 1-10),
  "grammar_score": (grammar score from 1-10),
  "vocabulary_score": (vocabulary score from 1-10),
  "coherence_score": (coherence score from 1-10),
  "content_analysis": "Analysis of how well content addresses the question (in Vietnamese)"
}

Focus on these areas for TOEIC Writing assessment:
1. Task Achievement - How well the response addresses the prompt
2. Grammar accuracy and complexity  
3. Vocabulary range and appropriateness
4. Coherence and organization
5. Language mechanics (spelling, punctuation)

Provide all feedback in Vietnamese. Be specific and constructive in your analysis.`;

    // Call DeepSeek API
    const deepSeekResponse = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 2000,
        }),
      }
    );

    if (!deepSeekResponse.ok) {
      const errorText = await deepSeekResponse.text();
      console.error("DeepSeek API error:", {
        status: deepSeekResponse.status,
        statusText: deepSeekResponse.statusText,
        response: errorText,
      });
      return res.status(500).json({
        error: `DeepSeek API error: ${deepSeekResponse.status} - ${deepSeekResponse.statusText}`,
      });
    }

    const deepSeekData = await deepSeekResponse.json();

    if (
      !deepSeekData.choices ||
      !deepSeekData.choices[0] ||
      !deepSeekData.choices[0].message
    ) {
      console.error("Invalid DeepSeek response:", deepSeekData);
      return res
        .status(500)
        .json({ error: "Invalid response from DeepSeek API" });
    }

    let analysis: DeepSeekResponse;
    try {
      analysis = JSON.parse(deepSeekData.choices[0].message.content);
    } catch (parseError) {
      console.error(
        "Failed to parse DeepSeek response:",
        deepSeekData.choices[0].message.content
      );
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    // Save to database
    try {
      await sequelize.authenticate();
      console.log("Database connection established");

      const feedback = await AIFeedback.create({
        content_type: "writing_submission" as any,
        content_id: user_id || 1,
        feedback_text: analysis.feedback_text,
        suggestions: analysis.suggestions || "",
        strengths: analysis.strengths || "",
        weaknesses: analysis.weaknesses || "",
        created_at: new Date(),
      } as any);

      console.log("Feedback saved to database:", feedback.id);
    } catch (dbError) {
      console.error("Database save error:", dbError);
      // Continue without saving to database but log the error
    }

    console.log("AI Analysis completed for writing sample");
    return res.status(200).json(analysis);
  } catch (error) {
    console.error("Error analyzing writing:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
