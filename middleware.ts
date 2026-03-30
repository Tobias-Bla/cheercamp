import { NextResponse, type NextRequest } from 'next/server';

function unauthorizedResponse(): NextResponse {
  return new NextResponse('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Cheercamp Admin"',
    },
  });
}

export function middleware(request: NextRequest): NextResponse {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return new NextResponse('Not found.', { status: 404 });
  }

  const authorizationHeader = request.headers.get('authorization');

  if (!authorizationHeader) {
    return unauthorizedResponse();
  }

  const [scheme, encoded] = authorizationHeader.split(' ');

  if (scheme !== 'Basic' || !encoded) {
    return unauthorizedResponse();
  }

  const decoded = atob(encoded);
  const separatorIndex = decoded.indexOf(':');

  if (separatorIndex < 0) {
    return unauthorizedResponse();
  }

  const providedUsername = decoded.slice(0, separatorIndex);
  const providedPassword = decoded.slice(separatorIndex + 1);

  if (providedUsername !== username || providedPassword !== password) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
