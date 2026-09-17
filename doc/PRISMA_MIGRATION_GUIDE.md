# Prisma Essential Commands Cheatsheet

Prisma নিয়ে কাজ করার সময় ডেভেলপমেন্ট, ডাটাবেজ আপডেট, ট্রাবলশুটিং এবং প্রোডাকশনে যে যে কমান্ডগুলো প্রয়োজন হয়, তার একটি সম্পূর্ণ তালিকা নিচে দেওয়া হলো।

---

## ১. প্রজেক্ট সেটআপ ও ইনিশিয়ালাইজেশন (Initial Setup)

* **Prisma প্রজেক্টে যুক্ত করা:**
  ```bash
  npm install prisma --save-dev
  npm install @prisma/client
  ```

* **Prisma ইনিশিয়ালাইজ করা:**
  ```bash
  npx prisma init
  ```
  *(এটি আপনার প্রজেক্টে `prisma/schema.prisma` ফাইল এবং `.env` ফাইল তৈরি করে দেবে।)*

* **নির্দিষ্ট ডাটাবেজ সহ ইনিশিয়ালাইজ করা (যেমন: PostgreSQL / MySQL):**
  ```bash
  npx prisma init --datasource-provider postgresql
  ```

---

## ২. মাইগ্রেশন ও ডাটাবেজ আপডেট (Migration & Database Updates)

* **ডেভেলপমেন্টে মাইগ্রেশন চালানো (নতুন ফাইল তৈরি + ডাটাবেজ আপডেট + Client জেনারেট):**
  ```bash
  npx prisma migrate dev --name <migration_name>
  ```
  *উদাহরণ:* `npx prisma migrate dev --name init_order_schema`

* **মাইগ্রেশন ফাইল তৈরি না করে সরাসরি ডাটাবেজে স্কিমা পুশ করা (Fast Prototyping/Testing):**
  ```bash
  npx prisma db push
  ```
  *(এটি মাইগ্রেশন হিস্ট্রি রাখে না। দ্রুত ডাটাবেজের টেবিল স্ট্রাকচার টেস্ট করার জন্য দরকারী।)*

* **প্রোডাকশন/লাইভ সার্ভারে মাইগ্রেশন চালানো:**
  ```bash
  npx prisma migrate deploy
  ```
  *(এটি গিটহাবে পুশ হওয়া পূর্বের সব পেন্ডিং মাইগ্রেশন ফাইল প্রোডাকশন ডাটাবেজে সেফলি অ্যাপ্লাই করে।)*

* **মাইগ্রেশন স্ট্যাটাস চেক করা:**
  ```bash
  npx prisma migrate status
  ```
  *(ডাটাবেজ এবং মাইগ্রেশন ফোল্ডারের মধ্যে কোনো অমিল বা পেন্ডিং মাইগ্রেশন আছে কিনা তা দেখার জন্য।)*

---

## ৩. প্রিসমা ক্লায়েন্ট জেনারেট করা (Client Generation)

* **Prisma Client আপডেট করা:**
  ```bash
  npx prisma generate
  ```
  *কখন লাগবে:* `schema.prisma` তে কোনো পরিবর্তন করার পর বা নতুন কোনো প্যাকেজ ইন্সটল করার পর আপনার কোডে TypeScript Type অটোকমপ্লিট পাওয়ার জন্য এটি চালাতে হয়।

---

## ৪. প্রিসমা স্টুডিও ও ডাটা ম্যানেজমেন্ট (GUI & Data Management)

* **Prisma Studio (Visual GUI) চালু করা:**
  ```bash
  npx prisma studio
  ```
  *(এটি ব্রাউজারে `http://localhost:5555` এ আপনার ডাটাবেজের সব টেবিল ও ডাটা সরাসরি দেখা, এডিট করা ও নতুন ডাটা যোগ করার সুন্দর ইন্টারফেস ওপেন করে।)*

