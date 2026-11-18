'use strict';
/* =========================================================================
   StockForge AI — Atelier App Controller (Vanilla JS, 100% offline)
   Wires the 6 pure AI agents (js/agents.js) to the luxury UI:
   - Bespoke app icon (Emerald-Gold Faceted Prism & AI Spark)
   - Splash sequence, Obsidian/Pearl theme, toast, bottom-tab navigation
   - 5-menu Studio Produksi, Master Prompt + Metadata output,
     Saran Asset AI, Riwayat Produksi (localStorage, max 40)
   - Copy via Capacitor Clipboard (fallback: navigator.clipboard /
     execCommand) and CSV/icon export via Capacitor Filesystem + Share
     (fallback: browser download)
   All Capacitor access is guarded with try/catch so the app also runs
   in a plain desktop/mobile browser.
   ========================================================================= */

/* =========================================================================
   1. BESPOKE LUXURY APP ICON SVG (Emerald-Gold Faceted Prism & AI Spark)
   Ported from the Luxury Mobile Atelier prototype getLuxuryAppIconSVG().
   The same markup ships as assets/icon-only.svg (1024x1024 master).
   ========================================================================= */
function getLuxuryAppIconSVG(size) {
    size = size || 512;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 512 512">'
        + '<defs>'
        + '<radialGradient id="sfBgGrad" cx="32%" cy="24%" r="85%">'
        + '<stop offset="0%" stop-color="#134E3A"/><stop offset="52%" stop-color="#062219"/><stop offset="100%" stop-color="#020B08"/>'
        + '</radialGradient>'
        + '<linearGradient id="sfGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">'
        + '<stop offset="0%" stop-color="#FFF3B0"/><stop offset="35%" stop-color="#E5C158"/><stop offset="70%" stop-color="#B8860B"/><stop offset="100%" stop-color="#F7E08B"/>'
        + '</linearGradient>'
        + '<linearGradient id="sfPrismEmerald" x1="0%" y1="0%" x2="100%" y2="100%">'
        + '<stop offset="0%" stop-color="#34D399"/><stop offset="55%" stop-color="#10B981"/><stop offset="100%" stop-color="#047857"/>'
        + '</linearGradient>'
        + '<linearGradient id="sfGlassSheen" x1="0%" y1="0%" x2="100%" y2="100%">'
        + '<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.32"/><stop offset="48%" stop-color="#FFFFFF" stop-opacity="0.06"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>'
        + '</linearGradient>'
        + '<pattern id="sfMicroGrid" width="32" height="32" patternUnits="userSpaceOnUse">'
        + '<path d="M 32 0 L 0 0 0 32" fill="none" stroke="#E5C158" stroke-width="0.6" stroke-opacity="0.12"/>'
        + '</pattern>'
        + '</defs>'
        + '<rect x="0" y="0" width="512" height="512" rx="116" fill="url(#sfBgGrad)"/>'
        + '<rect x="0" y="0" width="512" height="512" rx="116" fill="url(#sfMicroGrid)"/>'
        + '<rect x="22" y="22" width="468" height="468" rx="98" fill="none" stroke="url(#sfGoldRim)" stroke-width="3" opacity="0.78"/>'
        + '<rect x="34" y="34" width="444" height="444" rx="88" fill="none" stroke="#10B981" stroke-width="1.2" opacity="0.38"/>'
        + '<circle cx="256" cy="256" r="154" fill="none" stroke="url(#sfGoldRim)" stroke-width="2" stroke-dasharray="10 8" opacity="0.55"/>'
        + '<circle cx="256" cy="256" r="126" fill="rgba(16,185,129,0.08)" stroke="#34D399" stroke-width="1.5" opacity="0.45"/>'
        + '<polygon points="256,112 380,184 380,328 256,400 132,328 132,184" fill="none" stroke="url(#sfGoldRim)" stroke-width="6" stroke-linejoin="round"/>'
        + '<polygon points="256,112 380,184 256,256" fill="url(#sfGoldRim)" opacity="0.88"/>'
        + '<polygon points="380,184 380,328 256,256" fill="url(#sfPrismEmerald)" opacity="0.82"/>'
        + '<polygon points="380,328 256,400 256,256" fill="#064E3B" opacity="0.92"/>'
        + '<polygon points="256,400 132,328 256,256" fill="url(#sfGoldRim)" opacity="0.58"/>'
        + '<polygon points="132,328 132,184 256,256" fill="url(#sfPrismEmerald)" opacity="0.52"/>'
        + '<polygon points="132,184 256,112 256,256" fill="#047857" opacity="0.78"/>'
        + '<circle cx="256" cy="256" r="58" fill="#030D0A" stroke="url(#sfGoldRim)" stroke-width="3.5"/>'
        + '<path d="M256 206 C259 238, 274 253, 306 256 C274 259, 259 274, 256 306 C253 274, 238 259, 206 256 C238 253, 253 238, 256 206 Z" fill="url(#sfGoldRim)"/>'
        + '<circle cx="256" cy="256" r="9" fill="#FFFFFF"/>'
        + '<path d="M0 116 C0 52, 52 0, 116 0 L396 0 C432 0, 464 16, 485 42 C360 120, 180 185, 0 230 Z" fill="url(#sfGlassSheen)"/>'
        + '</svg>';
}

