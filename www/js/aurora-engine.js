'use strict';
/* =========================================================================
   StockForge AI — 60fps Silk Aurora & Bokeh Living Canvas Engine
   Ported from the Luxury Mobile Atelier prototype:
   - Flowing emerald-gold silk aurora ribbons (3 layers)
   - Slow-rotating astrolabe arc that follows the pointer
   - 34 luminous gold/emerald bokeh dust particles
   - pointermove parallax + energy burst on GENERATE PROMPT MASTER
   - Auto-pauses on visibilitychange (battery saving) and resumes
   100% offline. No network, no API key.
   ========================================================================= */

(function () {
    var CANVAS_STATE = {
        pointerX: 0.5,
        pointerY: 0.35,
        burstEnergy: 0,
        particles: [],
        running: false,
        rafId: null,
        t: 0
    };

    var canvas = null;
    var ctx = null;
    var viewport = null;

    function dpr() {
        return Math.min(window.devicePixelRatio || 1, 2);
    }

    function resizeCanvas() {
        if (!canvas || !viewport) return;
        var rect = viewport.getBoundingClientRect();
        var d = dpr();
        canvas.width = Math.max(1, Math.round(rect.width * d));
        canvas.height = Math.max(1, Math.round(rect.height * d));
        ctx.setTransform(d, 0, 0, d, 0, 0);
    }

    function seedParticles() {
        CANVAS_STATE.particles = [];
        for (var i = 0; i < 34; i++) {
            CANVAS_STATE.particles.push({
                x: Math.random(),
                y: Math.random(),
                r: 1.1 + Math.random() * 2.6,
                vx: (Math.random() - 0.5) * 0.00045,
                vy: -0.0002 - Math.random() * 0.0005,
                isGold: i % 3 === 0,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    function renderFrame() {
        if (!CANVAS_STATE.running) return;
        var d = dpr();
        var w = canvas.width / d;
        var h = canvas.height / d;
        var isPearl = document.documentElement.getAttribute('data-theme') === 'pearl';
        var t = CANVAS_STATE.t;

        CANVAS_STATE.t += 0.008 + CANVAS_STATE.burstEnergy * 0.035;
        if (CANVAS_STATE.burstEnergy > 0.001) {
            CANVAS_STATE.burstEnergy *= 0.94;
        } else {
            CANVAS_STATE.burstEnergy = 0;
        }

        ctx.clearRect(0, 0, w, h);

        // Flowing Silk Aurora Ribbons
        for (var layer = 0; layer < 3; layer++) {
            ctx.beginPath();
            var baseY = h * (0.24 + layer * 0.28) + Math.sin(t + layer) * 28;
            ctx.moveTo(0, h);
            for (var x = 0; x <= w; x += 16) {
                var nx = x / w;
                var wave =
                    Math.sin(nx * 3.4 + t * (1 + layer * 0.25) + layer) * (36 + CANVAS_STATE.burstEnergy * 45) +
                    Math.cos(nx * 5.2 - t * 0.8) * 18 +
                    (CANVAS_STATE.pointerY - 0.5) * 35;
                ctx.lineTo(x, baseY + wave);
            }
            ctx.lineTo(w, h);
            ctx.closePath();

            var grad = ctx.createLinearGradient(0, baseY - 60, w, baseY + 140);
            if (isPearl) {
                grad.addColorStop(0, layer === 1 ? 'rgba(184, 134, 11, 0.08)' : 'rgba(15, 81, 50, 0.07)');
                grad.addColorStop(1, 'rgba(246, 250, 248, 0)');
            } else {
                grad.addColorStop(0, layer === 1 ? 'rgba(229, 193, 88, ' + (0.09 + CANVAS_STATE.burstEnergy * 0.14) + ')' : 'rgba(16, 185, 129, ' + (0.12 + CANVAS_STATE.burstEnergy * 0.16) + ')');
                grad.addColorStop(1, 'rgba(3, 13, 10, 0)');
            }
            ctx.fillStyle = grad;
            ctx.fill();
        }

        // Delicate Rotating Astrolabe Arc in Background
        var cx = w * (0.5 + (CANVAS_STATE.pointerX - 0.5) * 0.08);
        var cy = h * 0.28;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.22);
        ctx.strokeStyle = isPearl ? 'rgba(184,134,11,0.12)' : 'rgba(229,193,88,' + (0.12 + CANVAS_STATE.burstEnergy * 0.25) + ')';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 12]);
        ctx.beginPath();
        ctx.arc(0, 0, 145 + CANVAS_STATE.burstEnergy * 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Luminous Bokeh Dust Particles
        for (var i = 0; i < CANVAS_STATE.particles.length; i++) {
            var p = CANVAS_STATE.particles[i];
            p.x += p.vx * (1 + CANVAS_STATE.burstEnergy * 6);
            p.y += p.vy * (1 + CANVAS_STATE.burstEnergy * 6);
            if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
            if (p.x < -0.05) p.x = 1.05;
            if (p.x > 1.05) p.x = -0.05;

            var px = p.x * w + (CANVAS_STATE.pointerX - 0.5) * 18;
            var py = p.y * h + (CANVAS_STATE.pointerY - 0.5) * 18;
            var alpha = 0.28 + 0.35 * Math.sin(t * 2.2 + p.phase) + CANVAS_STATE.burstEnergy * 0.3;

            ctx.beginPath();
            ctx.arc(px, py, p.r + CANVAS_STATE.burstEnergy * 1.5, 0, Math.PI * 2);
            if (p.isGold) {
                ctx.fillStyle = isPearl ? 'rgba(184, 134, 11, ' + alpha + ')' : 'rgba(229, 193, 88, ' + alpha + ')';
            } else {
                ctx.fillStyle = isPearl ? 'rgba(15, 81, 50, ' + (alpha * 0.85) + ')' : 'rgba(16, 185, 129, ' + alpha + ')';
            }
            ctx.fill();
        }

        CANVAS_STATE.rafId = requestAnimationFrame(renderFrame);
    }

    function start() {
        if (CANVAS_STATE.running || !canvas) return;
        CANVAS_STATE.running = true;
        CANVAS_STATE.rafId = requestAnimationFrame(renderFrame);
    }

    function stop() {
        CANVAS_STATE.running = false;
        if (CANVAS_STATE.rafId) {
            cancelAnimationFrame(CANVAS_STATE.rafId);
            CANVAS_STATE.rafId = null;
        }
    }

    function init() {
        canvas = document.getElementById('luxuryCanvas');
        viewport = document.getElementById('appViewport');
        if (!canvas || !viewport) return;
        ctx = canvas.getContext('2d');
        seedParticles();
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        viewport.addEventListener('pointermove', function (e) {
            var rect = viewport.getBoundingClientRect();
            if (rect.width > 0) CANVAS_STATE.pointerX = (e.clientX - rect.left) / rect.width;
            if (rect.height > 0) CANVAS_STATE.pointerY = (e.clientY - rect.top) / rect.height;
        });
        // Battery saving: pause the 60fps loop when the tab/app is hidden
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop();
            else start();
        });
        if (!document.hidden) start();
    }

    window.StockForgeAurora = {
        init: init,
        start: start,
        stop: stop,
        burst: function () { CANVAS_STATE.burstEnergy = 1.0; },
        state: CANVAS_STATE
    };
})();
