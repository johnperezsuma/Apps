/**
 * Helper para generar códigos QR con formato de usuario y evento
 * 
 * Este helper genera un código QR que contiene la información necesaria
 * para registrar un usuario en un evento mediante el escáner QR.
 * 
 * Formato del QR: JSON con { id_user: string, id_event: string }
 */

import { generateQRCode } from "./qr";

export interface QRUserEventData {
  id_user: string;
  id_event: string;
}

/**
 * Genera un código QR en formato data URL para un usuario y evento específicos
 * 
 * @param userId - ID del usuario que se registrará en el evento
 * @param eventId - ID del evento al que se registrará el usuario
 * @returns Promise con el data URL del código QR generado
 * 
 * @example
 * ```typescript
 * const qrDataURL = await generateUserEventQR("user-123", "event-456");
 * // Usa qrDataURL como src de una imagen o para descargar
 * ```
 */
export async function generateUserEventQR(
  userId: string,
  eventId: string
): Promise<string> {
  const qrData: QRUserEventData = {
    id_user: userId,
    id_event: eventId,
  };

  const qrString = JSON.stringify(qrData);
  const qrDataURL = await generateQRCode(qrString);

  return qrDataURL;
}

/**
 * Valida si un string es un QR válido con formato de usuario y evento
 * 
 * @param qrString - String leído del código QR
 * @returns Objeto con los datos parseados o null si es inválido
 */
export function parseUserEventQR(qrString: string): QRUserEventData | null {
  try {
    const data = JSON.parse(qrString) as QRUserEventData;
    
    if (data.id_user && data.id_event) {
      return data;
    }
    
    return null;
  } catch {
    return null;
  }
}

