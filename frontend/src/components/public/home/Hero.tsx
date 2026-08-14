import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Leaf, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Award,
  Users
} from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  title: string;
  highlightText: string;
  description: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  image: string;
  imageAlt: string;
  tag: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 1,
    badge: '১০০% প্রাকৃতিকভাবে উৎপাদিত',
    title: 'ক্ষেতের তাজা সবজি ও ফলমূল সরাসরি',
    highlightText: 'আপনার দরজায়',
    description: 'কোনো প্রকার মধ্যস্বত্বভোগী ছাড়াই সরাসরি প্রান্তিক কৃষকের মাঠ থেকে সংগ্রহ করা খাঁটি ও তাজা উপাদান এখন সহজে পৌঁছে যাচ্ছে আপনার ঘরে।',
    primaryBtnText: 'পণ্যসমূহ দেখুন',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'আজকের অফার',
    secondaryBtnLink: '/offers',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'তাজা প্রাকৃতিকভাবে উৎপাদিত সবজি ও ফলমূল',
    tag: 'দৈনিক তাজা বাজার'
  },
  {
    id: 2,
    badge: 'উন্নত ফলনের ভরসা',
    title: 'উচ্চ ফলনশীল বীজ ও আধুনিক',
    highlightText: 'কৃষি যন্ত্রপাতি',
    description: 'গুণগত মানসম্পন্ন সার, হাইব্রিড বীজ এবং আধুনিক স্প্রেয়ার ও অন্যান্য যন্ত্রপাতি দিয়ে আপনার কৃষিকাজকে করুন আরও সহজ ও লাভজনক।',
    primaryBtnText: 'বীজ ও সার কিনুন',
    primaryBtnLink: '/shop?category=seeds',
    secondaryBtnText: 'যন্ত্রপাতি দেখুন',
    secondaryBtnLink: '/shop?category=equipment',
    image: 'https://th.bing.com/th/id/OIP.GPdFZFdceYnzQ31QB_ZbSAHaEJ?w=310&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
    imageAlt: 'কৃষি বীজ ও সার সামগ্রী',
    tag: 'কৃষি সামগ্রী'
  }
];

const FEATURES = [
  {
    id: 1,
    icon: Truck,
    title: 'দ্রুত হোম ডেলিভারি',
    description: 'ঢাকার ভেতরে মাত্র ২৪ ঘণ্টার মধ্যে ডেলিভারি'
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: '১০০% খাঁটি ও তাজা',
    description: 'সরাসরি কৃষক থেকে সংগ্রহকৃত কেমিক্যাল মুক্ত'
  },
  {
    id: 3,
    icon: Award,
    title: 'ন্যায্য মূল্য',
    description: 'কৃষক এবং ক্রেতা উভয়ের জন্য সেরা দাম'
  },
  {
    id: 4,
    icon: Users,
    title: '১০,০০০+ বিশ্বস্ত পরিবার',
    description: 'সারা বাংলাদেশে আমাদের সন্তুষ্ট গ্রাহক'
  }
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section className="relative bg-gradient-to-b from-primary-50/50 via-white to-gray-50/50 overflow-hidden pt-4 pb-12 lg:pb-16">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 transform translate-x-1/3 -translate-y-1/4 w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 -z-10 transform -translate-x-1/3 w-[400px] h-[400px] bg-accent-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Slider Container */}
        <div className="relative rounded-3xl bg-white border border-primary-100/80 shadow-xl shadow-primary-900/5 p-5 sm:p-8 lg:p-12 overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* Image Column - Mobile এ উপরে (order-1), Desktop এ ডানে (lg:order-2) */}
            <div className="order-1 lg:order-2 lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-4/3 sm:aspect-square lg:aspect-4/3 rounded-2xl overflow-hidden shadow-xl border-4 border-white group">
                <img
                  src={HERO_SLIDES[currentSlide].image}
                  alt={HERO_SLIDES[currentSlide].imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Floating Image Tag Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-primary-800 shadow-md border border-gray-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  {HERO_SLIDES[currentSlide].tag}
                </div>
              </div>
            </div>

            {/* Text Column - Mobile এ নিচে (order-2), Desktop এ বামে (lg:order-1) */}
            <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left z-10">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary-100/80 text-primary-800 border border-primary-200/60 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full animate-fade-in">
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span>{HERO_SLIDES[currentSlide].badge}</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight sm:leading-tight">
                {HERO_SLIDES[currentSlide].title}{' '}
                <span className="text-primary-600 underline decoration-accent-400 decoration-wavy decoration-2 underline-offset-4">
                  {HERO_SLIDES[currentSlide].highlightText}
                </span>
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-base text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {HERO_SLIDES[currentSlide].description}
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1 sm:pt-2">
                <Link
                  to={HERO_SLIDES[currentSlide].primaryBtnLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg shadow-primary-600/25 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{HERO_SLIDES[currentSlide].primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to={HERO_SLIDES[currentSlide].secondaryBtnLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl border border-gray-200/80 transition-all cursor-pointer"
                >
                  <span>{HERO_SLIDES[currentSlide].secondaryBtnText}</span>
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-center lg:justify-start gap-5 sm:gap-6 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-primary-600" /> বিশুদ্ধ উপাদান
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-primary-600" /> ক্যাশ অন ডেলিভারি
                </span>
              </div>

            </div>

          </div>

          {/* Slider Arrow Controls */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg border border-gray-100 transition-all hover:scale-110 active:scale-95 hidden sm:flex cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg border border-gray-100 transition-all hover:scale-110 active:scale-95 hidden sm:flex cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-6 lg:mt-0 lg:absolute lg:bottom-6 lg:left-12">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === index 
                    ? 'w-8 bg-primary-600' 
                    : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-xs text-gray-500 font-normal mt-0.5 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};