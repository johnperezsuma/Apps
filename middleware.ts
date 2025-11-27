import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Manejar ruta /sign-up por separado - NO requiere autenticación
  if (req.nextUrl.pathname.startsWith("/sign-up")) {
    const isAdmin = process.env.IS_ADMIN === "TRUE";
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    // Si IS_ADMIN es TRUE, permitir acceso sin autenticación
    return NextResponse.next();
  }

  // Para rutas protegidas (/dashboard y /api/events), verificar token
  if (req.nextUrl.pathname.startsWith("/dashboard") || 
      req.nextUrl.pathname.startsWith("/api/events")) {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-up/:path*",
    "/dashboard/:path*",
    "/api/events/:path*",
  ],
}

