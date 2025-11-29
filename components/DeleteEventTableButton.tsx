"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteEventTableButtonProps {
  eventId: string;
}

export function DeleteEventTableButton({ eventId }: DeleteEventTableButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el evento");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error al eliminar el evento");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? "Eliminando..." : "Eliminar"}
    </button>
  );
}



