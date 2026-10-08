import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaffOrAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authRes = await requireStaffOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const stats = db.dashboard.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ error: 'Không thể tải dữ liệu thống kê.' }, { status: 500 });
  }
}
