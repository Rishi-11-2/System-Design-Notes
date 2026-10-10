# ⚡ System Design Notes & Engineering Blog

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Website-success?style=for-the-badge&logo=github)](https://rishi-11-2.github.io/System-Design-Notes/)
[![Theme: Monokai](https://img.shields.io/badge/Theme-Monokai%20%23272822-F92672?style=for-the-badge)](https://rishi-11-2.github.io/System-Design-Notes/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

A production-grade engineering blog and comprehensive system design knowledge base curated by **Rishi Chowdhury**. All technical notes, architectural patterns, and consensus algorithms from the repository's original documents are extracted verbatim and published as an interactive, highly aesthetic technical blog.

Designed with an authentic **Monokai Aesthetic Theme** (`#272822` canvas, `#F8F8F2` crisp typography, `#F92672` vibrant accent), optimized for reading comfort and long-form study.

---

## 🌐 Live Website

- **Online URL:** [https://rishi-11-2.github.io/System-Design-Notes/](https://rishi-11-2.github.io/System-Design-Notes/)
- **Local Preview:** Simply open [`index.html`](index.html) in any modern browser, or run:
  ```bash
  python3 -m http.server 8000
  # Navigate to http://localhost:8000
  ```

---

## 📚 Published Notes & Engineering Deep Dives

| Article Title | Category | Read Time | Source Document |
| :--- | :--- | :--- | :--- |
| [**Cloud-Native Databases and Amazon Aurora Architecture**](posts/amazon-aurora-cloud-native-databases.html) | Cloud Databases | 18 min | `Docs/Amazon_Aurora_Cloud_Native_Databases.pdf` |
| [**CAP Theorem and Google Spanner — The Globally-Distributed Database**](posts/cap-theorem-and-google-spanner.html) | Distributed Systems | 12 min | `Docs/CAP_THEOREM_AND_GOOGLE_SPANNER.pdf` |
| [**How Grab Configured Their Data Layer for Multi-Million Daily Transactions**](posts/grab-data-layer-architecture.html) | Case Studies | 8 min | `Docs/Grab_Configured_Data_Layer.pdf` |
| [**Apache Kafka Architecture Part 1 — Storage & Event Fundamentals**](posts/kafka-architecture-part1.html) | Streaming & Kafka | 8 min | `Docs/Kafka_Architecture_Part1.pdf` |
| [**Apache Kafka Architecture Part 2 — Consumer Groups & High Availability**](posts/kafka-architecture-part2.html) | Streaming & Kafka | 9 min | `Docs/Kafka_Architecture_Part2.pdf` |
| [**Microservices Design Patterns — Strangler, SAGA, CQRS & Outbox**](posts/microservices-design-patterns.html) | Microservices | 14 min | `Docs/Microservices_Architecture_Notes.pdf` |
| [**Redis Deep Dive — Event Loop, RESP Protocol & Data Structures**](posts/redis-internals-and-architecture.html) | In-Memory & Redis | 22 min | `Docs/Redis_Notes/` (17 PDF Modules) |
| [**Implementing Redis from Scratch in Java — NIO Event Loop & Parser**](posts/redis-java-implementation.html) | In-Memory & Redis | 15 min | `Redis_Implementation/` (Source Code) |
| [**System Design Foundations — Core Principles & DB Scaling**](posts/system-design-foundations-and-scaling.html) | Foundations & Scaling | 24 min | `Docs/System_Design_Notes.pdf` |
| [**Large-Scale System Design Case Studies (7 Systems)**](posts/system-design-case-studies.html) | Case Studies | 26 min | `Docs/System_Design_Notes.pdf` |

---

## 🎨 Design & Aesthetic Features

- 🎨 **Authentic Monokai Palette:**
  - **Background Canvas:** `#272822` (warm dark olive/charcoal)
  - **Foreground Typography:** `#F8F8F2` (soft off-white cream)
  - **Signature Accents:** Electric Pink `#F92672`, Sky Cyan `#66D9EF`, Lime Green `#A6E22E`, Tangerine Orange `#FD971F`, Purple `#AE81FF`, and Sunflower Yellow `#E6DB74`.
- 📖 **Typography Tuned for Long-Form Reading:**
  - High-performance font pairing: **Plus Jakarta Sans** for editorial prose and **JetBrains Mono** for code and math formulas.
  - Comfortable line height (`1.84`), generous line spacing, and optimal column width (`~70ch` / `800px max-width`) to prevent eye fatigue.
  - Contrast ratios exceeding WCAG AA+ standards (`6.8:1+` for secondary metadata and breadcrumbs).
- 📐 **Robust KaTeX LaTeX Typesetting:**
  - Precision mathematical rendering of quorum equations ($V_R + V_W > V$), Spanner TrueTime uncertainty intervals ($\epsilon$), and commit-wait formulas ($\text{TrueTime.now().earliest} > s$).
  - Pure HTML output mode preventing duplicate MathML rendering artifacts.
- 💻 **Monokai Code Highlighting (Highlight.js):**
  - Full syntax highlighting matching native Monokai code editors for Java, C, Lua, Bash, and SQL snippets.
- 📊 **Tailored Mermaid Architecture Diagrams:**
  - Flowcharts and sequence diagrams rendered with custom Monokai color tokens (storage-compute separation, 2PC/Paxos sequences, Strangler Fig transitions).
- 🔍 **Real-Time Client-Side Search & Filters:**
  - Instant live search across all articles (`⌘K` or `/` shortcut) with category chip filtering.
- 📜 **ScrollSpy Table of Contents:**
  - Sticky sidebar with active heading tracking as readers scroll through technical deep dives.
- 📋 **One-Click Code Copy:**
  - Interactive clipboard copy buttons with visual confirmation feedback.
- 📄 **Direct Untouched PDF Access:**
  - All original source PDFs and academic papers are preserved in `Docs/` with one-click viewing links.

---

## 📁 Repository Structure

```text
├── index.html                                    # Main blog portal & live search directory
├── .nojekyll                                     # Bypasses Jekyll processing for GitHub Pages
├── README.md                                     # Project overview and reading directory
├── .github/
│   └── workflows/
│       └── deploy.yml                            # Automated GitHub Actions deployment pipeline
├── assets/
│   ├── css/
│   │   └── style.css                             # Monokai aesthetic stylesheet & typography
│   └── js/
│       ├── articles-data.js                      # Searchable post metadata registry
│       └── main.js                               # Search, theme toggle, KaTeX, Highlight.js, TOC
├── posts/                                        # Standalone blog articles
│   ├── amazon-aurora-cloud-native-databases.html
│   ├── cap-theorem-and-google-spanner.html
│   ├── grab-data-layer-architecture.html
│   ├── kafka-architecture-part1.html
│   ├── kafka-architecture-part2.html
│   ├── microservices-design-patterns.html
│   ├── redis-internals-and-architecture.html
│   ├── redis-java-implementation.html
│   ├── system-design-case-studies.html
│   └── system-design-foundations-and-scaling.html
├── Docs/                                         # Original PDFs, academic papers, and notes
│   ├── Amazon_Aurora_Cloud_Native_Databases.pdf
│   ├── CAP_THEOREM_AND_GOOGLE_SPANNER.pdf
│   ├── Grab_Configured_Data_Layer.pdf
│   ├── Kafka_Architecture_Part1.pdf
│   ├── Kafka_Architecture_Part2.pdf
│   ├── Microservices_Architecture_Notes.pdf
│   ├── System_Design_Notes.pdf
│   ├── Papers/                                   # Google Spanner, Dremel papers
│   └── Redis_Notes/                              # 17 Original Redis note modules
└── Redis_Implementation/                         # Custom Java implementation of Redis
    ├── RedisEventLoopServer.java
    ├── RESP.java
    ├── RESPDecoder.java
    └── RedisPingServer.java
```

---

## 🚀 Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions upon every push to the `main` branch.

### Manual Settings (Alternative)
1. On GitHub, navigate to **Settings** $\to$ **Pages**.
2. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` / `/ (root)`
3. Click **Save**. The website will be live at:
   **https://rishi-11-2.github.io/System-Design-Notes/**

---

## 👤 Author & Curator

**Rishi Chowdhury**
- GitHub: [@Rishi-11-2](https://github.com/Rishi-11-2)
- Repository: [System-Design-Notes](https://github.com/Rishi-11-2/System-Design-Notes)
- Live Site: [https://rishi-11-2.github.io/System-Design-Notes/](https://rishi-11-2.github.io/System-Design-Notes/)
