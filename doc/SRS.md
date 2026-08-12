# SRS (Software Requirements Specification)
## প্রজেক্ট: কৃষি ই-কমার্স প্ল্যাটফর্ম (AgriBazar)

**প্রকল্পের সংস্করণ:** 1.0.0
**প্রস্তুতের তারিখ:** ২০২৬-০৮-১২

---

## ১. ভূমিকা (Introduction)

### ১.১ উদ্দেশ্য
এই ডকুমেন্টটি **"AgriBazar"** নামক একটি কৃষি-ভিত্তিক ই-কমার্স ওয়েবসাইটের সম্পূর্ণ ব্লুপ্রিন্ট। এই প্ল্যাটফর্মের মূল উদ্দেশ্য হলো কৃষক/বিক্রেতা এবং সাধারণ ক্রেতাদের মধ্যে সরাসরি ডিজিটাল সংযোগ স্থাপন করা। ক্রেতারা এখানে তাজা শাকসবজি, ফল, মাছ-মাংস, দুগ্ধজাত পণ্য এবং কৃষি উপকরণ (বীজ, সার) খুব সহজেই কিনতে পারবেন।

### ১.২ লক্ষ্য ব্যবহারকারী (User Roles)
প্ল্যাটফর্মে মূলত ৩ ধরনের ব্যবহারকারী থাকবে। কিন্তু ডেভেলপমেন্টের সুবিধার্থে আমরা কার্যকারিতা ভাগ করছি:

১. **ক্রেতা (Buyer/Guest):** সাধারণ দর্শক বা নিবন্ধিত ক্রেতা। শুধুমাত্র পণ্য দেখা, কার্টে যোগ করা ও অর্ডার করা—এই ফ্লোতে অংশ নেবেন। (ড্যাশবোর্ড থাকবে না)।
২. **বিক্রেতা (Seller/Farmer):** যিনি পণ্য বিক্রি করবেন। তার জন্য পৃথক ড্যাশবোর্ড থাকবে।
৩. **অ্যাডমিন (Admin):** পুরো প্ল্যাটফর্মের তত্ত্বাবধায়ক (ক্যাটাগরি অ্যাপ্রুভ, কন্টেন্ট ম্যানেজ ইত্যাদি - তবে এই SRS-এ অ্যাডমিন প্যানেলের বিস্তারিত রাখা হয়নি, শুধু ব্যাক-এন্ডের রিলেশনাল ডেটা মেইনটেইন করা হবে)।

---

## ২. প্রযুক্তি স্ট্যাক (Technology Stack)

**ফ্রন্টএন্ড (Frontend):**
- **Framework/Library:** React.js (Vite ব্যবহার করে বিল্ড করা হবে)।
- **Styling:** Tailwind CSS (Utility-first, মোবাইল-ফ্রেন্ডলি)।
- **Language:** TypeScript (স্ট্রং টাইপিংয়ের জন্য)।
- **State Management:** Redux Toolkit (কার্ট, অথেন্টিকেশন স্টেট এবং ফিল্টার ম্যানেজ করার জন্য)।~~
- **Routing:** React Router DOM v6।

**ব্যাকএন্ড (Backend):**
- **Runtime:** Node.js।
- **Framework:** Express.js।
- **Language:** TypeScript।
- **API Design:** RESTful API।

**ডেটাবেস (Database):**
- **DBMS:** PostgreSQL।
- **ORM/Query Builder:** Prisma (TypeScript এর সাথে সহজ ইন্টিগ্রেশনের জন্য)।

**অতিরিক্ত টুলস (Third-party Services):**
- **Authentication:** JWT (HttpOnly Cookie তে সংরক্ষিত)।
- **Payment Gateway:** SSLCommerz / Stripe (পরবর্তীতে bKash সংযোগ)।
- **Image Hosting:** Cloudinary (পণ্যের ছবি আপলোডের জন্য)।
- **Version Control:** Git + GitHub।

---

## ৩. পৃষ্ঠার তালিকা (Total Pages & Sections)

ডেভেলপারদের জন্য গুরুত্বপূর্ণ: পুরো ওয়েবসাইটে ক্রেতার জন্য **৬টি** পাবলিক পৃষ্ঠা এবং বিক্রেতার জন্য **১টি** প্রাইভেট ড্যাশবোর্ড থাকবে।

