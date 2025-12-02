import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";

export default async function DashboardPage() {
  // Sin autenticación por el momento - mostrar todos los eventos
  const events = await prisma.events.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome
        </h1>
        <p className="text-gray-600">
          Manage your events from here
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">My Events</h2>
        <Link
          href="/dashboard/events/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            You don't have any events created yet
          </p>
          <Link
            href="/dashboard/events/create"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Create your first event →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/dashboard/events/${event.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {event.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {event.description || "No description"}
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-center">
                  <span className="font-medium">📍</span> {event.location}, {event.city}
                </p>
                <p className="flex items-center">
                  <span className="font-medium">📅</span>{" "}
                  {format(new Date(event.date), "PPP", { locale: es })}
                </p>
                <p className="flex items-center">
                  <span className="font-medium">🕐</span> {event.startTime} - {event.endTime}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

