import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaffOrAdmin, requireAdmin } from '@/lib/auth';

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
    const product = db.products.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Admin get product error:', error);
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

    const updated = db.products.update(id, {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.nameLao !== undefined && { nameLao: body.nameLao?.trim() || undefined }),
      ...(body.sku !== undefined && { sku: body.sku.trim() }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.descriptionLao !== undefined && { descriptionLao: body.descriptionLao?.trim() || undefined }),
      ...(body.price !== undefined && { price: Math.max(0, Number(body.price)) }),
      ...(body.stock !== undefined && { stock: Math.max(0, Number(body.stock)) }),
      ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
      ...(body.subCategoryId !== undefined && { subCategoryId: body.subCategoryId }),
      ...(body.subCategoryName !== undefined && { subCategoryName: body.subCategoryName }),
      ...(body.subCategoryNameLao !== undefined && { subCategoryNameLao: body.subCategoryNameLao }),
      ...(body.brand !== undefined && { brand: body.brand }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.images !== undefined && { images: body.images }),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm để cập nhật' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cập nhật sản phẩm thành công!', product: updated });
  } catch (error) {
    console.error('Admin update product error:', error);
    return NextResponse.json({ error: 'Không thể cập nhật sản phẩm' }, { status: 500 });
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
    const success = db.products.delete(id);
    if (!success) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm để xóa' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Xóa sản phẩm thành công!' });
  } catch (error) {
    console.error('Admin delete product error:', error);
    return NextResponse.json({ error: 'Không thể xóa sản phẩm' }, { status: 500 });
  }
}