| # | পৃষ্ঠার নাম (Page Name) | URL রুট (Route) | অ্যাক্সেস লেভেল |
| :--- | :--- | :--- | :--- |
| ১ | হোম পেজ (Home) | `/` | পাবলিক |
| ২ | পণ্যের তালিকা (Shop/Listing) | `/shop` | পাবলিক |
| ৩ | পণ্যের বিবরণ (Product Details) | `/product/:id` | পাবলিক |
| ৪ | শপিং কার্ট (Cart) | `/cart` | পাবলিক (লগইন ছাড়াও) |
| ৫ | চেকআউট (Checkout) | `/checkout` | **প্রাইভেট** (লগইন প্রয়োজন) |
| ৬ | অর্ডার সফল (Order Success) | `/order/success/:id` | **প্রাইভেট** (লগইন প্রয়োজন) |
| ৭ | সেলার ড্যাশবোর্ড (Seller Dashboard) | `/seller/*` | **প্রাইভেট** (শুধুমাত্র Seller রোল) |

> **লগইন/রেজিস্টার:** আলাদা পৃষ্ঠা থাকবে না। এটি একটি **মডাল (Modal)** আকারে তৈরি করতে হবে, যা যেকোনো পৃষ্ঠা থেকে খোলা যাবে।

---

## ৪. পাবলিক পৃষ্ঠাসমূহের বিস্তারিত সেকশন (Public Pages Breakdown)

### ৪.১ হোম পেজ (Home Page - `/`)
ওয়েবসাইটের ল্যান্ডিং পেজ। দ্রুত ব্রাউজিং ও আবিষ্কারের জন্য ডিজাইন করতে হবে।

- **Navbar (স্টিকি টপবার):**
  - ব্র্যান্ড লোগো (AgriBazar)।
  - প্রোডাক্ট সার্চ বার (পণ্যের নাম বা ক্যাটাগরি দিয়ে খোঁজার অপশন)।
  - লোকেশন সিলেক্টর (ড্রপডাউন - জেলা নির্বাচন করুন, স্থানীয় পণ্য দেখানোর জন্য)।
  - কার্ট আইকন (পাশে মোট আইটেমের কাউন্টার দেখাতে হবে - Redux থেকে নিতে হবে)।
  - **লগইন/সাইনআপ বাটন** (ক্লিক করলে মডাল ওপেন হবে)।
- **হিরো সেকশন (Hero Banner):**
  - স্লাইডিং ব্যানার (মৌসুমি অফার, নতুন ফসলের আগমন, ফ্ল্যাশ সেল)।
- **ক্যাটাগরি এক্সপ্লোর (Category Grid):**
  - আইকন ও নাম সহ ৬টি প্রধান ক্যাটাগরি (শাকসবজি, ফলমূল, মাছ-মাংস, দুগ্ধজাত, বীজ ও সার, কৃষি যন্ত্রাংশ)।
- **ফিচার্ড প্রোডাক্টস (Featured Products):**
  - হোমপেজে ৮টি জনপ্রিয়/নির্বাচিত পণ্য কার্ড আকারে দেখাতে হবে।
  - প্রতিটি কার্ডে থাকবে: ছবি, নাম, দাম, রেটিং, **"কার্টে যোগ করুন"** বাটন।
- **ফ্ল্যাশ সেল (Flash Sale - ঐচ্ছিক):**
  - নির্দিষ্ট সময়ের জন্য ছাড়ের পণ্য, কাউন্টডাউন টাইমার সহ।
- **ফুটার (Footer):**
  - কোম্পানি সম্পর্কে, যোগাযোগ, ডেলিভারি পলিসি, রিটার্ন পলিসি, পেমেন্ট গেটওয়ের লোগো ও সোশ্যাল মিডিয়া লিংক।

---

### ৪.২ পণ্যের তালিকা পেজ (Shop/Listing - `/shop`)
সকল পণ্য ব্রাউজ ও ফিল্টার করার স্থান।

- **ব্রেডক্রাম্ব (Breadcrumb):** `হোম > ক্যাটাগরি > সাব-ক্যাটাগরি` (ডায়নামিক)।
- **বাম পাশের সাইডবার (Filters):**
  - **ক্যাটাগরি ফিল্টার:** চেকবক্স আকারে।
  - **দামের রেঞ্জ:** রেঞ্জ স্লাইডার (মিন-ম্যাক্স)।
  - **রেটিং:** ১ থেকে ৫ তারকা ফিল্টার।
  - **ডেলিভারি লোকেশন:** জেলা ভিত্তিক ড্রপডাউন (স্থানীয় পণ্য খুঁজতে)।
