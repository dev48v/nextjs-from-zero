Day 5 - Most developers learn Next.js by building a todo app. I fetched real articles from the DEV.to API to show exactly why SSR, SSG, and ISR are three different tools — and when each one actually matters.

🚀TechFromZero Series - NextjsFromZero

This isn't a Hello World. It's a real rendering strategy decision at every route:
📐 SSG Home → DEV.to API → ISR cache (revalidate) → SSR Article detail → hydrated React client

🌐 Try it live: https://nextjs-from-zero.vercel.app

🔗 The full code (with step-by-step commits you can follow):
https://github.com/dev48v/nextjs-from-zero

🧱 What I built (step by step):
1️⃣ Initialised Next.js project with TypeScript and Tailwind CSS
2️⃣ Added TypeScript types for every DEV.to API response shape
3️⃣ Built the DEV.to API utility with typed fetch helpers
4️⃣ Created a Layout component with a shared header and footer
5️⃣ Built ArticleCard and TagBadge reusable components
6️⃣ Built the Home page with SSG + client-side search filtering
7️⃣ Built the Article detail page with SSR (fresh on every request)
8️⃣ Built the Tag filter page with SSG + ISR revalidation
9️⃣ Built the Author profile page with SSG + ISR revalidation
🔟 Added a full README with quickstart guide + fixed tag_list normalisation

💡 Every file has detailed comments explaining WHY, not just what. Written for any beginner who wants to learn Next.js by reading real code — with full clarity on each step.

👉 If you're a beginner learning Next.js, clone it and read the commits one by one. Each commit = one concept. Each file = one lesson. Built from scratch, so nothing is hidden.

🔥 This is Day 5 of a 50-day series. A new technology every day. Follow along!

🌐 See all days: https://dev48v.infy.uk/techfromzero.php

#TechFromZero #Day5 #NextJS #LearnByDoing #OpenSource #BeginnerGuide #100DaysOfCode #CodingFromScratch
