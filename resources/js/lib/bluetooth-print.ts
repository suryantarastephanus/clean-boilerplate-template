/**
 * Bluetooth Thermal Printer Integration (ESC/POS 58mm / 80mm)
 * Supports:
 * 1. Web Bluetooth API: Direct in-browser GATT connection (Chrome for Android / Desktop).
 * 2. RawBT Print Service: Android Intent bridge supporting 100% of Bluetooth Classic (SPP 2.0/3.0) & BLE printers.
 * 3. Preference storage in localStorage for seamless 1-tap printing.
 */

export interface BluetoothPrintResult {
    success: boolean;
    method: 'web_bluetooth' | 'rawbt';
    message: string;
    deviceName?: string;
}

// Known GATT Service UUIDs used by ESC/POS Thermal Printers
const THERMAL_PRINTER_SERVICES = [
    '000018f0-0000-1000-8000-00805f9b34fb', // Standard ESC/POS Service
    'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // PosPrinter / Chinese thermal
    '49535343-fe7d-4ae5-8fa9-9fafd205e455', // ISSC transparent UART (Goojprt, MPT-II, PT-210)
    '0000ffe0-0000-1000-8000-00805f9b34fb', // Serial BLE module (HM-10, Zjiang, Panda)
    '0000ff00-0000-1000-8000-00805f9b34fb',
    '0000fff0-0000-1000-8000-00805f9b34fb',
    '0000fee7-0000-1000-8000-00805f9b34fb',
];

// Active connection cache for rapid subsequent prints without re-pairing
let cachedDevice: any = null;
let cachedCharacteristic: any = null;

/**
 * Detect whether the user is on a mobile device (Android, iOS, iPadOS, tablets)
 */
export function isMobileDevice(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    const ua = navigator.userAgent || '';
    const isMobileUa =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            ua,
        );
    const isTouchTablet =
        navigator.maxTouchPoints > 1 && window.innerWidth <= 1024;
    return isMobileUa || isTouchTablet;
}

/**
 * Detect whether the user is specifically running on an Android device
 */
export function isAndroidDevice(): boolean {
    if (typeof navigator === 'undefined') return false;
    return /Android/i.test(navigator.userAgent || '');
}

/**
 * Check whether Web Bluetooth API is supported in the current browser
 */
export function isWebBluetoothSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

/**
 * Convert base64 ESC/POS payload to Uint8Array
 */
export function base64ToUint8Array(base64: string): Uint8Array {
    // Strip metadata prefixes if present
    const clean = base64.replace(/^data:.*?;base64,/, '').trim();
    const binary = atob(clean);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

/**
 * Convert Uint8Array to base64 string
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Get preferred Bluetooth printing method from localStorage
 */
export function getPreferredBtPrintMethod():
    | 'web_bluetooth'
    | 'rawbt'
    | 'browser'
    | null {
    if (typeof localStorage === 'undefined') return null;
    const val = localStorage.getItem('waroeng_preferred_bt_print_method');
    if (val === 'web_bluetooth' || val === 'rawbt' || val === 'browser') {
        return val;
    }
    return null;
}

/**
 * Set preferred Bluetooth printing method in localStorage
 */
export function setPreferredBtPrintMethod(
    method: 'web_bluetooth' | 'rawbt' | 'browser' | null,
): void {
    if (typeof localStorage === 'undefined') return;
    if (method) {
        localStorage.setItem('waroeng_preferred_bt_print_method', method);
    } else {
        localStorage.removeItem('waroeng_preferred_bt_print_method');
    }
}

/**
 * Build Android RawBT Intent URL for 1-tap printing
 */
export function getRawBtIntentUrl(base64Payload: string): string {
    const cleanPayload = base64Payload.replace(/^data:.*?;base64,/, '').trim();
    return `intent:base64,${cleanPayload}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;S.browser_fallback_url=https://play.google.com/store/apps/details?id=ru.a402d.rawbtprinter;end;`;
}

/**
 * Trigger RawBT printing via Android Intent URL
 */
export function printViaRawBt(base64Payload: string): BluetoothPrintResult {
    const intentUrl = getRawBtIntentUrl(base64Payload);

    // Create a temporary hidden anchor to trigger standard Android intent dispatching
    const link = document.createElement('a');
    link.href = intentUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
        if (document.body.contains(link)) {
            document.body.removeChild(link);
        }
    }, 500);

    return {
        success: true,
        method: 'rawbt',
        message:
            'Perintah cetak dikirim ke aplikasi RawBT. Printer akan mencetak struk secara otomatis.',
    };
}