- **ডান পাশের কন্টেন্ট এরিয়া:**
  - **সর্টিং অপশন:** ড্রপডাউন (`জনপ্রিয়তা`, `কম দাম`, `বেশি দাম`, `নতুন সংযোজন`)।
  - **প্রোডাক্ট গ্রিড:** ৩ বা ৪ কলামে পণ্যের কার্ড দেখাতে হবে।
  - **পেজিনেশন:** নিচে পৃষ্ঠা নম্বর (`1, 2, 3 ...`) অথবা "লোড মোর" বাটন।

---

### ৪.৩ পণ্যের বিবরণ পেজ (Product Details - `/product/:id`)
পণ্যের সম্পূর্ণ তথ্য ও কেনাকাটার প্রধান স্থান।

- **ইমেজ গ্যালারি:**
  - বড় প্রিভিউ ইমেজ + নিচে থাম্বনেইল স্লাইডার।
  - জুম ইন/আউট করার সুবিধা (Hover বা ক্লিক)।
- **পণ্যের তথ্য:**
  - পণ্যের নাম ও SKU আইডি।
  - মূল্য (বর্তমান দাম ও আগের দাম থাকলে স্ট্রাইকথ্রু)।
  - ইউনিট (কেজি/গ্রাম/পিস) ও স্টক স্ট্যাটাস (`In Stock` / `Out of Stock`)।
  - রেটিং সামারি (গড় রেটিং ও মোট রিভিউ সংখ্যা)।
- **অ্যাকশন বাটন:**
  - **পরিমাণ নির্বাচক (Quantity):** `+` ও `-` বাটন সহ ইনপুট ফিল্ড (ন্যূনতম ১)।
  - **"কার্টে যোগ করুন"** (প্রাথমিক বাটন)।
  - **"এখনই কিনুন"** (সেকেন্ডারি বাটন - সরাসরি চেকআউটে নিয়ে যাবে)।
- **বিবরণ ও তথ্য:**
  - পণ্যের বিস্তারিত বিবরণ (কীভাবে উৎপন্ন, সংরক্ষণ পদ্ধতি)।
- **বিক্রেতার তথ্য (Seller Info):** নাম ও লোকেশন (শুধু ইনফো, ড্যাশবোর্ডে যাওয়ার লিংক ছাড়া)।
- **রিভিউ সেকশন:**
  - অন্যান্য ক্রেতাদের রিভিউ ও রেটিং দেখানো।
  - লগইন করা ক্রেতারা নতুন রিভিউ লেখার ফর্ম পাবেন।
- **সিমিলার প্রোডাক্টস:** একই ক্যাটাগরির অন্যান্য পণ্য (ক্যারোসেল আকারে)।

---

### ৪.৪ শপিং কার্ট পেজ (Cart - `/cart`)
ক্রেতা কেনাকাটা চূড়ান্ত করার আগে এখানে পণ্য দেখে নেবেন।

- **কার্ট আইটেমের তালিকা:**
  - প্রতিটি পণ্যের জন্য: ছবি, নাম, ইউনিট দাম, কোয়ান্টিটি পরিবর্তনের অপশন, এবং **"রিমুভ"** (Remove) বাটন।
  - কোয়ান্টিটি পরিবর্তন করলে সাথে সাথে দাম আপডেট হবে (Redux-এর মাধ্যমে)।
- **প্রাইস সামারি (কার্ট সামারি কার্ড):**
  - সাবটোটাল (মোট পণ্যের দাম)।
  - ডেলিভারি চার্জ (লোকেশন অনুযায়ী ভিন্ন হতে পারে)।
  - আনুমানিক কর (VAT)।
  - **মোট মূল্য (Grand Total)** (বড় ও সাহসী ফন্টে)।
- **কুপন কোড:**
  - ইনপুট ফিল্ড ও "Apply" বাটন (কুপন যাচাইয়ের জন্য API কল)।
- **অ্যাকশন বাটন:**
  - "শপিং চালিয়ে যান" (হোমপেজে)।
  - **"চেকআউটে যান"** (Proceed to Checkout) - ক্লিক করলে চেকআউটে যাবে, কিন্তু আগে লগইন চেক করবে।

---

### ৪.৫ চেকআউট পেজ (Checkout - `/checkout`)
**প্রয়োজনীয়তা:** এই পৃষ্ঠাটি দেখতে হলে ইউজারকে অবশ্যই লগইন করতে হবে (Route Guard প্রয়োগ করতে হবে)।

