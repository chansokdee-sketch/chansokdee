import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaffOrAdmin } from '@/lib/auth';
import { OrderStatus } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const authRes = await requireStaffOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = (searchParams.get('status') as OrderStatus) || undefined;

    const orders = db.orders.findMany({ search, status });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Admin get orders error:', error);
    return NextResponse.json({ error: 'Không thể tải danh sách đơn hàng' }, { status: 500 });
  }
}
