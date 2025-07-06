import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";

import { Part } from "@/models/Part";
import { Answer } from "@/models/Answer";
import { Question } from "@/models/Question";
import { UserAnswer } from "@/models/UserAnswer";
import { AIFeedback } from "@/models/AIFeedback";
import { getDeepseekFeedback } from "@/services/deepseek";
import { UserAttemptPart } from "@/models/UserAttemptPart";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { UserExamAttempt } from "@/models/UserExamAttempt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  await sequelize.authenticate();

  const endTime = new Date();

  const { id: attemptId } = req.query;
  const { startTime, selectedAnswers } = req.body;

  // console.log({
  //   attemptId,
  //   startTime,
  //   selectedAnswers,
  // });

  if (
    !attemptId ||
    !selectedAnswers ||
    !startTime ||
    typeof attemptId !== "string" ||
    typeof startTime !== "string" ||
    typeof selectedAnswers !== "object"
  ) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  const transaction = await sequelize.transaction();

  const groupedByPart: Record<number, { correct: number; total: number }> = {};
  let totalScore = 0;

  try {
    for (const [questionId, answerId] of Object.entries(selectedAnswers)) {
      const question = await Question.findByPk(questionId, {
        include: [{ model: Answer, as: "answers" }],
      });

      if (!question) continue;

      const is_correct = question.answers.some(
        (a: any) => a.id == answerId && a.is_correct === true
      );

      await UserAnswer.create(
        {
          user_exam_attempt_id: parseInt(attemptId),
          question_id: parseInt(questionId),
          answer_id: parseInt(answerId as string),
          is_correct,
        },
        { transaction }
      );

      const part_id = question.part_id;
      if (!groupedByPart[part_id])
        groupedByPart[part_id] = { correct: 0, total: 0 };
      groupedByPart[part_id].total += 1;
      if (is_correct) groupedByPart[part_id].correct += 1;
    }

    for (const part_id in groupedByPart) {
      const part = await Part.findByPk(part_id, {
        attributes: ["title"],
      });
      const { correct, total } = groupedByPart[part_id];
      const score = correct * 5;
      totalScore += score;

      const prompt = `
You are an English test evaluator.

I will give you a part from a TOEIC exam, along with the total number of questions and how many were answered correctly.

Please analyze the performance and return your feedback in JSON format with the following fields:
- feedback_text: An encouraging overall comment based on the score.
- suggestions: Tips to improve performance.
- strengths: What the test-taker did well.
- weaknesses: What areas need improvement.

***IMPORTANT: Respond in Vietnamese.***

Input example:
{
  "part_title": "Part 4 - Short Talks",
  "correct_answers": 8,
  "total_questions": 12
}

Output format (in JSON, but with Vietnamese text):
{
  "feedback_text": "...",
  "suggestions": "...",
  "strengths": "...",
  "weaknesses": "..."
}

Now please give me the feedback for the following:

{
  "part_title": "${part?.title}",
  "correct_answers": ${correct},
  "total_questions": ${total}
}
`;

      const feedbackJson = await getDeepseekFeedback(prompt);

      // console.log("Feedback JSON:", feedbackJson);

      // throw new Error("Feedback generation failed");

      const feedback = await AIFeedback.create(
        {
          content_type: "user_attempt_part",
          content_id: parseInt(attemptId),
          feedback_text: feedbackJson.feedback_text || "No feedback provided",
          suggestions:
            JSON.stringify(feedbackJson.suggestions) ||
            "No suggestions provided",
          strengths:
            JSON.stringify(feedbackJson.strengths) || "No strengths provided",
          weaknesses:
            JSON.stringify(feedbackJson.weaknesses) || "No strengths provided",
        },
        { transaction }
      );

      await UserAttemptPart.update(
        { ai_feedback_id: feedback.id, score },
        {
          where: {
            user_exam_attempt_id: attemptId,
            part_id,
          },
          transaction,
        }
      );
    }

    await UserExamAttempt.update(
      {
        start_time: new Date(startTime),
        end_time: endTime,
        score: totalScore,
        status: "completed",
      },
      {
        where: { id: attemptId },
        transaction,
      }
    );

    await transaction.commit();
    return res.status(200).json({ message: "Exam submitted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting exam:", error);
    return res
      .status(500)
      .json({ success: false, message: "Submission failed", error });
  }
}

export default withErrorHandler(handler);
