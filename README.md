# ⚡ System Design Notes & Engineering Blog

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Website-success?style=for-the-badge&logo=github)](https://rishi-11-2.github.io/System-Design-Notes/)
[![Design: Array UI](https://img.shields.io/badge/Design-Array%20UI%20(ape--design)-E60012?style=for-the-badge)](https://rishi-11-2.github.io/System-Design-Notes/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

A production-grade engineering blog and comprehensive systems design knowledge base curated by **Rishi Chowdhury**. All technical notes, architectural patterns, and consensus algorithms from the repository's original documents are extracted verbatim and published as an interactive, publication-grade technical knowledge base.

Designed strictly following the **Array UI (`ape-design`) Editorial Systems Design System** (Obsidian Carbon `#111113`, Paper Light `#f9f8f5`, 1px hairline borders, signature crimson accent `#e60012`, dense `Assistant` & `IBM Plex Mono` typography), optimized for high information density, mathematical precision, and reading discipline.

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

| Article Title | Category | Source Document |
| :--- | :--- | :--- |
| [**Cloud-Native Databases and Amazon Aurora Architecture**](posts/amazon-aurora-cloud-native-databases.html) | Cloud Databases | `Docs/Amazon_Aurora_Cloud_Native_Databases.pdf` |
| [**CAP Theorem and Google Spanner — The Globally-Distributed Database**](posts/cap-theorem-and-google-spanner.html) | Distributed Systems | `Docs/CAP_THEOREM_AND_GOOGLE_SPANNER.pdf` |
| [**Consistent Hashing — Implementation from First Principles**](posts/consistent-hashing.html) | Distributed Systems | `Docs/Consistent_Hashing_Guide.pdf` |
| [**Grab Data Layer Architecture**](posts/grab-data-layer-architecture.html) | Case Studies | `Docs/Grab_Configured_Data_Layer.pdf` |
| [**Apache Kafka Architecture Part 1 — Storage & Event Fundamentals**](posts/kafka-architecture-part1.html) | Streaming & Kafka | `Docs/Kafka_Architecture_Part1.pdf` |
| [**Apache Kafka Architecture Part 2 — Consumer Groups & High Availability**](posts/kafka-architecture-part2.html) | Streaming & Kafka | `Docs/Kafka_Architecture_Part2.pdf` |
| [**Microservices Design Patterns — Strangler, SAGA, CQRS & Outbox**](posts/microservices-design-patterns.html) | Microservices | `Docs/Microservices_Architecture_Notes.pdf` |
| [**Redis Deep Dive — Event Loop, RESP Protocol & Data Structures**](posts/redis-internals-and-architecture.html) | In-Memory & Redis | `Docs/Redis_Notes/` (17 PDF Modules) |
| [**Implementing Redis from Scratch in Java — NIO Event Loop & Parser**](posts/redis-java-implementation.html) | In-Memory & Redis | `Redis_Implementation/` (Source Code) |
| [**System Design Foundations — Core Principles & DB Scaling**](posts/system-design-foundations-and-scaling.html) | Foundations & Scaling | `Docs/System_Design_Notes.pdf` |
| [**Large-Scale System Design Case Studies (7 Systems)**](posts/system-design-case-studies.html) | Case Studies | `Docs/System_Design_Notes.pdf` |

---

## 🎨 Design & Aesthetic Features (Array UI / ape-design)

- 🎨 **Editorial Systems Palette:**
  - **Dark Mode (Obsidian Carbon):** `#111113` canvas, `#27272c` 1px hairline border, `#d6d6dc` soft readable text.
  - **Light Mode (Paper Light):** `#f9f8f5` warm paper canvas, `#dfded9` hairline border, `#2b2a30` dark carbon text.
  - **Signature Accents:** Signature Crimson `#e60012` (actions & active states), Amber `#cc9900` (maxims & callouts), Emerald `#10b981` (telemetry & health), Rose `#f43f5e` (outages & errors).
- 📖 **Disciplined Editorial Typography:**
  - High-performance pairing: **Assistant** for dense headings & body prose (15px base, `-0.015em` tracking), **Lora** for engineering maxims (italic serif), and **IBM Plex Mono** for code, telemetry, and badges.
  - Clean reading spine capped near `76ch` for optimal reading flow and zero eye fatigue.
- 📐 **Pure KaTeX LaTeX Typesetting:**
  - Mathematical equations rendered in pure HTML mode to eliminate duplicate MathML artifacts.
- 📊 **Tailored Mermaid Architecture Diagrams:**
  - Multi-node topology diagrams styled in native Array UI tokens (stateless compute nodes, Paxos leader groups, distributed storage segments).
- 🔍 **Real-Time Client-Side Search & Filters:**
  - Instant live search across all articles (`⌘K` or `/` shortcut) with category chip filtering.
- 📜 **ScrollSpy Table of Contents:**
  - Sticky sidebar with active heading tracking as readers scroll through technical deep dives.
- 📋 **One-Click Code Copy:**
  - Interactive clipboard copy buttons with visual confirmation feedback.

---

## 📁 Repository Structure

```text
├── index.html                                    # Main portal & live search directory
├── .nojekyll                                     # Bypasses Jekyll processing for GitHub Pages
├── README.md                                     # Project overview and reading directory
├── SKILL.md                                      # Array UI (ape-design) design system specification
├── .github/
│   └── workflows/
│       └── deploy.yml                            # Automated GitHub Actions deployment pipeline
├── assets/
│   ├── css/
│   │   └── style.css                             # Array UI editorial systems stylesheet
│   └── js/
│       ├── articles-data.js                      # Searchable post metadata registry
│       └── main.js                               # Search, theme toggle, KaTeX, Highlight.js, TOC
├── posts/                                        # Standalone blog articles
│   ├── amazon-aurora-cloud-native-databases.html
│   ├── cap-theorem-and-google-spanner.html
│   ├── consistent-hashing.html
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
│   ├── Consistent_Hashing_Guide.pdf
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
