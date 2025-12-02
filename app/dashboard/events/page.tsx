import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { DeleteEventTableButton } from "@/components/DeleteEventTableButton";

export default async function EventsPage() {
  // Sin autenticación por el momento - mostrar todos los eventos no eliminados lógicamente
  const events = await prisma.events.findMany({
    where: {
      deleteLogic: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Eventos</h1>
          <p className="text-gray-600">
            Gestiona todos tus eventos
          </p>
        </div>
        <Link
          href="/dashboard/events/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Crear Evento
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            No tienes eventos creados aún
          </p>
          <Link
            href="/dashboard/events/create"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Crear tu primer evento →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {event.title}
                      </div>
                      {event.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.location}
                    </div>
                    <div className="text-sm text-gray-500">{event.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(event.date), "PPP", { locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.startTime} - {event.endTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/dashboard/events/${event.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/dashboard/events/${event.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Editar
                      </Link>
                      <DeleteEventTableButton eventId={event.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

