import React, { useState, useMemo } from "react";
import { Play, Search, Clock, Eye, Video, Sparkles, X } from "lucide-react";
import { type VideoItem } from '../../../types/index';
// --- TYPES ---
// export interface VideoItem {
//   id: string;
//   title: string;
//   description: string;
//   youtubeId: string;
//   category: string;
//   duration: string;
//   views: string;
//   createdAt: string | Date;
//   featured?: boolean;
// }

// --- HELPER FUNCTIONS ---

// ১. ইংরেজি সংখ্যাকে বাংলায় রূপান্তর করার ফাংশন
const toBanglaDigits = (num: number | string): string => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .replace(/\d/g, (digit) => banglaDigits[parseInt(digit, 10)]);
};

// ২. ISO Date String/Date থেকে বাংলায় Relative Time প্রসেস করার ফাংশন
// eslint-disable-next-line react-refresh/only-export-components
export const formatRelativeTime = (dateInput: string | Date): string => {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(date.getTime()) || diffInSeconds < 0) return "কিছুক্ষণ আগে";

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (diffInSeconds < 60) {
    return "কিছুক্ষণ আগে";
  } else if (minutes < 60) {
    return `${toBanglaDigits(minutes)} মিনিট আগে`;
  } else if (hours < 24) {
    return `${toBanglaDigits(hours)} ঘণ্টা আগে`;
  } else if (days < 30) {
    return `${toBanglaDigits(days)} দিন আগে`;
  } else if (months < 12) {
    return `${toBanglaDigits(months)} মাস আগে`;
  } else {
    return `${toBanglaDigits(years)} বছর আগে`;
  }
};

// ৩. YouTube URL অথবা ID থেকে সঠিক ১১ ডিজিটের Video ID বের করার ফিক্সড ফাংশন
const getYoutubeId = (urlOrId: string): string => {
  if (!urlOrId) return "";
  const trimmed = urlOrId.trim();

  if (
    trimmed.length === 11 &&
    !trimmed.includes("/") &&
    !trimmed.includes(".")
  ) {
    return trimmed;
  }

  const regExp =
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);

  return match && match[1].length === 11 ? match[1] : trimmed;
};

// --- CATEGORIES ---
const CATEGORIES = [
  "সব ভিডিও",
  "কৃষি টিউটোরিয়াল",
  "পণ্য রিভিউ",
  "সার ও কীটনাশক",
  "আধুনিক প্রযুক্তি",
  "কৃষক সাফল্য",
];

// --- MOCK DATABASE DATA ---
const MOCK_VIDEOS: VideoItem[] = [
  {
      id: "1",
      title: "টবে সহজ পদ্ধতিতে টমেটো চাষ ও পরিচর্যা গাইড-২৫৫৪",
      description: "বাসার ছাদে বা বারান্দায় কীভাবে সহজে অর্গানিক উপায়ে লাল টমেটো ফলন বৃদ্ধি করবেন তার সম্পূর্ণ গাইডলাইন।",
      youtubeId: "https://youtu.be/7wtfhZwyrcc?si=DaxUknUGG7znoIRP",
      category: "কৃষি টিউটোরিয়াল",
      duration: "০৩:৩৭",
      views: "১.২ কে",
      createdAt: "2026-08-14T10:00:00.000Z",
      featured: true,
      status: "active",
  },
  {
    id: "2",
    status: "active",
    title: "জৈব কেঁচো সার (Vermicompost) ব্যবহারের সঠিক নিয়ম",
    description:
      "মাটির উর্বরতা বৃদ্ধি ও গাছের দ্রুত বৃদ্ধির জন্য কীভাবে ভার্মিকম্পোস্ট প্রয়োগ করবেন জানুন।",
    youtubeId: "https://youtu.be/7wtfhZwyrcc?si=DaxUknUGG7znoIRP",
    category: "সার ও কীটনাশক",
    duration: "০৭:৪৫",
    views: "৮৫০",
    createdAt: "2026-07-10T12:00:00.000Z",
  },
  {
    id: "3",
    status: "active",
    title: "১০ লিটার ম্যানুয়াল স্প্রে মেশিনের আনবক্সিং ও রিভিউ",
    description:
      "আমাদের শপে থাকা উচ্চ ক্ষমতার স্প্রে পাম্পের কার্যক্ষমতা ও নজেল সেটিং দেখুন।",
    youtubeId: "https://youtu.be/7wtfhZwyrcc?si=DaxUknUGG7znoIRP",
    category: "পণ্য রিভিউ",
    duration: "০৫:১৫",
    views: "২.১ কে",
    createdAt: "2026-08-08T08:30:00.000Z",
  },
  {
    id: "4",
    status: "active",
    title: "হাইব্রিড শসা চাষে দ্বিগুণ লাভের আধুনিক কৌশল",
    description:
      "পরামর্শ ও মাটির প্রস্তুতি থেকে শুরু করে বাজারজাতকরণ পর্যন্ত পুরো প্রক্রিয়া।",
    youtubeId: "7wtfhZwyrcc",
    category: "কৃষক সাফল্য",
    duration: "১২:৩০",
    views: "৩.৪ কে",
    createdAt: "2026-06-01T15:00:00.000Z",
  },
  {
    id: "5",
    status: "active",
    title: "ড্রিপ ইরিগেশন বা ড্রিপ সেচ ব্যবস্থা কীভাবে স্থাপন করবেন?",
    description:
      "কম পানিতে বেশি ফলন পেতে আধুনিক ড্রিপ ইরিগেশন প্রযুক্তির ব্যবহার।",
    youtubeId: "https://www.youtube.com/watch?v=7wtfhZwyrcc",
    category: "আধুনিক প্রযুক্তি",
    duration: "০৮:৫০",
    views: "১.৯ কে",
    createdAt: "2026-07-25T11:20:00.000Z",
  },
  {
    id: "6",
    status: "active",
    title: "গাছের পোকা দমনে ঘরোয়া নিম তেলের স্প্রে তৈরি",
    description:
      "কোনো রাসায়নিক ছাড়াই পোকা-মাকড় দূর করার সহজ ও পরিবেশবান্ধব সমাধান।",
    youtubeId: "7wtfhZwyrcc",
    category: "সার ও কীটনাশক",
    duration: "০৬:১০",
    views: "৯২০",
    createdAt: "2025-08-16T09:00:00.000Z",
  },
];

