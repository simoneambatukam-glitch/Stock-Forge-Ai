'use strict';
/* =========================================================================
   StockForge AI — Agent 03 Lexicon (Global English Transcreator)
   Ported verbatim from the tested web engine (56/56 PASS):
   ~/workspace/stockforge-ai/index.html
   - ID_TO_EN_PHRASES: multi-word Indonesian -> English phrase map
   - ID_TO_EN_WORDS: single-word dictionary (450+ terms with phrases)
   - INDONESIAN_STOPWORDS / ENGLISH_STOPWORDS / COMMON_ENGLISH_WHITELIST
   - TRADEMARK_BLOCKLIST: brand names stripped from every output
   100% offline. No network, no API key.
   ========================================================================= */

const ID_TO_EN_PHRASES = [
    // Cultural, Religious & Indonesian Heritage (Nusantara)
    ['ramadan keluarga indonesia', 'indonesian family celebrating ramadan'],
    ['sahur keluarga', 'family suhoor pre-dawn meal'],
    ['sahur ramadan', 'ramadan suhoor pre-dawn meal'],
    ['makan sahur', 'suhoor pre-dawn meal'],
    ['buka puasa bersama', 'communal ramadan iftar dinner'],
    ['buka puasa', 'ramadan iftar dinner'],
    ['berbuka puasa', 'breaking the fast iftar meal'],
    ['idul fitri', 'eid al fitr celebration'],
    ['hari raya idul fitri', 'eid al fitr festive holiday'],
    ['hari raya', 'festive holiday celebration'],
    ['mudik lebaran', 'eid homecoming family travel'],
    ['hampers lebaran', 'eid al fitr luxury gift hamper'],
    ['tahun baru imlek', 'chinese lunar new year celebration'],
    ['tahun baru', 'new year celebration'],
    ['hari kemerdekaan', 'independence day celebration'],
    ['budaya nusantara', 'indonesian archipelago cultural heritage'],
    ['motif batik nusantara', 'traditional indonesian batik ornament pattern'],
    ['batik kawung', 'javanese kawung batik geometric motif'],
    ['batik parang', 'traditional parang batik pattern'],
    ['kain tenun', 'traditional handwoven ikat textile'],
    ['rumah gadang', 'traditional minangkabau architecture'],
    ['candi borobudur', 'ancient buddhist temple monument'],
    ['tari tradisional', 'traditional cultural dance performance'],
    ['wayang kulit', 'traditional shadow puppet art'],
    ['alat musik gamelan', 'traditional bronze gamelan orchestra'],

    // Indonesian & Global Culinary (Kuliner & Minuman)
    ['sosis solo gorengan tradisional', 'traditional indonesian savory crispy crepe roll snack'],
    ['sosis solo', 'traditional savory crepe roll snack'],
    ['gorengan tradisional', 'traditional crispy fried street food snacks'],
    ['bakso goreng', 'crispy fried meatball snack'],
    ['kue tradisional nusantara', 'traditional indonesian heritage pastries'],
    ['kue lapis', 'traditional layered steamed cake'],
    ['klepon pandan', 'pandan sweet glutinous rice balls with palm sugar'],
    ['nasi goreng', 'indonesian spiced fried rice'],
    ['rendang daging', 'slow cooked spiced beef rendang'],
    ['sate ayam', 'grilled chicken skewers with peanut sauce'],
    ['gado gado', 'indonesian vegetable salad with peanut dressing'],
    ['kopi tubruk', 'traditional indonesian unfiltered black coffee'],
    ['kopi susu gula aren', 'iced palm sugar milk coffee latte'],
    ['kopi spesialti', 'artisanal specialty pour over coffee'],
    ['teh tarik', 'frothy pulled milk tea'],
    ['teh hangat', 'warm aromatic herbal tea'],
    ['es campur', 'tropical shaved ice fruit dessert'],
    ['hidangan sahur', 'suhoor pre-dawn breakfast spread'],
    ['hidangan berbuka', 'iftar festive dinner feast'],
    ['makanan sehat', 'healthy organic nutritious meal'],
    ['makanan cepat saji', 'modern fast food burger and fries'],
    ['buah buahan segar', 'fresh tropical organic fruits'],

    // Business, Finance, Fintech & E-Commerce
    ['belanja online', 'online e-commerce mobile shopping'],
    ['dompet digital', 'digital mobile e-wallet payment'],
    ['keuangan digital', 'modern fintech digital banking'],
    ['transaksi aman', 'secure encrypted financial transaction'],
    ['keamanan siber', 'cybersecurity data protection shield'],
    ['kecerdasan buatan', 'artificial intelligence machine learning'],
    ['pembelajaran mesin', 'deep learning neural network'],
    ['komputasi awan', 'cloud computing server infrastructure'],
    ['analisis data', 'big data business intelligence analytics'],
    ['rapat tim', 'diverse corporate team meeting'],
    ['kerja jarak jauh', 'remote work from home lifestyle'],
    ['ruang kerja minimalis', 'minimalist modern productivity workspace'],
    ['meja kerja', 'clean ergonomic office desk'],
    ['pertumbuhan bisnis', 'upward financial business growth chart'],
    ['pemasaran digital', 'digital marketing social media campaign'],
    ['ramah lingkungan', 'eco-friendly sustainable green living'],
    ['energi terbarukan', 'renewable clean solar and wind energy'],
    ['panel surya', 'photovoltaic solar power panels'],
    ['kemasan ramah lingkungan', 'biodegradable sustainable product packaging'],

    // Composition, Lighting & Visual Modifiers
    ['ruang kosong untuk teks', 'clean negative copy space for advertising typography'],
    ['ruang kosong', 'clean copy space'],
    ['latar belakang putih', 'pure isolated white background'],
    ['latar belakang transparan', 'transparent alpha channel background'],
    ['latar belakang gelap', 'dark obsidian background'],
    ['meja kayu', 'rustic natural wooden table'],
    ['ruang makan', 'warm sunlit modern dining room'],
    ['dapur modern', 'contemporary bright minimalist kitchen'],
    ['pagi hari', 'bright morning sunlight'],
    ['sore hari', 'warm golden hour afternoon light'],
    ['malam hari', 'atmospheric night scene'],
    ['hijau zamrud', 'emerald forest green'],
    ['hijau emerald', 'emerald green'],
    ['emas mewah', 'brushed luxury metallic gold'],
    ['cahaya matahari', 'natural warm sunbeams'],
    ['asap hangat', 'delicate rising aromatic steam'],
    ['perisai keamanan', 'glowing cyber security shield'],
    ['gelombang cahaya', 'flowing luminous light waves'],
    ['paket stiker', 'die-cut commercial sticker pack'],
    ['kartu ucapan', 'festive greeting card layout'],
    ['berputar mulus', 'seamless smooth 360 rotation']
];

