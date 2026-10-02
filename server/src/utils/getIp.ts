// utils/getIp.ts
import { Request } from "express";

export const getClientIp = (req: Request): string => {
  let ip = "";

  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    ip = forwarded.split(",")[0].trim();
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    ip = forwarded[0].trim();
  } else {
    ip = req.socket.remoteAddress || req.ip || "";
  }

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