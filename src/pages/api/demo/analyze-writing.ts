import type { NextApiRequest, NextApiResponse } from 'next';

interface AIFeedback {
  score: number;
  grammar_score?: number;
  vocabulary_score?: number;
  coherence_score?: number;
  task_achievement_score?: number;
  strengths: string;
  weaknesses: string;
  suggestions: string[] | string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AIFeedback | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { question, essay, userAttemptPartId } = req.body;

    if (!essay || !essay.trim()) {
      return res.status(400).json({ error: 'Essay content is required' });
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
            content: `Bạn là một giám khảo TOEIC Writing chuyên nghiệp. Hãy đánh giá bài viết của thí sinh và trả về phản hồi bằng tiếng Việt theo định dạng JSON chính xác như sau:

{
  "score": 8,
  "grammar_score": 7,
  "vocabulary_score": 8,
  "coherence_score": 9,
  "task_achievement_score": 8,
  "strengths": "Ngữ pháp chính xác, từ vựng phong phú, ý tưởng rõ ràng...",
  "weaknesses": "Một số lỗi chính tả nhỏ, cần cải thiện cách kết nối ý...",
  "suggestions": [
    "Kiểm tra lại chính tả trước khi nộp bài",
    "Sử dụng nhiều từ nối để tăng tính liên kết",
    "Phát triển ý tưởng chi tiết hơn"
  ]
}

Tiêu chí đánh giá:
- Grammar (Ngữ pháp): 0-10
- Vocabulary (Từ vựng): 0-10
- Coherence (Tính mạch lạc): 0-10
- Task Achievement (Hoàn thành nhiệm vụ): 0-10
- Overall Score (Điểm tổng): 0-10

Hãy đánh giá nghiêm túc như kỳ thi thật.`
          },
          {
            role: 'user',
            content: `Đề bài: ${question}

Bài viết của thí sinh:
"${essay}"

Hãy đánh giá bài viết này theo tiêu chuẩn TOEIC Writing.`
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
        strengths: "Có thể truyền đạt được ý tưởng cơ bản.",
        weaknesses: "Cần cải thiện tổng thể các kỹ năng viết.",
        suggestions: ["Luyện tập viết thêm", "Cải thiện ngữ pháp", "Mở rộng vốn từ vựng"]
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
    console.error('Error analyzing writing:', error);
    res.status(500).json({ error: 'Failed to analyze writing' });
  }
} 