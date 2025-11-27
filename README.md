# Flex Living – Reviews Dashboard

A reviews analytics and management dashboard built for Flex Living as part of the Flex project assessment.  
This application enables managers to explore property performance, inspect reviews, identify recurring issues, and approve reviews for public display.

Live Demo:  
https://flexliving-reviews-dashboard-beige.vercel.app

GitHub Repository:  
https://github.com/SanaKhan-1613026/Flexliving-Reviews-Dashboard

---

## Overview

This project implements a lightweight review-analytics tool inspired by the internal needs of a property-management team. It provides:

- A unified, normalized review API (simulating Hostaway data)
- Per-property dashboards with rating breakdowns
- Review approval workflow
- Public-facing property pages reflecting approved reviews
- Aggregated analytics across categories, channels, and time
- A clean, modern Next.js 14+ UI

The goal was to focus on clarity, insight, and a structure that mirrors real-world property-operations workflows.

---

## Features

### 🏘 Property-Level Dashboard
- View all properties with average ratings and review volume
- Open each property to explore category ratings, review distribution, and channel mix

### 📝 Review Moderation
- Approve or hide reviews
- Approved reviews automatically appear on the public property page
- Supports categories such as cleanliness, communication, location, etc.

### 📊 Analytics Module
- Pie charts and bar charts using Recharts
- Category breakdowns
- Channel distribution (Airbnb, Booking.com, Hostaway, Google)
- Rating trends and quick-glance summaries

### 🌐 Public Property Page
- Clean layout inspired by Flex Living’s front-facing design
- Displays only approved reviews
- Simulates a real guest-facing property profile

### 🧩 Review API (Mock Hostaway Simulation)
Because Hostaway sandbox returns an empty response, a mock JSON file is used.  
API path:
