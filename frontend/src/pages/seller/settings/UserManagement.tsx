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
  Phone
} from 'lucide-react';
import { useAppDispatch } from '../../../app/hooks';
import { showToast } from '../../../features/toast/toastSlice';
import { confirm } from '../../../features/confirm/confirmSlice';
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'moderator' | 'seller';
  status: 'active' | 'inactive';
  joinedDate: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'মাহেদুল মল্লিক',
      email: 'mahidul@example.com',
      phone: '01700000000',
      role: 'admin',
      status: 'active',
      joinedDate: '2025-10-15',
    },
    {
      id: '2',
      name: 'রহিম আহমেদ',
      email: 'rahim@example.com',
      phone: '01800000000',
      role: 'moderator',
      status: 'active',
      joinedDate: '2026-01-10',
    },
    {
      id: '3',
      name: 'আরিফ ট্রেডার্স',
      email: 'arif@example.com',
      phone: '01900000000',
      role: 'seller',
      status: 'inactive',
      joinedDate: '2026-03-01',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  // Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'moderator' as 'admin' | 'moderator' | 'seller',
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const userToAdd: User = {
      id: Date.now().toString(),
      ...newUser,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setUsers([userToAdd, ...users]);
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', phone: '', role: 'moderator' });

    dispatch(showToast('নতুন ইউজার সফলভাবে যোগ করা হয়েছে!', 'success'));
  };

  // ক্লিক করলে স্ট্যাটাস টগল হবে
  const handleToggleStatus = (id: string, currentStatus: 'active' | 'inactive') => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';

    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: nextStatus } : u
      )
    );

    const statusText = nextStatus === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়';
    dispatch(showToast(`ইউজার স্ট্যাটাস ${statusText} করা হয়েছে`, 'info'));
  };

  // ডিলিট হ্যান্ডলার
  const handleDelete = async (id: string) => {
    const isConfirmed = await dispatch(
      confirm({
        title: 'ইউজার মুছে ফেলার নিশ্চিতকরণ',
        message: 'আপনি কি নিশ্চিত যে এই ইউজারকে মুছে ফেলতে চান? এই অ্যাকশনটি ফিরিয়ে আনা যাবে না।',
        confirmText: 'হ্যাঁ, ডিলিট করুন',
        cancelText: 'বাতিল',
        type: 'danger',
      })
    );

    if (isConfirmed) {
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
      dispatch(showToast('ইউজার সফলভাবে মুছে ফেলা হয়েছে!', 'error'));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
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

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>নতুন ইউজার যোগ করুন</span>
        </button>
      </div>

      {/* Filter and Search */}
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
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 focus:border-primary-500 outline-none"
          >
            <option value="all">সব ইউজার</option>
            <option value="admin">অ্যাডমিন</option>
            <option value="moderator">মডারেটর</option>
            <option value="seller">সেলার</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-bold uppercase">
                <th className="p-4">ব্যবহারকারী</th>
                <th className="p-4">যোগাযোগ</th>
                <th className="p-4">রোল (Role)</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-[10px] text-gray-400">Joined: {user.joinedDate}</div>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{user.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4">{getRoleBadge(user.role)}</td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border select-none ${
                          user.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                      >
                        {user.status === 'active' ? 'এক্টিভ' : 'ইন-এক্টিভ'} 
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 text-xs font-bold">
                    কোন ইউজার পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding New User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">নতুন ইউজার যোগ করুন</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">পূর্ণ নাম</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="যেমন: রহিম আহমেদ"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="example@mail.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ফোন নম্বর</label>
                <input
                  type="text"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="01700000000"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">রোল সিলেক্ট করুন</label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value as 'admin' | 'moderator' | 'seller',
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
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  সেভ করুন
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