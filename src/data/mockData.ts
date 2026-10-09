export interface StudentCard {
  id: string;
  name: string;
  age: number;
  university: string;
  universityCode: string;
  gender: string;
  intent: string[];
  bio: string;
  photos: string[];
  interests: string[];
  traits: string[];
  distanceKm: number;
}

export interface Conversation {
  id: string;
  matchName: string;
  matchAvatar: string;
  university: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export const MOCK_STUDENTS: StudentCard[] = [
  {
    id: '1',
    name: 'Selin',
    age: 21,
    university: 'Akdeniz Üniversitesi',
    universityCode: 'AKU',
    gender: 'Kadın',
    intent: ['Activity Partner', 'Dating', 'Coffee'],
    bio: 'Mimar Sinan Fakültesinde İç Mimarlık okuyorum. Kampüste kahve içip çizim yapmayı severim 🎨☕',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
    ],
    interests: ['Mimarlık', 'Kahve', 'Fotoğrafçılık', 'Yoga', 'Resim'],
    traits: ['Eğlenceli', 'Yaratıcı', 'Sakin'],
    distanceKm: 1.2,
  },
  {
    id: '2',
    name: 'Mert',
    age: 22,
    university: 'Orta Doğu Teknik Üniversitesi (ODTÜ)',
    universityCode: 'METU',
    gender: 'Erkek',
    intent: ['Fun', 'Chat', 'Events'],
    bio: 'Bilgisayar Mühendisliği 3. sınıf. Yapay zeka ve gitar tutkunu 🎸💻',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    ],
    interests: ['Kodlama', 'Müzik', 'Basketbol', 'Konser'],
    traits: ['Akıllı', 'Sempatik', 'Dinleyici'],
    distanceKm: 3.5,
  },
  {
    id: '3',
    name: 'Elif',
    age: 20,
    university: 'İstanbul Teknik Üniversitesi (İTÜ)',
    universityCode: 'ITU',
    gender: 'Kadın',
    intent: ['Romance', 'Dating', 'Events'],
    bio: 'Endüstriyel Tasarım öğrencisi. İstanbul sokak lezzetleri ve sinema meraklısı 🎬🍜',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    ],
    interests: ['Sinema', 'Seyahat', 'Moda', 'Kitap', 'Dans'],
    traits: ['Enerjik', 'Güleryüzlü', 'Dürüst'],
    distanceKm: 2.1,
  },
  {
    id: '4',
    name: 'Kaan',
    age: 23,
    university: 'Boğaziçi Üniversitesi',
    universityCode: 'BOUN',
    gender: 'Erkek',
    intent: ['Activity Partner', 'Travel', 'Party'],
    bio: 'İktisat son sınıf. Kampüs festival komitesindeyim. Hafta sonu kamp ve trekking yapıyoruz 🏕️🚀',
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop',
    ],
    interests: ['Doğa', 'Kamp', 'Ekonomi', 'Yüzme', 'Festival'],
    traits: ['Hırslı', 'Dışadönük', 'Lider'],
    distanceKm: 4.8,
  },
  {
    id: '5',
    name: 'Zeynep',
    age: 21,
    university: 'Koç Üniversitesi',
    universityCode: 'KOC',
    gender: 'Kadın',
    intent: ['Chat', 'Friend', 'Events'],
    bio: 'Tıp Fakültesi 2. sınıf. Pilates ve felsefe sohbetleri severim 🧘‍♀️📚',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop',
    ],
    interests: ['Pilates', 'Tıp', 'Felsefe', 'Sergi', 'Tenis'],
    traits: ['Sakin', 'Zeki', 'Pozitif'],
    distanceKm: 5.0,
  },
];

export const MOCK_LIKES: StudentCard[] = [
  MOCK_STUDENTS[0],
  MOCK_STUDENTS[2],
  MOCK_STUDENTS[4],
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    matchName: 'Selin',
    matchAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    university: 'Akdeniz Üniversitesi',
    lastMessage: 'Selam! Kampüs kütüphanesinde kahve molasına ne dersin? ☕',
    timestamp: '14:20',
    unreadCount: 2,
  },
  {
    id: 'c2',
    matchName: 'Elif',
    matchAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
    university: 'İstanbul Teknik Üniversitesi (İTÜ)',
    lastMessage: 'Yarınki sinema kulübü etkinliğine gidiyor musun?',
    timestamp: 'Dün',
    unreadCount: 0,
  },
];
