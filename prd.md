# Product Requirements Document (PRD): UniMeet

## 1. Project Overview & Specs
- **App Name (Store Name):** UniMeet
- **Bundle ID / Package Name:** `com.mgverse.unimeet`
- **Tech Stack:** React Native, Expo (Managed Workflow), TypeScript
- **Target Platform:** iOS only (for initial release)
- **Localization:** Dual-language support (Turkish & English) via `react-i18next` or `expo-localization`. Default language detects device locale, fallback to Turkish.
- **UI/UX Design Direction:** Modern, smooth animations (`react-native-reanimated`, `react-native-gesture-handler`), high-quality Tinder-like interactive swipe gestures, polished onboarding experience.

---

## 2. Technical Dependencies & Permissions Configuration

### 2.1 Required Expo Packages & Native Libraries
- `expo-localization`, `i18next`, `react-i18next`
- `expo-notifications` (Push notification permissions)
- `expo-image-picker` (Gallery permission for photos)
- `@react-native-community/datetimepicker` or `react-native-wheel-pick` (Apple scrollable date picker)
- `react-native-reanimated`, `react-native-gesture-handler`, `moti` (Animations & Swipe cards)
- `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`
- `@react-native-async-storage/async-storage` (Local state & timer management for swipe limits)

### 2.2 Native Permissions Config (`app.json`)
```json
{
  "expo": {
    "name": "UniMeet",
    "slug": "unimeet",
    "ios": {
      "bundleIdentifier": "com.mgverse.unimeet",
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "UniMeet profilinize fotoğraf eklemek ve güncellemek için galeri erişim izni gereklidir.",
        "NSCameraUsageDescription": "UniMeet profilinize doğrudan fotoğraf çekip eklemek için kamera erişimi gereklidir."
      }
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "UniMeet profilinize fotoğraf eklemek için galeri erişim izni istiyoruz."
        }
      ]
    ]
  }
}
3. Localization Architecture (i18n Setup)
Create translation dictionaries (src/locales/tr.json and src/locales/en.json) covering all UI strings.

Example Keys:

onboarding.start_btn: "Hadi Başlayalım" / "Let's Get Started"

auth.edu_email_label: "Üniversite e-postan nedir?" / "What is your university email?"

swipe.limit_reached: "Swipe hakkınız bitmiştir." / "You've reached your swipe limit."

profile.completion: "Profil Doluluk Oranı" / "Profile Completion Rate"

4. University Domain Matching Engine (src/utils/universityDomainMatcher.ts)
Logic Requirements:
Input field must accept .edu.tr or .edu extensions.

Maintain a comprehensive JSON mapping table of Turkish & global university domain suffixes.

Automatically extract the domain from email input (e.g., mehmetgulhan@ogr.akdeniz.edu.tr -> akdeniz.edu.tr -> "Akdeniz Üniversitesi").

Display detected university dynamically on-screen in real-time.

Note: The email is strictly used to detect and record the university context; account registration proceeds via Google, Apple, or Personal Email in the final step.

5. User Onboarding & Registration Flow (Step-by-Step)
Strict Navigation Rule: User cannot proceed to the next screen without completing the required input/action.

Step 1: Push Notification Request
Request push notification permission upon launching the app for the first time.

Step 2: Interactive Onboarding Carousel (5 Pages)
Theme: "Kampüsünden öğrencilerle tanışmaya ne dersin?"

5 interactive, animated onboarding cards (react-native-reanimated).

Interactive elements on cards (tappable dynamic preview components, smooth page indicators).

CTA Button at Step 5: "Hadi Başlayalım" -> Navigates to Email Step.

Step 3: University Email Input Screen
Input: Text field enforcing @...edu.tr or @...edu.

Live Domain Matching Engine displays: "Tespit Edilen Üniversite: [Üniversite Adı]".

Validation: Must be a valid .edu / .edu.tr address.

Step 4: Password Creation Screen
Password input (Min 6 characters) + Password Confirmation input.

Validation check for match and length.

Step 5: Profile Photos Screen
Request Photo Library Permission (expo-image-picker).

Minimum 1 photo required, maximum 5 photos allowed.

First added photo automatically assigned as the main profile picture.

Step 6: First Name Input Screen
Single text input.

Validation: Letters only (Regex: ^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$). Numbers and special symbols blocked.

Step 7: Birth Date Screen
Component: Apple-style iOS scrollable wheel date picker.

Age Gate: Calculated age must be >= 16 years old.

Dynamic UI Notice: Displays real-time age badge: "Şu an [X] yaşındasın".

Privacy Notice: "Profilinde doğum tarihin görünmeyecek, yalnızca yaşın gösterilecektir."

Step 8: Meeting Intent / Activities Screen
Title: "Ne tür buluşmalar arıyorsun?"

Selectable Chips: Activity Partner, Fun, Dating, Romance, Chat, Events, Friend, Travel, Party, Clubbing, etc.

Constraint: Multi-select allowed, maximum 3 items.

Step 9: Gender Selection Screen
Options: Kadın, Erkek, Diğer.

Required selection. Displayed on public profile.

Step 10: Preferred Match Gender Screen
Title: "Kimlerle tanışmak istiyorsun?"

Options: Kadın, Erkek, Diğer.

Constraint: Multi-select allowed. Editable later in profile settings.

Step 11: Bio / Introduction Screen
Short bio text input.

Constraints: Mandatory, maximum 100 characters. Real-time character counter displayed.

Step 12: Interests / Hobbies Screen
Title: "Nelerden hoşlanırsın?"

Grid of 50+ interest tags (Sports, Tech, Cinema, Gaming, Coffee, Art, Music, etc.).

Constraint: Multi-select allowed, maximum 5 items.

Step 13: Desired Partner Traits Screen (Optional)
Title: "Karşı tarafta aradığın özellikler"

Personality traits / characteristics tags (e.g., Funny, Ambitious, Extrovert, Calm, Creative, Listener).

Constraint: Multi-select allowed, maximum 3 items. Can be skipped ("Atla").

Step 14: Final Account Creation Screen
Informative Disclaimer (Small Font):

"Üniversitenin .edu adreslerinde yaşanan teknik bir sorun nedeniyle hesabını aşağıdaki yollardan biriyle oluşturabilirsin. Merak etme, üniversite bilgin kayıt sırasında girdiğin adres üzerinden doğru şekilde kaydedilecektir."

Recorded Badge: "Üniversiten: [Tespit Edilen Üniversite Adı]"

Auth CTAs:

Continue with Google

Continue with Apple

Continue with Personal Email

6. Main Application Architecture & Screen Specifications
Bottom Navigation Bar Order (Left to Right):

Profil (Profile)

Keşfet (Explore / Swipe)

Beğeniler (Likes)

Chat (Messages)

6.1 Profile Screen (/profile)
Profile Completion Indicator: Animated circular progress bar displaying completion percentage (%).

Photo Manager: Upload/Delete photo gallery slots. Main photo dynamically set to slot 1.

Editable Categories:

Hakkımda (About Me): Update bio (max 100 chars).

Kimi Arıyorsun? (Looking For):

Preferred match gender choices.

Dating intent/activity choices (max 3).

Tercih Edilen Üniversiteler (Preferred Universities): Prioritizes matches from user's own university by default; filterable.

6.2 Explore Screen (/explore)
Swipe Card Component: High-performance gesture-driven card stack using react-native-reanimated and react-native-gesture-handler.

Card Content Structure (Top to Bottom Scroll):

Main Profile Photo with Overlay: Name, Age, University Name Badge.

Gender, Age, Dating Intent Tags.

Bio (Hakkımda).

Secondary Photos Carousel/List.

Interests & Characteristic Traits Badges.

Swipe Actions:

Swipe Right: Accept / Like

Swipe Left: Reject / Pass

Swipe Limit System:

Rule: 20 swipes max per 12-hour window.

State Storage: Track remaining swipes & expiration timestamp in AsyncStorage.

Limit Reached UI: Disables swipe gestures, displays overlay modal/banner: "Swipe hakkınız bitmiştir. [Geri Sayım Sayacı: HH:MM:SS]". Automatically resets after 12 hours.

6.3 Likes Screen (/likes)
Displays grid/list of users who have swiped right on the current user profile.

Shows profile avatar thumbnail, name, age, and university badge.

Tapping a card opens profile modal or triggers instant match if swiped back.

6.4 Chat Screen (/chat)
Matches Row: Horizontal scrollable avatars of mutual matches.

Conversations List: Active chat threads with match name, last message preview, timestamp, and unread badges.

1-on-1 Chat Interface: Real-time messaging screen supporting text messages and status indicators.

7. Non-Functional Requirements & Performance
Fluid Animations: All card swipes, transitions, and onboarding pages must run at a smooth 60 FPS using native driver / Reanimated.

Offline Resilience: Local data validation prevents state loss during step switches in onboarding.

Strict Validation: Edge cases (underage < 16, non-edu domain, invalid characters in name, over-selection limits) must block progress with friendly inline warnings.
UniMeet için hazırladığım kapsamlı, detaylı ve yapay zeka kodlama asistanlarının (Cursor, Antigravity vb.) sırasıyla eksiksiz uygulayabileceği **PRD (Product Requirements Document)** belgesi aşağıdadır.

Bu belgeyi doğrudan projenin kök dizinine `PRD.md` adıyla kaydedip yapay zekaya kaynak olarak verebilirsin.

---

```markdown
# Product Requirements Document (PRD): UniMeet

