import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = db.products.findById(id);

    if (!product || product.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Sản phẩm không tồn tại hoặc đã ngừng bán' }, { status: 404 });
    }

    const category = product.categoryId ? db.categories.findById(product.categoryId) : null;

    return NextResponse.json({ product, category });
  } catch (error) {
    console.error('Fetch product detail error:', error);
    return NextResponse.json({ error: 'Không thể lấy thông tin sản phẩm' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authRes = await requireAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = db.products.update(id, {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.sku !== undefined && { sku: body.sku.trim() }),
      ...(body.description !== undefined && { description: body.description }),
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
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Không thể cập nhật sản phẩm' }, { status: 500 });
  }
}

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
    const success = db.products.delete(id);
    if (!success) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm để xóa' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Xóa sản phẩm thành công!' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Không thể xóa sản phẩm' }, { status: 500 });
  }
}

