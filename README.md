# HireLane

<p align="center">
  <strong>AI-powered job application automation and tracking</strong>
  <br />
  Apply faster. Personalize better. Track everything.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Full%20Stack-Application-5b3df5?style=for-the-badge" alt="Full Stack Application" />
  <img src="https://img.shields.io/badge/AI%2FML-Powered-1bd29c?style=for-the-badge" alt="AI ML Powered" />
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge" alt="Chrome Extension" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge" alt="MongoDB" />
</p>

<p align="center">
  HireLane connects your career profile, job applications, AI assistance, browser automation, and application analytics into one workflow.
</p>

---

## Overview

Job hunting is repetitive, fragmented, and difficult to manage at scale.

A single application can involve:

* entering the same profile information into multiple ATS platforms
* understanding a new job description
* evaluating whether the role is a good fit
* writing a personalized pitch or cover letter
* remembering which jobs have already been applied to
* tracking applications across different websites

**HireLane turns that fragmented process into one connected system.**

It combines a web application with a Chrome extension that works directly inside supported job platforms.

```text
                    ┌──────────────────────┐
                    │      HireLane        │
                    │   Career Workspace   │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
           Your Profile    AI Assistance   Application Data
                │              │              │
                └──────────────┼──────────────┘
                               │
                               ▼
                     Browser Extension
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
           Workday         Greenhouse       Wellfound
              │                │                │
              └────────────┬───┴───────┬────────┘
                           │           │
                           ▼           ▼
                       Naukri     Internshala
```

---

## What HireLane Does

HireLane brings four major parts of the job-search workflow together:

| Capability                 | What it does                                                              |
| -------------------------- | ------------------------------------------------------------------------- |
| **Profile Management**     | Stores reusable career information used across applications               |
| **Application Automation** | Extracts and fills supported application forms                            |
| **AI Assistance**          | Classifies fields, scores job/profile fit, and generates tailored content |
| **Application Tracking**   | Records and organizes applications across supported platforms             |

The result is a workflow that looks like:

```text
Build Profile
     ↓
Find a Job
     ↓
Open the Application
     ↓
HireLane Understands the Context
     ↓
Fill / Track / Personalize
     ↓
Analyze Job Fit
     ↓
Record Application
     ↓
Review Career Insights
```

---

# Key Features

## 🤖 AI-Powered Job Assistance

HireLane uses AI for problems that benefit from contextual understanding.

### Field Classification

Different ATS platforms use different labels for the same information.

For example:

```text
"Current Organization"
        ↓
"Employer"
        ↓
"Company Name"
        ↓
        ▼
  Profile → currentCompany
```

HireLane extracts raw fields from the page and maps them to the structured profile model before filling the form.

### Job Match Scoring

Job descriptions can be evaluated against the user's profile to produce a match score.

```text
Job Description
       +
User Profile
       ↓
 AI Analysis
       ↓
 Match Score
```

The score can then become part of the application's historical data.

### Tailored Application Content

For supported workflows, HireLane can generate personalized cover letters or application pitches using the context of the actual job.

```text
User Profile
     +
Company
     +
Role
     +
Job Description
     ↓
Personalized Application Content
```

---

# 🌐 Platform-Aware Browser Automation

HireLane does not assume every job website behaves the same way.

Instead, the extension adapts its workflow to the platform.

| Platform        | HireLane Workflow                                                 |
| --------------- | ----------------------------------------------------------------- |
| **Workday**     | Form extraction + AI field classification + profile-based filling |
| **Greenhouse**  | Form filling + application-session awareness                      |
| **Naukri**      | Job detection + tracking + match scoring                          |
| **Internshala** | Job detection + tracking + match scoring                          |
| **Wellfound**   | Job-aware extraction + AI personalization + tracking              |

This platform-aware approach allows HireLane to choose the appropriate interaction rather than forcing a generic automation strategy onto every website.

---