function mountAppIcons() {
    var svgMarkup = getLuxuryAppIconSVG(512);
    ['splashIconMount', 'headerMiniIcon', 'iconStudioHeroMount', 'mockupDockIcon'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = svgMarkup;
    });
}

/* =========================================================================
   2. CAPACITOR BRIDGE HELPERS (all guarded — plain browser still works)
   ========================================================================= */
function capPlugins() {
    try {
        return (window.Capacitor && window.Capacitor.Plugins) || null;
    } catch (e) {
        return null;
    }
}

function initNativeChrome() {
    var plugins = capPlugins();
    if (!plugins) return;
    try {
        if (plugins.StatusBar) {
            var p1 = plugins.StatusBar.setBackgroundColor({ color: '#030D0A' });
            if (p1 && p1.catch) p1.catch(function () {});
            var p2 = plugins.StatusBar.setStyle({ style: 'DARK' });
            if (p2 && p2.catch) p2.catch(function () {});
        }
        if (plugins.SplashScreen) {
            var p3 = plugins.SplashScreen.hide();
            if (p3 && p3.catch) p3.catch(function () {});
        }
    } catch (e) { /* native chrome unavailable — web fallback */ }
}

function blobToBase64(blob) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onloadend = function () {
            var dataUrl = String(reader.result || '');
            resolve(dataUrl.indexOf(',') >= 0 ? dataUrl.split(',')[1] : dataUrl);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/* Save a file natively (Filesystem -> Share sheet) when running under
   Capacitor; returns true when handled, false to use browser download. */
async function saveFileNative(blob, filename) {
    var plugins = capPlugins();
    if (!plugins || !plugins.Filesystem || !plugins.Share) return false;
    try {
        var base64 = await blobToBase64(blob);
        var res = await plugins.Filesystem.writeFile({
            path: filename,
            data: base64,
            directory: 'CACHE'
        });
        await plugins.Share.share({
            title: filename,
            url: res.uri,
            dialogTitle: 'Simpan / Bagikan ' + filename
        });
        return true;
    } catch (e) {
        return false;
    }
}

function downloadBlobFallback(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
}

async function saveOrDownload(blob, filename, toastMsg) {
    var handled = await saveFileNative(blob, filename);
    if (!handled) downloadBlobFallback(blob, filename);
    showToast(toastMsg || ('File tersimpan: ' + filename));
}

/* =========================================================================
   3. APP STATE (history key matches the web tool for consistency)
   ========================================================================= */
var STORAGE_KEY = 'stockforge_ai_global_en_v2';
var HISTORY_MAX = 40;
var THEME_KEY = 'stockforge_theme';
var DEFAULT_THEME = 'Ramadan keluarga indonesia : sahur keluarga hangat di ruang makan cerah dengan kurma dan teh';

var STATE = {
    platform: 'Adobe Stock',
    category: 'Foto',
    format: 'Copy Space',
    style: 'High-Key Bright Airy',
    videoRatio: '16:9 Horizontal',
    videoCamera: 'Zoom in',
    videoLoop: 'Looping Mulus',
    theme: DEFAULT_THEME,
    currentResult: null,
    history: [],
    isGenerating: false
};

function escHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escAttr(s) {
    return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/* =========================================================================
   4. TOAST
   ========================================================================= */
var toastTimer = null;
function showToast(msg) {
    var box = document.getElementById('atelierToast');
    var label = document.getElementById('atelierToastMsg');
    if (!box || !label) return;
    label.textContent = msg;
    box.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        box.classList.remove('show');
    }, 2400);
}

/* =========================================================================
   5. SPLASH SCREEN BOOT SEQUENCE & THEME SWITCHER
   ========================================================================= */
