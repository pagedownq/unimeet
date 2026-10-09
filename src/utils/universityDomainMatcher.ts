export interface UniversityInfo {
  name: string;
  code: string;
  city?: string;
}

const UNIVERSITY_DOMAINS: Record<string, UniversityInfo> = {
  // Turkish State & Private Universities
  'akdeniz.edu.tr': { name: 'Akdeniz Üniversitesi', code: 'AKU', city: 'Antalya' },
  'metu.edu.tr': { name: 'Orta Doğu Teknik Üniversitesi (ODTÜ)', code: 'METU', city: 'Ankara' },
  'odtu.edu.tr': { name: 'Orta Doğu Teknik Üniversitesi (ODTÜ)', code: 'METU', city: 'Ankara' },
  'itu.edu.tr': { name: 'İstanbul Teknik Üniversitesi (İTÜ)', code: 'ITU', city: 'İstanbul' },
  'boun.edu.tr': { name: 'Boğaziçi Üniversitesi', code: 'BOUN', city: 'İstanbul' },
  'hacettepe.edu.tr': { name: 'Hacettepe Üniversitesi', code: 'HU', city: 'Ankara' },
  'ankara.edu.tr': { name: 'Ankara Üniversitesi', code: 'ANK', city: 'Ankara' },
  'istanbul.edu.tr': { name: 'İstanbul Üniversitesi', code: 'IU', city: 'İstanbul' },
  'ege.edu.tr': { name: 'Ege Üniversitesi', code: 'EGE', city: 'İzmir' },
  'dokuzeylul.edu.tr': { name: 'Dokuz Eylül Üniversitesi', code: 'DEU', city: 'İzmir' },
  'bilkent.edu.tr': { name: 'Bilkent Üniversitesi', code: 'BILKENT', city: 'Ankara' },
  'sabanciuniv.edu': { name: 'Sabancı Üniversitesi', code: 'SABANCI', city: 'İstanbul' },
  'ku.edu.tr': { name: 'Koç Üniversitesi', code: 'KOC', city: 'İstanbul' },
  'yildiz.edu.tr': { name: 'Yıldız Teknik Üniversitesi (YTÜ)', code: 'YTU', city: 'İstanbul' },
  'marmara.edu.tr': { name: 'Marmara Üniversitesi', code: 'MARMARA', city: 'İstanbul' },
  'gazi.edu.tr': { name: 'Gazi Üniversitesi', code: 'GAZI', city: 'Ankara' },
  'anadolu.edu.tr': { name: 'Anadolu Üniversitesi', code: 'ANADOLU', city: 'Eskişehir' },
  'ogu.edu.tr': { name: 'Eskişehir Osmangazi Üniversitesi', code: 'ESOGU', city: 'Eskişehir' },
  'eskisehir.edu.tr': { name: 'Eskişehir Teknik Üniversitesi', code: 'ESTU', city: 'Eskişehir' },
  'sakarya.edu.tr': { name: 'Sakarya Üniversitesi', code: 'SAU', city: 'Sakarya' },
  'kocaeli.edu.tr': { name: 'Kocaeli Üniversitesi', code: 'KOU', city: 'Kocaeli' },
  'uludag.edu.tr': { name: 'Bursa Uludağ Üniversitesi', code: 'ULUDAG', city: 'Bursa' },
  'cukurova.edu.tr': { name: 'Çukurova Üniversitesi', code: 'CUKUROVA', city: 'Adana' },
  'iyte.edu.tr': { name: 'İzmir Yüksek Teknoloji Enstitüsü (İYTE)', code: 'IYTE', city: 'İzmir' },
  'bahcesehir.edu.tr': { name: 'Bahçeşehir Üniversitesi (BAU)', code: 'BAU', city: 'İstanbul' },
  'yeditepe.edu.tr': { name: 'Yeditepe Üniversitesi', code: 'YEDITEPE', city: 'İstanbul' },
  'ozyegin.edu.tr': { name: 'Özyeğin Üniversitesi', code: 'OZU', city: 'İstanbul' },
  'tobb.edu.tr': { name: 'TOBB Ekonomi ve Teknoloji Üniversitesi', code: 'TOBB', city: 'Ankara' },
  'baskent.edu.tr': { name: 'Başkent Üniversitesi', code: 'BASKENT', city: 'Ankara' },
  'cankaya.edu.tr': { name: 'Çankaya Üniversitesi', code: 'CANKAYA', city: 'Ankara' },
  'tedu.edu.tr': { name: 'TED Üniversitesi', code: 'TEDU', city: 'Ankara' },
  'bilgi.edu.tr': { name: 'İstanbul Bilgi Üniversitesi', code: 'BILGI', city: 'İstanbul' },
  'isikun.edu.tr': { name: 'Işık Üniversitesi', code: 'ISIK', city: 'İstanbul' },
  'khas.edu.tr': { name: 'Kadir Has Üniversitesi', code: 'KHAS', city: 'İstanbul' },
  'yasar.edu.tr': { name: 'Yaşar Üniversitesi', code: 'YASAR', city: 'İzmir' },
  'ieu.edu.tr': { name: 'İzmir Ekonomi Üniversitesi', code: 'IEU', city: 'İzmir' },
  'pamukkale.edu.tr': { name: 'Pamukkale Üniversitesi', code: 'PAU', city: 'Denizli' },
  'mu.edu.tr': { name: 'Muğla Sıtkı Koçman Üniversitesi', code: 'MSKU', city: 'Muğla' },
  'sdu.edu.tr': { name: 'Süleyman Demirel Üniversitesi', code: 'SDU', city: 'Isparta' },
  'selcuk.edu.tr': { name: 'Selçuk Üniversitesi', code: 'SELCUK', city: 'Konya' },
  'ktu.edu.tr': { name: 'Karadeniz Teknik Üniversitesi (KTÜ)', code: 'KTU', city: 'Trabzon' },
  'omu.edu.tr': { name: 'Ondokuz Mayıs Üniversitesi', code: 'OMU', city: 'Samsun' },
  'inonu.edu.tr': { name: 'İnönü Üniversitesi', code: 'INONU', city: 'Malatya' },
  'firat.edu.tr': { name: 'Fırat Üniversitesi', code: 'FIRAT', city: 'Elazığ' },
  'dicle.edu.tr': { name: 'Dicle Üniversitesi', code: 'DICLE', city: 'Diyarbakır' },
  'gantep.edu.tr': { name: 'Gaziantep Üniversitesi', code: 'GAUN', city: 'Gaziantep' },

  // Global Ivy / Top International Domains
  'stanford.edu': { name: 'Stanford University', code: 'STANFORD' },
  'harvard.edu': { name: 'Harvard University', code: 'HARVARD' },
  'mit.edu': { name: 'Massachusetts Institute of Technology (MIT)', code: 'MIT' },
  'berkeley.edu': { name: 'UC Berkeley', code: 'UCB' },
  'columbia.edu': { name: 'Columbia University', code: 'COLUMBIA' },
  'ox.ac.uk': { name: 'University of Oxford', code: 'OXFORD' },
  'cam.ac.uk': { name: 'University of Cambridge', code: 'CAMBRIDGE' },
};