# 🧩 Three Application Modes

HireLane's extension changes its behavior depending on the application environment.

### Fill Mode

Used when HireLane can meaningfully interact with the application form.

```text
Detect ATS
   ↓
Extract fields
   ↓
Identify job context
   ↓
Classify fields
   ↓
Load profile
   ↓
Fill fields
   ↓
Analyze job
   ↓
Track application
```

### Track Mode

Used when the platform is better suited to job detection and application tracking than direct form automation.

```text
Detect Job
   ↓
Extract Company + Role
   ↓
Read Job Description
   ↓
Calculate Match Score
   ↓
Track Application
```

### Personalization Mode

Used for workflows where generating relevant application content is more valuable than filling a complex form.

```text
Detect Job
   ↓
Extract JD + Context
   ↓
Generate Tailored Content
   ↓
Calculate Match
   ↓
User Reviews / Copies
   ↓
Track Application
```

---

# 🧠 Architecture

HireLane follows a three-layer architecture:

```text
┌───────────────────────────────────────────────┐
│                  FRONTEND                     │
│                                               │
│  React UI • Auth • Dashboard • Profile       │
│  Applications • Insights • Extension Setup   │
└──────────────────────────┬────────────────────┘
                           │
                           │ REST API
                           ▼
┌───────────────────────────────────────────────┐
│                   BACKEND                     │
│                                               │
│  Authentication • Business Logic             │
│  Application Management • AI Orchestration    │
│  Field Classification • Match Scoring        │
│  Cover Generation • Security Middleware       │
└───────────────┬───────────────────┬───────────┘
                │                   │
                ▼                   ▼
         ┌─────────────┐      ┌─────────────┐
         │   MongoDB   │      │ AI Services │
         │             │      │             │
         │ Users       │      │ Classify    │
         │ Profiles    │      │ Match       │
         │ Applications│      │ Generate    │
         │ Sessions    │      │             │
         └─────────────┘      └─────────────┘

                           ▲
                           │
                    Authenticated API
                           │
                           │
┌──────────────────────────┴────────────────────┐
│               CHROME EXTENSION                │
│                                               │
│ Popup • Content Script • ATS Detection       │
│ DOM Extraction • Form Filling • Storage      │
│ Page Observation • Job Context Detection     │
└───────────────────────────────────────────────┘
```

---

# Browser Extension Architecture

The extension separates **page interaction** from **business logic**.

```text
┌────────────────────┐
│    Extension UI    │
│      Popup         │
└─────────┬──────────┘
          │
          │ chrome.tabs messaging
          ▼
┌────────────────────┐
│ Content / Detector  │
│                    │
│ ATS detection      │
│ Job extraction     │
│ Field extraction   │
│ JD extraction      │
│ Form filling       │
└─────────┬──────────┘
          │
          │ authenticated API calls
          ▼
┌────────────────────┐
│    HireLane API    │
│                    │
│ Profile            │
│ AI classification  │
│ Match scoring      │
│ Cover generation   │
│ Applications       │
└────────────────────┘
```

This keeps DOM-specific logic inside the browser while centralizing business logic and AI processing in the backend.

---

# 🔄 End-to-End Application Flow

A typical application can move through the following pipeline:

```text
                    JOB PAGE
                       │
                       ▼
                ATS Detection
                       │
                       ▼
              Job Context Extraction
                       │
            ┌──────────┼──────────┐
            │          │          │
            ▼          ▼          ▼
          Fill       Track    Personalize
            │          │          │
            └──────────┼──────────┘
                       ▼
                 AI Assistance
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      Field Map    Match Score   AI Content
          │            │            │
          └────────────┼────────────┘
                       ▼
              Application Record
                       │
                       ▼
                Dashboard / Insights
```

---

# 🗂️ Application Session Awareness

Modern job sites often behave like single-page applications.

The visible job can change without a traditional page reload, which creates a subtle problem:

