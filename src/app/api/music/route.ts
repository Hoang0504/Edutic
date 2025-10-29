import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const musicList = [];

    // Get music from public folder
    const publicDir = path.join(process.cwd(), 'public');
    const publicFiles = await readdir(publicDir);
    
    for (const file of publicFiles) {
      if (file.toLowerCase().endsWith('.mp3')) {
        const filePath = path.join(publicDir, file);
        const stats = await stat(filePath);
        
        // Extract title from filename (remove extension)
        const title = file.replace(/\.mp3$/i, '');
        
        // Determine if it's an uploaded file (has timestamp prefix) or original file
        const isUploadedFile = /^\d+-.+/.test(file);
        const cleanTitle = isUploadedFile 
          ? file.replace(/^\d+-/, '').replace(/\.mp3$/i, '').replace(/-/g, ' ')
          : title;
        
        musicList.push({
          id: file.replace(/[^a-zA-Z0-9]/g, ''),
          title: cleanTitle,
          artist: title.includes('LAKEY INSPIRED') ? 'LAKEY INSPIRED' : (isUploadedFile ? 'User Upload' : 'Unknown Artist'),
          fileUrl: `/${file}`,
          duration: 'Unknown', // Would need audio processing to get real duration
          source: isUploadedFile ? 'upload' : 'public'
        });
      }
    }

    return NextResponse.json({ music: musicList });

  } catch (error) {
    console.error('Error fetching music:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải danh sách nhạc' },
      { status: 500 }
    );
  }
} 