// --- MAIN COMPONENT ---
export const VideosPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("সব ভিডিও");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const filteredVideos = useMemo(() => {
    return MOCK_VIDEOS.filter((video) => {
      const matchesCategory =
        selectedCategory === "সব ভিডিও" || video.category === selectedCategory;
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredVideo = useMemo(() => {
    return MOCK_VIDEOS.find((v) => v.featured) || MOCK_VIDEOS[0];
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-12">
            <Video className="w-96 h-96" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-primary-700/60 text-primary-200 text-xs font-semibold px-3 py-1 rounded-full border border-primary-600/40 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" /> কৃষি পরামর্শ
              ও টিউটোরিয়াল
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              কৃষি বিষয়ক সকল ভিডিও গাইড
            </h1>
            <p className="text-primary-100 text-xs sm:text-sm leading-relaxed">
              আধুনিক চাষাবাদ, সার ও কীটনাশকের সঠিক ব্যবহার এবং কৃষি যন্ত্রপাতির
              রিভিউ দেখে আপনার কৃষি জ্ঞান বাড়ান।
            </p>
          </div>
        </div>

        {/* FEATURED VIDEO CARD */}
        {featuredVideo && !searchQuery && selectedCategory === "সব ভিডিও" && (
          <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-primary-700 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-accent-500" /> বিশেষ ভিডিও
              (Featured)
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div
                className="lg:col-span-7 relative aspect-video rounded-2xl overflow-hidden bg-gray-900 group cursor-pointer shadow-inner"
                onClick={() => setActiveVideo(featuredVideo)}
              >
                <img
                  src={`https://img.youtube.com/vi/${getYoutubeId(featuredVideo.youtubeId)}/hqdefault.jpg`}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-current translate-x-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs">
                  {featuredVideo.duration}
                </span>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <span className="inline-block bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full">
                  {featuredVideo.category}
                </span>
                <h2
                  className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug hover:text-primary-600 transition-colors cursor-pointer"
                  onClick={() => setActiveVideo(featuredVideo)}
                >
                  {featuredVideo.title}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                  {featuredVideo.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> {featuredVideo.views} ভিউ
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />{" "}
                    {formatRelativeTime(featuredVideo.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH & FILTERS */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="ভিডিও টিউটোরিয়াল খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="text-xs text-gray-500 font-medium self-end md:self-center">
              মোট{" "}
              <strong className="text-gray-900 font-bold">
                {toBanglaDigits(filteredVideos.length)}
              </strong>{" "}
              টি ভিডিও পাওয়া গেছে
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary-600 text-white shadow-xs"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* VIDEO GRID */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div
                    className="relative aspect-video bg-gray-900 cursor-pointer overflow-hidden"
                    onClick={() => setActiveVideo(video)}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${getYoutubeId(video.youtubeId)}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 text-primary-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                      {video.duration}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full inline-block">
                      {video.category}
                    </span>
                    <h3
                      className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer leading-snug"
                      onClick={() => setActiveVideo(video)}
                    >
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 flex items-center justify-between text-[11px] text-gray-400 font-medium border-t border-gray-50">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {video.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />{" "}
                    {formatRelativeTime(video.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
            <Video className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">
              কোনো ভিডিও পাওয়া যায়নি
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              আপনার খোঁজা ফিল্টার অনুযায়ী কোনো ফলাফল মেলেনি। অনুগ্রহ করে অন্য
              কোনো ক্যাটাগরি বা কিওয়ার্ড দিয়ে চেষ্টা করুন।
            </p>
          </div>
        )}
      </div>

      {/* VIDEO MODAL PLAYER */}
      {/* VIDEO MODAL PLAYER */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto"
          onClick={() => setActiveVideo(null)} // ব্যাকড্রপে ক্লিক করলে মোডাল বন্ধ হবে
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl relative max-h-[90vh] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()} // মোডালের ভেতরের ক্লিকে বন্ধ হওয়া থামাবে
          >
            {/* HEADER WITH STICKY CLOSE BUTTON */}
            <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="text-[11px] sm:text-xs font-bold text-primary-700 bg-primary-100/60 px-2.5 py-0.5 rounded-full shrink-0">
                  {activeVideo.category}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                aria-label="মোডাল বন্ধ করুন"
                className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200/80 active:bg-gray-300 rounded-full transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* SCROLLABLE BODY */}
            <div className="overflow-y-auto flex-1">
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo.youtubeId)}?autoplay=1`}
                  title={activeVideo.title}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-3 sm:p-4 bg-white space-y-2">
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {activeVideo.description}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium pt-1">
                  <span>ভিউ: {activeVideo.views}</span>
                  <span>•</span>
                  <span>
                    প্রকাশিত: {formatRelativeTime(activeVideo.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};
