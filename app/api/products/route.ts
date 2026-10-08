import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('category') || undefined;
    const subCategoryId = searchParams.get('subCategory') || undefined;
    const sort = searchParams.get('sort') || undefined;

    // Public API only returns ACTIVE products
    const products = db.products.findMany({
      status: 'ACTIVE',
      search,
      categoryId,
      subCategoryId,
      sort,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Không thể tải danh sách sản phẩm' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authRes = await requireAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const body = await req.json();
    const { name, sku, description, price, stock, categoryId, subCategoryId, subCategoryName, subCategoryNameLao, brand, status, images } = body;

    if (!name?.trim() || !price || isNaN(price)) {
      return NextResponse.json({ error: 'Vui lòng điền tên sản phẩm và giá hợp lệ.' }, { status: 400 });
    }

    const generatedSku = sku?.trim() || `SKU-${Date.now().toString(36).toUpperCase()}`;
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const newProduct = db.products.create({
      name: name.trim(),
      sku: generatedSku,
      slug,
      description: description?.trim() || '',
      price: Math.max(0, Number(price)),
      stock: Math.max(0, Number(stock) || 0),
      categoryId: categoryId || 'cat-1',
      subCategoryId: subCategoryId || undefined,
      subCategoryName: subCategoryName || undefined,
      subCategoryNameLao: subCategoryNameLao || undefined,
      brand: brand || undefined,
      status: status === 'HIDDEN' ? 'HIDDEN' : 'ACTIVE',
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'
      ],
    });

    return NextResponse.json({ message: 'Thêm sản phẩm thành công!', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Admin create product error:', error);
    return NextResponse.json({ error: 'Không thể tạo sản phẩm mới.' }, { status: 500 });
  }
}

