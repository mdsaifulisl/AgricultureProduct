# 🗄️ প্রিজমা ডাটাবেস চিট শিট (Prisma Database Cheat Sheet)

## ১. স্কিমা এবং ক্লায়েন্ট আপডেট (Schema & Client Updates)
* `npx prisma generate` - `schema.prisma` ফাইলে কোনো পরিবর্তন করার পর প্রিজমা ক্লায়েন্ট নতুন করে জেনারেট করার জন্য।
* `npx prisma format` - `schema.prisma` ফাইলের কোড ও ইন্ডেন্টেশন স্বয়ংক্রিয়ভাবে সুন্দর ও নিখুঁত করার জন্য।
* `npx prisma validate` - স্কিমা ফাইলে কোনো ভুল বা সিনট্যাক্স এরর আছে কিনা তা পরীক্ষা করার জন্য।

## ২. ডাটাবেস সিঙ্ক এবং মাইগ্রেশন (Database Sync & Migrations)
* `npx prisma db push` - ডেভেলপমেন্টের সময় স্কিমার পরিবর্তনগুলো সরাসরি পোস্টগ্রেএসকিউএল ডাটাবেসে পাঠাতে/সিঙ্ক করতে।
* `npx prisma migrate dev --name <migration_name>` - প্রডাকশনের উপযোগী মাইগ্রেশন ফাইল তৈরি এবং ডাটাবেসে অ্যাপ্লাই করার জন্য।
* `npx prisma db pull` - বিদ্যমান কোনো ডাটাবেস থেকে টেবিলগুলোর স্কিমা টেনে এনে `schema.prisma` ফাইলে বসাতে।

## ৩. ডাটাবেস জিইউআই এবং সিডিং (Database GUI & Seeding)
* `npx prisma studio` - ব্রাউজারে একটি সুন্দর ভিজ্যুয়াল ডাটাবেস ইন্টারফেস ওপেন করতে (http://localhost:5555)।
* `npx prisma db seed` - ডাটাবেসে প্রাথমিক বা ফেক টেস্ট ডাটা যুক্ত (Insert) করার জন্য।