> How do you know that the information currently visible belongs to Job A instead of Job B?

HireLane addresses this using **application session keys**.

They allow the system to associate:

* company
* role
* job description
* cached data
* application state
* match score

with the correct job context.

For example:

```text
Company A + Role A
       ↓
Session A

Company B + Role B
       ↓
Session B
```

rather than accidentally reusing:

```text
Company A + Role A
       ↓
Company B + Role B
       ↓
Old Application Data
```

## The Wellfound integration additionally uses the job listing identifier exposed in the URL and scopes extraction to the appropriate job-details panel.

# ⚡ Intelligent Caching

AI should not be called repeatedly for information the system already understands.

HireLane therefore follows a layered approach:

```text
┌─────────────────────────┐
│ Known / Static Mapping  │
└────────────┬────────────┘
             │ miss
             ▼
┌─────────────────────────┐
│ Persistent Cache        │
│ MongoDB                 │
└────────────┬────────────┘
             │ miss
             ▼
┌─────────────────────────┐
│ AI Inference            │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Cache Result             │
└─────────────────────────┘
```

This helps reduce:

* unnecessary AI requests
* repeated computation
* latency
* operating cost

It also makes the application more practical to run with a lightweight infrastructure footprint. The project handoff specifically identified this multi-layer cache as a key architectural strength.

---

# 📊 Application Tracking

Every application can become a structured record rather than a forgotten browser tab.

Typical application information includes:

| Field        | Purpose                                  |
| ------------ | ---------------------------------------- |
| Company      | Employer associated with the opportunity |
| Role         | Job title                                |
| ATS          | Source/platform                          |
| Status       | Application state                        |
| Session Key  | Identifies the application context       |
| Match Score  | AI-derived fit signal                    |
| Cover Letter | Generated content where applicable       |

That data forms the foundation for the dashboard and insights layer.

---

# 📈 Career Insights

The application history creates a useful feedback loop:

```text
Applications
      ↓
Structured Data
      ↓
Analytics
      ↓
Patterns
      ↓
Better Job Decisions
```

Because insights are derived from real tracked applications, the system can answer questions such as:

* How active is my job search?
* Which platforms am I using?
* Which roles am I targeting?
* What is my average match score?
* Which opportunities were stronger fits?
* How is my application activity changing?

The product is therefore not just automating applications; it is also building a structured dataset around the user's job search.

---

# 🔐 Authentication & Security

HireLane treats authentication as a system concern, not just a frontend feature.

Protected backend routes validate:

* authentication credentials
* token validity
* token expiration
* user existence
* account activity

The backend authentication middleware supports credentials from the appropriate authenticated channels and rejects invalid or expired sessions.

---

## Password Protection

Password-related flows use secure handling rather than exposing credentials through the extension.

The password-reset design uses short-lived OTP verification and invalidates existing sessions after a successful password change.

---

## OTP Security

OTP records are designed with:

* cryptographically generated codes
* hashed OTP storage
* purpose-specific records
* short expiration windows
* automatic MongoDB TTL cleanup
* one-time consumption
* rate limiting for sensitive flows

```text
Generate OTP
    ↓
Hash OTP
    ↓
Store hash + expiry
    ↓
Send code
    ↓
Verify hash
    ↓
Consume OTP
```

MongoDB's TTL index automatically removes expired OTP documents.

---

# 🔗 Extension Pairing

The browser extension uses a short-lived pairing mechanism rather than asking the user to enter their main HireLane password into the extension.

```text
Website
  │
  │ Generate pairing code
  ▼
┌─────────────┐
│  6-digit    │
│ pairing code│
└──────┬──────┘
       │
       │ user enters code
       ▼
Extension Popup
       │
       │ redeem
       ▼
Backend
       │
       ▼
Authenticated Extension Token
```

The pairing code is:

* short-lived
* single-use
* associated with the user
* destroyed after successful redemption

This keeps the primary account password away from the extension authentication surface.

