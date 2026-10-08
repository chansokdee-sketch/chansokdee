import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authRes = await requireAdmin(req);
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
