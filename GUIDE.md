# Standalone Dashboard Project

## Goal

Create a **single-page web application** that displays the Premium Dashboard for all users. No Shopify connection is needed. Everyone visiting the site has access.

---

## Features

* **One Page Only** → `/dashboard` (or root `/`).
* **Daily Auto-Update**:

  * At 4:00 AM ET, the page updates with:

    * Quote of the Day
    * Workout Plan (7 exercises)
    * Meal Plan (Breakfast, Lunch, Dinner)
* **Daily Email + PDF**:

  * At the same time, send an email to all registered users.
  * PDF content must exactly match what appears on the dashboard.

---

## Tech Stack

* **Frontend**: Next.js (static site / single page)
* **Content Storage**: Metaobjects (or a small database if not using Shopify)
* **PDF Generation**: Puppeteer/Playwright
* **Email Delivery**: Resend
* **Hosting**: Vercel (cron job at 4:00 AM ET)

---

## How It Works

1. **Daily Plan Data**

   * Admin pre-creates plans for each date.
   * Plans include: Quote, 7 Exercises, Breakfast, Lunch, Dinner.

2. **Dashboard Rendering**

   * Dashboard page fetches **today’s plan**.
   * Renders in dark-themed design.

3. **4:00 AM Automation**

   * Cron job runs daily:

     * Loads today’s plan.
     * Generates PDF from dashboard HTML.
     * Sends email with PDF attached to all users.

4. **Universal Access**

   * No login required.
   * Anyone visiting the site sees the current day’s plan.

---

## Deliverables

* Next.js project with:

  * `/dashboard` page (dark theme, renders today’s plan).
  * Cron job `/api/cron/daily-plan` for daily email + PDF.
  * Content management system (Metaobjects or JSON/db).
* Email template + PDF template that match dashboard.
* Deployment on Vercel.

---

## Success Criteria

* Dashboard shows correct plan for today.
* At 4:00 AM ET every day:

  * Dashboard updates.
  * All users receive email with matching PDF.
* System runs without manual intervention once plans are pre-loaded.
