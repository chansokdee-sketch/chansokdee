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
    const { items, customerName, customerPhone, shippingAddress, note } = body;

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
      shippingAddress: shippingAddress.trim(),
      note: note?.trim() || '',
      items: items.map(i => ({
        productId: i.productId,
        quantity: Number(i.quantity),
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