- **ডেলিভারি ঠিকানা ফর্ম:**
  - প্রাপকের নাম, মোবাইল নম্বর, জেলা (ড্রপডাউন), উপজেলা/থানা, বিস্তারিত ঠিকানা।
- **ডেলিভারি স্লট:**
  - রেডিও বাটন: `সকাল (৮-১২টা)` অথবা `বিকাল (২-৬টা)` (কৃষি পণ্যের তাজা রাখতে)।
- **অর্ডার সামারি (Order Summary):**
  - কার্টের সব পণ্যের নাম, পরিমাণ ও দামের সংক্ষিপ্ত তালিকা (ক্রেতা শেষবার দেখে নিতে পারবে)।
- **পেমেন্ট মেথড:**
  - **ক্যাশ অন ডেলিভারি (COD)** - ডিফল্ট সিলেক্টেড।
  - **অনলাইন পেমেন্ট** (বিকাশ/নগদ/ক্রেডিট কার্ড - SSLCommerz ইন্টিগ্রেশন)।
- **"অর্ডার কনফর্ম করুন" (Place Order) বাটন:** চাপ দিলে অর্ডার তৈরি হবে এবং ইনভয়েস জেনারেট হবে।

---

### ৪.৬ অর্ডার সফল পেজ (Order Success - `/order/success/:id`)
অর্ডার সম্পন্ন হওয়ার পরে রিডাইরেক্ট করবে।

- **সাফল্যের বার্তা:** বড় সবুজ চেকমার্ক (`✔`) ও "অর্ডার সফল হয়েছে!" টেক্সট।
- **অর্ডার নম্বর:** ইউনিক অর্ডার আইডি (বড় করে দেখাতে হবে)।
- **আনুমানিক ডেলিভারি তারিখ:** (বর্তমান সময় + ২/৩ দিন)।
- **অ্যাকশন বাটন:** **"আরও কেনাকাটা করুন"** (হোমপেজে রিডাইরেক্ট করবে)।

---

## ৫. সেলার ড্যাশবোর্ড (Seller Dashboard) - প্রাইভেট প্যানেল

**URL বেজ:** `/seller`
**অ্যাক্সেস কন্ট্রোল:** শুধুমাত্র `role = "seller"` যুক্ত ইউজাররা প্রবেশ করতে পারবেন। অন্যরা (ক্রেতা) প্রবেশ করলে হোমপেজে রিডাইরেক্ট হবে।

### ৫.১ লেআউট (Layout)
- **সাইডবার (Sidebar):** বাম পাশে স্থির থাকবে।
- **কন্টেন্ট এরিয়া:** ডান পাশে সাইডবারের আইটেম অনুযায়ী পরিবর্তন হবে।

**সাইডবার মেনু আইটেমসমূহ:**
1. ড্যাশবোর্ড (Dashboard)
2. আমার পণ্য (My Products)
3. নতুন পণ্য যোগ করুন (Add Product)
4. অর্ডার ব্যবস্থাপনা (Orders)
5. প্রোফাইল সেটিংস (Settings)

---

### ৫.২ সেকশন ১: ড্যাশবোর্ড ওভারভিউ (Dashboard)
- **স্ট্যাটিস্টিক্স কার্ড:** ৪টি কার্ড (মোট পণ্য, মোট অর্ডার, মোট আয়, পেন্ডিং অর্ডার)।
- **সাম্প্রতিক অর্ডার লিস্ট:** সর্বশেষ ৫টি অর্ডারের ছোট টেবিল (অর্ডার আইডি, ক্রেতা, টাকা, স্ট্যাটাস)।
- **লো স্টক অ্যালার্ট:** যেসব পণ্যের স্টক ৫ বা তার কম, সেগুলোর তালিকা।

### ৫.৩ সেকশন ২: আমার পণ্য (My Products)
- ডেটা টেবিল (পণ্যের ছবি, নাম, দাম, স্টক, স্ট্যাটাস)।
- **অ্যাকশন:** `এডিট` (পেন্সিল), `ডিলিট` (ট্র্যাশ), `স্টক টগল` (Active/Inactive সুইচ)।
- উপরে সার্চ বার ও ক্যাটাগরি ফিল্টার থাকবে।

### ৫.৪ সেকশন ৩: নতুন পণ্য যোগ করুন (Add Product)
- **ফর্ম ফিল্ডসমূহ:**
  - পণ্যের নাম (টেক্সট)
  - ক্যাটাগরি (ড্রপডাউন)
  - মূল্য (নাম্বার)
  - ইউনিট (ড্রপডাউন: কেজি, গ্রাম, পিস, লিটার)
  - স্টক পরিমাণ (নাম্বার)
  - বিবরণ (Textarea)
  - লোকেশন (জেলা + থানা ড্রপডাউন)
  - ছবি আপলোড (Drag & Drop - একাধিক ফাইল, Primary ছবি সেট করার অপশন)।
