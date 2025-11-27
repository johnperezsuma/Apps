"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/sign-in");
    router.refresh();
  };

  const userInitial = session?.user?.name?.[0]?.toUpperCase() || 
                     session?.user?.email?.[0]?.toUpperCase() || 
                     "U";

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Event Manager</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive("/dashboard") && pathname === "/dashboard"
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="mr-3">🏠</span>
            Inicio
          </Link>
          <Link
            href="/dashboard/events"
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive("/dashboard/events")
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="mr-3">📅</span>
            Eventos
          </Link>
          <Link
            href="/dashboard/qr-scanner"
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive("/dashboard/qr-scanner")
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="mr-3">📷</span>
            Escáner QR
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || session?.user?.email || "Usuario"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
}

