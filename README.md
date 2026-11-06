# DEFREEZE Web Application ❄️✨

> **"Break free. Become."**  
> An exclusive physical conversation experience this November. 25 spots. One experience. A step towards becoming.

---

## 🚀 Key Features

1. **3D Landing Splash (`/components/SplashModal.tsx` & `ThreeDefreezeMind.tsx`)**:
   - Built with **Three.js** featuring a 3D shattered crystal mind/head with dynamic light caustics, refraction, and orbiting ice shards.
   - Real-time thawing animation with opacity & facet transformation.
   - Animated "ANTICIPATE" tape styling and inspirational copy from the official flyers.
   - "Enter DEFREEZE" unlock button revealed upon thawing.

2. **Mindset Questionnaire Overlay (`/components/QuestionnaireModal.tsx`)**:
   - Slides up immediately after entering the experience.
   - Captures where the visitor feels stuck (Career, Creative Ideas, Personal Growth, Habits, Taking the First Step), their obstacles (Overthinking, Comparison, Fear of Failure), what they hope to unlock, and their readiness score (1-10).
   - Automatically pairs these answers with their reservation record!

3. **High-Impact Main Site (`/` Page)**:
   - **Hero Section**: Continuous 3D interactive crystal character with cursor parallax, capacity status meter, and direct CTA.
   - **The DEFREEZE Manifesto**: The complete story and philosophy (*"What if you're not stuck because you lack potential?"*).
   - **The Conversation Experience**: Highlights of the exclusive November 2026 event, showing the official flyer imagery (`defreeze-flyer-friends.jpg` and `defreeze-flyer-ice.jpg`).
   - **The 4 Pillars**: Shared Experiences, Honest Conversations, Engaging Activities, and Unbreakable Accountability.
   - **Event Details & FAQs**: Logistics, curated Lagos venue, schedule, and cohort criteria.

4. **Live 25-Spot Countdown & Reservation Form (`/components/ReservationSection.tsx`)**:
   - Real-time capacity tracker showing remaining spots out of 25.
   - Decrements automatically whenever an administrator confirms a payment.
   - Captures Full Name, WhatsApp Phone Number, Email, and Gender.

5. **Bank Details Pop-up Modal (`/components/PaymentModal.tsx`)**:
   - Pops up upon clicking *"Reserve My Spot"*.
   - Displays:
     - **Bank Name**
     - **Account Number** (with 1-click **Copy** button + feedback)
     - **Account Name**
     - **Amount** (with 1-click **Copy** button + feedback)
   - These details are dynamically editable in real-time from the `/admin` portal!
   - *"I Have Sent The Money"* button advances to receipt upload.

6. **Payment Receipt Upload & Celebration**:
   - Accepts `.jpg`, `.jpeg`, and `.png` transfer receipts.
   - Live image preview before submitting.
   - *"Confirm Payment"* submits the reservation to the database.
   - Celebratory confetti pop-up:
     > *"Reservation Request Received! The team will verify your payment, and a confirmation email will be sent to you as soon as payment has been confirmed. Come as you are, leave a little lighter. See you at DEFREEZE!"*

7. **Admin Control & Review Dashboard (`/admin`)**:
   - Passcode protected (default: `defreeze2026`, configurable via `NEXT_PUBLIC_ADMIN_PASSCODE`).
   - **Live Bank Details & Spot Limit Manager**: Edit bank name, account number, account name, ticket price, and capacity limit in real time!
   - **Attendee Review Table**: View attendee name, email, phone (with direct WhatsApp link), gender, and full mindset answers.
   - **Receipt Viewer Modal**: View high-resolution payment receipt photos.
   - **"Payment Confirmed" Button**: Instantly marks the reservation confirmed and decrements the remaining spots countdown across the website!
   - **CSV Export**: One-click download of all attendee records for the event check-in desk.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS, Custom Ice Glassmorphism & Cyber Gradients
- **3D Graphics**: Three.js (WebGL, PBR shaders, particle systems)
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, CSS Keyframe Glows
- **Database / Backend**: Supabase (PostgreSQL, Storage, Realtime) with resilient offline/local fallback.

---

## 🗄️ Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the SQL code from [`supabase/schema.sql`](./supabase/schema.sql).
4. Go to **Project Settings -> API** and copy:
   - `Project URL`
   - `anon public key`
5. Create a `.env.local` file (or set these in Vercel):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_ADMIN_PASSCODE=defreeze2026
   ```

*Note: The app is equipped with a smart local storage layer, so it functions immediately out of the box even before Supabase credentials are added.*

---

## 📦 Pushing to GitHub

To push this repository to GitHub:

```bash
# 1. Create a repository on github.com (e.g. "defreeze-site")
# 2. Add remote origin:
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 3. Push to main:
git push -u origin main
```

---

## ▲ Deploying to Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New... -> Project** and select your GitHub repository.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PASSCODE`
4. Click **Deploy**!

---

## 💻 Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the main experience or [http://localhost:3000/admin](http://localhost:3000/admin) for the admin portal.