- **সাবমিট বাটন:** "পণ্য সংরক্ষণ করুন"।

### ৫.৫ সেকশন ৪: অর্ডার ব্যবস্থাপনা (Orders)
- **ট্যাব ফিল্টার:** `All`, `Pending`, `Processing`, `Shipped`, `Delivered`।
- **অর্ডার টেবিল:** অর্ডার আইডি, ক্রেতার নাম, মোট মূল্য, তারিখ, স্ট্যাটাস (বড় ট্যাগ)।
- **অ্যাকশন (ভিউ/আপডেট):** একটি বাটনে ক্লিক করলে সাইড ড্রয়ার বা মডাল খুলবে।
  - মডালে ক্রেতার ঠিকানা ও পণ্যের লিস্ট দেখাবে।
  - স্ট্যাটাস আপডেট করার ড্রপডাউন থাকবে (`Processing` -> `Shipped` -> `Delivered`)।
  - "Delivered" করলে ঐ অর্ডারের টাকা সেলারের অ্যাকাউন্টে যোগ হবে।

### ৫.৬ সেকশন ৫: প্রোফাইল সেটিংস (Settings)
- দোকানের নাম, ঠিকানা, ফোন নম্বর আপডেট করার ফর্ম।
- পাসওয়ার্ড পরিবর্তনের ফর্ম (পুরনো + নতুন পাসওয়ার্ড)।
- পেমেন্ট ইনফো (বিকাশ/নগদ নম্বর) যোগ করার অপশন (ঐচ্ছিক)।

---

## ৬. ডেটাবেজ মডেল (Database Schema - PostgreSQL)

**Prisma Schema এর ডিফল্ট মডেলসমূহ:**

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  phone         String
  passwordHash  String
  role          Role      @default(BUYER) // BUYER, SELLER, ADMIN
  location      String?   // জেলা
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  cartItems     CartItem[]
  orders        Order[]
  reviews       Review[]
  sellerProfile SellerProfile?
}

model SellerProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  farmName    String
  farmAddress String
  bio         String?
  paymentInfo String?   // বিকাশ/নগদ নম্বর
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  products    Product[]
}

model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  imageUrl    String?
  parentId    String?  // সাব-ক্যাটাগরির জন্য
  parent      Category? @relation("CategoryToCategory", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryToCategory")
  products    Product[]
  createdAt   DateTime @default(now())
}

model Product {
  id          String   @id @default(cuid())
  sellerId    String
  seller      SellerProfile @relation(fields: [sellerId], references: [id])
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  name        String
  description String
  price       Float
  unit        Unit     @default(KG) // KG, GRAM, PCS, LITER
  stock       Int
  isOrganic   Boolean  @default(false)
  location    String   // উৎপত্তি স্থান
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  images      ProductImage[]
  cartItems   CartItem[]
  orderItems  OrderItem[]
  reviews     Review[]
}

model ProductImage {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  url         String   // Cloudinary URL
  isPrimary   Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model CartItem {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  quantity    Int
  addedAt     DateTime @default(now())
}

model Order {
  id            String       @id @default(cuid())
  userId        String
  user          User         @relation(fields: [userId], references: [id])
  orderDate     DateTime     @default(now())
  totalAmount   Float
  deliveryAddress String
  deliverySlot  DeliverySlot // MORNING, AFTERNOON
  paymentMethod PaymentMethod // COD, ONLINE
  paymentStatus PaymentStatus // PENDING, PAID
  orderStatus   OrderStatus  // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  trackingId    String?      // কুরিয়ার ট্র্যাকিং
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  items         OrderItem[]
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  quantity    Int
  priceAtTime Float    // অর্ডারের সময়কার দাম
}

model Review {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  rating      Int      // 1-5
  comment     String?
  createdAt   DateTime @default(now())
}

// Enums
enum Role { BUYER SELLER ADMIN }
enum Unit { KG GRAM PCS LITER }
enum DeliverySlot { MORNING AFTERNOON }
enum PaymentMethod { COD ONLINE }
enum PaymentStatus { PENDING PAID }
enum OrderStatus { PENDING PROCESSING SHIPPED DELIVERED CANCELLED }