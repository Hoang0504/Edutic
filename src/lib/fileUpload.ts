import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Ensure upload directories exist
export async function ensureUploadDirs() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const audioDir = path.join(uploadDir, 'audio');
  const imageDir = path.join(uploadDir, 'images');

  await mkdir(uploadDir, { recursive: true });
  await mkdir(audioDir, { recursive: true });
  await mkdir(imageDir, { recursive: true });
}

// Save audio file to a part-specific folder within the exam's directory
export async function saveAudioFile(
  file: Express.Multer.File,
  examFolderName: string,
  partNumber: number
): Promise<string> {
  const folderPath = path.join(examFolderName, `part${partNumber}`);
  const extension = getFileExtension(file.originalname) || 'mp3';
  const fileName = `audio_part_${partNumber}.${extension}`;
  // Ensure forward slashes for the URL path
  const relativePath = path.join(folderPath, fileName).replace(/\\/g, '/');

  const fullPath = path.join(process.cwd(), 'public', relativePath);
  const dirPath = path.dirname(fullPath);
  
  await mkdir(dirPath, { recursive: true });
  await writeFile(fullPath, file.buffer);
  
  return `/${relativePath}`;
}

// Save question image
export async function saveQuestionImage(
  file: Express.Multer.File,
  examId: number,
  partNumber: number,
  questionNumber: number
): Promise<string> {
  // Note: This function saves to a generic 'uploads' folder.
  // Consider refactoring to use the exam-specific folder structure like saveAudioFile.
  const fileName = `exam_${examId}_part_${partNumber}_q_${questionNumber}_${Date.now()}.${getFileExtension(file.originalname)}`;
  const filePath = path.join('uploads', 'images', fileName);
  const fullPath = path.join(process.cwd(), 'public', filePath);
  
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, file.buffer);
  
  return `/${filePath}`;
}

// Save image file with custom path
export async function saveImageFile(
  file: Express.Multer.File,
  relativePath: string
): Promise<string> {
  // Ensure the directory structure exists
  const fullPath = path.join(process.cwd(), 'public', relativePath);
  const dirPath = path.dirname(fullPath);
  
  await mkdir(dirPath, { recursive: true });
  await writeFile(fullPath, file.buffer);
  
  return `/${relativePath}`;
}

// Get file extension
function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return filename.substring(lastDotIndex + 1).toLowerCase();
}

// Get audio duration (simplified - you might want to use a library like ffprobe)
export function getAudioDuration(file: Express.Multer.File): number {
  // For now, return 0 - you can implement actual duration detection later
  // Using libraries like ffprobe-static or node-ffmpeg
  return 0;
} 