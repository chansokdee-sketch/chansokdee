import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaffOrAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authRes = await requireStaffOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const products = db.products.findMany();
    const inventory = products.map(p => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      stock: p.stock,
      price: p.price,
      status: p.status,
      isLowStock: p.stock <= 5,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error('Inventory fetch error:', error);
    return NextResponse.json({ error: 'Không thể tải dữ liệu tồn kho' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authRes = await requireStaffOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const body = await req.json();
    const { productId, stock } = body;

    if (!productId || stock === undefined || isNaN(stock) || Number(stock) < 0) {
      return NextResponse.json({ error: 'Vui lòng cung cấp mã sản phẩm và số lượng tồn kho hợp lệ' }, { status: 400 });
    }

    const updated = db.products.update(productId, {
      stock: Math.floor(Number(stock)),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cập nhật kho thành công!', product: updated });
  } catch (error) {
    console.error('Inventory update error:', error);
    return NextResponse.json({ error: 'Không thể cập nhật số lượng tồn kho' }, { status: 500 });
  }
}
