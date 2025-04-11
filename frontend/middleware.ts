import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Các route cần xác thực
const protectedRoutes = ["/admin", "/author", "/user"];
// Route login
const authRoute = "/auth/login";

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("accessToken")?.value;
  
  // Lấy path hiện tại
  const { pathname } = request.nextUrl;
  
  // Kiểm tra xem route hiện tại có cần bảo vệ không
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Kiểm tra route hiện tại có phải trang login không
  const isAuthRoute = pathname.startsWith(authRoute);
  
  // Nếu người dùng không đăng nhập và truy cập vào route bảo vệ 
  if (!currentUser && isProtectedRoute) {
    const redirectUrl = new URL(authRoute, request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Nếu người dùng đã đăng nhập và truy cập vào trang login
  if (currentUser && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

// Chỉ định các route cần middleware này
export const config = {
  matcher: [
    /*
     * Đặt route matcher cho route cần bảo vệ
     * '/admin/:path*' - Bất kỳ route nào bắt đầu với /admin
     * '/author/:path*' - Bất kỳ route nào bắt đầu với /author  
     * '/user/:path*' - Bất kỳ route nào bắt đầu với /user
     */
    "/admin/:path*", 
    "/author/:path*",
    "/user/:path*",
    "/auth/:path*"
  ],
};