import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  MessageSquare,
  Send,
  CheckCircle2,
  Tag,
} from "lucide-react";

export interface Comment {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string; // HTML content from Quill Editor
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  likes: number;
}

// Mock Blog Database
const MOCK_BLOG_DATA: Record<string, BlogPost> = {
  "1": {
    id: "1",
    title: "ছাদ বাগানে টমেটো চাষের সহজ পদ্ধতি ও পরিচর্যা",
    content: `
      <p>শহরের যান্ত্রিক জীবনে এক চিলতে সবুজের ছোঁয়া পেতে অনেকেই আজকাল ছাদ বাগান করছেন। তবে ছাদে ফলপ্রসূ ফসল ফলানো অনেকের জন্যই চ্যালেঞ্জিং হয়ে দাঁড়ায়। আজ আমরা বিস্তারিত আলোচনা করব কীভাবে খুব সহজেই আপনার বাড়ির ছাদে হাইব্রিড ও দেশি জাতের টমেটো চাষ করতে পারেন।</p>
      
      <h2>১. উপযুক্ত পাত্র ও মাটি নির্বাচন</h2>
      <p>টমেটো গাছের শিকড় বেশ গভীরে যায়, তাই অন্তত <strong>১২-১৬ ইঞ্চির টব বা ড্রাম</strong> ব্যবহার করা উত্তম। মাটি তৈরির জন্য:</p>
      <ul>
        <li>৫০% বেলে-দোআঁশ মাটি</li>
        <li>৩০% জৈব সার বা কেঁচো সার (Vermicompost)</li>
        <li>১০% কোকোপিট</li>
        <li>১০% ছাই ও নিমখৈল</li>
      </ul>

      <h2>২. চারা রোপণ ও প্রাথমিক পরিচর্যা</h2>
      <p>বীজ থেকে চারা তৈরি করে অথবা বিশ্বস্ত নার্সারি থেকে সুস্থ চারা কিনে এনে বিকেলে রোপণ করুন। রোপণের পর হালকা সেচ দিতে হবে এবং ২-৩ দিন আংশিক ছায়ায় রাখতে হবে।</p>

      <blockquote>
        "টমেটো গাছে অতিরিক্ত পানি দেওয়া যাবে না। গোড়ায় পানি জমলে শিকড় পচে গাছ মারা যেতে পারে।"
      </blockquote>

      <h2>৩. রোগবালাই ও পোকা দমন</h2>
      <p>টমেটো গাছে সাধারণত পাতা কোঁকড়ানো রোগ এবং মাছি পোকার আক্রমণ বেশি দেখা যায়। এর সমাধানের জন্য প্রতি ১৫ দিনে একবার <em>জৈব নিম তেল</em> স্প্রে করতে পারেন।</p>
    `,
    category: "কৃষি টিপস",
    author: "কৃষিবিদ হাসান",
    authorRole: "সিনিয়র কৃষি পরামর্শক",
    date: "১৫ আগস্ট, ২০২৬",
    readTime: "৫ মিনিট",
    image:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=1200&auto=format&fit=crop",
    tags: ["ছাদ বাগান", "টমেটো চাষ", "জৈব কৃষি", "সবজি পরিচর্যা"],
    likes: 42,
  },
  "2": {
    id: "2",
    title: "জৈব সার ব্যবহারের ৫টি বড় সুবিধা",
    content: `
      <p>মাটির সজীবতা রক্ষা ও বিষমুক্ত খাদ্য উৎপাদনের একমাত্র পথ হলো জৈব কৃষির সম্প্রসারণ। রাসায়নিক সারের অতিরিক্ত ব্যবহারের ফলে আমাদের জমির উর্বরতা দিন দিন হ্রাস পাচ্ছে।</p>
      <h2>জৈব সারের প্রধান সুবিধাসমূহ:</h2>
      <ol>
        <li><strong>মাটির গঠন উন্নত করে:</strong> এটি মাটির পানি ধারণ ক্ষমতা বাড়ায়।</li>
        <li><strong>উপকারী অনুজীব বৃদ্ধি:</strong> মাটিতে কেঁচো ও বন্ধুভাবাপন্ন ব্যাকটেরিয়ার সংখ্যা বৃদ্ধি পায়।</li>
        <li><strong>দীর্ঘস্থায়ী পুষ্টি:</strong> গাছ ধীরে ধীরে দীর্ঘমেয়াদে পুষ্টি উপাদান গ্রহণ করতে পারে।</li>
      </ol>
    `,
    category: "জৈব চাষাবাদ",
    author: "ড. আমিনুল ইসলাম",
    authorRole: "মৃত্তিকা বিজ্ঞানী",
    date: "১২ আগস্ট, ২০২৬",
    readTime: "৪ মিনিট",
    image:
      "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=1200&auto=format&fit=crop",
    tags: ["জৈব সার", "মাটির উর্বরতা", "কেঁচো সার"],
    likes: 28,
  },
};

