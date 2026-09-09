import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Video,
  Eye,
  EyeOff,
  Play,
  ExternalLink,
  Clock,
  Eye as ViewsIcon,
} from "lucide-react";

import { type VideoItem } from "../../../types/index";

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
    status: "inactive",
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

// Helper to extract clean YouTube Video ID from any format (URL or raw ID)
const getYoutubeVideoId = (urlOrId: string): string => {
  if (!urlOrId) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = urlOrId.match(regExp);
  return match && match[2].length === 11 ? match[2] : urlOrId;
};

export const VideosList: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>(MOCK_VIDEOS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeId: "",
    category: "",
    duration: "",
    views: "",
  });

  // Open Modal for Create / Edit
  const handleOpenModal = (video?: VideoItem) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        title: video.title,
        description: video.description || "",
        youtubeId: video.youtubeId,
        category: video.category || "",
        duration: video.duration || "",
        views: video.views || "",
      });
    } else {
      setEditingVideo(null);
      setFormData({
        title: "",
        description: "",
        youtubeId: "",
        category: "",
        duration: "",
        views: "",
      });
    }
    setIsModalOpen(true);
  };

  // Delete Video
  const handleDelete = (id: string | number) => {
    if (window.confirm("আপনি কি নিশ্চিত যে এই ভিডিওটি মুছে ফেলতে চান?")) {
      setVideos(videos.filter((item) => item.id !== id));
    }
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = (id: string | number) => {
    setVideos(
      videos.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === "inactive" ? "active" : "inactive",
          };
        }
        return item;
      })
    );
  };

  // Submit Form Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.youtubeId.trim()) {
      alert("অনুগ্রহ করে ইউটিউব লিংক বা ভিডিও আইডি লিখুন");
      return;
    }

    if (editingVideo) {
      setVideos(
        videos.map((item) =>
          item.id === editingVideo.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newVideo: VideoItem = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        status: "active",
      };
      setVideos([newVideo, ...videos]);
    }
    setIsModalOpen(false);
  };

  // Search Filter
  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Video className="w-4 h-4" />
              <span>ভিডিও ম্যানেজমেন্ট</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              ভিডিও টিউটোরিয়াল ও রিভিউ
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              ওয়েবসাইটের প্রোডাক্ট রিভিউ, টিউটোরিয়াল এবং প্রচারমূলক ভিডিওগুলো
              নিয়ন্ত্রণ করুন
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ভিডিও যোগ করুন</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ভিডিও টাইটেল বা ক্যাটাগরি সার্চ করুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
            />
          </div>
          <span className="text-xs font-bold text-gray-500">
            মোট ভিডিও:{" "}
            <span className="text-primary-600 font-black">
              {filteredVideos.length}
            </span>{" "}
            টি
          </span>
        </div>

        {/* Videos Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                  <th className="py-4 px-6">ভিডিও ও বিবরণ</th>
                  <th className="py-4 px-6">ক্যাটাগরি</th>
                  <th className="py-4 px-6">ডিউরেশন ও ভিউ</th>
                  <th className="py-4 px-6">স্ট্যাটাস</th>
                  <th className="py-4 px-6 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredVideos.length > 0 ? (
                  filteredVideos.map((video) => {
                    const cleanYtId = getYoutubeVideoId(video.youtubeId);
                    const thumbnailUrl = cleanYtId
                      ? `https://img.youtube.com/vi/${cleanYtId}/hqdefault.jpg`
                      : "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=400&q=80";

                    return (
                      <tr
                        key={video.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Thumbnail & Title */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div
                              onClick={() =>
                                cleanYtId && setPlayingVideoId(cleanYtId)
                              }
                              className="relative w-28 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 group cursor-pointer"
                            >
                              <img
                                src={thumbnailUrl}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                  <Play className="w-4 h-4 fill-current ml-0.5" />
                                </div>
                              </div>
                            </div>

                            <div className="max-w-md">
                              <h2 className="font-bold text-gray-900 leading-snug line-clamp-1 hover:text-primary-600 transition-colors">
                                {video.title}
                              </h2>
                              <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">
                                {video.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          {video.category && (
                            <span className="inline-block bg-primary-50 text-primary-700 font-bold text-xs px-2.5 py-1 rounded-lg">
                              {video.category}
                            </span>
                          )}
                        </td>

                        {/* Duration & Views */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="space-y-1 text-xs text-gray-500">
                            {video.duration && (
                              <div className="flex items-center gap-1.5 font-medium">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <span>{video.duration}</span>
                              </div>
                            )}
                            {video.views && (
                              <div className="flex items-center gap-1.5 font-medium">
                                <ViewsIcon className="w-3.5 h-3.5 text-gray-400" />
                                <span>{video.views} ভিউ</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(video.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                              video.status !== "inactive"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {video.status !== "inactive" ? (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>সক্রিয়</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>নিষ্ক্রিয়</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={
                                video.youtubeId.startsWith("http")
                                  ? video.youtubeId
                                  : `https://www.youtube.com/watch?v=${video.youtubeId}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="ইউটিউবে দেখুন"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleOpenModal(video)}
                              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                              title="এডিট করুন"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(video.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      কোনো ভিডিও পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Video Player Modal */}
        {playingVideoId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="relative bg-black w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <button
                onClick={() => setPlayingVideoId(null)}
                className="absolute top-3 right-3 z-10 p-2 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Video Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white w-full max-w-xl my-8 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-red-600"
                  >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>

                  <h3 className="text-lg font-bold text-gray-900">
                    {editingVideo
                      ? "ভিডিও আপডেট করুন"
                      : "নতুন ইউটিউব ভিডিও যোগ করুন"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
              >
                {/* YouTube Link or ID */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ইউটিউব ভিডিও লিংক / ভিডিও আইডি{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://youtu.be/7wtfhZwyrcc অথবা 7wtfhZwyrcc"
                    value={formData.youtubeId}
                    onChange={(e) =>
                      setFormData({ ...formData, youtubeId: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    ইউটিউব থেকে শেয়ার করা লিংক অথবা সরাসরি ভিডিওর আইডি বসান।
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ভিডিওর মূল শিরোনাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ১০ লিটার ম্যানুয়াল স্প্রে মেশিনের আনবক্সিং ও রিভিউ"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Category & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ভিডিওর ক্যাটাগরি
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: পণ্য রিভিউ / টিউটোরিয়াল"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ভিডিওর সময়সীমা (ডিউরেশন)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: ০৫:১৫"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Views & Description */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ভিউ সংখ্যা (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: ২.১ কে"
                      value={formData.views}
                      onChange={(e) =>
                        setFormData({ ...formData, views: e.target.value })
                      }
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      সংক্ষিপ্ত বিবরণ
                    </label>
                    <textarea
                      rows={2}
                      placeholder="ভিডিও সম্পর্কে সংক্ষেপে কিছু লিখুন..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 resize-none"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    {editingVideo ? "আপডেট করুন" : "সংরক্ষণ করুন"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};