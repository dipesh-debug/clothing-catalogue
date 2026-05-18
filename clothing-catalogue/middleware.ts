import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const decoded = atob(authValue);
    const [user, ...passwordParts] = decoded.split(':');
    const pwd = passwordParts.join(':'); 

    const validUser = process.env.ADMIN_USERNAME;
    const validPwd = process.env.ADMIN_PASSWORD;

    if (user === validUser && pwd === validPwd) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Auth required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};