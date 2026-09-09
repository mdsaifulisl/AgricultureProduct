export interface ParsedUnit {
  initialQuantity: number;
  baseAmount: number;
  unitLabel: string;
}

export const parseProductUnit = (unitStr?: string): ParsedUnit => {
  if (!unitStr) {
    return { initialQuantity: 1, baseAmount: 1, unitLabel: '' };
  }

  const trimmed = unitStr.trim();

  // ১. বাংলা সংখ্যাকে ইংরেজিতে রূপান্তর
  const banglaToEnglishMap: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  const convertedStr = trimmed.replace(/[০-৯]/g, (match) => banglaToEnglishMap[match]);

  // ২. দশমিক বা পূর্ণসংখ্যা খোঁজা (যেমন: .5, 0.5, 200, 1200)
  const match = convertedStr.match(/(\d*\.)?\d+/);

  // ৩. ইউনিট লেবেল ক্লিন করা
  let cleanLabel = convertedStr
    .replace(/(\d*\.)?\d+/g, '')
    .replace(/[()]/g, '')
    .trim();

  const unitLower = cleanLabel.toLowerCase();

  if (match) {
    let num = parseFloat(match[0]);
    num = isNaN(num) || num <= 0 ? 1 : num;

    // 💡 হাফ কেজি/পয়েন্ট হ্যান্ডলিং (.৫ বা 0.5 হলে ৫০০ করা)
    if (num < 1) {
      if (
        unitLower.includes('gram') ||
        unitLower.includes('গ্রাম') ||
        unitLower.includes('kg') ||
        unitLower.includes('কেজি') ||
        unitLower.includes('ml') ||
        unitLower.includes('মি.লি.')
      ) {
        num = num * 1000; // 0.5 -> 500
      }
    }

    // 💡 ১০০০ বা তার বেশি হলে গ্রাম -> কেজি এবং মি.লি. -> লিটার করা
    if (num >= 1000) {
      if (unitLower.includes('gram') || unitLower.includes('গ্রাম')) {
        num = Number((num / 1000).toFixed(2)); // ১২০০ -> ১.২
        cleanLabel = 'কেজি';
      } else if (unitLower.includes('ml') || unitLower.includes('মি.লি.') || unitLower.includes('mili')) {
        num = Number((num / 1000).toFixed(2));
        cleanLabel = 'লিটার';
      }
    }

    return {
      initialQuantity: num,
      baseAmount: num,
      unitLabel: cleanLabel || trimmed,
    };
  }

  return {
    initialQuantity: 1,
    baseAmount: 1,
    unitLabel: cleanLabel || trimmed,
  };
};