## 1. Project Overview & Specs
- **App Name (Store Name):** UniMeet
- **Bundle ID / Package Name:** `com.mgverse.unimeet`
- **Tech Stack:** React Native, Expo (Managed Workflow), TypeScript
- **Target Platform:** iOS only (for initial release)
- **Localization:** Dual-language support (Turkish & English) via `react-i18next` or `expo-localization`. Default language detects device locale, fallback to Turkish.
- **UI/UX Design Direction:** Modern, smooth animations (`react-native-reanimated`, `react-native-gesture-handler`), high-quality Tinder-like interactive swipe gestures, polished onboarding experience.

---

## 2. Technical Dependencies & Permissions Configuration

### 2.1 Required Expo Packages & Native Libraries
- `expo-localization`, `i18next`, `react-i18next`
- `expo-notifications` (Push notification permissions)
- `expo-image-picker` (Gallery permission for photos)
- `@react-native-community/datetimepicker` or `react-native-wheel-pick` (Apple scrollable date picker)
- `react-native-reanimated`, `react-native-gesture-handler`, `moti` (Animations & Swipe cards)
- `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`
- `@react-native-async-storage/async-storage` (Local state & timer management for swipe limits)

### 2.2 Native Permissions Config (`app.json`)
```json
{
  "expo": {
    "name": "UniMeet",
    "slug": "unimeet",
    "ios": {
      "bundleIdentifier": "com.mgverse.unimeet",
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "UniMeet profilinize fotoğraf eklemek ve güncellemek için galeri erişim izni gereklidir.",
        "NSCameraUsageDescription": "UniMeet profilinize doğrudan fotoğraf çekip eklemek için kamera erişimi gereklidir."
      }
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "UniMeet profilinize fotoğraf eklemek için galeri erişim izni istiyoruz."
        }
      ]
    ]
  }
}

```

