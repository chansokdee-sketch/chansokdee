import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signAuthToken, TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password, name, address, customerType } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ số điện thoại và mật khẩu.' },
        { status: 400 }
      );
    }

    let cleanPhone = phone.trim().replace(/[\s\.-]/g, '');
    if (cleanPhone.startsWith('+84')) {
      cleanPhone = '0' + cleanPhone.substring(3);
    } else if (cleanPhone.startsWith('84') && cleanPhone.length === 11) {
      cleanPhone = '0' + cleanPhone.substring(2);
    }

    const phoneRegex = /^0(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Số điện thoại không hợp lệ (cần gồm 10 chữ số, ví dụ: 0912345678).' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải chứa ít nhất 6 ký tự.' },
        { status: 400 }
      );
    }

    const existingUser = db.users.findByPhone(cleanPhone);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Số điện thoại này đã được đăng ký. Vui lòng đăng nhập.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const newUser = db.users.create({
      phone: cleanPhone,
      passwordHash,
      name: name?.trim() || `Khách hàng ${cleanPhone.slice(-4)}`,
      role: 'USER', // Always regular USER on signup
      customerType: customerType === 'WHOLESALE' ? 'WHOLESALE' : 'RETAIL',
      address: address?.trim() || '',
    });

    const token = await signAuthToken({
      userId: newUser.id,
      phone: newUser.phone,
      role: newUser.role,
      name: newUser.name,
    });

    const response = NextResponse.json({
      message: 'Đăng ký tài khoản thành công!',
      user: {
        id: newUser.id,
        phone: newUser.phone,
        name: newUser.name,
        role: newUser.role,
        customerType: newUser.customerType || 'RETAIL',
        address: newUser.address,
      },
      token,
    });

    response.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra trong quá trình đăng ký.' },
      { status: 500 }
    );
  }
}
