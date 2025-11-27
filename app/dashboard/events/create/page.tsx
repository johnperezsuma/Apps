import { EventForm } from "@/components/EventForm";

export default function CreateEventPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Evento</h1>
        <p className="text-gray-600">
          Completa el formulario para crear un nuevo evento
        </p>
      </div>
      <EventForm />
    </div>
  );
}

