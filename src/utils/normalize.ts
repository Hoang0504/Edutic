import { User } from "@/models/User";
import { Vocabulary } from "@/models/Vocabulary";

export function normalizeUser(user: User) {
  return {
    id: user.id,
    name: user.name ?? "",
    avatar: user.avatar ?? "",
    email: user.email ?? "",
    role: user.role,
    last_login: user.last_login
      ? user.last_login.toISOString().replace("T", " ").substring(0, 19)
      : null,
  };
}

export function normalizeVocabulary(vocabulary: Vocabulary) {
  return {
    id: vocabulary.id,
    word: vocabulary.word ?? "",
    image_url: vocabulary.image_url ?? "",
    pronunciation: vocabulary.pronunciation ?? "",
    speech_audio_url: vocabulary.speech_audio_url ?? "",
    meaning: vocabulary.meaning ?? "",
    example: vocabulary.example ?? "",
    context: vocabulary.context ?? "",
    status: vocabulary.status ?? "pending",
    created_at: vocabulary.created_at
      ? vocabulary.created_at.toISOString().split("T")[0]
      : null,
    updated_at: vocabulary.updated_at
      ? vocabulary.updated_at.toISOString().split("T")[0]
      : null,
  };
}
