'use strict';
/* =========================================================================
   StockForge AI — Agent 01 & 02 Data (Platform Rules + 4-Asset Taxonomy)
   Ported verbatim from the tested web engine (56/56 PASS) with the
   CORRECTED platform rules:
   - Adobe Stock: title max 200 (ideal 70-150), NO comma in title,
     49 keywords, NO Description field (Title is the metadata).
   - Vecteezy: title MUST be 3-8 words AND <70 chars, NO Description,
     50 keywords (some sources say 30 - check upload page), keywords
     CANNOT change after submit.
   - Dreamstime: title max 115, description max 200, 80 keywords.
   - Shutterstock: Title = Description (one field, max 200 chars),
     50 keywords. WARNING: Shutterstock does NOT accept AI content
     from contributors (official rule, 16 Jul 2025).
   - Freepik: title max 100, 50 keywords. iStock: 50 keywords +
     automatic subject count ("no people" / "one person" /
     "group of people"). Pond5: 50 keywords. Depositphotos/123RF: 50.
   100% offline. No network, no API key.
   ========================================================================= */

const PLATFORMS_CONFIG = {
    'Adobe Stock': {
        id: 'Adobe Stock',
        badge: '49 Keyword • Tanpa Koma',
        titleIdeal: 150,
        titleMax: 200,
        forbidCommaInTitle: true,
        descStatus: 'TIDAK DIGUNAKAN (Adobe hanya pakai Title)',
        descRequired: false,
        descRecommended: false,
        descMax: 0,
        maxKeywords: 49,
        specialRule: 'DILARANG menggunakan tanda koma (,) di dalam Title Adobe Stock. Title optimal 70–150 karakter (batas keras 200 char) dan urutan 10–15 keyword pertama sangat menentukan peringkat. Centang "Created using generative AI" saat upload konten AI.',
        categories: [
            '1. Animals', '2. Buildings and Architecture', '3. Business', '4. Drinks',
            '5. The Environment', '6. States of Mind', '7. Food', '8. Graphic Resources',
            '9. Hobbies and Leisure', '10. Industry', '11. Landscapes', '12. Lifestyle',
            '13. People', '14. Plants and Flowers', '15. Culture and Religion', '16. Science',
            '17. Social Issues', '18. Sports', '19. Technology', '20. Transport', '21. Travel'
        ]
    },
    'Shutterstock': {
        id: 'Shutterstock',
        badge: '50 Keyword • Desc Wajib',
        titleIdeal: 120,
        titleMax: 200,
        forbidCommaInTitle: false,
        descStatus: 'WAJIB (Unified Title & Description)',
        descRequired: true,
        descRecommended: false,
        descMax: 200,
        maxKeywords: 50,
        specialRule: 'Pada Shutterstock, Title dan Description digabung menjadi satu kolom Description wajib (maksimal 200 karakter) dengan 2 kategori dan maksimal 50 keyword. PERINGATAN: Shutterstock TIDAK menerima konten AI dari kontributor (aturan resmi 16 Jul 2025) — jangan upload aset AI ke sini, hanya file digambar manual.',
        categories: [
            'Abstract', 'Animals/Wildlife', 'Arts', 'Backgrounds/Textures', 'Beauty/Fashion',
            'Buildings/Landmarks', 'Business/Finance', 'Celebrities', 'Education', 'Food and Drink',
            'Healthcare/Medical', 'Holidays', 'Industrial', 'Interiors', 'Miscellaneous',
            'Nature', 'Objects', 'Parks/Outdoor', 'People', 'Religion', 'Science',
            'Signs/Symbols', 'Sports/Recreation', 'Technology', 'Transportation', 'Vintage'
        ]
    },
    'Vecteezy': {
        id: 'Vecteezy',
        badge: '50 Keyword • Title 3–8 Kata',
        titleIdeal: 60,
        titleMax: 70,
        forbidCommaInTitle: false,
        descStatus: 'TIDAK ADA — Vecteezy tanpa Description',
        descRequired: false,
        descRecommended: false,
        descMax: 0,
        maxKeywords: 50,
        specialRule: 'Title wajib 3–8 kata dan di bawah 70 karakter, TANPA Description, dan keyword TIDAK bisa diubah setelah submit. Perhatian: beberapa sumber menyebut maks keyword 30 (bukan 50) — cek halaman upload sebelum submit.',
        categories: [
            'Abstract', 'Animals', 'Backgrounds', 'Business', 'Celebrations', 'Education',
            'Food & Drink', 'Health & Medical', 'Icons', 'Illustrations', 'Nature', 'Objects',
            'Patterns', 'People', 'Seasons', 'Sports', 'Technology', 'Templates', 'Textures', 'Travel'
        ]
    },
    'Dreamstime': {
        id: 'Dreamstime',
        badge: '80 Keyword • Desc Wajib',
        titleIdeal: 100,
        titleMax: 115,
        forbidCommaInTitle: false,
        descStatus: 'WAJIB (Max 200 Char)',
        descRequired: true,
        descRecommended: false,
        descMax: 200,
        maxKeywords: 80,
        specialRule: 'Dreamstime mewajibkan Title (maks 115 char) dan Description (maks 200 char), mendukung hingga 3 kategori serta kapasitas hingga 80 keyword (target 40).',
        categories: [
            'Abstract', 'Animals', 'Arts & Architecture', 'Business', 'Editorial', 'Education',
            'Food & Drink', 'Health', 'Holidays', 'Illustrations & Clipart', 'Industrial',
            'IT & C', 'Nature', 'Objects', 'People', 'Technology', 'Travel', 'Web Design Elements'
        ]
    },
    'Freepik': {
        id: 'Freepik',
        badge: '50 Tags • Title ≤ 100',
        titleIdeal: 75,
        titleMax: 100,
        forbidCommaInTitle: false,
        descStatus: 'OPSIONAL (Max 300 Char)',
        descRequired: false,
        descRecommended: false,
        descMax: 300,
        maxKeywords: 50,
        specialRule: 'Freepik menerapkan batas ketat maksimal 100 karakter pada Title. Gunakan frase natural Bahasa Inggris tanpa spam kata kunci dan maksimal 50 tags.',
        categories: [
            'Vectors', 'Photos', 'AI Images', 'Icons', 'PSD', 'Templates',
            'Mockups', 'Backgrounds', 'Illustrations', 'Banners', 'Stickers', 'Patterns'
        ]
    },
    'iStock / Getty Images': {
        id: 'iStock / Getty Images',
        badge: '50 Keyword • Jumlah Subjek',
        titleIdeal: 90,
        titleMax: 150,
        forbidCommaInTitle: false,
        descStatus: 'WAJIB + Jumlah Subjek (Max 2000 Char)',
        descRequired: true,
        descRecommended: false,
        descMax: 2000,
        maxKeywords: 50,
        specialRule: 'Description WAJIB mencantumkan keterangan jumlah manusia dalam Bahasa Inggris ("no people", "one person", "two people", atau "group of people") agar lolos kurasi ESP.',
        categories: [
            'Business', 'Concepts', 'Food & Drink', 'Healthcare', 'Holidays', 'Lifestyle',
            'Nature', 'Objects', 'People', 'Science', 'Sports', 'Technology',
            'Transportation', 'Travel', 'Illustrations & Clip Art'
        ]
    },
    'Pond5': {
        id: 'Pond5',
        badge: '50 Keyword • Title ≤ 120',
        titleIdeal: 75,
        titleMax: 120,
        forbidCommaInTitle: false,
        descStatus: 'DISARANKAN (Max 1000 Char)',
        descRequired: false,
        descRecommended: true,
        descMax: 1000,
        maxKeywords: 50,
        specialRule: 'Title dibatasi maksimal 120 karakter. Description sangat disarankan menjelaskan gerakan kamera (drone, static, orbit) dan status seamless loop dalam Bahasa Inggris.',
        categories: [
            'Abstract & Backgrounds', 'Aerials', 'Animals & Wildlife', 'Business & Finance',
            'City & Architecture', 'Education', 'Food & Drink', 'Green Screen & VFX',
            'Healthcare & Medical', 'Holidays & Seasonal', 'Lifestyle & Family',
            'Nature & Landscapes', 'People', 'Sports & Fitness', 'Technology & Science',
            'Time-Lapse', 'Transportation'
        ]
    },
    'Depositphotos / 123RF': {
        id: 'Depositphotos / 123RF',
        badge: '50 Keyword • Title ≤ 160',
        titleIdeal: 95,
        titleMax: 160,
        forbidCommaInTitle: false,
        descStatus: 'DISARANKAN (Max 255 Char)',
        descRequired: false,
        descRecommended: true,
        descMax: 255,
        maxKeywords: 50,
        specialRule: 'Title wajib Bahasa Inggris (maks 160 karakter), Description disarankan (maks 255 karakter), dan 15 keyword pertama memegang prioritas pencarian utama.',
        categories: [
            'Abstract', 'Animals', 'Architecture', 'Arts & Entertainment', 'Beauty & Fashion',
            'Business & Finance', 'Celebrities', 'City', 'Conceptual', 'Education',
            'Food & Drink', 'Healthcare & Medical', 'Holidays', 'Industrial', 'Interiors',
            'Nature', 'Objects', 'People', 'Professions', 'Religion', 'Science',
            'Sports', 'Technology', 'Transportation', 'Travel', 'Vintage'
        ]
    }
};