function runSplashSequence() {
    var overlay = document.getElementById('splashOverlay');
    var bar = document.getElementById('splashProgressBar');
    var pct = document.getElementById('splashPercentLabel');
    var lbl = document.getElementById('splashAgentLabel');
    if (!overlay || !bar || !pct || !lbl) return;

    overlay.classList.remove('splash-hidden');
    bar.style.width = '0%';
    pct.textContent = '0%';

    var stages = [
        { p: 20, text: 'Agent 01: Platform Rules (8 Sites)...' },
        { p: 42, text: 'Agent 02: 4-Asset Spec Validator...' },
        { p: 65, text: 'Agent 03: Global EN Lexicon (450+)...' },
        { p: 84, text: 'Agent 04 & 05: Master Prompt & BG...' },
        { p: 100, text: 'Agent 06: Overpowered SEO Ready ✓' }
    ];

    var idx = 0;
    var interval = setInterval(function () {
        if (idx < stages.length) {
            bar.style.width = stages[idx].p + '%';
            pct.textContent = stages[idx].p + '%';
            lbl.textContent = stages[idx].text;
            idx++;
        } else {
            clearInterval(interval);
            setTimeout(function () {
                overlay.classList.add('splash-hidden');
            }, 340);
        }
    }, 300);
}

function replaySplashAnimation() {
    if (window.StockForgeSound) window.StockForgeSound.playLuxuryChime();
    runSplashSequence();
}

function applyTheme(name) {
    document.documentElement.setAttribute('data-theme', name);
    var label = document.getElementById('themeBadgeLabel');
    if (label) label.textContent = name === 'obsidian' ? 'Obsidian' : 'Pearl';
    try { localStorage.setItem(THEME_KEY, name); } catch (e) {}
}

function toggleLuxuryTheme() {
    var root = document.documentElement;
    var current = root.getAttribute('data-theme') || 'obsidian';
    var next = current === 'obsidian' ? 'pearl' : 'obsidian';
    applyTheme(next);
    showToast(next === 'obsidian' ? 'Theme: Emerald Obsidian Luxury' : 'Theme: Champagne Pearl Luxury');
}

function toggleAudioSound() {
    if (window.StockForgeSound) window.StockForgeSound.toggleAudioSound();
}

/* =========================================================================
   6. CLIPBOARD (Capacitor Clipboard -> navigator.clipboard -> execCommand)
   ========================================================================= */
async function copyText(txt, label) {
    var text = String(txt == null ? '' : txt);
    var done = false;
    var plugins = capPlugins();
    if (plugins && plugins.Clipboard && typeof plugins.Clipboard.write === 'function') {
        try {
            await plugins.Clipboard.write({ string: text });
            done = true;
        } catch (e) { /* fall through */ }
    }
    if (!done) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                done = true;
            }
        } catch (e) { /* fall through */ }
    }
    if (!done) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
    }
    showToast((label || 'Teks') + ' disalin!');
}

function copyFromElement(elId, label) {
    var el = document.getElementById(elId);
    copyText(el ? el.textContent : '', label || 'Teks');
}

function copyKeywords(limit) {
    if (!STATE.currentResult) return;
    var list = STATE.currentResult.metadata.keywords.slice(0, limit);
    copyText(list.join(', '), limit <= 15 ? 'Top 15 Keyword Krusial (EN)' : 'Semua ' + list.length + ' Keyword (EN)');
}

function copyFullMetadataBundle() {
    if (!STATE.currentResult) return;
    var r = STATE.currentResult;
    var m = r.metadata;
    var bundle = 'PLATFORM: ' + r.platform
        + '\nCATEGORY: ' + m.primaryCategory
        + '\nTITLE (EN): ' + m.title
        + '\nDESCRIPTION (EN): ' + (m.description || '-')
        + '\nKEYWORDS (' + m.keywords.length + ' EN): ' + m.keywords.join(', ')
        + '\nBACKGROUND: ' + r.bgAdvice.spec
        + '\nMASTER PROMPT:\n' + r.masterPrompt;
    copyText(bundle, 'Paket Metadata Global EN');
}

/* =========================================================================
   7. MENU RENDERERS (Platform / Kategori / Format / Gaya Visual)
   ========================================================================= */
function renderPlatformMenu() {
    var names = Object.keys(PLATFORMS_CONFIG);
    document.getElementById('platformGrid').innerHTML = names.map(function (p) {
        var cfg = PLATFORMS_CONFIG[p];
        var active = STATE.platform === p;
        return '<button type="button" onclick="selectPlatform(\'' + escAttr(p) + '\')"'
            + ' class="lux-btn pill-chip ' + (active ? 'active' : '') + ' p-2p5 rounded-2xl text-left">'
            + '<div class="text-11 font-extrabold truncate">' + escHtml(p) + '</div>'
            + '<div class="text-9 font-mono-tech mt-0p5" style="opacity: 0.8;">' + escHtml(cfg.badge) + '</div>'
            + '</button>';
    }).join('');

    var activeCfg = PLATFORMS_CONFIG[STATE.platform];
    document.getElementById('activePlatformPill').textContent = STATE.platform;
    document.getElementById('platformRuleCard').innerHTML =
        '<div class="flex items-center justify-between font-bold mb-1">'
        + '<span style="color: var(--accent-gold);">Status Desc: ' + escHtml(activeCfg.descStatus) + '</span>'
        + '<span class="font-mono-tech" style="color: var(--accent-emerald);">Max ' + activeCfg.maxKeywords + ' KW</span>'
        + '</div>'
        + '<p class="leading-relaxed" style="color: var(--text-secondary);">' + escHtml(activeCfg.specialRule) + '</p>';

    // Hard AI warning — visible only when Shutterstock is selected
    document.getElementById('shutterstockAiWarning').classList.toggle('hidden', STATE.platform !== 'Shutterstock');
}

