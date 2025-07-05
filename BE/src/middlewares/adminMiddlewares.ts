// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const decoded: any = jwt.verify(token, process.env.DB_TOKEN_SECRET!);
    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // ✅ Chỉ áp dụng cho /admin
};
