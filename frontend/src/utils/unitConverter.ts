// ১. প্রোডাক্টের ইউনিট পার্স করার ফাংশন
export const parseProductUnit = (unitLabel: string = '') => {
  if (!unitLabel) return { baseAmount: 1, unitLabel: '' };

  const match = unitLabel.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);

  if (match) {
    return {
      baseAmount: parseFloat(match[1]),
      unitLabel: match[2].trim(),
    };
  }

  return {
    baseAmount: 1,
    unitLabel: unitLabel.trim(),
  };
};

// ২. ডিসপ্লে ইউনিট ফরম্যাট করার ফাংশন (mili, ml, মিলি, মি.লি. সব কভার করা হয়েছে)
export const formatDisplayUnit = (quantity: number, unitLabel: string = '') => {
  const unitLower = unitLabel.toLowerCase();

  // গ্রাম থেকে কেজি conversion
  if ((unitLower.includes('gram') || unitLower.includes('গ্রাম')) && quantity >= 1000) {
    const kgValue = Number((quantity / 1000).toFixed(2));
    return {
      quantity: kgValue,
      unit: 'কেজি'
    };
  }

  // মি.লি. / মিলি / ml / mili থেকে লিটার conversion
  const isMl = 
    unitLower.includes('ml') || 
    unitLower.includes('mili') || 
    unitLower.includes('মি.লি.') || 
    unitLower.includes('মিলি');

  if (isMl && quantity >= 1000) {
    const literValue = Number((quantity / 1000).toFixed(2));
    return {
      quantity: literValue,
      unit: 'লিটার'
    };
  }

  return {
    quantity,
    unit: unitLabel
  };
};