const ASSET_TAXONOMY = {
    Foto: {
        formats: [
            'Scene Penuh',
            'Subjek Isolasi (BG Polos)',
            'Copy Space',
            'Editorial / Dokumenter',
            'Flat Lay / Overhead',
            'Macro / Detail Ekstrem',
            'Portrait / Model Fokus',
            'Seamless Texture / Surface'
        ],
        styles: [
            'Cinematic',
            'Studio Putih Minimalis',
            'Flat Lay Top-Down',
            'Macro Close-up',
            'Golden Hour',
            'Blue Hour Twilight',
            'Moody Low-Key',
            'High-Key Bright Airy',
            'Aerial Drone View',
            'Long Exposure',
            'Bokeh Shallow DOF',
            'Lifestyle Candid',
            'Product Clean Mockup',
            'Food Editorial',
            'Architectural Symmetry',
            'HDR Commercial',
            'Vintage Film Grain',
            'Black & White Fine Art'
        ]
    },
    Ilustrasi: {
        formats: [
            'Ilustrasi Full Layar',
            'Isolated Background',
            'Karakter / Maskot',
            'Scene Storytelling / Editorial',
            'Seamless Pattern / Motif',
            'Spot Illustration / UI Element',
            'Konsep Abstrak / Background',
            'Infografis & Diagram'
        ],
        styles: [
            'Bebas (Tanpa Gaya Khusus)',
            '3D Glassmorphism',
            'Cyber-UI Dark Neon',
            'Isometrik Data & Cloud',
            'Modern Flat 2.0 (Soft Gradient)',
            'Hand-drawn Doodle',
            'Memphis Pattern',
            'Retro Vintage Badge',
            'Halftone Pop Art',
            'Batik Motif Nusantara',
            'Mandala Ornament',
            'Tribal Ornament Flat',
            'Floral Botanical Flat',
            'Watercolor Digital',
            'Paper Cutout 3D Layer',
            'Storybook Gouache',
            'Minimalist Line & Wash',
            '3D Clay Render'
        ]
    },
    Video: {
        formats: [
            'Looping Background Abstrak',
            'Sinematik Alam (Aerial/Drone)',
            'Timelapse',
            'Slow Motion Makro',
            'Food & Drink B-roll',
            'Teknologi Futuristik',
            'Animasi 2D Flat / Motion Graphic',
            'Musiman (Natal, Lebaran, Imlek)',
            'Budaya Nusantara',
            'Unboxing & Hands-on',
            'Tutorial Langkah-demi-Langkah',
            'Stop Motion',
            'Hyperlapse Kota',
            'Product Reveal Sinematik',
            'Alam & Satwa',
            'Olahraga & Fitness',
            'Workspace & Produktivitas'
        ],
        ratios: ['16:9 Horizontal', '9:16 Vertikal'],
        cameras: ['Diam / Static', 'Pan', 'Zoom in', 'Drone', 'Orbit'],
        loops: ['Looping Mulus', 'Klip Biasa'],
        styles: [
            '4K Commercial Clean',
            'Cinematic Teal & Orange',
            'Slow Motion 120fps',
            'Aerial 4K Drone',
            'Macro Studio Lighting',
            'Neon Cyberpunk Glow',
            'Minimalist White Studio',
            'Golden Hour Warmth',
            'Hyperlapse Dynamic',
            'Smooth 3D Abstract Loop',
            'Flat 2D Motion Graphics',
            'Moody Documentary',
            'Bright Lifestyle Natural',
            'Vertical Social Reels',
            'Product Turntable 360',
            'Time-Lapse Cloud & Sky'
        ]
    },
    Vector: {
        formats: [
            'Flat Vector',
            'Sticker Pack',
            'Icon Set',
            'Logo & Monogram',
            'Seamless Pattern',
            'Badge, Label & Emblem',
            'Banner, Flyer & Social Media Kit',
            'Infografis & Chart',
            'Template Kartu & Bingkai'
        ],
        styles: [
            'Line Art',
            'WPAP',
            'Flat Design',
            'Siluet',
            'Karikatur Vektor',
            'Anime / Kartun Vektor',
            'Flat Pattern',
            'Op Art Geometris Abstrak',
            'Minimalis Tradisional',
            'Isometrik Flat Infografis',
            'Cut Out Gaya Naif',
            'Ikon Siluet Minimalis',
            'Ikon Logo Flat',
            'Badge & Sale',
            'Banner Template',
            'Frame Template',
            'Background Gradient',
            'Layout Kartu Ucapan',
            'Elemen Infografis',
            '3D Glassmorphism',
            'Cyber-UI Dark Neon',
            'Isometrik Data & Cloud',
            'Modern Flat 2.0 (Soft Gradient)',
            'Hand-drawn Doodle',
            'Memphis Pattern',
            'Retro Vintage Badge',
            'Gradient Mesh Abstract',
            'Low Poly',
            'Monoline Icon',
            'Duotone',
            'Halftone Pop Art',
            'Stained Glass Mosaic',
            'Batik Motif Nusantara',
            'Mandala Ornament',
            'Art Deco Geometric',
            'Bauhaus Shapes',
            'Swiss Minimal',
            'Tribal Ornament Flat',
            'Floral Botanical Flat'
        ]
    }
};

