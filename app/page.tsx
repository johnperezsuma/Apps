import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAdmin = process.env.IS_ADMIN === "TRUE";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="flex flex-col items-center justify-center gap-12">
          {/* Sección de información */}
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Event Manager
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Gestiona tus eventos de manera fácil y profesional. Crea, organiza y comparte tus eventos con códigos QR personalizados.
            </p>
            <div className="flex gap-4 justify-center">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
                >
                  Ir al Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/sign-up"
                      className="inline-block bg-white hover:bg-gray-50 text-indigo-600 font-semibold py-3 px-8 rounded-lg text-lg transition-colors border-2 border-indigo-600"
                    >
                      Registrarse
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

