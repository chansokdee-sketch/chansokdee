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
      ...(body.priceTHB !== undefined && { priceTHB: Number(body.priceTHB) > 0 ? Number(body.priceTHB) : undefined }),
      ...(body.wholesalePrice !== undefined && { wholesalePrice: Math.max(0, Number(body.wholesalePrice)) }),
      ...(body.wholesalePriceTHB !== undefined && { wholesalePriceTHB: Number(body.wholesalePriceTHB) > 0 ? Number(body.wholesalePriceTHB) : undefined }),
      ...(body.minWholesaleQty !== undefined && { minWholesaleQty: Math.max(1, Number(body.minWholesaleQty) || 3) }),
      ...(body.baseUnitName !== undefined && { baseUnitName: body.baseUnitName?.trim() || undefined }),
      ...(body.baseUnitNameLao !== undefined && { baseUnitNameLao: body.baseUnitNameLao?.trim() || undefined }),
      ...(body.hasPack !== undefined && { hasPack: Boolean(body.hasPack) }),
      ...(body.packQty !== undefined && { packQty: Math.max(1, Number(body.packQty)) }),
      ...(body.packPrice !== undefined && { packPrice: Number(body.packPrice) > 0 ? Number(body.packPrice) : undefined }),
      ...(body.packPriceTHB !== undefined && { packPriceTHB: Number(body.packPriceTHB) > 0 ? Number(body.packPriceTHB) : undefined }),
      ...(body.hasBox !== undefined && { hasBox: Boolean(body.hasBox) }),
      ...(body.boxQty !== undefined && { boxQty: Math.max(1, Number(body.boxQty)) }),
      ...(body.boxPrice !== undefined && { boxPrice: Number(body.boxPrice) > 0 ? Number(body.boxPrice) : undefined }),
      ...(body.boxPriceTHB !== undefined && { boxPriceTHB: Number(body.boxPriceTHB) > 0 ? Number(body.boxPriceTHB) : undefined }),
      ...(body.hasCarton !== undefined && { hasCarton: Boolean(body.hasCarton) }),
      ...(body.cartonBoxQty !== undefined && { cartonBoxQty: Number(body.cartonBoxQty) > 0 ? Number(body.cartonBoxQty) : undefined }),
      ...(body.cartonQty !== undefined && { cartonQty: Math.max(1, Number(body.cartonQty)) }),
      ...(body.cartonPrice !== undefined && { cartonPrice: Number(body.cartonPrice) > 0 ? Number(body.cartonPrice) : undefined }),
      ...(body.cartonPriceTHB !== undefined && { cartonPriceTHB: Number(body.cartonPriceTHB) > 0 ? Number(body.cartonPriceTHB) : undefined }),
      ...(body.variants !== undefined && { variants: Array.isArray(body.variants) ? body.variants : undefined }),
      ...(body.tier1Name !== undefined && { tier1Name: body.tier1Name?.trim() || undefined }),
      ...(body.tier1Options !== undefined && { tier1Options: Array.isArray(body.tier1Options) ? body.tier1Options : undefined }),
      ...(body.tier2Name !== undefined && { tier2Name: body.tier2Name?.trim() || undefined }),
      ...(body.tier2Options !== undefined && { tier2Options: Array.isArray(body.tier2Options) ? body.tier2Options : undefined }),
      ...(body.colors !== undefined && { colors: Array.isArray(body.colors) ? body.colors : undefined }),
      ...(body.sizes !== undefined && { sizes: Array.isArray(body.sizes) ? body.sizes : undefined }),
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