const DOMAIN_DEFINITIONS = {
    holidays: {
        triggers: ['ramadan', 'suhoor', 'iftar', 'eid', 'fitr', 'lunar', 'christmas', 'new year', 'valentine', 'halloween', 'ketupat', 'lantern', 'mosque', 'festive', 'celebration', 'holiday', 'greeting', 'islamic', 'halal'],
        adobe: '15. Culture and Religion',
        adobeAlt: '7. Food',
        genericCat: 'Holidays & Seasonal',
        pond5Cat: 'Holidays & Seasonal',
        freepikCat: 'Templates',
        keywords: ['holiday celebration', 'festive season', 'cultural tradition', 'greeting card', 'seasonal campaign', 'warm togetherness', 'decorative lantern', 'spiritual moment', 'festive banner', 'celebration background', 'family gathering', 'traditional feast', 'special occasion', 'islamic culture', 'joyful atmosphere']
    },
    technology: {
        triggers: ['ai', 'artificial intelligence', 'cyber', 'security', 'shield', 'cloud', 'data', 'robot', 'futuristic', 'neon', 'hologram', 'quantum', 'network', 'software', 'coding', 'digital', 'tech', 'fintech', 'wallet', 'ecommerce', 'online', 'server'],
        adobe: '19. Technology',
        adobeAlt: '8. Graphic Resources',
        genericCat: 'Technology & Science',
        pond5Cat: 'Technology & Science',
        freepikCat: 'Vectors',
        keywords: ['artificial intelligence', 'cyber security', 'digital transformation', 'futuristic technology', 'cloud computing', 'data protection', 'neural network', 'smart automation', 'innovation concept', 'high tech', 'virtual interface', 'fintech payment', 'machine learning', 'modern software', 'digital future']
    },
    food: {
        triggers: ['food', 'drink', 'beverage', 'coffee', 'espresso', 'latte', 'tea', 'pastry', 'culinary', 'kitchen', 'meal', 'breakfast', 'dinner', 'lunch', 'restaurant', 'cafe', 'fruit', 'dates', 'snack', 'fried', 'savory', 'crepe', 'meatball', 'rice', 'chicken', 'beef'],
        adobe: '7. Food',
        adobeAlt: '4. Drinks',
        genericCat: 'Food & Drink',
        pond5Cat: 'Food & Drink',
        freepikCat: 'Photos',
        keywords: ['gourmet food', 'artisanal culinary', 'fresh ingredients', 'delicious meal', 'cafe culture', 'organic dining', 'healthy nutrition', 'food photography', 'culinary craft', 'appetizing dish', 'table setting', 'morning beverage', 'hospitality', 'menu promotion', 'savory treat']
    },
    business: {
        triggers: ['business', 'office', 'entrepreneur', 'team', 'meeting', 'finance', 'marketing', 'corporate', 'startup', 'chart', 'graph', 'infographic', 'workspace', 'productivity', 'shopping', 'commerce', 'payment', 'economy'],
        adobe: '3. Business',
        adobeAlt: '19. Technology',
        genericCat: 'Business & Finance',
        pond5Cat: 'Business & Finance',
        freepikCat: 'Templates',
        keywords: ['modern business', 'corporate strategy', 'team collaboration', 'financial growth', 'startup innovation', 'professional workspace', 'entrepreneurship', 'business presentation', 'commercial success', 'digital marketing', 'productivity', 'leadership', 'office life', 'analytics dashboard', 'global enterprise']
    },
    nature: {
        triggers: ['nature', 'forest', 'jungle', 'mountain', 'beach', 'ocean', 'sea', 'floral', 'flower', 'botanical', 'leaf', 'foliage', 'eco', 'sustainable', 'solar', 'green energy', 'plant', 'garden', 'earth'],
        adobe: '5. The Environment',
        adobeAlt: '14. Plants and Flowers',
        genericCat: 'Nature & Landscapes',
        pond5Cat: 'Nature & Landscapes',
        freepikCat: 'Backgrounds',
        keywords: ['pristine nature', 'environmental conservation', 'sustainable future', 'eco friendly', 'botanical beauty', 'organic foliage', 'scenic landscape', 'green earth', 'natural harmony', 'outdoor serenity', 'climate action', 'fresh greenery', 'untouched wilderness', 'earth day', 'renewable world']
    },
    lifestyle: {
        triggers: ['family', 'lifestyle', 'home', 'interior', 'cozy', 'woman', 'man', 'child', 'children', 'person', 'people', 'happy', 'smiling', 'portrait', 'couple', 'friends', 'living', 'dining'],
        adobe: '12. Lifestyle',
        adobeAlt: '13. People',
        genericCat: 'Lifestyle & People',
        pond5Cat: 'Lifestyle & Family',
        freepikCat: 'Photos',
        keywords: ['authentic lifestyle', 'modern living', 'warm home', 'human connection', 'happy moment', 'candid portrait', 'everyday wellness', 'family bonding', 'contemporary life', 'comfort and joy', 'natural expression', 'domestic harmony', 'inclusive culture', 'real people', 'editorial lifestyle']
    },
    health: {
        triggers: ['health', 'healthcare', 'medical', 'doctor', 'nurse', 'hospital', 'yoga', 'fitness', 'sport', 'running', 'workout', 'wellness', 'medicine', 'vitamin'],
        adobe: '16. Science',
        adobeAlt: '18. Sports',
        genericCat: 'Healthcare & Medical',
        pond5Cat: 'Healthcare & Medical',
        freepikCat: 'Photos',
        keywords: ['healthcare innovation', 'active wellness', 'healthy lifestyle', 'medical care', 'physical fitness', 'mindful living', 'preventive health', 'vitality energy', 'clinical precision', 'holistic care', 'modern medicine', 'workout routine', 'wellbeing', 'athletic spirit', 'clean health']
    },
    abstract: {
        triggers: ['abstract', 'wave', 'waves', 'glass', 'gradient', 'pattern', 'geometric', 'batik', 'mandala', 'background', 'texture', 'minimalist', 'ornament', 'seamless', 'loop'],
        adobe: '8. Graphic Resources',
        adobeAlt: '6. States of Mind',
        genericCat: 'Abstract & Backgrounds',
        pond5Cat: 'Abstract & Backgrounds',
        freepikCat: 'Backgrounds',
        keywords: ['abstract composition', 'modern background', 'geometric harmony', 'seamless texture', 'contemporary design', 'decorative pattern', 'smooth gradient', 'visual rhythm', 'creative backdrop', 'artistic surface', 'minimalist aesthetic', 'graphic element', 'design resource', 'color balance', 'versatile template']
    }
};

