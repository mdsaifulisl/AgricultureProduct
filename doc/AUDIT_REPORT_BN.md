# ওয়েবসাইট নিরাপত্তা ও পারফরম্যান্স নিরীক্ষা

তারিখ: ২৮ অক্টোবর ২০২৬  
পরিধি: `frontend` React/Vite এবং `server` Express/Prisma/PostgreSQL

## সম্পন্ন সংশোধন

1. **Sitemap ও robots.txt:** `/sitemap.xml` এবং `/robots.txt` routes API-র পরে, কিন্তু static assets ও SPA fallback-এর আগে রাখা হয়েছে। Sitemap handler এখন অ্যাপের shared Prisma client ব্যবহার করে, ফলে অনুরোধপ্রতি নতুন database pool তৈরি হয় না।
2. **উচ্চ ট্রাফিক নিয়ন্ত্রণ:** API-তে সাধারণ rate limit, order POST-এ fingerprint-ভিত্তিক সীমা (৮টি/১৫ মিনিট; fingerprint অনুপস্থিত হলে IP fallback), login/OTP routes-এ সীমা (১০টি/১৫ মিনিট), JSON body limit ১ MB, configurable Prisma pool এবং graceful shutdown যুক্ত হয়েছে। Status monitor default-এ বন্ধ; দরকারে `ENABLE_STATUS_MONITOR=true` দিন।
3. **নির্দিষ্ট device blocking:** Checkout ব্রাউজারে random device ID সংরক্ষণ করে SHA-256 hash পাঠায়। Order-এ hash সংরক্ষিত হয় এবং admin order details থেকে device block করা যায়; `/api/v1/iplog/devices` এবং `/devices/toggle-block` admin-only। IP log থাকলেও IP ব্লক আর অর্ডার আটকায় না।
4. **YouTube embed:** public ও seller iframe-এ `youtube-nocookie.com`, `autoplay=1`, `mute=1`, `playsinline=1`, encoded `origin`, `strict-origin-when-cross-origin` referrer policy যুক্ত হয়েছে। Helmet-এর `frameSrc`/`childSrc`-এ nocookie host অনুমোদিত। Video খোলার ব্যবহারকারীর click-ই play trigger করে; autoplay ব্যর্থ হলে YouTube player-এর নিজস্ব play control থাকে।
5. **অর্ডার ও authentication hardening:** client থেকে order status/seen/IP আর গ্রহণ করা হয় না; payment method COD-তে সীমিত। Order total, delivery fee এবং item-এর নাম/দাম/ছবি এখন server-এর product/settings data থেকে হিসাব হয়। Login brute-force limiter, JWT secret fallback বাদ, দুর্বল ডিফল্ট admin password বাদ, OTP cryptographically random ও database-এ bcrypt-hash, SMTP certificate verification পুনরায় চালু করা হয়েছে।
6. **XSS:** প্রকাশ্য blog content render করার আগে allowlist sanitizer চালানো হয়; script, event handler এবং বিপজ্জনক URL attribute বাদ পড়ে। CSP থেকে `unsafe-eval` সরানো হয়েছে।

## Deploy করার আগে আবশ্যক

- `server/.env`-এ `JWT_SECRET` অন্তত ৩২ অক্ষরের random secret দিন। `INITIAL_ADMIN_EMAIL` ও `INITIAL_ADMIN_PASSWORD` প্রথম admin তৈরির জন্য দিন; password অন্তত ১২ অক্ষরের রাখুন। বিদ্যমান database-এ admin থাকলে seed নতুন account বানাবে না।
- `CORS_ORIGINS`-এ production frontend origin-গুলো comma-separated দিন, যেমন `https://shop.example.com`. বর্তমানে explicit origin allowlist চালু।
- Reverse proxy ঠিক কত hop-এ client request পাঠায় তা যাচাই করে `TRUST_PROXY_HOPS` সেট করুন। ভুল hop count rate limiter-এর client identity ভুল করতে পারে।
- `DB_POOL_SIZE`/`DB_POOL_TIMEOUT` deployment-এর PostgreSQL connection budget অনুযায়ী দিন। প্রতি replica-র pool size গুণ replica সংখ্যা যেন DB `max_connections` অতিক্রম না করে। Default pool size ১০।
- `npm run prisma:deploy` চালিয়ে `20261028000000_device_fingerprint_blocks` migration প্রয়োগ করুন, তারপর server deploy করুন।

## অবশিষ্ট ঝুঁকি ও পরবর্তী কাজ

| অগ্রাধিকার | পর্যবেক্ষণ | প্রভাব / সুপারিশ |
|---|---|---|
| উচ্চ | Rate limiter-এর default memory store প্রতিটি Node process-এ আলাদা | একাধিক server/replica বা restart-এ সীমা shared নয়। Production-এ Redis-backed store যুক্ত করুন। বর্তমান সীমাগুলো একক process-এ কার্যকর। |
| উচ্চ | `Order` তালিকা `findMany` দিয়ে সব order ও items একবারে ফেরত দেয় | ডেটা বাড়লে DB, memory ও response latency বাড়ে। Cursor pagination, date/status filters এবং সীমিত projection যোগ করতে হবে। |
| মাঝারি | Device ID localStorage-এর random token; প্রকৃত hardware fingerprint নয় | storage মুছলে, private mode বা অন্য browser-এ নতুন hash হবে; spoof করাও সম্ভব। এটি এক Wi-Fi-র সবাইকে আটকে না দিয়ে browser profile-ভিত্তিক ব্যবহারিক শনাক্তকরণ দেয়, নিশ্চিত পরিচয় নয়। প্রয়োজনে phone OTP/account verification-এর সঙ্গে ব্যবহার করুন। |
| মাঝারি | `trust proxy` এখন default-এ বন্ধ | reverse proxy-র পেছনে deploy করলে `TRUST_PROXY_HOPS` না দিলে client IP সঠিক নাও হতে পারে। Fingerprint blocking এতে নির্ভর করে না। |
| মাঝারি | Main frontend bundle build-এ প্রায় 1.6 MB (gzip ~444 KB) | Initial load ধীর হতে পারে। Route-level lazy loading এবং chart/admin code split করুন। |
| মাঝারি | Rich text sanitizer client-side | বর্তমান browser display XSS ঝুঁকি কমায়; একই HTML অন্য consumer/API-তে ব্যবহার করলে server-side sanitize-ও যোগ করতে হবে। |
| মাঝারি | CORS allowlist এবং CSP production host নির্ভর | Deployment URL-গুলো environment-এ ঠিক না দিলে API/CSP resource load ব্যর্থ হবে। CSP-তে image/connect wildcard scheme rules production-specific origins-এ সংকুচিত করা যায়। |
| নিম্ন | Sitemap static `yourdomain.com` fallback এবং dynamic URL সংখ্যা সীমাহীন | `CLIENT_URL` production-এ নির্ধারণ করুন। ৫০,০০০ URL অতিক্রম করলে sitemap index/partition তৈরি করতে হবে। |

## যাচাই

- `npx prisma generate` সফল।
- `server` TypeScript build সফল।
- `frontend` TypeScript/Vite production build সফল; Vite 500 KB chunk warning দেখিয়েছে (bundle splitting সুপারিশ করা হয়েছে)।
- Production database migration চালানো হয়নি; deploy pipeline-এ `npm run prisma:deploy` চালাতে হবে।