---

## 3. Localization Architecture (i18n Setup)

Create translation dictionaries (`src/locales/tr.json` and `src/locales/en.json`) covering all UI strings.

* **Example Keys:**
* `onboarding.start_btn`: "Hadi Başlayalım" / "Let's Get Started"
* `auth.edu_email_label`: "Üniversite e-postan nedir?" / "What is your university email?"
* `swipe.limit_reached`: "Swipe hakkınız bitmiştir." / "You've reached your swipe limit."
* `profile.completion`: "Profil Doluluk Oranı" / "Profile Completion Rate"



---

## 4. University Domain Matching Engine (`src/utils/universityDomainMatcher.ts`)

### Logic Requirements:

1. Input field must accept `.edu.tr` or `.edu` extensions.
2. Maintain a comprehensive JSON mapping table of Turkish & global university domain suffixes.
3. Automatically extract the domain from email input (e.g., `mehmetgulhan@ogr.akdeniz.edu.tr` -> `akdeniz.edu.tr` -> "Akdeniz Üniversitesi").
4. Display detected university dynamically on-screen in real-time.
5. Note: The email is **strictly** used to detect and record the university context; account registration proceeds via Google, Apple, or Personal Email in the final step.

---

## 5. User Onboarding & Registration Flow (Step-by-Step)

