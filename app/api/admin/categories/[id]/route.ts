import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaffOrAdmin } from '@/lib/auth';

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
    const updated = db.categories.update(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Không tìm thấy danh mục' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cập nhật danh mục thành công!', category: updated });
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json({ error: 'Không thể cập nhật danh mục' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authRes = await requireStaffOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const { id } = await params;
    const deleted = db.categories.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Không tìm thấy danh mục để xóa' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Đã xóa danh mục thành công' });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json({ error: 'Không thể xóa danh mục' }, { status: 500 });
  }
}
