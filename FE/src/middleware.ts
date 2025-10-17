import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode('abcdefABCDEF123456');

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('tai-khoan/dang-nhap', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } catch (err) {
    return NextResponse.redirect(new URL('tai-khoan/dang-nhap', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
