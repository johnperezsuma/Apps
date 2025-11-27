import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/EventForm";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findFirst({
    where: {
      id: params?.id,
      deleteLogic: false,
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Evento</h1>
        <p className="text-gray-600">
          Modifica la información del evento
        </p>
      </div>
      <EventForm event={event} />
    </div>
  );
}

