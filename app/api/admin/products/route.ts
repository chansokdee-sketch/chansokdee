import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaffOrAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authRes = await requireStaffOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('category') || undefined;

    // Staff & Admin see all products (ACTIVE and HIDDEN)
    const products = db.products.findMany({ search, categoryId });
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Admin get products error:', error);
    return NextResponse.json({ error: 'Không thể tải danh sách sản phẩm' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authRes = await requireStaffOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const body = await req.json();
    const { 
      name, 
      nameLao, 
      sku, 
      description, 
      descriptionLao, 
      price, 
      priceTHB,
      wholesalePrice,
      wholesalePriceTHB,
      minWholesaleQty,
      hasPack,
      packQty,
      packPrice,
      packPriceTHB,
      hasBox,
      boxQty,
      boxPrice,
      boxPriceTHB,
      hasCarton,
      cartonQty,
      cartonPrice,
      cartonPriceTHB,
      variants,
      colors,
      sizes,
      stock, 
      categoryId, 
      subCategoryId, 
      subCategoryName, 
      subCategoryNameLao, 
      brand, 
      status, 
      images 
    } = body;

    if (!name?.trim() || price === undefined || isNaN(price)) {
      return NextResponse.json({ error: 'Vui lòng điền tên sản phẩm và giá hợp lệ.' }, { status: 400 });
    }

    const generatedSku = sku?.trim() || `SKU-${Date.now().toString(36).toUpperCase()}`;
    let slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    if (!slug || slug.replace(/-/g, '').length === 0) {
      slug = `item-${Date.now().toString(36)}`;
    }

    const numPrice = Math.max(0, Number(price));
    const numPriceTHB = priceTHB !== undefined && !isNaN(Number(priceTHB)) && Number(priceTHB) > 0
      ? Number(priceTHB)
      : undefined;

    const numWholesale = wholesalePrice !== undefined && !isNaN(Number(wholesalePrice))
      ? Math.max(0, Number(wholesalePrice))
      : Math.round(numPrice * 0.8);

    const numWholesaleTHB = wholesalePriceTHB !== undefined && !isNaN(Number(wholesalePriceTHB)) && Number(wholesalePriceTHB) > 0
      ? Number(wholesalePriceTHB)
      : undefined;

    const numMinQty = Math.max(1, Number(minWholesaleQty) || 3);

    const newProduct = db.products.create({
      name: name.trim(),
      nameLao: nameLao?.trim() || undefined,
      sku: generatedSku,
      slug,
      description: description?.trim() || '',
      descriptionLao: descriptionLao?.trim() || undefined,
      price: numPrice,
      priceTHB: numPriceTHB,
      wholesalePrice: numWholesale,
      wholesalePriceTHB: numWholesaleTHB,
      minWholesaleQty: numMinQty,
      hasPack: Boolean(hasPack),
      packQty: packQty ? Math.max(1, Number(packQty)) : 6,
      packPrice: packPrice && Number(packPrice) > 0 ? Number(packPrice) : undefined,
      packPriceTHB: packPriceTHB && Number(packPriceTHB) > 0 ? Number(packPriceTHB) : undefined,
      hasBox: Boolean(hasBox),
      boxQty: boxQty ? Math.max(1, Number(boxQty)) : 10,
      boxPrice: boxPrice && Number(boxPrice) > 0 ? Number(boxPrice) : undefined,
      boxPriceTHB: boxPriceTHB && Number(boxPriceTHB) > 0 ? Number(boxPriceTHB) : undefined,
      hasCarton: Boolean(hasCarton),
      cartonQty: cartonQty ? Math.max(1, Number(cartonQty)) : 50,
      cartonPrice: cartonPrice && Number(cartonPrice) > 0 ? Number(cartonPrice) : undefined,
      cartonPriceTHB: cartonPriceTHB && Number(cartonPriceTHB) > 0 ? Number(cartonPriceTHB) : undefined,
      variants: Array.isArray(variants) ? variants : undefined,
      colors: Array.isArray(colors) ? colors : undefined,
      sizes: Array.isArray(sizes) ? sizes : undefined,
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