const ID_TO_EN_WORDS = {
    // People & Family
    keluarga: 'family', ayah: 'father', ibu: 'mother', anak: 'child', 'anak-anak': 'children',
    bayi: 'baby', orang: 'person', manusia: 'human', wanita: 'woman', perempuan: 'woman',
    pria: 'man', 'laki-laki': 'man', remaja: 'teenager', lansia: 'senior', kakek: 'grandfather',
    nenek: 'grandmother', teman: 'friends', sahabat: 'best friends', pasangan: 'couple',
    pengantin: 'wedding couple', tim: 'team', kelompok: 'group', masyarakat: 'community',
    warga: 'citizens', penduduk: 'local people', indonesia: 'indonesian', asia: 'asian',
    nusantara: 'indonesian heritage',

    // Professions
    pengusaha: 'entrepreneur', pebisnis: 'businessperson', pekerja: 'worker', karyawan: 'employee',
    manajer: 'manager', pemimpin: 'leader', direktur: 'executive', dokter: 'doctor',
    perawat: 'nurse', apoteker: 'pharmacist', ilmuwan: 'scientist', peneliti: 'researcher',
    insinyur: 'engineer', arsitek: 'architect', programmer: 'software developer', desainer: 'designer',
    seniman: 'artist', fotografer: 'photographer', koki: 'chef', barista: 'barista',
    pelayan: 'waiter', petani: 'farmer', nelayan: 'fisherman', guru: 'teacher',
    dosen: 'professor', mahasiswa: 'university student', pelajar: 'student', kurir: 'delivery courier',
    atlet: 'athlete', pelatih: 'fitness trainer',

    // Holidays, Religion & Culture
    ramadan: 'ramadan', ramadhan: 'ramadan', sahur: 'suhoor pre-dawn meal', puasa: 'fasting',
    iftar: 'iftar', lebaran: 'eid al fitr', syawal: 'eid celebration', ketupat: 'woven ketupat',
    bedug: 'traditional mosque drum', masjid: 'mosque', musholla: 'prayer room', sajadah: 'prayer rug',
    tasbih: 'prayer beads', lentera: 'lantern', lampu: 'lamp', bulan: 'crescent moon',
    sabit: 'crescent', bintang: 'star', natal: 'christmas', pohon: 'tree',
    kado: 'gift box', hadiah: 'present', imlek: 'lunar new year', lampion: 'red lantern',
    angpao: 'red envelope', naga: 'dragon', barongsai: 'lion dance', waisak: 'vesak',
    nyepi: 'balinese day of silence', pura: 'balinese temple', gereja: 'church',
    batik: 'batik', kebaya: 'traditional kebaya', songket: 'gold woven songket',
    keris: 'traditional dagger', angklung: 'bamboo angklung', budaya: 'culture',
    tradisi: 'tradition', adat: 'custom heritage', upacara: 'ceremony', festival: 'festival',
    perayaan: 'celebration', liburan: 'holiday vacation', wisata: 'tourism',

    // Food & Beverages
    makanan: 'food', minuman: 'beverage', hidangan: 'meal dish', masakan: 'cuisine',
    kuliner: 'culinary', sarapan: 'breakfast', makan: 'dining', kopi: 'coffee',
    teh: 'tea', susu: 'milk', jus: 'juice', air: 'water',
    es: 'iced', gula: 'sugar', aren: 'palm sugar', madu: 'honey',
    kurma: 'dates', kue: 'pastry cake', roti: 'artisan bread', gorengan: 'crispy fried snack',
    sosis: 'savory roll', bakso: 'meatball', mie: 'noodles', nasi: 'steamed rice',
    ayam: 'chicken', daging: 'beef', ikan: 'fish', udang: 'shrimp',
    sayur: 'vegetables', sayuran: 'fresh vegetables', buah: 'fruit', pisang: 'banana',
    mangga: 'mango', kelapa: 'coconut', alpukat: 'avocado', stroberi: 'strawberry',
    cokelat: 'chocolate', keju: 'cheese', rempah: 'aromatic spices', cabai: 'chili pepper',
    bawang: 'garlic', piring: 'ceramic plate', mangkuk: 'bowl', gelas: 'glass cup',
    cangkir: 'coffee cup', sendok: 'spoon', garpu: 'fork', dapur: 'kitchen',
    restoran: 'restaurant', kafe: 'cafe', warung: 'traditional eatery',

    // Business, Finance & Technology
    bisnis: 'business', kantor: 'office', perusahaan: 'corporate company', keuangan: 'finance',
    uang: 'money', koin: 'gold coin', dompet: 'wallet', bank: 'banking',
    investasi: 'investment', saham: 'stock market', grafik: 'analytics chart', diagram: 'diagram',
    belanja: 'shopping', keranjang: 'shopping cart', diskon: 'discount sale', promo: 'promotion',
    harga: 'price tag', paket: 'package', kemasan: 'packaging', botol: 'bottle',
    kotak: 'box', label: 'label', produk: 'product', merek: 'brand',
    teknologi: 'technology', digital: 'digital', internet: 'internet', jaringan: 'network',
    data: 'data', awan: 'cloud', server: 'server', keamanan: 'security',
    siber: 'cyber', perisai: 'shield', gembok: 'padlock', kunci: 'key',
    robot: 'robot', layar: 'screen', ponsel: 'smartphone', laptop: 'laptop',
    komputer: 'computer', aplikasi: 'mobile app', ikon: 'icon', tombol: 'button',
    kode: 'code', perangkat: 'device', inovasi: 'innovation', masa: 'future',
    depan: 'forward',

    // Nature, Environment & Places
    alam: 'nature', lingkungan: 'environment', bumi: 'earth', dunia: 'global world',
    hutan: 'forest', rimba: 'jungle', gunung: 'mountain', bukit: 'hill',
    lembah: 'valley', sungai: 'river', danau: 'lake', airterjun: 'waterfall',
    pantai: 'beach', laut: 'sea', samudra: 'ocean', pulau: 'island',
    langit: 'sky', matahari: 'sun', senja: 'sunset', fajar: 'sunrise',
    hujan: 'rain', salju: 'snow', angin: 'wind', api: 'fire',
    bunga: 'flower', daun: 'leaf', dedaunan: 'foliage', tanaman: 'plant',
    rumput: 'grass', taman: 'garden', sawah: 'rice terrace', kebun: 'plantation',
    kucing: 'cat', anjing: 'dog', burung: 'bird', kupu: 'butterfly',
    kota: 'city', gedung: 'skyscraper building', jalan: 'street', jembatan: 'bridge',
    rumah: 'home', ruang: 'room', kamar: 'bedroom', tamu: 'living room',
    meja: 'table', kursi: 'chair', jendela: 'window', pintu: 'door',
    dinding: 'wall', lantai: 'floor', kayu: 'wood', batu: 'stone',
    kaca: 'glass', logam: 'metal', emas: 'gold', perak: 'silver',

    // Health, Sport & Education
    kesehatan: 'healthcare', sehat: 'healthy', medis: 'medical', obat: 'medicine',
    vitamin: 'vitamin', olahraga: 'fitness sport', lari: 'running', yoga: 'yoga',
    senam: 'workout', sepeda: 'cycling', bola: 'football', renang: 'swimming',
    pendidikan: 'education', belajar: 'learning', sekolah: 'school', kampus: 'campus',
    buku: 'book', pena: 'pen', catatan: 'notebook', ujian: 'exam',
    wisuda: 'graduation',

    // Art, Design & Visual Attributes
    seni: 'art', lukisan: 'painting', ilustrasi: 'illustration', gambar: 'graphic',
    vektor: 'vector', stiker: 'sticker', pola: 'pattern', motif: 'motif',
    ornamen: 'ornament', bingkai: 'frame', spanduk: 'banner', poster: 'poster',
    kartu: 'card', ucapan: 'greeting', undangan: 'invitation', logo: 'logo',
    lencana: 'badge', gelombang: 'wave', cahaya: 'light', sinar: 'glow',
    bayangan: 'shadow', warna: 'color', gradien: 'gradient', tekstur: 'texture',
    abstrak: 'abstract', geometris: 'geometric', lingkaran: 'circle', segitiga: 'triangle',

    // Adjectives, Verbs & Time (Kata Sifat, Kerja & Waktu)
    hangat: 'warm', cerah: 'bright', terang: 'luminous', gelap: 'dark',
    mewah: 'luxury', elegan: 'elegant', minimalis: 'minimalist', modern: 'modern',
    tradisional: 'traditional', klasik: 'classic', antik: 'vintage', futuristik: 'futuristic',
    estetik: 'aesthetic', indah: 'beautiful', cantik: 'pretty', rapi: 'neat',
    bersih: 'clean', segar: 'fresh', renyah: 'crispy', lezat: 'delicious',
    nikmat: 'tasty', manis: 'sweet', pedas: 'spicy', bahagia: 'happy',
    senang: 'joyful', tersenyum: 'smiling', ramah: 'friendly', semangat: 'energetic',
    tenang: 'calm peaceful', damai: 'serene', cepat: 'fast', mulus: 'seamless smooth',
    kuat: 'strong', aman: 'safe secure', cerdas: 'smart', kreatif: 'creative',
    hijau: 'green', zamrud: 'emerald', biru: 'blue', merah: 'red',
    kuning: 'yellow', oranye: 'orange', ungu: 'purple', merahmuda: 'pink',
    putih: 'white', hitam: 'black', abu: 'gray', cokelatwarna: 'brown',
    pagi: 'morning', siang: 'daytime', sore: 'afternoon', malam: 'night',
    subuh: 'dawn', menyiapkan: 'preparing', menikmati: 'enjoying', bekerja: 'working',
    berbelanja: 'shopping', tersenyumlah: 'smiling', berkumpul: 'gathering',
    berbagi: 'sharing', berdoa: 'praying', memasak: 'cooking', minum: 'drinking',
    berputar: 'rotating', mengalir: 'flowing', bersinar: 'glowing', terbang: 'flying'
};

