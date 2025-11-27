import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await getAuth();

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Verificar que el evento existe
    const event = await prisma.event.findFirst({
      where: {
        id: params.id,
        deleteLogic: false,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    // Obtener información del evento con asistentes
    const eventWithAttendees = await prisma.event.findUnique({
      where: { id: params.id },
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
    });

    if (!eventWithAttendees) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(eventWithAttendees);
  } catch (error) {
    console.error("Error fetching event attendees:", error);
    return NextResponse.json(
      { error: "Error al obtener los asistentes del evento" },
      { status: 500 }
    );
  }
}

