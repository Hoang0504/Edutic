import sequelize from "@/lib/db";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { Answer } from "@/models/Answer";
import { Question } from "@/models/Question";
import { QuestionGroup } from "@/models/QuestionGroup";
import { Translation } from "@/models/Translation";
import { UserAnswer } from "@/models/UserAnswer";
import { getAnswerOption } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();

  const { id: attemptId, question_id: questionId } = req.query;

  if (!attemptId || !questionId)
    return res
      .status(400)
      .json({ message: "Missing attempt_id or question_id" });

  await sequelize.authenticate();

  const question = await Question.findByPk(questionId.toString(), {
    attributes: ["id", "content", "question_number", "image_url", "group_id"],
    include: [
      {
        model: QuestionGroup,
        as: "group",
        attributes: ["id", "content", "image_url"],
      },
      {
        model: Answer,
        as: "answers",
        attributes: ["id", "content", "is_correct", "explanation"],
      },
    ],
  });

  if (!question) return res.status(404).json({ message: "Question not found" });

  const userAnswer = await UserAnswer.findOne({
    where: {
      user_exam_attempt_id: attemptId,
      question_id: question.id,
    },
  });

  // console.log(question);
  // return res.json(question);

  let groupTranslation;
  if (question.group) {
    groupTranslation = await Translation.findOne({
      where: {
        content_type: "question_group",
        content_id: question.group?.id,
      },
      attributes: ["vietnamese_text"],
    });
  }

  // Lấy translation cho question
  const questionTranslation = await Translation.findOne({
    where: {
      content_type: "question",
      content_id: question.id,
    },
  });

  // Lấy translation cho answers
  const answerTranslations = await Translation.findAll({
    where: {
      content_type: "answer",
      content_id: question.answers.map((a) => a.id),
    },
  });

  // Tạo map id -> translation
  const answerTranslationMap = new Map<number, string>();
  answerTranslations.forEach((tr) => {
    answerTranslationMap.set(tr.content_id, tr.vietnamese_text);
  });

  const answers = question.answers.map((a) => ({
    content: a.content,
    is_correct: a.is_correct,
    explanation: a.explanation,
    translation: answerTranslationMap.get(a.id) || null,
  }));

  const correctAns = question.answers.find((a) => a.is_correct);

  return res.json({
    question_id: question.id,
    question_number: question.question_number,
    content: question.content,
    //   question_type: question.question_type,
    question_image_url: question.image_url,
    question_translation: questionTranslation?.vietnamese_text ?? null,
    group_content: question.group?.content ?? null,
    group_image_url: question.group?.image_url ?? null,
    group_translation: groupTranslation?.vietnamese_text,
    user_answer: userAnswer
      ? {
          option: getAnswerOption(question.answers, userAnswer.answer_id),
          content: question.answers.find((a) => a.id === userAnswer.answer_id)
            ?.content,
        }
      : null,
    correct_answer: correctAns
      ? {
          option: getAnswerOption(question.answers, correctAns.id),
          content: correctAns.content,
        }
      : null,
    is_correct: userAnswer?.is_correct ?? null,
    explanation: correctAns?.explanation ?? null,
    answers,
  });
};

export default withErrorHandler(handler);
