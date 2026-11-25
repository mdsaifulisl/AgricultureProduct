import React, { useEffect } from 'react';
import { usePartner } from '../../../features/partner/usePartner';

export interface Partner {
  id: string;
  name: string;
  logo: string;
  websiteUrl?: string;
  createdAt?: string; 
  updatedAt?: string;
}

export const PartnerLogosSection: React.FC = () => {
  const { partners, getAllPartners } = usePartner();

  const partnersData = (partners || []) as Partner[];

  useEffect(() => {
    if (getAllPartners) {
      getAllPartners();
    }
  }, [getAllPartners]);

  if (!partnersData || partnersData.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm font-bold text-primary-600 uppercase tracking-wider mb-1">
            বিশ্বস্ত পার্টনার ও ব্র্যান্ডস
          </p>
          <h3 className="text-lg sm:text-2xl font-black text-gray-900">
            যে সকল বিখ্যাত কোম্পানির অফিসিয়াল পণ্য সরবরাহ করি
          </h3>
        </div>

        {/* Logos Flex Wrapper */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {partnersData.map((partner) => (
            <div
              key={partner.id || partner.name}
              // প্যাডিং তুলে দিয়ে কন্টেইনারের সাইজ পারফেক্ট করা হয়েছে
              className="flex items-center justify-center overflow-hidden bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-primary-300 hover:bg-white hover:shadow-lg transition-all duration-300 group h-20 sm:h-22 w-[calc(50%-0.5rem)] sm:w-44 md:w-48 px-3"
            >
              {partner.websiteUrl ? (
                <a
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-full"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    title={partner.name}
                    // অবজেক্ট কনটেইন বা কভার রেখে লোগো শতভাগ কভার করার ব্যবস্থা
                    className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                  />
                </a>
              ) : (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  title={partner.name}
                  className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};