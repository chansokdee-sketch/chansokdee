import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authRes = await requireAuth(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const { user } = authRes;
    const orders = db.orders.findMany({ userId: user.id });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch my orders error:', error);
    return NextResponse.json({ error: 'Không thể tải lịch sử đơn hàng.' }, { status: 500 });
  }
}
