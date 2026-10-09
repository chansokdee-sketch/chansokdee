import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaffOrAdmin } from '@/lib/auth';
import { OrderStatus } from '@/lib/types';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authRes = await requireStaffOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const { id } = await params;
    const order = db.orders.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Admin get order error:', error);
    return NextResponse.json({ error: 'Đã có lỗi xảy ra' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authRes = await requireStaffOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, assignedStaffId, assignedStaffName, assignedStaffPhone, note } = body;

    const existingOrder = db.orders.findById(id);
    if (!existingOrder) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng để cập nhật' }, { status: 404 });
    }

    const updates: Record<string, any> = {};

    if (status) {
      const validStatuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'COMPLETED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Trạng thái đơn hàng không hợp lệ' }, { status: 400 });
      }
      updates.status = status;
    }

    if (assignedStaffId !== undefined) {
      updates.assignedStaffId = assignedStaffId;
      updates.assignedStaffName = assignedStaffName || '';
      updates.assignedStaffPhone = assignedStaffPhone || '';
      updates.assignedAt = assignedStaffId ? new Date().toISOString() : undefined;
      updates.assignedBy = `${authRes.user.name || authRes.user.phone} (${authRes.user.role === 'ADMIN' ? 'Boss' : 'Quản lý'})`;
    }

    if (note !== undefined) {
      updates.note = note;
    }

    const updated = db.orders.update(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Không thể cập nhật đơn hàng' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Cập nhật đơn hàng thành công!', order: updated });
  } catch (error) {
    console.error('Admin update order error:', error);
    return NextResponse.json({ error: 'Không thể cập nhật đơn hàng' }, { status: 500 });
  }
}
