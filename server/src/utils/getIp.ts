// utils/getIp.ts
import { Request } from "express";

export const getClientIp = (req: Request): string => {
  let ip = req.ip || req.socket.remoteAddress || "";

  // ::ffff:127.0.0.1 থেকে ::ffff: অংশটি বাদ দেওয়া হচ্ছে
  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  // IPv6 Loopback (::1) কে 127.0.0.1 করা (Optional)
  if (ip === "::1") {
    ip = "127.0.0.1";
  }

  return ip;
};