const FORMAT_EN_MAP = {
    'Scene Penuh': 'full environmental scene',
    'Subjek Isolasi (BG Polos)': 'isolated subject on solid white background',
    'Copy Space': 'clean negative copy space composition',
    'Editorial / Dokumenter': 'authentic editorial documentary framing',
    'Flat Lay / Overhead': '90-degree overhead flat lay knolling',
    'Macro / Detail Ekstrem': 'extreme macro close-up detail shot',
    'Portrait / Model Fokus': 'commercial lifestyle portrait focus',
    'Seamless Texture / Surface': 'seamless tileable surface texture',
    'Ilustrasi Full Layar': 'full-bleed edge-to-edge illustration',
    'Isolated Background': 'isolated element on pure white background',
    'Karakter / Maskot': 'expressive character mascot sheet',
    'Scene Storytelling / Editorial': 'narrative editorial storytelling scene',
    'Seamless Pattern / Motif': 'seamless repeating ornamental pattern',
    'Spot Illustration / UI Element': 'clean spot illustration UI element',
    'Konsep Abstrak / Background': 'abstract conceptual backdrop',
    'Infografis & Diagram': 'structured infographic diagram layout',
    'Looping Background Abstrak': 'seamless looping abstract motion background',
    'Sinematik Alam (Aerial/Drone)': 'cinematic aerial drone nature footage',
    'Timelapse': 'dynamic high-resolution time-lapse footage',
    'Slow Motion Makro': 'ultra-smooth 120fps macro slow-motion shot',
    'Food & Drink B-roll': 'appetizing culinary food and drink b-roll',
    'Teknologi Futuristik': 'futuristic sci-fi technology motion visual',
    'Animasi 2D Flat / Motion Graphic': 'clean 2D flat vector motion graphics animation',
    'Musiman (Natal, Lebaran, Imlek)': 'festive seasonal holiday celebration footage',
    'Budaya Nusantara': 'authentic Indonesian cultural heritage footage',
    'Unboxing & Hands-on': 'clean commercial product unboxing hands-on shot',
    'Tutorial Langkah-demi-Langkah': 'clear step-by-step instructional demonstration',
    'Stop Motion': 'tactile frame-by-frame stop motion animation',
    'Hyperlapse Kota': 'dynamic urban cityscape hyperlapse',
    'Product Reveal Sinematik': 'sleek studio commercial product reveal',
    'Alam & Satwa': 'pristine wildlife and nature documentary footage',
    'Olahraga & Fitness': 'energetic athletic sports and fitness action',
    'Workspace & Produktivitas': 'modern productive office workspace b-roll',
    'Flat Vector': 'clean scalable flat vector artwork',
    'Sticker Pack': 'die-cut commercial vector sticker pack',
    'Icon Set': 'pixel-aligned modular vector icon set',
    'Logo & Monogram': 'minimalist geometric brand logo emblem',
    'Seamless Pattern': 'seamless repeating vector pattern swatch',
    'Badge, Label & Emblem': 'commercial promotional badge and emblem set',
    'Banner, Flyer & Social Media Kit': 'modern social media and web banner layout kit',
    'Infografis & Chart': 'clean business infographic chart elements',
    'Template Kartu & Bingkai': 'ornamental greeting card and frame template'
};

