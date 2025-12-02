import { EventForm } from "@/components/EventForm";

export default function CreateEventPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Event</h1>
        <p className="text-gray-600">
          Fill out the form to create a new event
        </p>
      </div>
      <EventForm />
    </div>
  );
}