function selectPlatform(p) {
    STATE.platform = p;
    renderPlatformMenu();
    if (STATE.currentResult) buildProductionData(false);
}

function renderCategoryMenu() {
    var cats = [
        { name: 'Foto', icon: '📷' },
        { name: 'Ilustrasi', icon: '🎨' },
        { name: 'Video', icon: '🎬' },
        { name: 'Vector', icon: '✒️' }
    ];
    document.getElementById('categoryGrid').innerHTML = cats.map(function (c) {
        return '<button type="button" onclick="selectCategory(\'' + c.name + '\')"'
            + ' class="lux-btn pill-chip ' + (STATE.category === c.name ? 'active' : '') + ' py-2p5 px-1p5 rounded-2xl flex flex-col items-center gap-1">'
            + '<span class="text-14">' + c.icon + '</span>'
            + '<span class="text-10 font-extrabold">' + c.name + '</span>'
            + '</button>';
    }).join('');
}

function selectCategory(cat) {
    STATE.category = cat;
    STATE.format = ASSET_TAXONOMY[cat].formats[0];
    STATE.style = ASSET_TAXONOMY[cat].styles[0];
    var input = document.getElementById('styleSearchInput');
    if (input) input.value = '';
    renderAllMenus();
}

function renderFormatMenu() {
    var tax = ASSET_TAXONOMY[STATE.category];
    document.getElementById('formatCatTag').textContent = '(' + STATE.category + ')';
    document.getElementById('formatCountBadge').textContent = tax.formats.length + ' Format';

    document.getElementById('formatGrid').innerHTML = tax.formats.map(function (f) {
        return '<button type="button" onclick="selectFormat(\'' + escAttr(f) + '\')"'
            + ' class="lux-btn pill-chip ' + (STATE.format === f ? 'active' : '') + ' py-2 px-2p5 rounded-xl text-11 font-bold text-center leading-tight">'
            + escHtml(f) + '</button>';
    }).join('');

    var vPanel = document.getElementById('videoSubPanel');
    if (STATE.category === 'Video') {
        vPanel.classList.remove('hidden');
        document.getElementById('videoRatioGrid').innerHTML = tax.ratios.map(function (r) {
            return '<button type="button" onclick="selectVideoMeta(\'ratio\', \'' + escAttr(r) + '\')"'
                + ' class="lux-btn pill-chip ' + (STATE.videoRatio === r ? 'active' : '') + ' py-1p5 px-2 rounded-xl text-10 font-bold">' + escHtml(r) + '</button>';
        }).join('');
        document.getElementById('videoCameraGrid').innerHTML = tax.cameras.map(function (c) {
            return '<button type="button" onclick="selectVideoMeta(\'camera\', \'' + escAttr(c) + '\')"'
                + ' class="lux-btn pill-chip ' + (STATE.videoCamera === c ? 'active' : '') + ' py-1p5 px-1p5 rounded-xl text-10 font-bold">' + escHtml(c) + '</button>';
        }).join('');
        document.getElementById('videoLoopGrid').innerHTML = tax.loops.map(function (l) {
            return '<button type="button" onclick="selectVideoMeta(\'loops\', \'' + escAttr(l) + '\')"'
                + ' class="lux-btn pill-chip ' + (STATE.videoLoop === l ? 'active' : '') + ' py-1p5 px-2 rounded-xl text-10 font-bold">' + escHtml(l) + '</button>';
        }).join('');
    } else {
        vPanel.classList.add('hidden');
    }
}

function selectFormat(f) {
    STATE.format = f;
    renderFormatMenu();
}

function selectVideoMeta(key, val) {
    if (key === 'ratio') STATE.videoRatio = val;
    else if (key === 'camera') STATE.videoCamera = val;
    else if (key === 'loops') STATE.videoLoop = val;
    renderFormatMenu();
}

