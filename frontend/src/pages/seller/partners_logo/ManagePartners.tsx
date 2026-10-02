import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Upload,
  X,
  Save,
  Globe,
  Building2,
  Loader2,
} from "lucide-react";
import { confirm } from "../../../features/confirm/confirmSlice";
import { useAppDispatch } from "../../../app/hooks";
import { usePartner } from "../../../features/partner/usePartner";
import type { Partner } from "../../../features/partner/PartnerTypes";

export const ManagePartners: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    partners,
    isLoading,
    errorMessage,
    isError,
    getAllPartners,
    handleCreatePartner,
    handleUpdatePartner,
    handleDeletePartner,
  } = usePartner();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    websiteUrl: string;
  }>({
    name: "",
    websiteUrl: "",
  });

  // Initial Fetching
  useEffect(() => {
    getAllPartners();
  }, [getAllPartners]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  // if ( !partners || partners.length === 0 ) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <span>No Partners Found</span>
  //     </div>
  //   );
  // }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>{errorMessage}</span>
      </div>
    );
  }
  // Open Modal for Create
  const handleOpenAddModal = () => {
    setEditingPartner(null);
    setFormData({ name: "", websiteUrl: "" });
    setSelectedFile(null);
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      websiteUrl: partner.websiteUrl || "",
    });
    setSelectedFile(null);
    setPreviewUrl(partner.logo || "");
    setIsModalOpen(true);
  };

  // Handle Text Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Logo File Select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Remove Selected Logo
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  // Save or Update Partner
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert("ব্র্যান্ডের নাম আবশ্যক!");
      return;
    }

    if (!editingPartner && !selectedFile) {
      alert("ব্র্যান্ড লোগো আবশ্যক!");
      return;
    }

    try {
      // FormData তৈরি (যদি ফাইল থাকে তবে FormData ব্যবহার করাই শ্রেয়)
      const data = new FormData();
      data.append("name", formData.name);
      data.append("websiteUrl", formData.websiteUrl);
      if (selectedFile) {
        data.append("logo", selectedFile);
      }

      if (editingPartner) {
        await handleUpdatePartner(editingPartner.id, data);
      } else {
        await handleCreatePartner(data);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Save partner error:", error);
    }
  };

  // Delete Partner
  const handleDelete = async (id: string) => {
    const isConfirmed = await dispatch(
      confirm({
        title: "ব্র্যান্ড মুছে ফেলার নিশ্চিতকরণ",
        message:
          "আপনি কি নিশ্চিত যে এই ব্র্যান্ডটি মুছে ফেলতে চান? এই অ্যাকশনটি ফিরিয়ে আনা যাবে না।",
        confirmText: "হ্যাঁ, ডিলিট করুন",
        cancelText: "বাতিল",
        type: "danger",
      }),
    );

    if (isConfirmed) {
      try {
        await handleDeletePartner(id);
      } catch (error) {
        console.error("Delete partner error:", error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary-600" />
            পার্টনার ও ব্র্যান্ড ম্যানেজমেন্ট
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            আপনার ওয়েবসাইটে প্রদর্শিত অফিসিয়াল পার্টনার লোগো ও লিংকসমূহ
            পরিচালনা করুন
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ব্র্যান্ড যোগ করুন</span>
        </button>
      </div>

      {/* Grid List or Loading */}
      { partners.length === 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-100 rounded-2xl h-24 w-[calc(50%-0.5rem)] sm:w-44 md:w-48 flex items-center justify-center p-4 border border-gray-100"
            >
              <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {partners?.map((partner) => (
            <div
              key={partner.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between group relative"
            >
              {/* Logo Display */}
              <div className="h-28 flex items-center justify-center p-2 bg-gray-50/60 rounded-xl mb-3 border border-gray-50">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-16 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Partner Info */}
              <div className="space-y-2">
                <h3 className="font-bold text-xs sm:text-sm text-gray-800 truncate text-center">
                  {partner.name}
                </h3>

                {partner.websiteUrl ? (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-primary-600 hover:underline flex items-center justify-center gap-1 truncate"
                  >
                    <Globe className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">
                      {partner.websiteUrl.replace(/^https?:\/\//, "")}
                    </span>
                  </a>
                ) : (
                  <p className="text-[11px] text-gray-400 text-center">
                    ওয়েবসাইট যুক্ত নেই
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleOpenEditModal(partner)}
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                  title="এডিট করুন"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(partner.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                {editingPartner
                  ? "ব্র্যান্ড তথ্য এডিট করুন"
                  : "নতুন ব্র্যান্ড যোগ করুন"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Brand Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  কোম্পানি/ব্র্যান্ডের নাম{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="যেমন: ACI Agriculture"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  ওয়েবসাইট ইউআরএল (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  ব্র্যান্ড লোগো <span className="text-red-500">*</span>
                </label>

                {previewUrl ? (
                  <div className="relative border border-gray-200 rounded-xl p-3 bg-gray-50 flex items-center justify-between">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-10 object-contain max-w-[150px]"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 hover:border-primary-500 bg-gray-50 p-4 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-xs font-bold text-gray-600">
                      লোগো আপলোড করুন
                    </span>
                    <span className="text-[10px] text-gray-400">
                      PNG, JPG বা WEBP
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePartners;
