import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token: Record<string, any> | null | undefined = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated, send a 401 response
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth'
    url.searchParams.set('code', '2');
    return NextResponse.redirect(url)
  }

  const userPermissions = token.account.response.role?.permissions?.map((perm: any) => perm.action) || [];

  const restrictedRoutes: Record<string, string[]> = {
    // '/admin': ['adminAccess'],
    '/dashboard/manage-users': ['userManagement.viewListOfUser'],
  };

  const currentPath = req.nextUrl.pathname;
  const requiredPermissions = Object.keys(restrictedRoutes).find(path => currentPath.startsWith(path));

  if (requiredPermissions && restrictedRoutes[requiredPermissions]) {
    const hasPermission = restrictedRoutes[requiredPermissions].some(permission => userPermissions.includes(permission));
    if (!hasPermission) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  return NextResponse.next();
}

// Specify the paths where the middleware should be applied
export const config = {
  matcher: ["/dashboard", "/dashboard/manage-users"], // Replace with your protected routes
};
