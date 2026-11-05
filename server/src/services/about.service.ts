import { PrismaClient } from '@prisma/client';
import { deleteLocalFile } from '../utils/file.util.js';

const prisma = new PrismaClient();

// ১. About Section এর তথ্য ডাটাবেজ থেকে নিয়ে আসা
export const getAboutData = async () => {
  let about = await prisma.aboutSetting.findFirst();

  // যদি প্রথমবার ডাটাবেজে কোনো রেকর্ড না থাকে, তবে ডিফল্ট রেকর্ড ক্রিয়েট করবে
  if (!about) {
    about = await prisma.aboutSetting.create({
      data: {
        imageUrl: '',
        badgeTitle: 'সেরা কৃষি ই-কমার্স',
        badgeSubtitle: 'গ্রাহক সন্তুষ্টি ও নির্ভরযোগ্যতায়',
        tagline: 'আমাদের মূল লক্ষ্য',
        title: 'আমরা কীভাবে বাজারে একটি ইতিবাচক পরিবর্তন আনছি?',
        description:
          'প্রচলিত বাজার ব্যবস্থায় কৃষকরা কঠোর পরিশ্রম করেও উপযুক্ত মূল্য পান না, অন্যদিকে ভোক্তারা অতিরিক্ত দামে রাসায়নিক যুক্ত অস্বাস্থ্যকর খাবার কিনে থাকেন। ReliableKrishi এই সমস্যার স্থায়ী সমাধান নিয়ে এসেছে।',
        features: [
          'কৃষক থেকে সরাসরি সংগৃহীত তাজা ফল, সবজি ও বীজ',
          'মধ্যস্বত্বভোগী মুক্ত স্বচ্ছ মূল্য নির্ধারণ ব্যবস্থা',
          'পরিবেশবান্ধব ও সুনির্দিষ্ট মানের প্যাকিং ব্যবস্থা',
          '২৪/৭ ডেডিকেটেড কাস্টমার সাপোর্ট সার্ভিস',
        ],
        buttonText: 'পণ্যসমূহ দেখুন',
        buttonLink: '/shop',
      },
    });
  }

  return about;
};

// ২. About Section এর তথ্য আপডেট করা
export const updateAboutData = async (payload: any) => {
  // payload থেকে images আলাদা করে আসল ডাটাগুলো dataToUpdate এ নেওয়া হচ্ছে
  const { images, ...dataToUpdate } = payload;

  const existingAbout = await prisma.aboutSetting.findFirst();

  if (existingAbout) {
    // যদি নতুন কোনো imageUrl পাঠানো হয় এবং পূর্বে একটি ভিন্ন imageUrl ডাটাবেজে থেকে থাকে
    if (
      dataToUpdate.imageUrl &&
      existingAbout.imageUrl &&
      dataToUpdate.imageUrl !== existingAbout.imageUrl
    ) {
      // পুরনো ছবি ফাইল সিস্টেম থেকে ডিলিট করা হচ্ছে
      deleteLocalFile(existingAbout.imageUrl);
    }

    return await prisma.aboutSetting.update({
      where: { id: existingAbout.id },
      data: dataToUpdate,
    });
  } else {
    return await prisma.aboutSetting.create({
      data: dataToUpdate,
    });
  }
};