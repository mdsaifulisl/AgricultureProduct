// --- TYPES Product ---
export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Specification {
  key: string;
  value: string;
}
 
export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  unit: string;
  rating?: number;
  reviewsCount?: number;
  images: string[];
  description: string;
  shortDescription: string;
  metaDescription?: string;
  badge?: string;
  inStock?: boolean;
  stockCount: number;
  sku: string;
  isFeatured?: boolean;
  specifications?: Specification[];
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

// --- TYPES Product End ---

// --- TYPES Slide ---
export interface Slide {
  id: string | number; // string এবং number দুটোই এলাউ করা হলো
  badge?: string;
  title: string;
  highlightText?: string;
  description?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  image: string;
  imageAlt?: string;
  tag?: string;
  status?: 'active' | 'inactive';
}
// --- TYPES Slide End ---


// --- TYPES Blog ---

export interface BlogComment {
  id: string;
  userName: string;
  commentText: string;
  createdAt: string; // ISO date string or formatted string
}

export interface BlogPost {
  id: string;
  title: string;
  metaDescription?: string;
  content: string;
  category: string;
  author: string;
  authorRole?: string; 
  date: string;
  readTime: string;
  image?: string;
  tags: string[];
  likes: number;
  comments?: BlogComment[]; // কমেন্টের অ্যারে (Optional)
  status?: 'published' | 'draft' | 'archived';
}

// --- TYPES Blog End ---

// --- TYPES Video ---
export interface VideoItem {
  status: string;
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
  duration: string;
  views: string;
  createdAt: string | Date;
  featured?: boolean;
}

// --- TYPES Video End ---

// --- TYPES Cart ---
export interface CartItem {
  id: string;
  name: string;
  price: number; // আপলোড করা প্রোডাক্টের দাম (যেমন: 20 টাকা)
  image: string;
  unit?: string; // যেমন: "200 gm", "0.5 gm", "1 pc"
  baseAmount?: number; // ইউনিট থেকে এক্সট্র্যাক্ট করা সংখ্যা (যেমন: 200, 0.5, বা 1)
  sku?: string;
  quantity: number; // কাস্টমারের সিলেক্ট করা পরিমাণ (যেমন: 600)
  selectedSpec?: Record<string, string>;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

// --- TYPES Card End ---