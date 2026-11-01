/**
 * Sound & Voice Announcement utility for QRIS payment success.
 * Uses Web Audio API for harmonic chimes + SpeechSynthesis for indonesian voice soundbox announcement.
 */

export function terbilangRupiah(nominal: number): string {
    const angka = Math.floor(Math.abs(nominal));
    if (angka === 0) return 'nol rupiah';

    const satuan = [
        '',
        'satu',
        'dua',
        'tiga',
        'empat',
        'lima',
        'enam',
        'tujuh',
        'delapan',
        'sembilan',
        'sepuluh',
        'sebelas',
    ];

    function bilang(n: number): string {
        if (n < 12) return satuan[n];
        if (n < 20) return bilang(n - 10) + ' belas';
        if (n < 100)
            return (
                bilang(Math.floor(n / 10)) +
                ' puluh' +
                (n % 10 !== 0 ? ' ' + satuan[n % 10] : '')
            );
        if (n < 200)
            return 'seratus' + (n - 100 !== 0 ? ' ' + bilang(n - 100) : '');
        if (n < 1000)
            return (
                bilang(Math.floor(n / 100)) +
                ' ratus' +
                (n % 100 !== 0 ? ' ' + bilang(n % 100) : '')
            );
        if (n < 2000)
            return 'seribu' + (n - 1000 !== 0 ? ' ' + bilang(n - 1000) : '');
        if (n < 1000000)
            return (
                bilang(Math.floor(n / 1000)) +
                ' ribu' +
                (n % 1000 !== 0 ? ' ' + bilang(n % 1000) : '')
            );
        if (n < 1000000000)
            return (
                bilang(Math.floor(n / 1000000)) +
                ' juta' +
                (n % 1000000 !== 0 ? ' ' + bilang(n % 1000000) : '')
            );
        if (n < 1000000000000)
            return (
                bilang(Math.floor(n / 1000000000)) +
                ' milyar' +
                (n % 1000000000 !== 0 ? ' ' + bilang(n % 1000000000) : '')
            );
        return String(n);
    }

    return `${bilang(angka).trim()} rupiah`;
}

/**
 * Play a sparkling melodic chime (cash-register / payment success harmony)
 */
export function playQrisSuccessChime(): void {
    if (typeof window === 'undefined') return;

    try {
        const AudioContextClass =
            window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        const ctx = new AudioContextClass();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const now = ctx.currentTime;

        // Arpeggiated cheerful major chord: C5, E5, G5, C6, E6 with bell shimmer
        const chordFrequencies = [523.25, 659.25, 783.99, 1046.5, 1318.51];

        chordFrequencies.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // Blend triangle and sine for smooth but crisp bell timbre
            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            // Shimmer envelope: quick attack, smooth exponential decay
            gain.gain.setValueAtTime(0, now + idx * 0.07);
            gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.07 + 0.015);
            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                now + idx * 0.07 + 0.45,
            );

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.5);
        });

        // Add high metallic bell sparkle on top (coin register sound)
        const shimmerOsc = ctx.createOscillator();
        const shimmerGain = ctx.createGain();
        shimmerOsc.type = 'sine';
        shimmerOsc.frequency.setValueAtTime(2093.0, now + 0.28); // C7 bell ring
        shimmerGain.gain.setValueAtTime(0, now + 0.28);
        shimmerGain.gain.linearRampToValueAtTime(0.12, now + 0.29);
        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28 + 0.6);

        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(ctx.destination);
        shimmerOsc.start(now + 0.28);
        shimmerOsc.stop(now + 0.28 + 0.65);
    } catch (e) {
        console.warn('Failed to play QRIS success chime:', e);
    }
}

/**
 * Announce success via Indonesian Speech Synthesis (Soundbox voice)
 */
export function speakQrisSuccessAnnouncement(amount?: number | string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
        window.speechSynthesis.cancel(); // Stop any pending speech

        let spokenText = 'Pembayaran QRIS berhasil diterima.';
        const numAmount =
            typeof amount === 'string' ? parseFloat(amount) : amount;

        if (numAmount && !isNaN(numAmount) && numAmount > 0) {
            spokenText = `Pembayaran QRIS berhasil diterima, sebesar ${terbilangRupiah(numAmount)}.`;
        }

        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.lang = 'id-ID';
        utterance.rate = 1.05;
        utterance.pitch = 1.0;

        // Try selecting an Indonesian voice if available
        const voices = window.speechSynthesis.getVoices();
        const idVoice = voices.find(
            (v) =>
                v.lang.toLowerCase().startsWith('id') ||
                v.name.toLowerCase().includes('indonesia'),
        );
        if (idVoice) {
            utterance.voice = idVoice;
        }

        window.speechSynthesis.speak(utterance);
    } catch (e) {
        console.warn('Failed speech synthesis:', e);
    }
}

/**
 * Master function: Play chime and announce via voice
 */
export function playQrisPaymentSuccessSound(options?: {
    amount?: number | string;
    withVoice?: boolean;
    soundEnabled?: boolean;
}): void {
    if (options?.soundEnabled === false) return;

    // 1. Play crystal melodic chime immediately
    playQrisSuccessChime();

    // 2. Play vocal soundbox announcement with a brief pleasing delay (350ms)
    if (options?.withVoice !== false) {
        setTimeout(() => {
            speakQrisSuccessAnnouncement(options?.amount);
        }, 350);
    }
}
