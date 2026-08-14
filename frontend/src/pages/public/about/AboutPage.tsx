import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ShieldCheck, 
  Truck,  
  Award, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight,
  Leaf,
  PhoneCall
} from 'lucide-react';

// Stat Interface
interface StatItem {
  id: string;
  value: string;
  label: string;
}

// Feature Interface
interface FeatureItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Team Member Interface
interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

const STATS: StatItem[] = [
  { id: '1', value: '১০,০০০+', label: 'সন্তুষ্ট গ্রাহক' },
  { id: '2', value: '৫০০+', label: 'নিবন্ধিত কৃষক' },
  { id: '3', value: '১০০%', label: 'রাসায়নিক মুক্ত পণ্য' },
  { id: '4', value: '৬৪', label: 'জেলায় ডেলিভারি' }
];

const FEATURES: FeatureItem[] = [
  {
    id: '1',
    icon: <Leaf className="w-6 h-6 text-primary-600" />,
    title: '১০০% খাঁটি ও তাজা',
    description: 'কোনো প্রকার ক্ষতিকর রাসায়নিক বা ফরমালিন ছাড়াই মাঠ থেকে সরাসরি সংগৃহীত তাজা কৃষিপণ্য।'
  },
  {
    id: '2',
    icon: <HeartHandshake className="w-6 h-6 text-primary-600" />,
    title: 'কৃষকদের ন্যায্য মূল্য',
    description: 'মধ্যস্বত্বভোগীদের বাদ দিয়ে সরাসরি কৃষকদের কাছ থেকে পণ্য কিনে তাদের সঠিক মূল্য নিশ্চিত করি।'
  },
  {
    id: '3',
    icon: <Truck className="w-6 h-6 text-primary-600" />,
    title: 'দ্রুত ও নিরাপদ ডেলিভারি',
    description: 'ঢাকার ভেতরে এবং বাইরে বিশেষ প্যাকেজিংয়ের মাধ্যমে পণ্যের সতেজতা বজায় রেখে দ্রুত ডেলিভারি।'
  },
  {
    id: '4',
    icon: <ShieldCheck className="w-6 h-6 text-primary-600" />,
    title: 'মান নিয়ন্ত্রণ ও গ্যারান্টি',
    description: 'প্রতিটি পণ্য বাজারজাত করার আগে আমাদের নিজস্ব মান নিয়ন্ত্রণ টিম দ্বারা পুঙ্খানুপুঙ্খ পরীক্ষা করা হয়।'
  }
];

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'মাহেদুল মল্লিক',
    role: 'প্রতিষ্ঠাতা ও সিইও',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'ড. আমিনুল ইসলাম',
    role: 'প্রধান কৃষি উপদেষ্টা',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'নাসরিন আক্তার',
    role: 'কোয়ালিটি কন্ট্রোল হেড',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop'
  }
];

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-gray-50/50 min-h-screen pb-16">
      
      {/* 1. Hero Section */}
      <section className="bg-primary-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-800/60 backdrop-blur-sm border border-primary-700/50 px-4 py-1.5 rounded-full text-primary-100 text-xs sm:text-sm font-semibold mb-6">
            <Sprout className="w-4 h-4 text-accent-400" />
            <span>আমাদের পরিচিতি</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-6 leading-tight">
            কৃষক ও ভোক্তার মাঝে <br className="hidden sm:inline" />
            <span className="text-accent-400">আস্থার নিরাপদ সেতু</span>
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            ReliableKrishi-এর লক্ষ্য হলো বিষমুক্ত, তাজা ও খাঁটি কৃষিপণ্য সরাসরি কৃষকের মাঠ থেকে আপনার দরজায় পৌঁছে দেওয়া এবং কৃষককে তার কষ্টের ন্যায্য মূল্য এনে দেওয়া।
          </p>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {STATS.map((stat) => (
            <div key={stat.id} className="p-2">
              <div className="text-2xl sm:text-4xl font-black text-primary-700 mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Our Story / Vision Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative">
            <div className="relative h-80 sm:h-[420px] rounded-3xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=800&auto=format&fit=crop" 
                alt="কৃষকের হাসিমুখ" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">সেরা কৃষি ই-কমার্স</div>
                <div className="text-xs text-gray-500">গ্রাহক সন্তুষ্টি ও নির্ভরযোগ্যতায়</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-primary-700 font-bold text-xs uppercase tracking-wider">
              <Sprout className="w-4 h-4" /> আমাদের মূল লক্ষ্য
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 leading-snug">
              আমরা কীভাবে বাজারে একটি ইতিবাচক পরিবর্তন আনছি?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              প্রচলিত বাজার ব্যবস্থায় কৃষকরা কঠোর পরিশ্রম করেও উপযুক্ত মূল্য পান না, অন্যদিকে ভোক্তারা অতিরিক্ত দামে রাসায়নিক যুক্ত অস্বাস্থ্যকর খাবার কিনে থাকেন। ReliableKrishi এই সমস্যার স্থায়ী সমাধান নিয়ে এসেছে।
            </p>

            <ul className="space-y-3 pt-2">
              {[
                'কৃষক থেকে সরাসরি সংগৃহীত তাজা ফল, সবজি ও বীজ',
                'মধ্যস্বত্বভোগী মুক্ত স্বচ্ছ মূল্য নির্ধারণ ব্যবস্থা',
                'পরিবেশবান্ধব ও সুনির্দিষ্ট মানের প্যাকিং ব্যবস্থা',
                '২৪/৭ ডেডিকেটেড কাস্টমার সাপোর্ট সার্ভিস'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-6 py-3 rounded-full transition-all shadow-md shadow-primary-200 cursor-pointer"
              >
                <span>পণ্যসমূহ দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Why Choose Us (Features) */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              কেন আমাদের বেছে নেবেন?
            </h2>
            <p className="text-gray-500 text-sm">
              আমরা আপনাকে দিচ্ছি সর্বোচ্চ গুণগত মান এবং সততার শতভাগ নিশ্চয়তা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div 
                key={feature.id} 
                className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100/80 hover:bg-white hover:shadow-lg hover:border-primary-100 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
            আমাদের পেছনের মুখসমূহ
          </h2>
          <p className="text-gray-500 text-sm">
            একঝাঁক তরুণ ও অভিজ্ঞ কৃষি বিশেষজ্ঞদের নিয়ে আমাদের টিম গঠিত।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div 
              key={member.id} 
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow text-center p-6"
            >
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden mb-4 ring-4 ring-primary-50">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <p className="text-primary-600 text-xs font-semibold mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Call to Action (CTA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gradient-to-r from-primary-800 to-primary-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl">
          <div className="space-y-2 text-center md:text-left z-10">
            <h3 className="text-2xl sm:text-3xl font-bold">
              যে কোনো পরামর্শ বা অর্ডারের জন্য যোগাযোগ করুন
            </h3>
            <p className="text-primary-200 text-xs sm:text-sm">
              আমাদের সাপোর্ট টিম সপ্তাহের ৭ দিনই আপনার সহায়তায় প্রস্তুত।
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 z-10">
            <a 
              href="tel:01700000000" 
              className="inline-flex items-center gap-2 bg-white text-primary-900 hover:bg-primary-50 font-bold text-sm px-6 py-3 rounded-full transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-primary-600" />
              <span>কল করুন: ০১৭০০-০০০০০</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;