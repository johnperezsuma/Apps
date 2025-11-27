import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-helpers";
import { z } from "zod";

const registerAttendeeSchema = z.object({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId: currentUserId } = await getAuth();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = registerAttendeeSchema.parse(body);

    // Verificar que el evento existe
    const event = await prisma.event.findFirst({
      where: {
        id: validatedData.eventId,
        deleteLogic: false,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que el usuario existe
    const user = await prisma.users.findUnique({
      where: { id: validatedData.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si el usuario ya está registrado
    const existingAttendee = await prisma.eventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId: validatedData.eventId,
          userId: validatedData.userId,
        },
      },
    });

    if (existingAttendee) {
      return NextResponse.json(
        { error: "El usuario ya está registrado en este evento" },
        { status: 400 }
      );
    }

    // Registrar el asistente
    const attendee = await prisma.eventAttendee.create({
      data: {
        eventId: validatedData.eventId,
        userId: validatedData.userId,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(attendee, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error registering attendee:", error);
    return NextResponse.json(
      { error: "Error al registrar el asistente" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getAuth();

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (eventId) {
      // Obtener todos los asistentes de un evento específico
      const attendees = await prisma.eventAttendee.findMany({
        where: {
          eventId: eventId,
        },
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
      });

      return NextResponse.json(attendees);
    }

    // Obtener todos los eventos a los que el usuario está registrado
    const userAttendances = await prisma.eventAttendee.findMany({
      where: {
        userId: userId,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(userAttendances);
  } catch (error) {
    console.error("Error fetching attendees:", error);
    return NextResponse.json(
      { error: "Error al obtener los asistentes" },
      { status: 500 }
    );
  }
}

