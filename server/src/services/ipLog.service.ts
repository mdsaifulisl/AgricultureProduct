import prisma from '../config/prisma.js'; 

// ১. অর্ডার করার সময় IP চেক করা ও ডাটাবেজে সেভ রাখা
interface OrderUserInfo {
  fullName?: string;
  phone?: string;
}

// ১. অর্ডার করার সময় IP চেক করা এবং নাম-ফোনসহ সেভ/আপডেট করা
export const checkAndSaveIpService = async (
  clientIp: string,
  userInfo?: OrderUserInfo
) => {
  if (!clientIp) return;

  // IP ডাটাবেজে আছে কিনা চেক
  const ipRecord = await prisma.ipLog.findUnique({
    where: { ip: clientIp },
  });

  // IP না থাকলে নতুন ক্রিয়েট করবে, আর থাকলে নাম ও ফোন আপডেট করবে (যদি নতুন অর্ডারে তথ্য থাকে)
  if (!ipRecord) {
    await prisma.ipLog.create({
      data: {
        ip: clientIp,
        fullName: userInfo?.fullName || null,
        phone: userInfo?.phone || null,
        isBlocked: false,
      },
    });
  } else {
    await prisma.ipLog.update({
      where: { ip: clientIp },
      data: {
        fullName: userInfo?.fullName || ipRecord.fullName,
        phone: userInfo?.phone || ipRecord.phone,
      },
    });
  }
};

// ২. ফ্রন্টএন্ডে সব IP (নাম ও ফোনসহ) দেখানোর সার্ভিস
export const getAllIpsService = async () => {
  return await prisma.ipLog.findMany({
    select: {
      id: true,
      ip: true,
      fullName: true,
      phone: true,
      isBlocked: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });
};

// ৩. ফ্রন্টএন্ড থেকে IP ব্লক / আনব্লক করার সার্ভিস
export const toggleBlockIpService = async (ip: string, isBlocked: boolean) => {
  return await prisma.ipLog.upsert({
    where: { ip },
    update: { isBlocked },
    create: {
      ip,
      isBlocked,
    },
  });
};

export const getDeviceBlocksService = async () => {
  const [orderGroups, blocks] = await Promise.all([
    prisma.order.groupBy({
      by: ['deviceFingerprint'],
      where: { deviceFingerprint: { not: null } },
      _count: { _all: true },
      _max: { createdAt: true },
    }),
    prisma.deviceBlock.findMany(),
  ]);
  const blockedByFingerprint = new Map(blocks.map((block) => [block.fingerprint, block]));
  const seen = new Set<string>();
  const devices = orderGroups.flatMap((group) => {
    const fingerprint = group.deviceFingerprint;
    if (!fingerprint) return [];
    seen.add(fingerprint);
    const block = blockedByFingerprint.get(fingerprint);
    return [{
      id: block?.id || fingerprint,
      fingerprint,
      orderCount: group._count._all,
      lastOrderAt: group._max.createdAt,
      reason: block?.reason || null,
      isBlocked: block?.isBlocked || false,
    }];
  });
  for (const block of blocks) {
    if (!seen.has(block.fingerprint)) devices.push({
      id: block.id,
      fingerprint: block.fingerprint,
      orderCount: 0,
      lastOrderAt: null,
      reason: block.reason,
      isBlocked: block.isBlocked,
    });
  }
  return devices.sort((a, b) => Number(b.isBlocked) - Number(a.isBlocked) || b.orderCount - a.orderCount);
};
export const toggleDeviceBlockService = (fingerprint: string, isBlocked: boolean, reason?: string) =>
  prisma.deviceBlock.upsert({
    where: { fingerprint },
    update: { isBlocked, reason: reason || null },
    create: { fingerprint, isBlocked, reason: reason || null },
  });



