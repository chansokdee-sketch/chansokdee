import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, signAuthToken, TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp số điện thoại và mật khẩu.' },
        { status: 400 }
      );
    }

    let cleanPhone = phone.trim().replace(/[\s\.-]/g, '');
    if (cleanPhone.startsWith('+84')) {
      cleanPhone = '0' + cleanPhone.substring(3);
    } else if (cleanPhone.startsWith('84') && cleanPhone.length === 11) {
      cleanPhone = '0' + cleanPhone.substring(2);
    }

    const user = db.users.findByPhone(cleanPhone);

    if (!user) {
      return NextResponse.json(
        { error: 'Số điện thoại này chưa được đăng ký tài khoản. Bạn vui lòng bấm sang tab "Đăng ký tài khoản" phía trên để tạo tài khoản mới nhé!' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Mật khẩu không chính xác. Vui lòng thử lại hoặc sử dụng tài khoản mẫu có sẵn.' },
        { status: 401 }
      );
    }

    const token = await signAuthToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      message: 'Đăng nhập thành công!',
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        address: user.address,
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra trong quá trình đăng nhập.' },
      { status: 500 }
    );
  }
}
