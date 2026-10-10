import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const authRes = await requireAuth(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const { user } = authRes;
    const body = await req.json();
    const { items, customerName, customerPhone, customerType, shippingAddress, note, currency, exchangeRate } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Giỏ hàng của bạn đang trống.' }, { status: 400 });
    }

    if (!customerName?.trim() || !customerPhone?.trim() || !shippingAddress?.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.' },
        { status: 400 }
      );
    }

    const result = db.orders.create({
      userId: user.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerType: customerType === 'WHOLESALE' ? 'WHOLESALE' : 'RETAIL',
      shippingAddress: shippingAddress.trim(),
      note: note?.trim() || '',
      currency: currency === 'THB' ? 'THB' : 'LAK',
      exchangeRate: typeof exchangeRate === 'number' && exchangeRate > 0 ? exchangeRate : undefined,
      items: items.map(i => ({
        productId: i.productId,
        quantity: Number(i.quantity || 1),
        unit: i.unit,
        unitQuantity: i.unitQuantity !== undefined ? Number(i.unitQuantity) : undefined,
        variantId: i.variantId,
        variantName: i.variantName,
        variantImage: i.variantImage,
        selectedColor: i.selectedColor,
        selectedSize: i.selectedSize,
      })),
    });

    if (result.error || !result.order) {
      return NextResponse.json({ error: result.error || 'Đặt hàng không thành công.' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Đặt hàng thành công!',
      order: result.order,
    }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Đã có lỗi xảy ra khi tạo đơn hàng.' }, { status: 500 });
  }
}
