import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-helpers";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  location: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  date: z.string().optional(),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.events.findFirst({
      where: {
        id: id,
        deleteLogic: false,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Error al obtener el evento" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await getAuth();

    // Verificar que el evento existe
    const event = await prisma.events.findFirst({
      where: {
        id: id,
        deleteLogic: false,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    // Si hay autenticación, verificar que el usuario es el creador
    if (userId && event.createdBy !== userId && event.createdBy !== "default-user") {
      return NextResponse.json(
        { error: "No autorizado para editar este evento" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = eventSchema.parse(body);

    const updateData: any = {};
    if (validatedData.title) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.location) updateData.location = validatedData.location;
    if (validatedData.city) updateData.city = validatedData.city;
    if (validatedData.date) updateData.date = new Date(validatedData.date);
    if (validatedData.startTime) updateData.startTime = validatedData.startTime;
    if (validatedData.endTime) updateData.endTime = validatedData.endTime;

    const updatedEvent = await prisma.events.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Error al actualizar el evento" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await getAuth();

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const event = await prisma.events.findFirst({
      where: {
        id: id,
        createdBy: userId,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    // Eliminación lógica: actualizar deleteLogic a true
    await prisma.events.update({
      where: {
        id: id,
      },
      data: {
        deleteLogic: true,
      },
    });

    return NextResponse.json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Error al eliminar el evento" },
      { status: 500 }
    );
  }
}

