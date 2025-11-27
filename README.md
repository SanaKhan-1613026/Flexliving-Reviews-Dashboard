#Flex Living – Reviews Dashboard

A reviews analytics and management dashboard built for Flex Living as part of the Flex project assessment.  
This application enables managers to explore property performance, inspect reviews, identify recurring issues, and approve reviews for public display.

Live Demo:  
https://flexliving-reviews-dashboard-beige.vercel.app

GitHub Repository:  
https://github.com/SanaKhan-1613026/Flexliving-Reviews-Dashboard


#Overview

This project implements a lightweight review-analytics tool inspired by the internal needs of a property-management team. It provides:

- A unified, normalized review API (simulating Hostaway data)
- Per-property dashboards with rating breakdowns
- Review approval workflow
- Public-facing property pages reflecting approved reviews
- Aggregated analytics across categories, channels, and time
- A clean, modern Next.js 14+ UI

The goal was to focus on clarity, insight, and a structure that mirrors real-world property-operations workflows.

#Features

#Property-Level Dashboard
- View all properties with average ratings and review volume
- Open each property to explore category ratings, review distribution, and channel mix

#Review Moderation
- Approve or hide reviews
- Approved reviews automatically appear on the public property page
- Supports categories such as cleanliness, communication, location, etc.

#Analytics Module
- Pie charts and bar charts using Recharts
- Category breakdowns
- Channel distribution (Airbnb, Booking.com, Hostaway, Google)
- Rating trends and quick-glance summaries

#Public Property Page
- Clean layout inspired by Flex Living’s front-facing design
- Displays only approved reviews
- Simulates a real guest-facing property profile

#Review API (Mock Hostaway Simulation)
Because Hostaway sandbox returns an empty response, a mock JSON file is used.  
API path:


The API performs:
1. Loading mock review JSON  
2. Normalizing fields  
3. Returning a clean `Review[]` structure used by all UI components  

#Tech Stack

| Layer | Technology |
|------|-------------|
| Frontend | React, Next.js App Router |
| Styling | Tailwind CSS |
| Charts | Recharts |
| API | Next.js Route Handlers |
| Deployment | Vercel |
| Language | TypeScript |


#Architecture Overview

app/
├─ dashboard/ → Manager overview
├─ properties/ → Property list
├─ property/[id]/ → Internal property details
│ ├─ page.tsx → Reviews, analytics, filters
│ └─ public/ → Public-facing approved reviews
├─ analytics/ → General analytics
├─ api/
│ └─ reviews/
│ └─ hostaway → Normalized review API
public/ → Icons, assets
mockReviews.json → Simulated Hostaway data
next.config.ts → Remote image config


The layout is intentionally simple, readable, and scalable for future integration with real APIs.


#Running the Project Locally

#Install dependencies

```bash
npm install


Run development server
npm run dev
Local URL:
http://localhost:3000
Build for production
npm run build
npm start

Google Reviews – Technical Exploration

Google Places API can provide public reviews if a Place ID is known.

During this assessment:
I reviewed the Places Details API
Learned about quotas and pricing
Explored the structure of Google review objects
Planned a normalization layer that maps Google reviews into the same Review type
To avoid exposing API keys in this assessment and because the full integration was optional, the final implementation documents the approach instead of shipping the full API integration.

Future steps:
Add a secure server-side fetcher for Google reviews
Store reviews and merge with Hostaway data
Cache results to avoid API rate limits

Deployment
The project is deployed via Vercel.
Every push to the main branch triggers a new deployment automatically.

Production URL:
https://flexliving-reviews-dashboard-beige.vercel.app

AI Assistance Disclosure-
During development, ChatGPT from OpenAI was used as an assistant for debugging, brainstorming, and documentation support.
All code, architecture, UI decisions, and final integration were manually reviewed and implemented by me.

Future Improvements-
Authentication & user roles
Advanced analytics (sentiment, issue clustering
Direct integration with Hostaway API & Google Places API
CSV/PDF exports
Property overview homepage with richer data insights