function renderStyleMenu() {
    var tax = ASSET_TAXONOMY[STATE.category];
    var input = document.getElementById('styleSearchInput');
    var q = (input ? input.value : '').toLowerCase().trim();
    document.getElementById('styleCatTag').textContent = '(' + tax.styles.length + ' Gaya)';
    var list = q ? tax.styles.filter(function (s) { return s.toLowerCase().indexOf(q) !== -1; }) : tax.styles;

    document.getElementById('styleGrid').innerHTML = list.map(function (s) {
        return '<button type="button" onclick="selectVisualStyle(\'' + escAttr(s) + '\')"'
            + ' class="lux-btn pill-chip ' + (STATE.style === s ? 'active' : '') + ' py-2 px-2 rounded-xl text-10 font-bold text-center leading-tight">'
            + escHtml(s) + '</button>';
    }).join('');
}

function selectVisualStyle(s) {
    STATE.style = s;
    renderStyleMenu();
}

function renderAllMenus() {
    renderPlatformMenu();
    renderCategoryMenu();
    renderFormatMenu();
    renderStyleMenu();
}

function applyQuickPreset(theme, cat, fmt, sty) {
    var ta = document.getElementById('themeTextarea');
    if (ta) ta.value = theme;
    STATE.theme = theme;
    STATE.category = cat;
    STATE.format = fmt;
    STATE.style = sty;
    renderAllMenus();
    updateLivePreview();
    triggerMasterGeneration();
}

/* =========================================================================
   8. LIVE TRANSCREATION PREVIEW + 6-AGENT GENERATION PIPELINE
   ========================================================================= */
function updateLivePreview() {
    var ta = document.getElementById('themeTextarea');
    var el = document.getElementById('liveEnglishSubject');
    if (!ta || !el) return;
    try {
        var parsed = window.StockForgeAgents.transcreateToGlobalEnglish(ta.value.trim());
        el.textContent = '"' + parsed.englishSubject + '" (' + parsed.peopleCountPhrase + ')';
    } catch (e) {
        el.textContent = '';
    }
}

function renderAgentsMiniGrid(activeIdx) {
    var grid = document.getElementById('agentsMiniGrid');
    if (!grid) return;
    var agents = window.StockForgeAgents.SIX_AGENTS_INFO;
    grid.innerHTML = agents.map(function (ag, i) {
        var running = i === activeIdx;
        var done = activeIdx === -1 || i < activeIdx;
        var code = ag.id.replace('Agent ', 'AG-');
        return '<div class="p-2 rounded-xl" style="background: ' + (running ? 'rgba(229,193,88,0.22)' : 'var(--glass-pill)') + '; border: 1px solid ' + (running ? 'var(--accent-gold)' : 'var(--border-subtle)') + ';">'
            + '<div class="flex items-center justify-between text-9 font-mono-tech font-bold">'
            + '<span style="color: var(--accent-gold);">' + code + '</span>'
            + '<span style="color: var(--accent-emerald);">' + (running ? 'RUN' : done ? '100%' : 'WAIT') + '</span>'
            + '</div>'
            + '<div class="text-10 font-bold truncate mt-0p5">' + escHtml(ag.name) + '</div>'
            + '</div>';
    }).join('');
}

function buildProductionData(saveHistory) {
    var ta = document.getElementById('themeTextarea');
    var rawTheme = ta ? ta.value.trim() : '';
    STATE.theme = rawTheme || STATE.theme;

    var result = window.StockForgeAgents.compileProductionPackagePure({
        platform: STATE.platform,
        category: STATE.category,
        format: STATE.format,
        style: STATE.style,
        videoRatio: STATE.videoRatio,
        videoCamera: STATE.videoCamera,
        videoLoop: STATE.videoLoop,
        themeInput: STATE.theme
    });

    var parsed = result.parsed;
    var preview = document.getElementById('liveEnglishSubject');
    if (preview) preview.textContent = '"' + parsed.englishSubject + '" (' + parsed.peopleCountPhrase + ')';

    STATE.currentResult = result;
    if (saveHistory) {
        STATE.history.unshift(result);
        if (STATE.history.length > HISTORY_MAX) STATE.history = STATE.history.slice(0, HISTORY_MAX);
        saveHistoryToStorage();
    }

    renderOutputUI(result);
    renderSaranTab(result);
    renderHistoryTab();
}

async function triggerMasterGeneration() {
    if (STATE.isGenerating) return;
    STATE.isGenerating = true;

    if (window.StockForgeAurora) window.StockForgeAurora.burst();
    if (window.StockForgeSound) {
        window.StockForgeSound.playLuxuryChime();
        window.StockForgeSound.hapticImpact('Medium');
    }

    var label = document.getElementById('btnGenerateLabel');
    var status = document.getElementById('agentsPipelineStatus');
    label.textContent = '6 AGENTS WORKING...';

    var agents = window.StockForgeAgents.SIX_AGENTS_INFO;
    for (var i = 0; i < agents.length; i++) {
        status.textContent = agents[i].id + ': ' + agents[i].name + '...';
        renderAgentsMiniGrid(i);
        await new Promise(function (r) { setTimeout(r, 70); });
    }

    renderAgentsMiniGrid(-1);
    status.textContent = '100% Global English Ready ✓';
    label.textContent = 'GENERATE PROMPT MASTER';

    buildProductionData(true);
    STATE.isGenerating = false;
    showToast('Master Prompt & ' + STATE.currentResult.metadata.keywords.length + ' Keyword EN siap!');
}

