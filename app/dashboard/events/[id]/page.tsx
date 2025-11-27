import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { DeleteEventButton } from "@/components/DeleteEventButton";
import { QRImage } from "@/components/QRImage";

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findFirst({
    where: {
      id: params.id,
      deleteLogic: false,
    },
    // @ts-expect-error - Prisma types need regeneration after schema update
    include: {
      attendees: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  }) as any;

  if (!event) {
    notFound();
  }

  const eventUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/event/${event.id}`;

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full">
              <svg
                className="h-5 w-5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-indigo-700 font-bold text-lg">
                {event.attendees.length}
              </span>
              <span className="text-indigo-600 text-sm">
                {event.attendees.length === 1 ? "asistente" : "asistentes"}
              </span>
            </div>
          </div>
          <p className="text-gray-600">
            Detalles del evento
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/events/${event.id}/edit`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Editar
          </Link>
          <DeleteEventButton eventId={event.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Información del Evento
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Descripción
              </label>
              <p className="mt-1 text-gray-900">
                {event.description || "Sin descripción"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Ubicación
              </label>
              <p className="mt-1 text-gray-900">{event.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Ciudad</label>
              <p className="mt-1 text-gray-900">{event.city}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Fecha</label>
              <p className="mt-1 text-gray-900">
                {format(new Date(event.date), "PPP", { locale: es })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Hora</label>
              <p className="mt-1 text-gray-900">
                {event.startTime} - {event.endTime}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Creado por
              </label>
              <p className="mt-1 text-gray-900">{event.userCreator}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                URL del Evento
              </label>
              <p className="mt-1 text-sm text-indigo-600 break-all">
                {eventUrl}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Código QR
          </h2>
          {event.qrImage ? (
            <div className="flex flex-col items-center">
              <div className="mb-4 p-4 bg-white border-2 border-gray-200 rounded-lg">
                <QRImage
                  src={event.qrImage}
                  alt="QR Code"
                  width={300}
                  height={300}
                  className="rounded"
                />
              </div>
              <a
                href={event.qrImage}
                download={`qr-${event.title.replace(/\s+/g, "-")}.png`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Descargar QR
              </a>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay código QR generado</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de Asistentes */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Asistentes Registrados
          </h2>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
            <svg
              className="h-5 w-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-indigo-700 font-bold text-base">
              {event.attendees.length}
            </span>
            <span className="text-indigo-600 text-sm">
              {event.attendees.length === 1 ? "asistente" : "asistentes"}
            </span>
          </div>
        </div>

        {event.attendees.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p>No hay asistentes registrados aún</p>
            <p className="text-sm mt-2">
              Los usuarios se registrarán cuando escaneen su código QR
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Registro
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {event.attendees.map((attendee: any, index: number) => (
                  <tr key={attendee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {attendee.user.name
                              ? attendee.user.name.charAt(0).toUpperCase()
                              : attendee.user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {attendee.user.name || "Sin nombre"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendee.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(attendee.createdAt), "PPP 'a las' HH:mm", {
                        locale: es,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

