import React, { useState, useEffect } from "react";
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
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { type VideoItem } from "../../../types/index";
import { confirm } from "../../../features/confirm/confirmSlice";
import { useAppDispatch } from "../../../app/hooks";
import { useVideos } from "../../../features/videos/useVideos";
import { showToast } from "../../../features/toast/toastSlice";
import { useAuth } from "../../../features/auth/useAuth";

const getYoutubeVideoId = (urlOrId: string): string => {
  if (!urlOrId) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = urlOrId.match(regExp);
  return match && match[2].length === 11 ? match[2] : urlOrId;
};

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  youtubeId: "",
  category: "",
  duration: "",
  views: "",
  featured: false,
};

export const VideosList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const {
    videos = [],
    getVideos,
    loading,
    error,
    createVideo,
    updateVideo,
    deleteVideo,
    clearError,
  } = useVideos();

  useEffect(() => {
    getVideos();
  }, [getVideos]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const handleOpenModal = (video?: VideoItem) => {
    if (clearError) clearError();
    if (video) {
      setEditingVideo(video);
      setFormData({
        title: video.title || "",
        description: video.description || "",
        youtubeId: video.youtubeId || "",
        category: video.category || "",
        duration: video.duration || "",
        views: video.views || "",
        featured: video.featured || false,
      });
    } else {
      setEditingVideo(null);
      setFormData(INITIAL_FORM_STATE);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVideo(null);
    setFormData(INITIAL_FORM_STATE);
    if (clearError) clearError();
  };

  const handleDelete = async (id: string | number) => {
    const isConfirmed = await dispatch(
      confirm({
        title: "ভিডিও মুছে ফেলার নিশ্চিতকরণ",
        message:
          "আপনি কি নিশ্চিত যে এই ভিডিওটি মুছে ফেলতে চান? এই অ্যাকশনটি ফিরিয়ে আনা যাবে না।",
        confirmText: "হ্যাঁ, ডিলিট করুন",
        cancelText: "বাতিল",
        type: "danger",
      }),
    );

    if (isConfirmed && deleteVideo) {
      await deleteVideo(String(id));
    }
  };

  const handleToggleStatus = async (video: VideoItem) => {
    if (updateVideo) {
      const currentStatus = video.status ?? "inactive";
      const nextStatus = currentStatus === "inactive" ? "active" : "inactive";

      // createdAt কে স্ট্রিং আকারে ফরম্যাট করা
      const formattedCreatedAt = video.createdAt
        ? typeof video.createdAt === "string"
          ? video.createdAt
          : video.createdAt.toISOString()
        : undefined;

      await updateVideo(video.id, {
        ...video,
        status: nextStatus,
        createdAt: formattedCreatedAt,
      });

      dispatch(showToast("ভিডিও স্টেটাস আপডেট করা হয়েছে!", "success"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.youtubeId.trim()) {
      // alert("অনুগ্রহ করে ইউটিউব লিংক বা ভিডিও আইডি লিখুন");
      dispatch(
        showToast("অনুগ্রহ করে ইউটিউব লিংক বা ভিডিও আইডি লিখুন", "success"),
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanedYtId = getYoutubeVideoId(formData.youtubeId);
      const payload = { ...formData, youtubeId: cleanedYtId };

      if (editingVideo && updateVideo) {
        await updateVideo(editingVideo.id, payload);
        dispatch(showToast("ভিডিও সফলভাবে আপডেট করা হয়েছে!", "success"));
      } else if (createVideo) {
        await createVideo({
          ...payload,
          status: "active",
          createdAt: new Date().toISOString(),
        });
        dispatch(showToast("ভিডিও সফলভাবে তৈরি করা হয়েছে!", "success"));
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save video:", err);
    } finally {
      setIsSubmitting(false);
      getVideos();
    }
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
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
              নিয়ন্ত্রণ করুন
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer text-sm shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ভিডিও যোগ করুন</span>
            </button>
          )}
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            {clearError && (
              <button
                onClick={clearError}
                className="p-1 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Search Bar */}
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

        {/* Table */}
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                        <span>লোড হচ্ছে...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredVideos.length > 0 ? (
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

                            <div className="max-w-md space-y-1">
                              <div className="flex items-center gap-2">
                                <h2 className="font-bold text-gray-900 leading-snug line-clamp-1 hover:text-primary-600 transition-colors">
                                  {video.title}
                                </h2>
                                {video.featured && (
                                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                    ফিচার্ড
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 line-clamp-2">
                                {video.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 whitespace-nowrap">
                          {video.category && (
                            <span className="inline-block bg-primary-50 text-primary-700 font-bold text-xs px-2.5 py-1 rounded-lg">
                              {video.category}
                            </span>
                          )}
                        </td>

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

                        <td className="py-4 px-6 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(video as VideoItem)
                            }
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                              video.status !== "inactive"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-gray-100 text-gray-500"
                            } ${isAdmin ? "" : "pointer-events-none"}`}
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

                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={
                                video.youtubeId?.startsWith("http")
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

                            {isAdmin && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenModal(video as VideoItem)
                                  }
                                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                                  title="এডিট করুন"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(video.id)}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
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

        {/* Player Modal */}
        {playingVideoId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="relative bg-black w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <button
                type="button"
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

        {/* Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white w-full max-w-xl my-8 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingVideo
                      ? "ভিডিও আপডেট করুন"
                      : "নতুন ইউটিউব ভিডিও যোগ করুন"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ইউটিউব ভিডিও লিংক / ভিডিও আইডি{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
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

                <div className="pt-2 border-t border-gray-100">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-xs font-bold text-gray-700">
                      ফিচার্ড ভিডিও হিসেবে দেখান
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    <span>{editingVideo ? "সংরক্ষণ করুন" : "যোগ করুন"}</span>
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