Strict Navigation Rule: User **cannot** proceed to the next screen without completing the required input/action.

### Step 1: Push Notification Request

* Request push notification permission upon launching the app for the first time.

### Step 2: Interactive Onboarding Carousel (5 Pages)

* **Theme:** "Kampüsünden öğrencilerle tanışmaya ne dersin?"
* 5 interactive, animated onboarding cards (`react-native-reanimated`).
* Interactive elements on cards (tappable dynamic preview components, smooth page indicators).
* **CTA Button at Step 5:** "Hadi Başlayalım" -> Navigates to Email Step.

### Step 3: University Email Input Screen

* **Input:** Text field enforcing `@...edu.tr` or `@...edu`.
* Live Domain Matching Engine displays: `"Tespit Edilen Üniversite: [Üniversite Adı]"`.
* **Validation:** Must be a valid `.edu` / `.edu.tr` address.

### Step 4: Password Creation Screen

* Password input (Min 6 characters) + Password Confirmation input.
* Validation check for match and length.

### Step 5: Profile Photos Screen

* Request Photo Library Permission (`expo-image-picker`).
* Minimum 1 photo required, maximum 5 photos allowed.
* First added photo automatically assigned as the main profile picture.

### Step 6: First Name Input Screen

* Single text input.
* Validation: Letters only (Regex: `^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$`). Numbers and special symbols blocked.

### Step 7: Birth Date Screen

* **Component:** Apple-style iOS scrollable wheel date picker.
* **Age Gate:** Calculated age **must be >= 16 years old**.
* **Dynamic UI Notice:** Displays real-time age badge: `"Şu an [X] yaşındasın"`.
* **Privacy Notice:** "Profilinde doğum tarihin görünmeyecek, yalnızca yaşın gösterilecektir."

### Step 8: Meeting Intent / Activities Screen

* Title: "Ne tür buluşmalar arıyorsun?"
* **Selectable Chips:** Activity Partner, Fun, Dating, Romance, Chat, Events, Friend, Travel, Party, Clubbing, etc.
* **Constraint:** Multi-select allowed, **maximum 3 items**.

### Step 9: Gender Selection Screen

* Options: `Kadın`, `Erkek`, `Diğer`.
* Required selection. Displayed on public profile.

### Step 10: Preferred Match Gender Screen

* Title: "Kimlerle tanışmak istiyorsun?"
* Options: `Kadın`, `Erkek`, `Diğer`.
* **Constraint:** Multi-select allowed. Editable later in profile settings.

### Step 11: Bio / Introduction Screen

* Short bio text input.
* **Constraints:** Mandatory, **maximum 100 characters**. Real-time character counter displayed.

### Step 12: Interests / Hobbies Screen

* Title: "Nelerden hoşlanırsın?"
* Grid of 50+ interest tags (Sports, Tech, Cinema, Gaming, Coffee, Art, Music, etc.).
* **Constraint:** Multi-select allowed, **maximum 5 items**.

### Step 13: Desired Partner Traits Screen (Optional)

* Title: "Karşı tarafta aradığın özellikler"
* Personality traits / characteristics tags (e.g., Funny, Ambitious, Extrovert, Calm, Creative, Listener).
* **Constraint:** Multi-select allowed, **maximum 3 items**. Can be skipped ("Atla").

### Step 14: Final Account Creation Screen

