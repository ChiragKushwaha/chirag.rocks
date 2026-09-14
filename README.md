# macOS Big Sur Clone 

![macOS Big Sur Clone Banner](public/og-image.png)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

## 🚀 Introduction

Welcome to my **macOS Big Sur Clone**! This project is a pixel-perfect recreation of the macOS Big Sur desktop environment, running entirely in your browser. It serves as a comprehensive portfolio piece, demonstrating advanced frontend engineering skills, complex state management, and the power of modern web technologies.

This isn't just a UI mockup; it's a fully functional operating system simulation with a working file system, installable apps, virtualization, and global internalization.

**[Live Demo](https://chirag.rocks)**

## ✨ Key Features

### 🖥️ Desktop Environment

* **Window Manager**: Draggable, resizable, and minimizable windows with z-index management.
* **Dock**: Animated dock with magnification effects and bouncing animations.
* **Menu Bar**: Fully functional global menu bar that updates based on the active application.
* **Control Center**: Quick access to system toggles like Wi-Fi, Bluetooth, and Display brightness.
* **Notification Center**: Real-time notifications and widgets.
* **Spotlight Search**: Global search for apps and files (Cmd + Space).
* **Dark/Light Mode**: System-wide theme switching with automatic preference detection.

### 🌐 Internationalization (i18n)

* **30+ Languages**: Fully translated into over 30 languages including Spanish, French, German, Chinese, Japanese, Arabic, and more.
* **Dynamic Routing**: Locale-based routing (e.g., `/en`, `/es`, `/ja`).
* **RTL Support**: Full Right-to-Left layout support for languages like Arabic and Hebrew.

### 📂 File System (OPFS)

* Built on the **Origin Private File System (OPFS)** for high-performance, persistent local storage.
* **Finder**: Full-featured file manager with drag-and-drop support, file previews, and directory navigation.
* **Offline Support**: All files and apps work offline via Service Workers.

## 📱 Featured Apps

This project includes a suite of functional applications, each showcasing different technical challenges:

| App | Description | Key Tech |
| :--- | :--- | :--- |
| **Finder** | Full file system management with drag-and-drop. | OPFS, Web Workers |
| **Maps** | Interactive global map with search and geocoding. | `leaflet`, `react-leaflet`, Nominatim API |
| **Virtual Machine** | Run real operating systems (Linux, KolibriOS) in the browser. | V86 Emulator, WebAssembly |
| **Safari** | Browser simulation with tabs and history. | IFrame, History API |
| **Terminal** | Interactive shell with command parsing and file system access. | Custom Parser, OPFS |
| **VS Code** | Lightweight code editor with syntax highlighting. | Monaco Editor |
| **Messages** | Real-time messaging simulation. | Socket.IO |
| **FaceTime** | Video calling interface with camera access. | WebRTC |
| **Photos** | Image gallery with grid view, map view, and EXIF preview. | CSS Grid, Leaflet, Next.js Image |
| **PDF Viewer** | Native-like PDF rendering and navigation. | `react-pdf`, `pdf.js` |
| **Music** | Audio player with playlist management. | HTML5 Audio |
| **Chess** | Full chess game with AI opponent and move validation. | `chess.js`, `react-chessboard` |

### 🔗 Portfolio Web Apps

The Launchpad also links out to a set of standalone web apps, each shown with its official site logo:

| App | Description | Link |
| :--- | :--- | :--- |
| **Sacred Texts** | The world's sacred literature — scripture, myth & the esoteric. | [sacred-texts.xyz](https://sacred-texts.xyz/) |
| **AlgoViz** | Algorithms you can see — animated, step-by-step visualizations. | [algorithms.sacred-texts.xyz](https://algorithms.sacred-texts.xyz/) |
| **SpeakSpanish** | Learn Spanish one swipe at a time, across 90+ topics. | [sp4nish.vercel.app](https://sp4nish.vercel.app/) |
| **Toonflix** | A Netflix-style reader for public-domain comics, manga & toons. | [t00nflix.vercel.app](https://t00nflix.vercel.app/) |

## 🛠️ Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & CSS Modules
* **State Management**: [Zustand](https://github.com/pmndrs/zustand)
* **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
* **Mapping**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
* **Virtualization**: [V86](https://github.com/copy/v86)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Performance**: Server Components, Dynamic Imports, Service Workers

## 🚦 Getting Started

### Prerequisites

* Node.js 18+
* pnpm (recommended) or npm

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/ChiragKushwaha/mac.git
    cd mac
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    ```

3. **Run the development server**

    ```bash
    pnpm dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## � Testing

End-to-end tests are written with [Playwright](https://playwright.dev/) and live in the [`tests/`](tests) folder. They cover routing & SEO, the boot/setup flow, the desktop shell, Launchpad, Spotlight, the API routes, and the external web-apps.

```bash
# Install the browser binary once
pnpm exec playwright install chromium

# Run the full suite (auto-starts the dev server)
pnpm test

# Interactive UI mode / headed mode
pnpm test:ui
pnpm test:headed

# Open the HTML report from the last run
pnpm test:report
```

By default the suite boots a local dev server on port 3000. Set `PLAYWRIGHT_WEB_SERVER="pnpm build && pnpm start"` to test a production build, or `PLAYWRIGHT_BASE_URL=https://…` to run against a deployed URL.

## �🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://www.linkedin.com/in/chirag-kushwaha/">Chirag Kushwaha</a>
</div>
