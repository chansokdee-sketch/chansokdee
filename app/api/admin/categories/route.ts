import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaffOrAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authRes = await requireStaffOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const categories = db.categories.findMany();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Admin get categories error:', error);
    return NextResponse.json({ error: 'Không thể tải danh mục' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authRes = await requireStaffOrAdmin(req);
    if ('error' in authRes) {
      return NextResponse.json({ error: authRes.error }, { status: authRes.status });
    }

    const body = await req.json();
    const { name, nameLao, icon, subCategories } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Vui lòng nhập tên danh mục' }, { status: 400 });
    }

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const formattedSubCategories = Array.isArray(subCategories)
      ? subCategories.map((sub: any, idx: number) => {
          if (typeof sub === 'string') {
            const subName = sub.trim();
            const subSlug = subName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            return {
              id: `sub-${Date.now()}-${idx}`,
              name: subName,
              slug: subSlug || `sub-${idx}`,
              categoryId: '',
            };
          }
          return sub;
        })
      : [];

    const newCategory = db.categories.create({
      name: name.trim(),
      nameLao: nameLao?.trim() || '',
      icon: icon || 'Sparkles',
      slug: slug || `cat-${Date.now()}`,
      subCategories: formattedSubCategories,
    });

    return NextResponse.json({ message: 'Tạo danh mục thành công!', category: newCategory }, { status: 201 });
  } catch (error) {
    console.error('Admin create category error:', error);
    return NextResponse.json({ error: 'Không thể tạo danh mục' }, { status: 500 });
  }
}