/* =========================================================================
   9. OUTPUT RENDER (Master Prompt / Background / Metadata / Keywords)
   ========================================================================= */
function renderOutputUI(r) {
    var meta = r.metadata;

    document.getElementById('outMasterPrompt').textContent = r.masterPrompt;
    document.getElementById('outNegativePrompt').textContent = r.negativePrompt;
    document.getElementById('outBgVerdict').textContent = r.bgAdvice.verdict;
    document.getElementById('outBgSpec').textContent = r.bgAdvice.spec;
    document.getElementById('outBgReason').textContent = r.bgAdvice.reason;

    document.getElementById('outMetaTitle').textContent = meta.title;
    document.getElementById('outTitleCount').textContent = meta.title.length + '/' + meta.titleMax;

    var descEl = document.getElementById('outMetaDesc');
    var descBadge = document.getElementById('outDescBadge');
    var copyDescBtn = document.getElementById('btnCopyDesc');
    descBadge.textContent = meta.descStatus;
    if (!meta.description) {
        // Adobe & Vecteezy have no Description field — say so, don't fake one
        descEl.textContent = r.platform === 'Adobe Stock'
            ? '— Adobe Stock tidak memakai field Description; Title adalah metadata utama.'
            : '— Vecteezy tidak memakai field Description.';
        copyDescBtn.classList.add('opacity-40');
        copyDescBtn.style.pointerEvents = 'none';
    } else {
        descEl.textContent = meta.description;
        copyDescBtn.classList.remove('opacity-40');
        copyDescBtn.style.pointerEvents = '';
    }

    document.getElementById('outPrimaryCat').textContent = meta.primaryCategory;
    document.getElementById('outSecondaryCat').textContent = meta.secondaryCategory;

    document.getElementById('outKwCount').textContent = meta.keywords.length;
    document.getElementById('outKwMax').textContent = meta.maxKeywords;
    document.getElementById('outKwTailNum').textContent = meta.keywords.length;

    var top15 = meta.keywords.slice(0, 15);
    var rest = meta.keywords.slice(15);

    document.getElementById('outTop15Keywords').innerHTML = top15.map(function (kw, i) {
        return '<button type="button" onclick="copyText(\'' + escAttr(kw) + '\', \'Top Keyword #' + (i + 1) + '\')"'
            + ' class="lux-btn kw-chip kw-chip-top">'
            + '<span class="font-mono-tech text-9" style="color: var(--accent-gold);">#' + (i + 1) + '</span> ' + escHtml(kw)
            + '</button>';
    }).join('');

    document.getElementById('outRestKeywords').innerHTML = rest.map(function (kw, i) {
        return '<button type="button" onclick="copyText(\'' + escAttr(kw) + '\', \'Keyword #' + (i + 16) + '\')"'
            + ' class="lux-btn kw-chip">'
            + '<span class="font-mono-tech text-9" style="opacity: 0.6;">#' + (i + 16) + '</span> ' + escHtml(kw)
            + '</button>';
    }).join('');
}

/* =========================================================================
   10. SARAN ASSET AI TAB
   ========================================================================= */
function renderSaranTab(r) {
    document.getElementById('saranThemeSubtitle').textContent = '"' + r.themeInput + '"';
    document.getElementById('saranCardsList').innerHTML = r.recommendations.map(function (rec, idx) {
        return '<div class="atelier-card p-4 space-y-2p5">'
            + '<div class="flex items-center justify-between">'
            + '<span class="px-2p5 py-0p5 rounded-lg text-10 font-extrabold uppercase" style="background: var(--active-pill-bg); color: #FFF;">' + escHtml(rec.category) + '</span>'
            + '<span class="text-11 font-mono-tech font-bold" style="color: var(--accent-gold);">' + escHtml(rec.demandScore) + '</span>'
            + '</div>'
            + '<div class="text-12 font-extrabold">' + escHtml(rec.format) + ' • <span style="color: var(--accent-emerald);">' + escHtml(rec.style) + '</span></div>'
            + '<p class="text-11 leading-relaxed" style="color: var(--text-secondary);">' + escHtml(rec.reason) + '</p>'
            + '<button type="button" onclick="applySaranStyle(' + idx + ')"'
            + ' class="lux-btn pill-chip active w-full py-2p5 rounded-xl text-11 font-extrabold">Terapkan Gaya Ini</button>'
            + '</div>';
    }).join('');
}