const INDONESIAN_STOPWORDS = new Set([
    'di', 'ke', 'dari', 'yang', 'dan', 'dengan', 'untuk', 'pada', 'dalam', 'atau',
    'ini', 'itu', 'sedang', 'lagi', 'sangat', 'tentang', 'tema', 'konsep', 'gaya',
    'latar', 'belakang', 'sebuah', 'suatu', 'para', 'adalah', 'menjadi', 'secara',
    'saja', 'juga', 'serta', 'agar', 'supaya', 'karena', 'sebab', 'oleh', 'bagi',
    'buat', 'buatkan', 'bikin', 'bikinkan', 'tolong', 'cari', 'carikan', 'kasih',
    'foto', 'video', 'ilustrasi', 'vektor', 'aset', 'asset', 'bagus', 'keren',
    'mantap', 'banget', 'sekali', 'penuh', 'berisi', 'tampak', 'terlihat', 'memakai',
    'menggunakan', 'ada', 'nya', 'pun', 'lah', 'kah', 'per', 'tiap', 'setiap'
]);

const ENGLISH_STOPWORDS = new Set([
    'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'a', 'an',
    'is', 'are', 'by', 'as', 'from', 'into', 'over', 'under', 'that', 'this'
]);

const COMMON_ENGLISH_WHITELIST = new Set([
    'ramadan', 'suhoor', 'iftar', 'eid', 'fitr', 'halal', 'mosque', 'islamic', 'muslim',
    'arabic', 'lantern', 'crescent', 'dates', 'ketupat', 'batik', 'indonesian', 'asian',
    'family', 'father', 'mother', 'child', 'children', 'woman', 'man', 'people', 'person',
    'group', 'team', 'couple', 'friends', 'portrait', 'lifestyle', 'candid', 'happy',
    'smiling', 'warm', 'cozy', 'home', 'kitchen', 'dining', 'table', 'wooden', 'modern',
    'minimalist', 'luxury', 'clean', 'bright', 'airy', 'morning', 'evening', 'night',
    'golden', 'hour', 'sunlight', 'coffee', 'espresso', 'latte', 'tea', 'cup', 'mug',
    'food', 'drink', 'beverage', 'meal', 'breakfast', 'dinner', 'lunch', 'snack', 'pastry',
    'crispy', 'fried', 'savory', 'sweet', 'fresh', 'organic', 'healthy', 'gourmet',
    'culinary', 'restaurant', 'cafe', 'plate', 'bowl', 'glass', 'steam', 'smoke',
    'business', 'office', 'corporate', 'finance', 'fintech', 'banking', 'money', 'coin',
    'wallet', 'payment', 'shopping', 'ecommerce', 'online', 'cart', 'sale', 'discount',
    'promo', 'banner', 'icon', 'icons', 'vector', 'sticker', 'pack', 'badge', 'logo',
    'pattern', 'seamless', 'frame', 'card', 'greeting', 'infographic', 'chart', 'graph',
    'technology', 'tech', 'digital', 'cyber', 'security', 'shield', 'cloud', 'data',
    'network', 'ai', 'artificial', 'intelligence', 'robot', 'futuristic', 'neon', 'glow',
    'hologram', 'abstract', 'wave', 'waves', 'gradient', 'emerald', 'green', 'gold',
    'blue', 'red', 'white', 'black', 'dark', 'light', 'nature', 'forest', 'mountain',
    'beach', 'ocean', 'tropical', 'floral', 'flower', 'leaf', 'leaves', 'plant', 'eco',
    'sustainable', 'solar', 'energy', 'medical', 'health', 'healthcare', 'doctor', 'nurse',
    'fitness', 'sport', 'yoga', 'running', 'education', 'book', 'learning', 'city',
    'skyline', 'architecture', 'interior', 'background', 'isolated', 'copy', 'space',
    'studio', 'macro', 'aerial', 'drone', 'cinematic', 'loop', 'looping', 'vertical',
    'horizontal', '4k', 'uhd', '3d', 'glassmorphism', 'isometric', 'flat', 'doodle',
    'watercolor', 'vintage', 'retro', 'geometric', 'minimal', 'commercial', 'editorial'
]);

const TRADEMARK_BLOCKLIST = new Set([
    'adobe', 'photoshop', 'illustrator', 'shutterstock', 'vecteezy', 'dreamstime', 'freepik',
    'istock', 'getty', 'pond5', 'depositphotos', '123rf', 'canva', 'apple', 'iphone', 'ipad',
    'macbook', 'samsung', 'nike', 'adidas', 'disney', 'marvel', 'google', 'microsoft', 'windows',
    'instagram', 'tiktok', 'facebook', 'youtube', 'netflix', 'starbucks', 'coca', 'cola', 'tesla'
]);


window.StockForgeLexicon = {
    ID_TO_EN_PHRASES: ID_TO_EN_PHRASES,
    ID_TO_EN_WORDS: ID_TO_EN_WORDS,
    INDONESIAN_STOPWORDS: INDONESIAN_STOPWORDS,
    ENGLISH_STOPWORDS: ENGLISH_STOPWORDS,
    COMMON_ENGLISH_WHITELIST: COMMON_ENGLISH_WHITELIST,
    TRADEMARK_BLOCKLIST: TRADEMARK_BLOCKLIST
};
