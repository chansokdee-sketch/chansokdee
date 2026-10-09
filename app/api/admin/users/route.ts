import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin, requireManagerOrAdmin, requireStaffOrAdmin } from '@/lib/auth';

import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const authRes = await requireStaffOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const users = db.users.findMany();
    const orders = db.orders.findMany();

    const usersWithStats = users.map(user => {
      const userOrders = orders.filter(o => o.userId === user.id);
      const totalSpent = userOrders
        .filter(o => o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + o.totalPrice, 0);

      return {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        customerType: user.customerType || 'RETAIL',
        address: user.address,
        createdAt: user.createdAt,
        orderCount: userOrders.length,
        totalSpent,
      };
    });

    return NextResponse.json({ users: usersWithStats });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Không thể tải danh sách người dùng' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authRes = await requireManagerOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const body = await req.json();
    const { phone, password, name, role = 'USER', customerType = 'RETAIL', address } = body;

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json({ error: 'Số điện thoại không hợp lệ (tối thiểu 8 số)' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' }, { status: 400 });
    }

    const cleanPhone = phone.trim();
    const existing = db.users.findByPhone(cleanPhone);
    if (existing) {
      return NextResponse.json({ error: 'Số điện thoại này đã được sử dụng trong hệ thống' }, { status: 400 });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    let assignedRole: 'ADMIN' | 'MANAGER' | 'STAFF' | 'USER' = 'USER';
    if (role === 'MANAGER' && authRes.user.role === 'ADMIN') {
      assignedRole = 'MANAGER';
    } else if (role === 'STAFF') {
      assignedRole = 'STAFF';
    } else {
      assignedRole = 'USER';
    }
    const assignedCustomerType = customerType === 'WHOLESALE' ? 'WHOLESALE' : 'RETAIL';

    const defaultName = assignedRole === 'MANAGER'
      ? 'Quản lý cửa hàng'
      : assignedRole === 'STAFF' 
      ? 'Nhân viên bán hàng' 
      : (assignedCustomerType === 'WHOLESALE' ? 'Khách sỉ đại lý' : 'Khách mua lẻ');

    const newUser = db.users.create({
      phone: cleanPhone,
      passwordHash,
      name: name?.trim() || defaultName,
      role: assignedRole,
      customerType: assignedCustomerType,
      address: address?.trim() || '',
    });

    const { passwordHash: _discard, ...safeUser } = newUser;
    return NextResponse.json({ success: true, user: safeUser }, { status: 201 });
  } catch (error) {
    console.error('Create user/staff error:', error);
    return NextResponse.json({ error: 'Không thể tạo tài khoản' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authRes = await requireManagerOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const body = await req.json();
    const { id, role, customerType, name, address, password } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID người dùng' }, { status: 400 });
    }

    const targetUser = db.users.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    // Do not allow demoting or altering the main Admin
    if (targetUser.role === 'ADMIN' && role && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Không thể hạ quyền của Boss Hải' }, { status: 403 });
    }

    // Only Boss Hai (ADMIN) can promote or modify MANAGER
    if ((targetUser.role === 'MANAGER' || role === 'MANAGER') && authRes.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Chỉ Boss Hải mới có quyền quản lý chức vụ Quản lý' }, { status: 403 });
    }

    const updates: Partial<typeof targetUser> = {};
    if (role && (role === 'MANAGER' || role === 'STAFF' || role === 'USER')) {
      updates.role = role;
    }
    if (customerType && (customerType === 'RETAIL' || customerType === 'WHOLESALE')) {
      updates.customerType = customerType;
    }
    if (typeof name === 'string' && name.trim()) {
      updates.name = name.trim();
    }
    if (typeof address === 'string') {
      updates.address = address.trim();
    }
    if (typeof password === 'string' && password.trim().length >= 6) {
      updates.passwordHash = bcrypt.hashSync(password.trim(), 10);
    }

    const updated = db.users.update(id, updates);
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Update user/staff error:', error);
    return NextResponse.json({ error: 'Không thể cập nhật người dùng' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authRes = await requireAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID người dùng' }, { status: 400 });
    }

    const targetUser = db.users.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: 'Không tìm thấy tài khoản' }, { status: 404 });
    }

    if (targetUser.role === 'ADMIN' || targetUser.id === 'usr-admin-1') {
      return NextResponse.json({ error: 'Không thể xóa tài khoản Boss Hải' }, { status: 403 });
    }

    const success = db.users.delete(id);
    if (!success) {
      return NextResponse.json({ error: 'Không thể xóa tài khoản' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Không thể xóa tài khoản' }, { status: 500 });
  }
}