---

# 🧱 Core Data Model

At a conceptual level:

```text
User
│
├── Profile
│
├── Applications
│   ├── Company
│   ├── Role
│   ├── ATS
│   ├── Status
│   ├── Match Score
│   └── Session Key
│
├── Authentication State
│
├── OTP Records
│
└── Extension Connection
```

Important domain objects include:

### `User`

Account and authentication identity.

### `Profile`

Structured career information used for automation and personalization.

### `Application`

A tracked job opportunity.

### `Otp`

Short-lived verification and password-reset challenge.

### `PairingCode`

Short-lived browser-extension connection credential.

### `SessionKey`

Identifier for a specific job/application context.

---

# 🛠️ Technology Stack

## Frontend

* React
* React Router
* Context-based authentication state
* HTTP API integration

## Backend

* Node.js
* REST APIs
* Authentication middleware
* Business logic services
* AI orchestration

## Database

* MongoDB
* Mongoose
* TTL indexes
* Persistent application/profile storage

## AI / ML

* Gemini-backed AI workflows
* Semantic field classification
* Job/profile match scoring
* Contextual content generation

## Browser Automation

* Chrome Extension APIs
* Content scripts
* DOM extraction
* ATS-specific detection
* Dynamic page observation
* Extension storage
* Popup ↔ content-script messaging

## Email

* Resend
* OTP-based verification and password reset

---

# 📁 Project Structure

A typical high-level structure is:

```text
HireLane/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── lib/
│   └── ...
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── config/
│   └── ...
│
├── extension/
│   ├── popup/
│   ├── content/
│   ├── detector/
│   └── ...
│
└── README.md
```

The key architectural separation is:

```text
Frontend
   ↓
Backend API
   ↓
Database + AI Services

Extension
   ↓
Backend API
   ↓
Job Platforms
```

---

# 🎯 Design Principles

### Automate the repetitive work

Users should not repeatedly enter the same information.

### Keep the user in control

Automation should assist the user, not silently submit decisions they have not reviewed.

### Use AI where context matters

Classification, matching, and personalization benefit from semantic understanding.

### Prefer deterministic logic where possible

Known mappings and cached knowledge should be used before invoking AI.

### Treat websites as different environments

A Workday form and a Wellfound job page are fundamentally different interaction surfaces.

### Keep business logic centralized

The extension handles browser interaction; the backend owns application logic, authentication, persistence, and AI workflows.

### Build for practical deployment

The architecture favors lightweight services, caching, and a small operational footprint rather than unnecessary infrastructure.

---

# 💡 Why This Is More Than an Auto-Fill Extension

A conventional form-filling extension solves one problem:

> "Enter my information for me."

HireLane is designed around a larger problem:

> **"Help me manage and improve my entire job application workflow."**

That difference can be represented as:

```text
Traditional Auto-Fill
        │
        ▼
   Fill the form


HireLane
        │
        ├── Understand the job
        ├── Identify application context
        ├── Classify fields
        ├── Reuse profile information
        ├── Fill supported forms
        ├── Score job fit
        ├── Generate personalized content
        ├── Track applications
        └── Build job-search insights
```

---

# 🚀 Product Vision

HireLane is built around a simple idea:

> **Your job search should be a system, not a collection of browser tabs and spreadsheets.**

The platform connects:

```text
             YOUR PROFILE
                   │
                   ▼
             JOB DISCOVERY
                   │
                   ▼
             JOB ANALYSIS
                   │
                   ▼
              AI MATCHING
                   │
                   ▼
          APPLICATION AUTOMATION
                   │
                   ▼
             PERSONALIZATION
                   │
                   ▼
          APPLICATION TRACKING
                   │
                   ▼
             CAREER INSIGHTS
```

Every application contributes to a larger picture of the user's search.

That is the core purpose of HireLane:

### **Apply faster. Apply smarter. Keep track of everything.**
