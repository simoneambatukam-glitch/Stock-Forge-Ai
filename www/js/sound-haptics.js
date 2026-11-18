'use strict';
/* =========================================================================
   StockForge AI — Web Audio Glass Synthesizer + Tactile Haptics
   Ported from the Luxury Mobile Atelier prototype:
   - playTactileClick(): short 880Hz -> 420Hz sine blip on every tap
   - playLuxuryChime(): C5-E5-G5-C6 triangle glass chord (generate / export)
   - Coordinate radial ripple on every .lux-btn (pointerdown)
   - Mute / Unmute toggle persisted in localStorage
   Capacitor layer (guarded — the app also runs fine in a plain browser):
   - @capacitor/haptics  Haptics.impact()  (fallback: navigator.vibrate)
   - @capacitor/clipboard / filesystem / share are used by app.js
   100% offline. No network, no API key.
   ========================================================================= */

(function () {
    var SOUND_KEY = 'stockforge_sound_enabled';
    var audioCtx = null;
    var isSoundEnabled = true;

    try {
        var saved = localStorage.getItem(SOUND_KEY);
        if (saved !== null) isSoundEnabled = saved !== 'false';
    } catch (e) { /* storage unavailable — keep sound on */ }

    function capPlugins() {
        try {
            return (window.Capacitor && window.Capacitor.Plugins) || null;
        } catch (e) {
            return null;
        }
    }

    function hapticImpact(style) {
        // style: 'Light' | 'Medium' | 'Heavy'
        var plugins = capPlugins();
        try {
            if (plugins && plugins.Haptics && typeof plugins.Haptics.impact === 'function') {
                plugins.Haptics.impact({ style: style || 'Light' });
                return;
            }
        } catch (e) { /* fall through to vibrate */ }
        try {
            if (navigator.vibrate) navigator.vibrate(style === 'Heavy' ? 25 : 10);
        } catch (e) { /* no vibration support */ }
    }

    function ensureAudioCtx() {
        if (!audioCtx) {
            var AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                try { audioCtx = new AudioContextClass(); } catch (e) { audioCtx = null; }
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(function () {});
        }
    }

    function playTactileClick() {
        if (!isSoundEnabled) return;
        try {
            ensureAudioCtx();
            if (!audioCtx) return;
            var now = audioCtx.currentTime;
            var osc = audioCtx.createOscillator();
            var gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(420, now + 0.045);
            gain.gain.setValueAtTime(0.045, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) { /* audio unavailable */ }
    }

    function playLuxuryChime() {
        if (!isSoundEnabled) return;
        try {
            ensureAudioCtx();
            if (!audioCtx) return;
            var now = audioCtx.currentTime;
            var freqs = [523.25, 659.25, 783.99, 1046.5]; // C5-E5-G5-C6 luxury glass chord
            freqs.forEach(function (f, idx) {
                var osc = audioCtx.createOscillator();
                var gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, now + idx * 0.045);
                gain.gain.setValueAtTime(0.001, now + idx * 0.045);
                gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.045 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.045 + 0.42);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now + idx * 0.045);
                osc.stop(now + idx * 0.045 + 0.45);
            });
        } catch (e) { /* audio unavailable */ }
    }

    function showToastSafe(msg) {
        try {
            if (window.StockForgeApp && typeof window.StockForgeApp.showToast === 'function') {
                window.StockForgeApp.showToast(msg);
            }
        } catch (e) { /* toast not ready yet */ }
    }

    function syncSoundIcons() {
        var on = document.getElementById('iconSoundOn');
        var off = document.getElementById('iconSoundOff');
        if (on) on.classList.toggle('hidden', !isSoundEnabled);
        if (off) off.classList.toggle('hidden', isSoundEnabled);
    }

    function toggleAudioSound() {
        isSoundEnabled = !isSoundEnabled;
        try { localStorage.setItem(SOUND_KEY, isSoundEnabled ? 'true' : 'false'); } catch (e) {}
        syncSoundIcons();
        if (isSoundEnabled) playTactileClick();
        showToastSafe(isSoundEnabled ? 'Tactile Glass Audio: ON' : 'Tactile Glass Audio: MUTED');
    }

    // Global coordinate radial ripple + tactile click on every .lux-btn
    document.addEventListener('pointerdown', function (e) {
        var btn = e.target && e.target.closest ? e.target.closest('.lux-btn') : null;
        if (!btn) return;
        playTactileClick();
        hapticImpact('Light');

        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var ripple = document.createElement('span');
        ripple.className = 'lux-ripple';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 620);
    });

    window.StockForgeSound = {
        playTactileClick: playTactileClick,
        playLuxuryChime: playLuxuryChime,
        toggleAudioSound: toggleAudioSound,
        hapticImpact: hapticImpact,
        syncSoundIcons: syncSoundIcons,
        isEnabled: function () { return isSoundEnabled; }
    };
})();