* **বিদ্যমান ডাটাবেজ থেকে স্কিমা রিভার্স ইঞ্জিনিয়ারিং করা (Pull Schema from DB):**
  ```bash
  npx prisma db pull
  ```
  *(আগে থেকে তৈরি থাকা ডাটাবেজ থেকে সরাসরি `schema.prisma` তৈরি করার জন্য ব্যবহার করা হয়।)*

* **ডাটাবেজে সিড (Seed/Dummy Data) পুশ করা:**
  ```bash
  npx prisma db seed
  ```
  *(ডেভেলপমেন্টের জন্য প্রাথমিক টেস্ট ডাটা ডাটাবেজে ভরার জন্য।)*

---

## ৫. ফরম্যাটিং, ভ্যালিডেশন ও ট্রাবলশুটিং (Formatting & Troubleshooting)

* **`schema.prisma` ফাইল রিডঅ্যাবল ও ফরম্যাট করা:**
  ```bash
  npx prisma format
  ```
  *(স্কিমা ফাইলে স্পেস বা ইন্ডেন্টেশন এলোমেলো হলে এটি সুন্দর করে সাজিয়ে দেয়।)*

* **স্কিমা ফাইলে কোনো ভুল আছে কিনা চেক করা:**
  ```bash
  npx prisma validate
  ```

* **ডাটাবেজ সম্পূর্ণ রিসেট করা (Warning: All data will be deleted):**
  ```bash
  npx prisma migrate reset
  ```
  *(লোকাল ডাটাবেজের সব ডাটা ও টেবিল ডিলিট করে আবার শুরু থেকে সব মাইগ্রেশন নতুন করে অ্যাপ্লাই করে।)*

---

## ৬. প্রোডাকশন ডেপ্লয়মেন্ট চেকলিস্ট (Production Deployment Commands)

প্রোডাকশন সার্ভারে (Vercel/Render/VPS) বিল্ড দেওয়ার সময় যে কমান্ডগুলো সিকোয়েন্সিয়ালি চালাতে হয়:

```bash
# ১. প্রিসমা ক্লায়েন্ট জেনারেট করা
npx prisma generate

# ২. পেন্ডিং মাইগ্রেশনগুলো প্রোডাকশন ডাটাবেজে অ্যাপ্লাই করা
npx prisma migrate deploy
```

---

## ৭. `npx prisma migrate dev` vs `npx prisma migrate deploy`

| বৈশিষ্ট্য / কাজ | `npx prisma migrate dev` | `npx prisma migrate deploy` |
| :--- | :--- | :--- |
| **ব্যবহারের স্থান** | Local / Development Environment | Production / Staging Server |
| **নতুন SQL ফাইল তৈরি** | হ্যাঁ (যদি স্কিমায় পরিবর্তন থাকে) | না (বিদ্যমান ফাইল রান করে) |
| **Prisma Client Regeneration** | অটোমেটিক রান হয় | রান হয় না (আলাদা `npx prisma generate` চালাতে হয়) |
| **ইউজার ইনপুট (Prompts)** | প্রয়োজন অনুযায়ী প্রশ্ন করতে পারে | কোনো ইনপুট নেয় না (Non-interactive) |
| **প্রধান উদ্দেশ্য** | পরিবর্তনগুলো ড্রাফট ও ট্র্যাক করা | পরিবর্তনগুলো প্রোডাকশনে অ্যাপ্লাই করা |

---

## আদর্শ ডেভলপমেন্ট ওয়ার্কফ্লো (Standard Workflow)

১. **লোকাল কম্পিউটারে কাজ শুরু:**
   ```bash
   # schema.prisma এ পরিবর্তন করার পর
   npx prisma migrate dev --name init_order_schema
   ```

২. **গিটহাবে কোড পুশ:**
   ```bash
   git add .
   git commit -m "feat: added order migration"
   git push origin main
   ```
   *(অবশ্যই `prisma/migrations` ফোল্ডারসহ গিটহাবে পুশ করবেন)*

৩. **প্রোডাকশন বা লাইভ সার্ভারে:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy