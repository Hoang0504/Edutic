// ✅ Full backend API handler (Next.js API Route)
import { Op } from 'sequelize';
import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import sequelize from '@/lib/db';
import { Vocabulary } from '@/models/Vocabulary';
import { normalizeVocabulary } from '@/utils/normalize';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { User } from '@/models/User';
import { Flashcard } from '@/models/Flashcard';

interface NextApiRequestWithFiles extends NextApiRequest {
  files?: {
    [fieldname: string]: Express.Multer.File[];
  };
}

const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;
      if (file.fieldname === 'image') {
        uploadDir = path.join(process.cwd(), 'public/uploads/images');
      } else if (file.fieldname === 'audio') {
        uploadDir = path.join(process.cwd(), 'public/uploads/audio');
      }
      if (uploadDir) {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      } else {
        cb(new Error('Invalid upload directory'), '');
      }
    },
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]);

async function handler(req: NextApiRequestWithFiles, res: NextApiResponse) {
  await sequelize.authenticate();

  if (req.method === 'GET') {
    const { page = 1, limit = 10, word, context, status } = req.query;
    const whereClause: Record<string, any> = {};

    if (word) whereClause.word = { [Op.like]: `%${word}%` };
    if (context && context !== 'All') whereClause.context = context;
    if (status && status !== 'All') whereClause.status = status;

    const vocabularies = await Vocabulary.findAll({
      where: whereClause,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: [['created_at', 'DESC']],
    });

    const totalVocabularies = await Vocabulary.count({ where: whereClause });
    const totalPages = Math.ceil(totalVocabularies / +limit);

    res.status(200).json({
      data: vocabularies.map(normalizeVocabulary),
      currentPage: +page,
      totalPages,
      totalItems: totalVocabularies,
    });
    return;
  }

  if (req.method === 'POST') {
    await new Promise((resolve, reject) => {
      uploadMiddleware(req as any, res as any, (err) => {
        if (err) return reject(err);
        resolve(null);
      });
    });

    const { user_id, word, pronunciation, meaning, example, context, status = 'pending' } = req.body;
    const imageFile = req.files?.image?.[0];
    const audioFile = req.files?.audio?.[0];

    if (!word || !meaning || !example || !context) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let existingVocab = await Vocabulary.findOne({ where: { word, example } });
    if (existingVocab) {
      return res.status(200).json({ message: 'This word + example already exists' });
    }

    const imageUrl = imageFile ? `/uploads/images/${imageFile.filename}` : null;
    const audioUrl = audioFile ? `/uploads/audio/${audioFile.filename}` : null;

    const vocab = await Vocabulary.create({
      word,
      image_url: imageUrl,
      pronunciation,
      speech_audio_url: audioUrl,
      meaning,
      example,
      context,
      status,
    });

    if (user_id) {
      const user = await User.findOne({ where: { id: user_id } });
      if (user) {
        await Flashcard.create({ user_id: user.id, vocabulary_id: vocab.id });
      }
    }

    res.status(201).json(normalizeVocabulary(vocab));
    return;
  }

  return res.status(405).end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withErrorHandler(handler, 'Cannot get vocabularies list');
