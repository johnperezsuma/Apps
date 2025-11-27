import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQRCode } from "@/lib/qr";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().min(1),
  city: z.string().min(1),
  date: z.string(),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = eventSchema.parse(body);

    // Generar URL del evento
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const eventUrl = `${appUrl}/event/${crypto.randomUUID()}`;

    // Generar QR code
    let qrImageUrl: string | null = null;
    try {
      const qrDataURL = await generateQRCode(eventUrl);
      
      // Convertir data URL a blob y subir a UploadThing
      // Por ahora, guardamos el data URL directamente
      // En producción, deberías subirlo a UploadThing o Cloudinary
      qrImageUrl = qrDataURL;
    } catch (error) {
      console.error("Error generating QR code:", error);
      // Continuar sin QR si hay error
    }

    // Crear el evento (el ID se generará en Prisma)
    // Sin autenticación por el momento - usar valores por defecto
    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        location: validatedData.location,
        city: validatedData.city,
        date: new Date(validatedData.date),
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        createdBy: "default-user",
        userCreator: "Usuario",
        qrImage: qrImageUrl,
      },
    });

    // Actualizar el QR con el ID real del evento
    const finalEventUrl = `${appUrl}/event/${event.id}`;
    let finalQrImageUrl = qrImageUrl;
    
    try {
      const finalQrDataURL = await generateQRCode(finalEventUrl);
      finalQrImageUrl = finalQrDataURL;
      
      // Actualizar el evento con el QR correcto
      await prisma.event.update({
        where: { id: event.id },
        data: { qrImage: finalQrImageUrl },
      });
    } catch (error) {
      console.error("Error updating QR code:", error);
    }

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Error al crear el evento" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Sin autenticación por el momento - mostrar todos los eventos
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Error al obtener los eventos" },
      { status: 500 }
    );
  }
}

