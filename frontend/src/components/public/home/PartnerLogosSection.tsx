import React from 'react';
import partnersData from '../../../data/partners.json';

export interface Partner {
  id: string;
  name: string;
  logo: string;
  websiteUrl?: string;
}

const partners = partnersData as Partner[];

export const PartnerLogosSection: React.FC = () => {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm font-bold text-primary-600 uppercase tracking-wider mb-1">
            বিশ্বস্ত পার্টনার ও ব্র্যান্ডস
          </p>
          <h3 className="text-lg sm:text-2xl font-black text-gray-900">
            যে সকল বিখ্যাত কোম্পানির অফিসিয়াল পণ্য সরবরাহ করি
          </h3>
        </div>

        {/* Logos Flex Wrapper (Centering items when fewer logos exist) */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center p-4 sm:p-6 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-white hover:shadow-md transition-all duration-300 group h-24 w-[calc(50%-0.5rem)] sm:w-44 md:w-48"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                title={partner.name}
                className="max-h-12 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