/**
 * Extracts and matches university from email address.
 * E.g., 'mehmetgulhan@ogr.akdeniz.edu.tr' -> 'Akdeniz Üniversitesi'
 */
export function extractUniversityFromEmail(email: string): UniversityInfo | null {
  if (!email || !email.includes('@')) return null;

  const parts = email.toLowerCase().trim().split('@');
  if (parts.length !== 2) return null;

  const domain = parts[1];
  
  // Must end with .edu or .edu.tr or .ac.uk
  if (!domain.includes('.edu') && !domain.includes('.ac.uk')) {
    return null;
  }

  // 1. Direct key match
  if (UNIVERSITY_DOMAINS[domain]) {
    return UNIVERSITY_DOMAINS[domain];
  }

  // 2. Subdomain stripping (e.g. ogr.akdeniz.edu.tr -> akdeniz.edu.tr)
  const subParts = domain.split('.');
  if (subParts.length >= 3) {
    // try last 3 parts for .edu.tr or .ac.uk
    const lastThree = subParts.slice(-3).join('.');
    if (UNIVERSITY_DOMAINS[lastThree]) {
      return UNIVERSITY_DOMAINS[lastThree];
    }
    // try last 2 parts for .edu
    const lastTwo = subParts.slice(-2).join('.');
    if (UNIVERSITY_DOMAINS[lastTwo]) {
      return UNIVERSITY_DOMAINS[lastTwo];
    }
  }

  // Fallback: Format generic name from domain
  const mainDomain = subParts.find(
    (p) => p !== 'ogr' && p !== 'student' && p !== 'mail' && p !== 'edu' && p !== 'tr' && p !== 'ac' && p !== 'uk'
  );

  if (mainDomain) {
    const formattedName = mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1) + ' Üniversitesi';
    return {
      name: formattedName,
      code: mainDomain.toUpperCase(),
    };
  }

  return null;
}

export function isValidEduEmail(email: string): boolean {
  if (!email) return false;
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.(edu|edu\.tr|ac\.uk)$/;
  return emailRegex.test(trimmed);
}
