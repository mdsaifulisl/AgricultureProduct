# cPanel/Passenger-এ deployment নির্দেশনা

এই প্রকল্পে PM2 ব্যবহার করা হয় না। cPanel-এর **Setup Node.js App/Passenger** দিয়ে Node.js অ্যাপ চালু রাখুন। অ্যাপের Application root হবে `public_html/server`, Startup file হবে `dist/server.js`, এবং Application URL আপনার domain-এর root হবে—যদি Express থেকেই `frontend/dist` serve করানো হয়। Hosting panel-এর path format ও Node version-এর নির্দেশনা অনুসরণ করুন।

## Build ও deploy

Production environment variables cPanel-এ সেট করুন; `.env`-এর secret Git-এ দেবেন না। `DATABASE_URL` hosting server থেকে reachable হতে হবে। Frontend code বদলালে:

```bash
cd ~/public_html/frontend
npm ci
npm run build
```

তারপর server build ও migration:

```bash
cd ~/public_html/server
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
```

Build শেষে cPanel-এর **Setup Node.js App** থেকে অ্যাপটি Restart করুন। `server`-এর `npm run deploy:prod` dependency install, Prisma generate/migration, TypeScript build চালায়; frontend build կամ app process start করে না।

## হোস্টিং সেটিং

- cPanel/Passenger-এ অ্যাপটি চালু করে domain routing সেট করতে হবে। PM2 বা `node dist/server.js` আলাদা background process হিসেবে চালাবেন না।
- Reverse proxy থাকলে hosting-এর নির্দেশনা অনুযায়ী trusted proxy configure করুন। `PORT` hosting panel দিলে সেটি গ্রহণ করুন; `.env`-এর স্থির port যেন Passenger-এর port-কে override না করে।
- Hosting-এর CPU, memory, process/thread এবং database connection quota মানুন। `DB_POOL_SIZE` কম রাখুন এবং provider-এর PostgreSQL limit অতিক্রম করবেন না।
- Redis না থাকলে rate-limit counter এক app process-এর memory-তে থাকে; restart-এ reset হয়। একাধিক worker চালালে shared Redis/Valkey store দরকার।

Shared hosting-এর concurrency ক্ষমতা hosting quota ও database connection budget-এর ওপর নির্ভরশীল; load test ছাড়া সমসাময়িক user সংখ্যা নিশ্চিত করা যায় না।



