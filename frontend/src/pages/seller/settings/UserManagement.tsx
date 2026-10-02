/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  ShieldAlert,
  Store,
  Trash2,
  X,
  Mail,
  Phone,
  Edit2,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useAppDispatch } from '../../../app/hooks';
import { showToast } from '../../../features/toast/toastSlice';
import { confirm } from '../../../features/confirm/confirmSlice';
import { useUser } from '../../../features/user/useUser';
import type { User, UserRole, UserStatus } from '../../../features/user/userTypes';
import { useAuth } from '../../../features/auth/useAuth';

export const UserManagement: React.FC = () => {
  const {
    users,
    isLoading,
    isError,
    error,
    fetchAllUsers,
    createNewUser,
    editUser,
    deleteUser,
  } = useUser(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'moderator' as UserRole,
  });

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', phone: '', role: 'moderator' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (targetUser: User) => {
    setEditingUser(targetUser);
    setFormData({
      name: targetUser.name,
      email: targetUser.email,
      phone: targetUser.phone || '',
      role: targetUser.role,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    try {
      setIsSubmitting(true);
      if (editingUser) {
        await editUser(editingUser.id, {
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
        });
        dispatch(showToast('ইউজার তথ্য সফলভাবে আপডেট করা হয়েছে!', 'success'));
      } else {
        await createNewUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        });
        dispatch(showToast('নতুন ইউজার সফলভাবে যোগ করা হয়েছে!', 'success'));
      }

      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', phone: '', role: 'moderator' });
    } catch (err: any) {
      dispatch(showToast(err || 'একটি সমস্যা ঘটেছে!', 'error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: UserStatus) => {
    if (!isAdmin) return;
    const nextStatus = (currentStatus === 'active' ? 'inactive' : 'active') as UserStatus;
    try {
      await editUser(id, { status: nextStatus });
      const statusText = nextStatus === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়';
      dispatch(showToast(`ইউজার স্ট্যাটাস ${statusText} করা হয়েছে`, 'info'));
    } catch (err: any) {
      dispatch(showToast(err || 'স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি', 'error'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    const isConfirmed = await dispatch(
      confirm({
        title: 'ইউজার মুছে ফেলার নিশ্চিতকরণ',
        message: 'আপনি কি নিশ্চিত যে এই ইউজারকে মুছে ফেলতে চান? এই অ্যাকশনটি ফিরিয়ে আনা যাবে না।',
        confirmText: 'হ্যাঁ, ডিলিট করুন',
        cancelText: 'বাতিল',
        type: 'danger',
      })
    );

    if (isConfirmed) {
      try {
        await deleteUser(id);
        dispatch(showToast('ইউজার সফলভাবে মুছে ফেলা হয়েছে!', 'success'));
      } catch (err: any) {
        dispatch(showToast(err || 'ইউজার মুছে ফেলতে ব্যর্থ হয়েছে', 'error'));
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" /> অ্যাডমিন
          </span>
        );
      case 'moderator':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 flex items-center gap-1 w-fit">
            <ShieldAlert className="w-3.5 h-3.5" /> মডারেটর
          </span>
        );
      case 'seller':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 flex items-center gap-1 w-fit">
            <Store className="w-3.5 h-3.5" /> সেলার
          </span>
        );
      default:
        return null;
    }
  };

  const totalCols = isAdmin ? 5 : 3;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-600" />
            ইউজার ও রোল ম্যানেজমেন্ট
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            এডমিন, মডারেটর এবং সেলারদের তালিকা নিয়ন্ত্রণ ও নতুন ইউজার যোগ করুন
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchAllUsers()}
            disabled={isLoading}
            className="p-2.5 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {isAdmin && (
            <button
              onClick={handleOpenAddModal}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>নতুন ইউজার যোগ করুন</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:border-primary-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-600">রোল ফিল্টার:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 focus:border-primary-500 outline-none"
          >
            <option value="all">সব ইউজার</option>
            <option value="admin">অ্যাডমিন</option>
            <option value="moderator">মডারেটর</option>
            <option value="seller">সেলার</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-bold uppercase">
                <th className="p-4">ব্যবহারকারী</th>
                <th className="p-4">যোগাযোগ</th>
                <th className="p-4">রোল (Role)</th>
                {isAdmin && (
                  <>
                    <th className="p-4">স্ট্যাটাস</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={totalCols} className="p-8 text-center text-gray-400 text-xs font-bold">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                      <span>ইউজার ডেটা লোড হচ্ছে...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={totalCols} className="p-8 text-center text-rose-500 text-xs font-bold">
                    {error || 'ডেটা লোড করতে সমস্যা হয়েছে!'}
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-[10px] text-gray-400">
                        Joined: {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4">{getRoleBadge(item.role)}</td>
                    {isAdmin && (
                      <>
                        <td className="p-4"> 
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item.id, item.status)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border select-none ${
                              item.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}
                            title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                          >
                            {item.status === 'active' ? 'এক্টিভ' : 'ইন-এক্টিভ'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="রিমুভ করুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={totalCols} className="p-8 text-center text-gray-400 text-xs font-bold">
                    কোন ইউজার পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">
                {editingUser ? 'ইউজার তথ্য সম্পাদনা করুন' : 'নতুন ইউজার যোগ করুন'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">পূর্ণ নাম</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="যেমন: রহিম আহমেদ"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@mail.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ফোন নম্বর</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01700000000"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">রোল সিলেক্ট করুন</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none focus:border-primary-500"
                >
                  <option value="moderator">মডারেটর (Moderator)</option>
                  <option value="seller">সেলার (Seller)</option>
                  <option value="admin">অ্যাডমিন (Admin)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingUser ? 'আপডেট করুন' : 'সেভ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;