export const getCleanUnit = (unitString: string): string => {
  if (!unitString) return '';
  const clean = unitString.replace(/[0-9০-৯\s]/g, '').trim();
  return clean || unitString.trim();
};