/**
 * Disconnect cached Web Bluetooth printer
 */
export async function disconnectWebBluetooth(): Promise<void> {
    if (cachedDevice && cachedDevice.gatt?.connected) {
        try {
            await cachedDevice.gatt.disconnect();
        } catch {
            // Ignore disconnect errors
        }
    }
    cachedDevice = null;
    cachedCharacteristic = null;
}

/**
 * Print via Web Bluetooth API (BLE GATT)
 */
export async function printViaWebBluetooth(
    payload: Uint8Array | string,
): Promise<BluetoothPrintResult> {
    if (!isWebBluetoothSupported()) {
        throw new Error(
            'Web Bluetooth tidak didukung pada browser ini. Gunakan Google Chrome di Android atau gunakan metode RawBT.',
        );
    }

    const data =
        typeof payload === 'string' ? base64ToUint8Array(payload) : payload;
    let characteristic = cachedCharacteristic;
    let deviceName = cachedDevice?.name || 'Printer Bluetooth';

    // 1. Try reusing existing connection
    const isCachedValid =
        cachedDevice &&
        cachedDevice.gatt &&
        cachedDevice.gatt.connected &&
        characteristic;

    if (!isCachedValid) {
        // Request device from user
        const nav = navigator as any;
        const device = await nav.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: THERMAL_PRINTER_SERVICES,
        });

        if (!device) {
            throw new Error('Pemilihan perangkat Bluetooth dibatalkan.');
        }

        deviceName = device.name || 'Printer Bluetooth';

        // Listen for disconnect
        device.addEventListener('gattserverdisconnected', () => {
            cachedDevice = null;
            cachedCharacteristic = null;
        });

        const server = await device.gatt.connect();
        if (!server) {
            throw new Error('Gagal menyambungkan ke GATT server printer.');
        }

        // Search for writable characteristic across all services
        let foundChar: any = null;

        // Try known services first
        for (const serviceUuid of THERMAL_PRINTER_SERVICES) {
            try {
                const service = await server.getPrimaryService(serviceUuid);
                const chars = await service.getCharacteristics();
                for (const char of chars) {
                    if (
                        char.properties.write ||
                        char.properties.writeWithoutResponse
                    ) {
                        foundChar = char;
                        break;
                    }
                }
            } catch {
                // Service not present on this device, proceed to next
            }
            if (foundChar) break;
        }

        // If not found in known UUIDs, probe all primary services
        if (!foundChar) {
            try {
                const services = await server.getPrimaryServices();
                for (const service of services) {
                    try {
                        const chars = await service.getCharacteristics();
                        for (const char of chars) {
                            if (
                                char.properties.write ||
                                char.properties.writeWithoutResponse
                            ) {
                                foundChar = char;
                                break;
                            }
                        }
                    } catch {
                        // ignore characteristic read error
                    }
                    if (foundChar) break;
                }
            } catch {
                // ignore
            }
        }

        if (!foundChar) {
            await server.disconnect();
            throw new Error(
                `Tidak ditemukan karakteristik print ESC/POS yang dapat ditulis pada printer "${deviceName}". Pastikan printer mendukung BLE atau gunakan metode RawBT.`,
            );
        }

        cachedDevice = device;
        cachedCharacteristic = foundChar;
        characteristic = foundChar;
    }

    // 2. Transmit data in chunks (100 bytes chunks with 20ms delay to prevent buffer overflow)
    const CHUNK_SIZE = 100;
    const totalBytes = data.length;

    for (let offset = 0; offset < totalBytes; offset += CHUNK_SIZE) {
        const chunk = data.slice(
            offset,
            Math.min(offset + CHUNK_SIZE, totalBytes),
        );

        if (characteristic.properties.writeWithoutResponse) {
            await characteristic.writeValueWithoutResponse(chunk);
        } else {
            await characteristic.writeValue(chunk);
        }

        // Short throttle pause for printer micro-controller buffer
        if (offset + CHUNK_SIZE < totalBytes) {
            await new Promise((resolve) => setTimeout(resolve, 20));
        }
    }

    return {
        success: true,
        method: 'web_bluetooth',
        message: `Struk berhasil dikirim ke printer "${deviceName}".`,
        deviceName,
    };
}
