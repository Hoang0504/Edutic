import { Part } from "@/models/Part";
import { Answer } from "@/models/Answer";
import { Question } from "@/models/Question";
import { AudioFile } from "@/models/AudioFile";

export async function getStaticPartData(partId: number) {
  return await Part.findOne({
    where: { id: partId },
    include: [
      {
        model: AudioFile,
        as: "audioFile",
        attributes: ["file_path", "status"],
      },
      {
        model: Question,
        as: "questions",
        include: [
          {
            model: Answer,
            as: "answers",
          },
        ],
      },
    ],
  });
}