export const BlogDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Comment state
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      author: "মোঃ রফিকুল ইসলাম",
      date: "১৬ আগস্ট, ২০২৬",
      text: "খুবই দরকারী একটি আর্টিকেল। ছাদ বাগানে টমেটো চাষ নিয়ে আমার কিছু সংশয় ছিল, যা এখন স্পষ্ট হলো।",
    },
  ]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id && MOCK_BLOG_DATA[id]) {
      const data = MOCK_BLOG_DATA[id];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBlog(data);
      setLikesCount(data.likes);
    } else {
      // Fallback for demo when unknown ID passed
      setBlog(MOCK_BLOG_DATA["1"]);
      setLikesCount(MOCK_BLOG_DATA["1"].likes);
    }
  }, [id]);

  if (!blog) return null;

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newEntry: Comment = {
      id: Date.now().toString(),
      author: newCommentName.trim() || "শুভাকাঙ্ক্ষী পাঠক",
      date: "আজ",
      text: newCommentText.trim(),
    };

    setComments([newEntry, ...comments]);
    setNewCommentText("");
    setNewCommentName("");
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-16">
      {/* 1. Header Navigation Bar */}
      <div className="bg-white border-b border-gray-100 py-4 sticky top-20 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ব্লগ তালিকায় ফিরুন</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                hasLiked
                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${hasLiked ? "fill-rose-600 text-rose-600" : ""}`}
              />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors relative cursor-pointer"
              title="লিঙ্ক কপি করুন"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* 2. Title & Metadata Header */}
          <div className="p-6 sm:p-10 pb-6">
            <div className="inline-block bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-lg mb-4">
              {blog.category}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight mb-6">
              {blog.title}
            </h1>

            {/* Author info */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{blog.author}</div>
                  <div className="text-[11px] text-gray-400">
                    {blog.authorRole}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" /> {blog.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" /> {blog.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Featured Image */}
          <div className="px-6 sm:px-10">
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 4. HTML Content Area (Renders Quill HTML safely) */}
          <div className="p-6 sm:p-10">
            <div
              className="prose prose-emerald max-w-none 
                prose-headings:font-bold prose-headings:text-gray-900 
                prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-li:text-gray-700 prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-5 prose-ol:pl-5
                prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-gray-700
                prose-img:rounded-xl prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400 mr-1" />
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Social Share Footer */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">
                পোস্টটি শেয়ার করুন:
              </span>
              <div className="flex items-center gap-2">
                {/* Facebook SVG */}
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 border border-gray-100 shadow-2xs transition-colors cursor-pointer"
                  title="Facebook এ শেয়ার করুন"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>

                {/* Twitter / X SVG */}
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 bg-white text-gray-900 rounded-xl hover:bg-gray-100 border border-gray-100 shadow-2xs transition-colors cursor-pointer"
                  title="X (Twitter) এ শেয়ার করুন"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>

                {/* LinkedIn SVG */}
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 bg-white text-blue-700 rounded-xl hover:bg-blue-50 border border-gray-100 shadow-2xs transition-colors cursor-pointer"
                  title="LinkedIn এ শেয়ার করুন"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* 5. Comments Section */}
        <section className="mt-10 bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            <span>মন্তব্যসমূহ ({comments.length})</span>
          </h3>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8 space-y-4">
            <input
              type="text"
              placeholder="আপনার নাম (ঐচ্ছিক)"
              value={newCommentName}
              onChange={(e) => setNewCommentName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
            <textarea
              rows={3}
              placeholder="আপনার মতামত বা প্রশ্ন লিখুন..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
              required
            />
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>মন্তব্য পোস্ট করুন</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4 divide-y divide-gray-100">
            {comments.map((comment) => (
              <div key={comment.id} className="pt-4 first:pt-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-gray-900">
                    {comment.author}
                  </span>
                  <span className="text-xs text-gray-400">{comment.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
