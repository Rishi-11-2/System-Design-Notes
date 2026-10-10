# ⚡ System Design Notes & Engineering Blog

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Website-success?style=for-the-badge&logo=github)](https://rishi-11-2.github.io/System-Design-Notes/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

A production-grade engineering blog and comprehensive system design knowledge base curated by **Rishi Chowdhury**. All technical notes, architectural patterns, and consensus algorithms from the repository's PDF documents are extracted verbatim and published as an interactive, responsive blog website.

---

## 🌐 Live Website

- **Online URL:** [https://rishi-11-2.github.io/System-Design-Notes/](https://rishi-11-2.github.io/System-Design-Notes/)
- **Local Preview:** Simply open [`index.html`](index.html) in any browser, or run:
  ```bash
  python3 -m http.server 8000
  # Open http://localhost:8000
  ```

---

## 📚 Published Blog Posts & Extracted Notes

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

## 🛠️ Features of the Website

- ⚡ **Zero-Build GitHub Pages Compatibility:** Pure, performant HTML5, CSS3, and modern JavaScript. Requires zero npm build steps or compilation; deploys instantly on GitHub Pages.
- 🌓 **Dynamic Theme Switching:** Dark mode by default with light mode toggle, saved to `localStorage`.
- 🔍 **Real-Time Client-Side Search:** Instant keyword search across all article titles, excerpts, categories, and tags (`⌘K` or `/` shortcut).
- 🏷️ **Category Filter Chips:** Instant category filtering across Cloud Databases, Distributed Systems, Kafka, Microservices, and Redis.
- 📐 **KaTeX Mathematical Typesetting:** Precision rendering of consensus equations ($V_R + V_W > V$) and TrueTime uncertainty intervals ($\epsilon$).
- 📊 **Interactive Mermaid Architecture Diagrams:** SVG vector flowcharts illustrating storage-compute separation, Paxos commit-wait sequences, and outbox CDC pipelines.
- 📋 **One-Click Code Copy:** Easy copying of commands and code snippets with animated feedback.
- 📜 **ScrollSpy Table of Contents:** Active heading tracking as readers scroll through long-form technical analyses.
- 📄 **Direct Untouched PDF Access:** Seamless download buttons connecting to the original repository PDF files.

---

## 📁 Repository Structure

```text
├── index.html                                    # Main blog portal & search directory
├── .nojekyll                                     # Disables Jekyll processing for GitHub Pages
├── README.md                                     # Project documentation and directory
├── assets/
│   ├── css/
│   │   └── style.css                             # Responsive developer-oriented stylesheet
│   └── js/
│       ├── articles-data.js                      # Searchable metadata registry of all posts
│       └── main.js                               # Search, theme toggle, TOC scrollspy, copy code
├── posts/                                        # Standalone blog article pages
│   ├── amazon-aurora-cloud-native-databases.html
│   ├── cap-theorem-and-google-spanner.html
│   ├── grab-data-layer-architecture.html
│   ├── kafka-architecture-part1.html
│   ├── kafka-architecture-part2.html
│   ├── microservices-design-patterns.html
│   ├── redis-internals-and-architecture.html
│   ├── redis-java-implementation.html
│   ├── system-design-foundations-and-scaling.html
│   └── system-design-case-studies.html
├── Docs/                                         # Original PDFs, research papers, and notes
│   ├── Amazon_Aurora_Cloud_Native_Databases.pdf
│   ├── CAP_THEOREM_AND_GOOGLE_SPANNER.pdf
│   ├── Grab_Configured_Data_Layer.pdf
│   ├── Kafka_Architecture_Part1.pdf
│   ├── Kafka_Architecture_Part2.pdf
│   ├── Microservices_Architecture_Notes.pdf
│   ├── System_Design_Notes.pdf
│   ├── Papers/                                   # Academic papers: Spanner, Dremel
│   └── Redis_Notes/                              # 17 Original Redis note modules
└── Redis_Implementation/                         # Custom Java implementation of Redis
    ├── RedisEventLoopServer.java
    ├── RESP.java
    ├── RESPDecoder.java
    └── RedisPingServer.java
```

---

## 🚀 How to Enable GitHub Pages

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Publish System Design Notes GitHub Pages website and blog"
   git push origin main
   ```
2. Navigate to your repository on GitHub: **Settings** $\to$ **Pages**.
3. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` / `/ (root)`
4. Click **Save**. Your site will be live at `https://rishi-11-2.github.io/System-Design-Notes/` in ~30 seconds!

---

## 👤 Author & Curator

**Rishi Chowdhury**
- GitHub: [@Rishi-11-2](https://github.com/Rishi-11-2)
- Repository: [System-Design-Notes](https://github.com/Rishi-11-2/System-Design-Notes)
