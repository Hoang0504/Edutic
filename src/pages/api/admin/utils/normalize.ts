import { User } from "../../../../models/User";
import { Vocabulary } from "../../../../models/Vocabulary";

interface NormalizedUser {
  id: number;
  name?: string;
  avatar?: string;
  email: string;
  role?: 'student' | 'teacher' | 'admin';
  last_login?: Date;
}

interface NormalizedVocabulary {
  id: number;
  word: string;
  image_url?: string;
  pronunciation?: string;
  speech_audio_url?: string;
  meaning: string;
  example?: string;
  context: string;
  status: 'Active' | 'Inactive';
  created_at: Date;
  updated_at: Date;
}

export const normalizeUser = (user: User): NormalizedUser => ({
  id: user.id,
  name: user.name,
  avatar: user.avatar ?? undefined,
  email: user.email,
  role: user.role === 'student' || user.role === 'teacher' || user.role === 'admin' ? user.role : undefined,
  last_login: user.last_login ?? undefined,
});

export const normalizeVocabulary = (vocab: Vocabulary): NormalizedVocabulary => ({
  id: vocab.id,
  word: vocab.word,
  image_url: vocab.image_url,
  pronunciation: vocab.pronunciation,
  speech_audio_url: vocab.speech_audio_url,
  meaning: vocab.meaning,
  example: vocab.example,
  context: vocab.context,
  status: vocab.status === 'approved' ? 'Active' : 'Inactive',
  created_at: vocab.createdAt,
  updated_at: vocab.updatedAt,
});