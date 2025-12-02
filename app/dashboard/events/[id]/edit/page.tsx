import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/EventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.events.findFirst({
    where: {
      id: id,
      deleteLogic: false,
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Event</h1>
        <p className="text-gray-600">
          Modify the event information
        </p>
      </div>
      <EventForm event={event} />
    </div>
  );
}

