import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { QRImage } from "@/components/QRImage";

export default async function PublicEventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findFirst({
    where: {
      id: params.id,
      deleteLogic: false,
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            {event.description && (
              <p className="text-indigo-100 text-lg">{event.description}</p>
            )}
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Detalles del Evento
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">📍</span>
                      <div>
                        <p className="font-medium text-gray-900">{event.location}</p>
                        <p className="text-gray-600">{event.city}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">📅</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {format(new Date(event.date), "PPP", { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">🕐</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {event.startTime} - {event.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">👤</span>
                      <div>
                        <p className="font-medium text-gray-900">Organizado por</p>
                        <p className="text-gray-600">{event.userCreator}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {event.qrImage && (
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Escanea el código QR
                  </h3>
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <QRImage
                      src={event.qrImage}
                      alt="QR Code"
                      width={250}
                      height={250}
                      className="rounded"
                    />
                  </div>
                  <a
                    href={event.qrImage}
                    download={`qr-${event.title.replace(/\s+/g, "-")}.png`}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Descargar QR
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