* **Informative Disclaimer (Small Font):**
> "Üniversitenin .edu adreslerinde yaşanan teknik bir sorun nedeniyle hesabını aşağıdaki yollardan biriyle oluşturabilirsin. Merak etme, üniversite bilgin kayıt sırasında girdiğin adres üzerinden doğru şekilde kaydedilecektir."


* **Recorded Badge:** `"Üniversiten: [Tespit Edilen Üniversite Adı]"`
* **Auth CTAs:**
1. Continue with Google
2. Continue with Apple
3. Continue with Personal Email



---

## 6. Main Application Architecture & Screen Specifications

Bottom Navigation Bar Order (Left to Right):

1. **Profil** (Profile)
2. **Keşfet** (Explore / Swipe)
3. **Beğeniler** (Likes)
4. **Chat** (Messages)

---

### 6.1 Profile Screen (`/profile`)

* **Profile Completion Indicator:** Animated circular progress bar displaying completion percentage (%).
* **Photo Manager:** Upload/Delete photo gallery slots. Main photo dynamically set to slot 1.
* **Editable Categories:**
* **Hakkımda (About Me):** Update bio (max 100 chars).
* **Kimi Arıyorsun? (Looking For):**
* Preferred match gender choices.
* Dating intent/activity choices (max 3).


* **Tercih Edilen Üniversiteler (Preferred Universities):** Prioritizes matches from user's own university by default; filterable.



---

### 6.2 Explore Screen (`/explore`)

* **Swipe Card Component:** High-performance gesture-driven card stack using `react-native-reanimated` and `react-native-gesture-handler`.
* **Card Content Structure (Top to Bottom Scroll):**
1. Main Profile Photo with Overlay: Name, Age, University Name Badge.
2. Gender, Age, Dating Intent Tags.
3. Bio (Hakkımda).
4. Secondary Photos Carousel/List.
5. Interests & Characteristic Traits Badges.


* **Swipe Actions:**
* Swipe Right: Accept / Like
* Swipe Left: Reject / Pass


* **Swipe Limit System:**
* **Rule:** 20 swipes max per 12-hour window.
* **State Storage:** Track remaining swipes & expiration timestamp in `AsyncStorage`.
* **Limit Reached UI:** Disables swipe gestures, displays overlay modal/banner: `"Swipe hakkınız bitmiştir. [Geri Sayım Sayacı: HH:MM:SS]"`. Automatically resets after 12 hours.



---

### 6.3 Likes Screen (`/likes`)

* Displays grid/list of users who have swiped right on the current user profile.
* Shows profile avatar thumbnail, name, age, and university badge.
* Tapping a card opens profile modal or triggers instant match if swiped back.

---

### 6.4 Chat Screen (`/chat`)

* **Matches Row:** Horizontal scrollable avatars of mutual matches.
* **Conversations List:** Active chat threads with match name, last message preview, timestamp, and unread badges.
* **1-on-1 Chat Interface:** Real-time messaging screen supporting text messages and status indicators.

---

## 7. Non-Functional Requirements & Performance

1. **Fluid Animations:** All card swipes, transitions, and onboarding pages must run at a smooth 60 FPS using native driver / Reanimated.
2. **Offline Resilience:** Local data validation prevents state loss during step switches in onboarding.
3. **Strict Validation:** Edge cases (underage < 16, non-edu domain, invalid characters in name, over-selection limits) must block progress with friendly inline warnings.

```

---

### Tavsiye Edilen Geliştirme Sırası (Roadmap)
1. Projeyi `npx create-expo-app UniMeet --template blank-typescript` ile oluştur.
2. `app.json` ve izin ayarlarını bu PRD'deki gibi ekle.
3. `react-i18next` paketini kurup TR/EN çeviri dosyalarını bağla.
4. Onboarding ekranlarını ve adım sınırlamalarını (Step 1 - 14) sırayla inşa et.
5. `AsyncStorage` tabanlı 12 saatlik / 20 swipe sınırlama mantığını ve Reanimated swipe kartlarını `Keşfet` ekranında tamamla.

```