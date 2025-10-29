import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Tên file là bắt buộc' },
        { status: 400 }
      );
    }

    // Only allow deleting uploaded files, not public files
    if (!filename.includes('-')) {
      return NextResponse.json(
        { error: 'Không thể xóa file công khai' },
        { status: 403 }
      );
    }

    const filepath = path.join(process.cwd(), 'public', filename);

    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: 'File không tồn tại' },
        { status: 404 }
      );
    }

    await unlink(filepath);

    return NextResponse.json({
      success: true,
      message: 'Đã xóa file thành công'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xóa file' },
      { status: 500 }
    );
  }
} 