import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authRes = await requireAuth(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const { user } = authRes;
    const { id } = await params;

    // Tìm đơn hàng theo ID hoặc theo Mã đơn
    const order = db.orders.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng cần hủy.' }, { status: 404 });
    }

    // Kiểm tra quyền sở hữu đơn hàng (chỉ chủ đơn hoặc Admin/Manager/Staff)
    const isOwner = order.userId === user.id;
    const isPrivileged = user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'STAFF';
    if (!isOwner && !isPrivileged) {
      return NextResponse.json(
        { error: 'Bạn không có quyền thao tác trên đơn hàng này.' },
        { status: 403 }
      );
    }

    // Đơn đã hủy trước đó
    if (order.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Đơn hàng này đã được hủy trước đó rồi.' },
        { status: 400 }
      );
    }

    // Điều kiện trọng tâm: Khách chỉ có thể hủy đơn khi NHÂN VIÊN CHƯA TIẾP NHẬN
    // Đơn được xem là đã tiếp nhận nếu:
    // 1. Trạng thái khác PENDING (ví dụ CONFIRMED, PROCESSING, SHIPPING, COMPLETED)
    // 2. Hoặc đã được phân công nhân viên nhận đơn (assignedStaffId có giá trị)
    const hasStaffAccepted = (order.assignedStaffId && order.assignedStaffId.trim() !== '') || order.status !== 'PENDING';

    if (hasStaffAccepted && !isPrivileged) {
      return NextResponse.json(
        { 
          error: 'Đơn hàng đã được nhân viên tiếp nhận và xử lý, không thể tự hủy lúc này. Quý khách vui lòng liên hệ hotline shop để được hỗ trợ!',
          order 
        },
        { status: 400 }
      );
    }

    // Đọc lý do hủy từ body nếu có
    let reason = '';
    try {
      const body = await req.json();
      if (body && typeof body.reason === 'string') {
        reason = body.reason.trim();
      }
    } catch {
      // Body rỗng không sao
    }

    const cancelTag = reason ? `[Khách hàng hủy: ${reason}]` : '[Khách hàng hủy đơn]';
    const updatedNote = order.note ? `${order.note} | ${cancelTag}` : cancelTag;

    // Cập nhật trạng thái CANCELLED (db.orders.update tự động hoàn lại tồn kho sản phẩm)
    const updatedOrder = db.orders.update(order.id, {
      status: 'CANCELLED',
      note: updatedNote,
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Không thể cập nhật trạng thái đơn hàng.' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Đã hủy đơn hàng thành công!',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Customer cancel order error:', error);
    return NextResponse.json({ error: 'Đã có lỗi xảy ra khi hủy đơn hàng.' }, { status: 500 });
  }
}

export const PUT = POST;
