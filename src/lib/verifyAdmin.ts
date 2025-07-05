// lib/middleware/verifyAdmin.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyAdmin(req: any) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'secret') as any;
    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
