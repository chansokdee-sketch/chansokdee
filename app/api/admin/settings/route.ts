import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authRes = await requireAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const settings = db.settings.get();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Admin get settings error:', error);
    return NextResponse.json({ error: 'Không thể lấy thông tin cấu hình' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authRes = await requireAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const body = await req.json();
    const updated = db.settings.update(body);

    return NextResponse.json({
      message: 'Đã lưu cấu hình website thành công!',
      settings: updated,
    });
  } catch (error) {
    console.error('Admin update settings error:', error);
    return NextResponse.json({ error: 'Không thể lưu cấu hình' }, { status: 500 });
  }
}
