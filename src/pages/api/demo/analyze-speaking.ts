import type { NextApiRequest, NextApiResponse } from 'next';

interface AIFeedback {
  score: number;
  pronunciation_score?: number;
  fluency_score?: number;
  content_score?: number;
  strengths: string;
  weaknesses: string;
  suggestions: string[] | string;
  pronunciation_analysis?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AIFeedback | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    const { question, transcription, recordingTime, userAttemptPartId } = req.body;

    if (!transcription || !transcription.trim()) {
      return res.status(400).json({ error: 'Transcription is required' });
    }

    // Call DeepSeek API
    const deepSeekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `Bạn là một giám khảo TOEIC Speaking chuyên nghiệp. Hãy đánh giá bài nói của thí sinh và trả về phản hồi bằng tiếng Việt theo định dạng JSON chính xác như sau:

{
  "score": 8,
  "pronunciation_score": 7,
  "fluency_score": 8,
  "content_score": 9,
  "strengths": "Phát âm rõ ràng, nội dung phù hợp với chủ đề...",
  "weaknesses": "Cần cải thiện tốc độ nói, một số từ phát âm chưa chính xác...",
  "suggestions": [
    "Luyện tập phát âm từ vựng khó",
    "Tăng tốc độ nói tự nhiên",
    "Sử dụng nhiều từ nối hơn"
  ],
  "pronunciation_analysis": "Phân tích chi tiết về phát âm..."
}

Tiêu chí đánh giá:
- Pronunciation (Phát âm): 0-10
- Fluency (Lưu loát): 0-10  
- Content (Nội dung): 0-10
- Overall Score (Điểm tổng): 0-10

Hãy đánh giá nghiêm túc như kỳ thi thật.`
          },
          {
            role: 'user',
            content: `Đề bài: ${question}

Bài nói của thí sinh: "${transcription}"

Thời gian nói: ${recordingTime} giây

Hãy đánh giá bài nói này theo tiêu chuẩn TOEIC Speaking.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!deepSeekResponse.ok) {
      throw new Error(`DeepSeek API error: ${deepSeekResponse.status}`);
    }

    const deepSeekData = await deepSeekResponse.json();
    const aiResponse = deepSeekData.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse AI response
    let feedback;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      feedback = JSON.parse(jsonString);
    } catch (parseError) {
      feedback = {
        score: 5,
        strengths: "Có thể hiểu được nội dung cơ bản.",
        weaknesses: "Cần cải thiện tổng thể các kỹ năng nói.",
        suggestions: ["Luyện tập thêm", "Cải thiện phát âm", "Tăng độ lưu loát"],
        pronunciation_analysis: "Cần đánh giá thêm."
      };
    }

    // Save to database if userAttemptPartId is provided
    if (userAttemptPartId) {
      try {
        const { sequelize } = await import('@/lib/database');
        const { AiFeedback } = await import('@/models');

        await AiFeedback.create({
          content_type: 'user_attempt_parts',
          content_id: userAttemptPartId,
          feedback_text: JSON.stringify(feedback),
          suggestions: Array.isArray(feedback.suggestions) ? feedback.suggestions.join('\n') : feedback.suggestions,
          strengths: feedback.strengths,
          weaknesses: feedback.weaknesses,
          created_at: new Date(),
          updated_at: new Date()
        });
        console.log(`Saved AI feedback for user_attempt_part ${userAttemptPartId}`);
      } catch (dbError) {
        console.error('Database save error:', dbError);
      }
    }

    res.status(200).json(feedback);

  } catch (error) {
    console.error('Error analyzing speaking:', error);
    res.status(500).json({ error: 'Failed to analyze speaking' });
  }
} 