function applySaranStyle(idx) {
    var rec = STATE.currentResult && STATE.currentResult.recommendations[idx];
    if (!rec) return;
    STATE.category = rec.category;
    STATE.format = rec.format;
    STATE.style = rec.style;
    renderAllMenus();
    switchBottomTab(0, 'studio');
    triggerMasterGeneration();
}

/* =========================================================================
   11. RIWAYAT PRODUKSI (localStorage, max 40, 2-step clear)
   ========================================================================= */
function saveHistoryToStorage() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE.history)); } catch (e) {}
}

function loadHistoryFromStorage() {
    try {
        var saved = localStorage.getItem(STORAGE_KEY);
        STATE.history = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(STATE.history)) STATE.history = [];
    } catch (e) {
        STATE.history = [];
    }
}

function renderHistoryTab() {
    document.getElementById('historyTotalLabel').textContent = STATE.history.length;
    var list = document.getElementById('historyCardsList');
    if (STATE.history.length === 0) {
        list.innerHTML = '<div class="atelier-card p-6 text-center text-12" style="color: var(--text-muted);">Belum ada riwayat produksi tersimpan.</div>';
        return;
    }
    list.innerHTML = STATE.history.map(function (item, idx) {
        return '<div class="atelier-card p-3p5 space-y-2">'
            + '<div class="flex items-center justify-between text-10">'
            + '<span class="px-2 py-0p5 rounded font-extrabold" style="background: var(--active-pill-bg); color: #FFF;">' + escHtml(item.category) + ' • ' + escHtml(item.platform) + '</span>'
            + '<span class="font-mono-tech" style="color: var(--text-muted);">' + escHtml(item.timestamp || '') + '</span>'
            + '</div>'
            + '<div class="text-11 font-bold" style="color: var(--accent-gold);">' + escHtml(item.format) + ' • ' + escHtml(item.style) + '</div>'
            + '<p class="text-12 font-semibold line-clamp-2">"' + escHtml(item.themeInput) + '"</p>'
            + '<div class="flex gap-2 pt-1">'
            + '<button type="button" onclick="reloadHistoryItem(' + idx + ')" class="lux-btn pill-chip active flex-1 py-2 rounded-xl text-10 font-extrabold">Muat ke Studio</button>'
            + '<button type="button" onclick="deleteHistoryItem(' + idx + ')" class="lux-btn pill-chip px-3 py-2 rounded-xl text-10 font-bold">Hapus</button>'
            + '</div>'
            + '</div>';
    }).join('');
}

function reloadHistoryItem(idx) {
    var item = STATE.history[idx];
    if (!item) return;
    STATE.platform = item.platform;
    STATE.category = item.category;
    STATE.format = item.format;
    STATE.style = item.style;
    STATE.videoRatio = (item.videoMeta && item.videoMeta.ratio) || '16:9 Horizontal';
    STATE.videoCamera = (item.videoMeta && item.videoMeta.camera) || 'Zoom in';
    STATE.videoLoop = (item.videoMeta && item.videoMeta.loops) || 'Looping Mulus';
    STATE.theme = item.themeInput;
    document.getElementById('themeTextarea').value = item.themeInput;
    renderAllMenus();
    renderOutputUI(item);
    STATE.currentResult = item;
    switchBottomTab(0, 'studio');
    showToast('Riwayat dimuat ke Studio!');
}

function deleteHistoryItem(idx) {
    STATE.history.splice(idx, 1);
    saveHistoryToStorage();
    renderHistoryTab();
    showToast('Item dihapus.');
}

function promptClearHistory() {
    if (STATE.history.length === 0) return showToast('Riwayat sudah kosong.');
    document.getElementById('btnRequestClearHistory').classList.add('hidden');
    var row = document.getElementById('confirmClearHistoryRow');
    row.classList.remove('hidden');
    row.classList.add('flex');
}

function abortClearHistory() {
    document.getElementById('btnRequestClearHistory').classList.remove('hidden');
    var row = document.getElementById('confirmClearHistoryRow');
    row.classList.add('hidden');
    row.classList.remove('flex');
}

function executeClearAllHistory() {
    STATE.history = [];
    try { localStorage.setItem(STORAGE_KEY, '[]'); } catch (e) {}
    abortClearHistory();
    renderHistoryTab();
    showToast('Semua riwayat berhasil dihapus.');
}

/* =========================================================================
   12. CSV EXPORT (Capacitor Filesystem + Share, fallback browser download)
   ========================================================================= */