const STYLE_EN_MAP = {
    'Cinematic': 'cinematic commercial film aesthetic',
    'Studio Putih Minimalis': 'minimalist pure white studio lighting',
    'Flat Lay Top-Down': 'top-down flat lay studio arrangement',
    'Macro Close-up': 'razor-sharp macro close-up photography',
    'Golden Hour': 'warm golden hour sunlight glow',
    'Blue Hour Twilight': 'atmospheric blue hour twilight ambiance',
    'Moody Low-Key': 'dramatic moody low-key chiaroscuro lighting',
    'High-Key Bright Airy': 'bright airy high-key natural daylight',
    'Aerial Drone View': 'high-altitude aerial drone perspective',
    'Long Exposure': 'silky long-exposure motion blur trails',
    'Bokeh Shallow DOF': 'creamy shallow depth-of-field bokeh',
    'Lifestyle Candid': 'authentic natural lifestyle candid moment',
    'Product Clean Mockup': 'sleek commercial product mockup presentation',
    'Food Editorial': 'gourmet editorial food styling and lighting',
    'Architectural Symmetry': 'precise architectural symmetry and lines',
    'HDR Commercial': 'crisp high-dynamic-range commercial clarity',
    'Vintage Film Grain': 'nostalgic analog 35mm film grain tone',
    'Black & White Fine Art': 'high-contrast monochrome fine art photography',
    'Bebas (Tanpa Gaya Khusus)': 'clean modern commercial digital art',
    '3D Glassmorphism': 'frosted translucent 3D glassmorphism render',
    'Cyber-UI Dark Neon': 'futuristic dark-mode cyber-UI neon glow',
    'Isometrik Data & Cloud': '30-degree isometric cloud and data architecture',
    'Modern Flat 2.0 (Soft Gradient)': 'modern flat 2.0 with smooth soft gradients',
    'Hand-drawn Doodle': 'charming hand-drawn organic ink doodle',
    'Memphis Pattern': 'playful geometric Memphis design aesthetic',
    'Retro Vintage Badge': 'nostalgic retro vintage badge typography art',
    'Halftone Pop Art': 'bold halftone dot pop art comic aesthetic',
    'Batik Motif Nusantara': 'intricate Indonesian Batik Nusantara ornament',
    'Mandala Ornament': 'symmetrical sacred mandala geometric ornament',
    'Tribal Ornament Flat': 'bold flat tribal geometric ornament',
    'Floral Botanical Flat': 'elegant flat botanical floral illustration',
    'Watercolor Digital': 'soft cold-pressed digital watercolor wash',
    'Paper Cutout 3D Layer': 'layered 3D paper cutout shadow-box craft',
    'Storybook Gouache': 'warm textured gouache storybook painting',
    'Minimalist Line & Wash': 'minimalist monoline ink with soft color wash',
    '3D Clay Render': 'tactile matte 3D clay soft studio render',
    '4K Commercial Clean': 'ultra-clean 4K UHD commercial broadcast look',
    'Cinematic Teal & Orange': 'cinematic teal and orange color grading',
    'Slow Motion 120fps': 'silky 120fps high-frame-rate slow motion',
    'Aerial 4K Drone': 'stabilized 4K aerial drone cinematography',
    'Macro Studio Lighting': 'precision macro studio product lighting',
    'Neon Cyberpunk Glow': 'vibrant emerald and cyan neon cyberpunk glow',
    'Minimalist White Studio': 'seamless minimalist white cyclorama studio',
    'Golden Hour Warmth': 'warm sunlit golden hour lens warmth',
    'Hyperlapse Dynamic': 'stabilized dynamic motion hyperlapse',
    'Smooth 3D Abstract Loop': 'fluid 3D abstract particle seamless loop',
    'Flat 2D Motion Graphics': 'crisp 2D flat vector motion graphics',
    'Moody Documentary': 'dramatic shallow-depth documentary realism',
    'Bright Lifestyle Natural': 'bright natural daylight lifestyle authenticity',
    'Vertical Social Reels': 'mobile-first 9:16 social media vertical framing',
    'Product Turntable 360': 'smooth 360-degree studio product turntable',
    'Time-Lapse Cloud & Sky': 'accelerating atmospheric cloudscape time-lapse',
    'Line Art': 'clean uniform-stroke vector line art',
    'WPAP': 'vibrant Indonesian WPAP geometric pop art portrait',
    'Flat Design': 'crisp geometric flat vector design',
    'Siluet': 'bold minimalist high-contrast silhouette vector',
    'Karikatur Vektor': 'expressive stylized vector caricature',
    'Anime / Kartun Vektor': 'clean cel-shaded anime cartoon vector',
    'Flat Pattern': 'seamless repeating flat vector pattern',
    'Op Art Geometris Abstrak': 'optical illusion geometric abstract op art',
    'Minimalis Tradisional': 'refined minimalist traditional heritage vector',
    'Isometrik Flat Infografis': 'precision isometric flat infographic vector',
    'Cut Out Gaya Naif': 'playful organic paper cut-out naive vector',
    'Ikon Siluet Minimalis': 'minimalist solid silhouette icon set',
    'Ikon Logo Flat': 'clean geometric flat brand logo icon',
    'Badge & Sale': 'bold commercial sale promo badge emblem',
    'Banner Template': 'modular commercial web and social banner',
    'Frame Template': 'decorative ornamental border frame template',
    'Background Gradient': 'smooth mesh aurora gradient backdrop',
    'Layout Kartu Ucapan': 'balanced festive greeting card vector layout',
    'Elemen Infografis': 'modular business chart infographic kit',
    'Gradient Mesh Abstract': 'fluid multi-point abstract gradient mesh',
    'Low Poly': 'faceted geometric low-poly triangle mesh',
    'Monoline Icon': 'consistent 2px rounded monoline vector icon',
    'Duotone': 'high-impact two-tone duotone graphic',
    'Stained Glass Mosaic': 'luminous stained glass mosaic vector',
    'Art Deco Geometric': 'luxury gold and emerald Art Deco geometry',
    'Bauhaus Shapes': 'primary geometric Bauhaus modernist shapes',
    'Swiss Minimal': 'grid-aligned Swiss typographic minimalism'
};


window.StockForgeTaxonomy = {
    PLATFORMS_CONFIG: PLATFORMS_CONFIG,
    ASSET_TAXONOMY: ASSET_TAXONOMY,
    DOMAIN_DEFINITIONS: DOMAIN_DEFINITIONS,
    FORMAT_EN_MAP: FORMAT_EN_MAP,
    STYLE_EN_MAP: STYLE_EN_MAP
};
