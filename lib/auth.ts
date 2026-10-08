import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import { User, Role } from './types';
import { db } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'novastore-super-secret-jwt-key-2026-secure-production-grade'
);

export const TOKEN_COOKIE_NAME = 'novastore_token';

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export interface TokenPayload {
  userId: string;
  phone: string;
  role: Role;
  name?: string;
  exp?: number;
}

export async function signAuthToken(payload: {
  userId: string;
  phone: string;
  role: Role;
  name?: string;
}): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyAuthToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(req: NextRequest): Promise<User | null> {
  let token: string | undefined;

  // 1. Check Bearer Authorization Header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // 2. Fallback to Cookie
  if (!token) {
    const cookie = req.cookies.get(TOKEN_COOKIE_NAME);
    token = cookie?.value;
  }

  if (!token) return null;

  const payload = await verifyAuthToken(token);
  if (!payload || !payload.userId) return null;

  const user = db.users.findById(payload.userId);
  if (!user) return null;

  return user;
}

export async function requireAuth(req: NextRequest): Promise<{ user: User } | { error: string; status: number }> {
  const user = await getSessionUser(req);
  if (!user) {
    return { error: 'Bạn cần đăng nhập để thực hiện chức năng này.', status: 401 };
  }
  return { user };
}

export async function requireAdmin(req: NextRequest): Promise<{ user: User } | { error: string; status: number }> {
  const authRes = await requireAuth(req);
  if ('error' in authRes) {
    return authRes;
  }

  if (authRes.user.role !== 'ADMIN') {
    return { error: 'Truy cập bị từ chối! Bạn không có quyền Quản trị viên (Boss Hải).', status: 403 };
  }

  return { user: authRes.user };
}

export async function requireStaffOrAdmin(req: NextRequest): Promise<{ user: User } | { error: string; status: number }> {
  const authRes = await requireAuth(req);
  if ('error' in authRes) {
    return authRes;
  }

  if (authRes.user.role !== 'ADMIN' && authRes.user.role !== 'STAFF') {
    return { error: 'Truy cập bị từ chối! Bạn không có quyền Nhân viên hoặc Quản trị viên.', status: 403 };
  }

  return { user: authRes.user };
}