async function exportCurrentCSV() {
    if (!STATE.currentResult) return;
    var r = STATE.currentResult;
    var m = r.metadata;
    var esc = function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; };
    var csv = 'Platform,Category,Title_EN,Description_EN,Keywords_EN\n'
        + [r.platform, m.primaryCategory, m.title, m.description || '', m.keywords.join(', ')].map(esc).join(',');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var filename = 'StockForge_' + r.platform.replace(/\W+/g, '_') + '_' + Date.now() + '.csv';
    await saveOrDownload(blob, filename, 'CSV Global English berhasil disimpan!');
}

/* =========================================================================
   13. APP ICON EXPORT (PNG 1024x1024 via canvas, SVG master)
   ========================================================================= */
async function downloadAppIconPNG() {
    if (window.StockForgeSound) window.StockForgeSound.playLuxuryChime();
    var svgStr = getLuxuryAppIconSVG(1024);
    var blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var img = new Image();
    img.onload = async function () {
        var canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 1024, 1024);
        URL.revokeObjectURL(url);
        canvas.toBlob(async function (pngBlob) {
            if (!pngBlob) return showToast('Gagal membuat PNG.');
            await saveOrDownload(pngBlob, 'stockforge-ai-icon-1024.png', 'PNG 1024×1024 tersimpan!');
        }, 'image/png');
    };
    img.onerror = function () {
        URL.revokeObjectURL(url);
        showToast('Gagal memuat SVG ikon.');
    };
    img.src = url;
}

async function downloadAppIconSVG() {
    if (window.StockForgeSound) window.StockForgeSound.playTactileClick();
    var svgStr = getLuxuryAppIconSVG(1024);
    var blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    await saveOrDownload(blob, 'stockforge-ai-icon.svg', 'SVG ikon tersimpan!');
}

/* =========================================================================
   14. BOTTOM TAB NAVIGATION
   ========================================================================= */
function switchBottomTab(index, tabName) {
    var indicator = document.getElementById('dockActiveIndicator');
    if (indicator) indicator.style.transform = 'translateX(' + (index * 100) + '%)';
    [0, 1, 2, 3].forEach(function (i) {
        var btn = document.getElementById('dock-btn-' + i);
        if (btn) btn.classList.toggle('active', i === index);
    });
    ['studio', 'saran', 'riwayat', 'icon'].forEach(function (name) {
        var view = document.getElementById('tab-view-' + name);
        if (view) view.classList.toggle('hidden', name !== tabName);
    });
    var scroller = document.getElementById('mainScrollContainer');
    if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =========================================================================
   15. INITIALIZATION
   ========================================================================= */
document.addEventListener('DOMContentLoaded', function () {
    loadHistoryFromStorage();

    try {
        var savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === 'pearl' || savedTheme === 'obsidian') applyTheme(savedTheme);
    } catch (e) {}

    mountAppIcons();
    if (window.StockForgeAurora) window.StockForgeAurora.init();
    if (window.StockForgeSound) window.StockForgeSound.syncSoundIcons();
    initNativeChrome();

    var ta = document.getElementById('themeTextarea');
    if (ta) {
        ta.value = STATE.theme;
        ta.addEventListener('input', updateLivePreview);
    }

    renderAllMenus();
    renderAgentsMiniGrid(-1);
    buildProductionData(STATE.history.length === 0);
    updateLivePreview();
    runSplashSequence();
});

/* Globals required by the inline onclick handlers in index.html */
window.replaySplashAnimation = replaySplashAnimation;
window.toggleAudioSound = toggleAudioSound;
window.toggleLuxuryTheme = toggleLuxuryTheme;
window.applyQuickPreset = applyQuickPreset;
window.triggerMasterGeneration = triggerMasterGeneration;
window.copyFromElement = copyFromElement;
window.copyText = copyText;
window.copyKeywords = copyKeywords;
window.copyFullMetadataBundle = copyFullMetadataBundle;
window.exportCurrentCSV = exportCurrentCSV;
window.promptClearHistory = promptClearHistory;
window.executeClearAllHistory = executeClearAllHistory;
window.abortClearHistory = abortClearHistory;
window.downloadAppIconPNG = downloadAppIconPNG;
window.downloadAppIconSVG = downloadAppIconSVG;
window.switchBottomTab = switchBottomTab;
window.renderStyleMenu = renderStyleMenu;
window.selectPlatform = selectPlatform;
window.selectCategory = selectCategory;
window.selectFormat = selectFormat;
window.selectVideoMeta = selectVideoMeta;
window.selectVisualStyle = selectVisualStyle;
window.applySaranStyle = applySaranStyle;
window.reloadHistoryItem = reloadHistoryItem;
window.deleteHistoryItem = deleteHistoryItem;

window.StockForgeApp = {
    showToast: showToast,
    state: STATE,
    buildProductionData: buildProductionData,
    triggerMasterGeneration: triggerMasterGeneration,
    getLuxuryAppIconSVG: getLuxuryAppIconSVG
};
