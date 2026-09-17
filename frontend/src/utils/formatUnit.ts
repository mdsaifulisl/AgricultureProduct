// utils/formatUnit.ts
export const getCleanUnit = (unitString: string): string => {
  if (!unitString) return '';
  
  // সংখ্যা এবং খালি স্পেস রিমুভ করা
  const clean = unitString.replace(/[0-9০-৯\s]/g, '').toLowerCase();

  if (clean.includes('kg') || clean.includes('কেজি')) return 'কেজি';
  if (clean.includes('gm') || clean.includes('gram') || clean.includes('গ্রাম')) return 'গ্রাম';
  if (clean.includes('ltr') || clean.includes('liter') || clean.includes('লিটার')) return 'লিটার';
  if (clean.includes('ml') || clean.includes('মিলি')) return 'মিলি';
  if (clean.includes('pcs') || clean.includes('piece') || clean.includes('পিস')) return 'পিস';

  return clean || unitString;
};
