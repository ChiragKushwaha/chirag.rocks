# macOS Big Sur Clone 

![macOS Big Sur Clone Banner](public/og-image.png)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

## 🚀 Introduction

Welcome to my **macOS Big Sur Clone**! This project is a pixel-perfect recreation of the macOS Big Sur desktop environment, running entirely in your browser. It serves as a comprehensive portfolio piece, demonstrating advanced frontend engineering skills, complex state management, and the power of modern web technologies.

This isn't just a UI mockup; it's a fully functional operating system simulation with a working file system, installable apps, and real-time features.

**[Live Demo](https://chirag-rocks.vercel.app)**

## ✨ Key Features

### 🖥️ Desktop Environment
*   **Window Manager**: Draggable, resizable, and minimizable windows with z-index management.
*   **Dock**: Animated dock with magnification effects and bouncing animations.
*   **Menu Bar**: Fully functional global menu bar that updates based on the active application.
*   **Control Center**: Quick access to system toggles like Wi-Fi, Bluetooth, and Display brightness.
*   **Notification Center**: Real-time notifications and widgets.
*   **Spotlight Search**: Global search for apps and files (Cmd + Space).
*   **Dark/Light Mode**: System-wide theme switching with automatic preference detection.

### 📂 File System (OPFS)
*   Built on the **Origin Private File System (OPFS)** for high-performance, persistent local storage.
*   **Finder**: Full-featured file manager with drag-and-drop support, file previews, and directory navigation.
*   **Offline Support**: All files and apps work offline via Service Workers.

## 📱 Featured Apps

This project includes a suite of functional applications, each showcasing different technical challenges:

| App | Description | Key Tech |
| :--- | :--- | :--- |
| **Chess** | Full chess game with AI opponent and move validation. | `chess.js`, `react-chessboard` |
| **Terminal** | Interactive shell with command parsing and file system access. | Custom Parser, OPFS |
| **VS Code** | Lightweight code editor with syntax highlighting. | Monaco Editor |
| **Safari** | Browser simulation with tabs and history. | IFrame, History API |
| **Messages** | Real-time messaging simulation. | Socket.IO |
| **FaceTime** | Video calling interface with camera access. | WebRTC |
| **PDF Viewer** | Native-like PDF rendering and navigation. | `react-pdf`, `pdf.js` |
| **Photos** | Image gallery with grid view and preview. | CSS Grid, Next.js Image |
| **Music** | Audio player with playlist management. | HTML5 Audio |
| **Calculator** | Standard calculator with history. | React State |

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & CSS Modules
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Performance**: Server Components, Dynamic Imports, Service Workers
*   **Deployment**: Vercel

## 🚦 Getting Started

### Prerequisites
*   Node.js 18+
*   pnpm (recommended) or npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ChiragKushwaha/mac.git
    cd mac
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Run the development server**
    ```bash
    pnpm dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://www.linkedin.com/in/chirag-kushwaha/">Chirag Kushwaha</a>
</div>
