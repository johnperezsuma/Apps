"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRData {
  id_user: string;
  id_event: string;
}

interface EventInfo {
  id: string;
  title: string;
}

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventInfo: EventInfo | null;
  userId: string;
  eventId: string;
  onRegisterSuccess: () => void;
}

interface CameraPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

function CameraPermissionModal({
  isOpen,
  onClose,
  onRetry,
}: CameraPermissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Permisos de Cámara Requeridos
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="mb-4 flex justify-center">
            <svg
              className="h-16 w-16 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-gray-700 mb-4">
            Para escanear códigos QR, necesitas otorgar permisos de cámara a este sitio.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Instrucciones:
            </p>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Haz clic en el ícono de candado o información en la barra de direcciones</li>
              <li>Busca la sección de "Permisos" o "Cámara"</li>
              <li>Selecciona "Permitir" para el acceso a la cámara</li>
              <li>Recarga la página o haz clic en "Reintentar"</li>
            </ol>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onRetry}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
}

function QRScannerModal({
  isOpen,
  onClose,
  eventInfo,
  userId,
  eventId,
  onRegisterSuccess,
}: QRScannerModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setIsRegistering(true);
    setError(null);

    try {
      const response = await fetch("/api/attendees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventId,
          userId: userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al registrar el asistente");
      }

      setSuccess(true);
      setTimeout(() => {
        onRegisterSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Información del Evento
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {eventInfo && (
          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Nombre del Evento:
            </p>
            <p className="text-xl text-gray-900">{eventInfo.title}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">
              ¡Usuario registrado exitosamente!
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleRegister}
            disabled={isRegistering || success}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {isRegistering ? "Registrando..." : "Registrar Usuario al Evento"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function QRScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrReaderRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [scannedData, setScannedData] = useState<QRData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startScanning = async () => {
    try {
      setError(null);
      setCameraError(null);
      setIsScanning(true);
      
      // Esperar a que el elemento se renderice en el DOM
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verificar que el elemento existe
      const element = document.getElementById("qr-reader");
      if (!element) {
        throw new Error("Elemento del escáner no encontrado");
      }

      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0,
          disableFlip: false,
          videoConstraints: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        (decodedText) => {
          handleQRCodeScanned(decodedText);
        },
        (errorMessage) => {
          // Ignorar errores de escaneo continuo
        }
      );
    } catch (err: any) {
      console.error("Error starting scanner:", err);
      setIsScanning(false);
      
      // Detectar errores de permisos
      const errorMessage = err?.message || String(err);
      const isPermissionError = 
        errorMessage.includes("Permission denied") ||
        errorMessage.includes("NotAllowedError") ||
        errorMessage.includes("NotReadableError") ||
        errorMessage.includes("NotFoundError") ||
        errorMessage.includes("camera") ||
        errorMessage.includes("permission");

      if (isPermissionError) {
        setPermissionModalOpen(true);
      } else {
        setCameraError(
          "No se pudo acceder a la cámara. Verifica que tengas permisos de cámara y que no esté siendo usada por otra aplicación."
        );
      }
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleQRCodeScanned = async (decodedText: string) => {
    try {
      // Detener el escáner
      await stopScanning();

      // Intentar parsear el JSON del QR
      let qrData: QRData;
      try {
        qrData = JSON.parse(decodedText);
      } catch {
        // Si no es JSON, intentar parsear como formato simple
        // Formato esperado: {"id_user":"...","id_event":"..."}
        throw new Error("Formato de QR inválido");
      }

      // Validar que tenga los campos necesarios
      if (!qrData.id_user || !qrData.id_event) {
        throw new Error("El QR no contiene la información necesaria");
      }

      setScannedData(qrData);

      // Obtener información del evento
      const eventResponse = await fetch(`/api/events/${qrData.id_event}`);
      if (!eventResponse.ok) {
        throw new Error("Evento no encontrado");
      }

      const event = await eventResponse.json();
      setEventInfo({
        id: event.id,
        title: event.title,
      });

      setModalOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al procesar el código QR"
      );
      // Reiniciar el escáner después de un error
      setTimeout(() => {
        startScanning();
      }, 2000);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setScannedData(null);
    setEventInfo(null);
    setError(null);
  };

  const handleRegisterSuccess = () => {
    setScannedData(null);
    setEventInfo(null);
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopScanning();
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Escáner de Código QR
        </h1>
        <p className="text-gray-600">
          Escanea el código QR de un usuario para registrarlo en un evento
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {!isScanning ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              Haz clic en el botón para iniciar el escáner
            </p>
            <button
              onClick={startScanning}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Iniciar Escáner
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-700 font-medium">
                Escaneando código QR...
              </p>
              <button
                onClick={stopScanning}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Detener Escáner
              </button>
            </div>
            <div 
              id="qr-reader" 
              ref={qrReaderRef}
              className="w-full"
            ></div>
          </div>
        )}

        {cameraError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{cameraError}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {scannedData && eventInfo && (
        <QRScannerModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          eventInfo={eventInfo}
          userId={scannedData.id_user}
          eventId={scannedData.id_event}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      <CameraPermissionModal
        isOpen={permissionModalOpen}
        onClose={() => setPermissionModalOpen(false)}
        onRetry={() => {
          setPermissionModalOpen(false);
          setTimeout(() => {
            startScanning();
          }, 500);
        }}
      />
    </div>
  );
}

