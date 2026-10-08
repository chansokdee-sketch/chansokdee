import { NextRequest, NextResponse } from 'next/server';
import { requireStaffOrAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const authRes = await requireStaffOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const directUrl = formData.get('url') as string | null;

    if (directUrl && directUrl.trim().startsWith('http')) {
      return NextResponse.json({ url: directUrl.trim() });
    }

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file hình ảnh tải lên từ điện thoại' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Determine extension safely for phone uploads
    let ext = 'jpg';
    if (file.name && file.name.includes('.')) {
      ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    } else if (file.type) {
      ext = file.type.split('/')[1]?.toLowerCase() || 'jpg';
    }
    if (ext === 'jpeg') ext = 'jpg';

    const filename = `phone-upload-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Tải ảnh lên thất bại.' }, { status: 500 });
  }
}
