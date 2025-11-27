import * as QRCode from 'qrcode';

export async function generateQRCode(url: string): Promise<string> {
  try {
    const qrDataURL = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return qrDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

export async function generateQRCodeBuffer(url: string): Promise<Buffer> {
  try {
    const qrBuffer = await QRCode.toBuffer(url, {
      width: 300,
      margin: 2,
    })
    return qrBuffer
  } catch (error) {
    console.error('Error generating QR code buffer:', error)
    throw error
  }
}

