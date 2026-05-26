# Gourmet Haven | Michelin-Starred Fine Dining & Premium Delivery

Welcome to the digital sanctuary of **Gourmet Haven**, a pixel-perfect, premium website built with modern web technologies, elegant dark glassmorphism styling, gold accents, and a fully interactive reservations, cart, and checkout system.

---

## 🌐 1. Access the Live Deployed Website
The website is fully compiled and hosted online via **GitHub Pages**. 
* **Live Link**: [https://pnguyen-it499.github.io/IT499-Capstone](https://pnguyen-it499.github.io/IT499-Capstone)

*(Any push to the `main` branch of this repository automatically triggers a GitHub Actions workflow that recompiles, prefixes, and redeploys the site live in under a minute!)*

---

## 💻 2. Running & Developing the Project Locally

If you want to run, develop, or compile the project locally on your machine, you have two options:

### Option A: Local Development (Using Yarn or NPM)
If you have **Yarn** or **NPM** installed globally:

1. **Open your terminal** and navigate to the project workspace directory:
   ```bash
   cd restaurant/restaurant
   ```
2. **Install the dependencies**:
   ```bash
   yarn install
   # Or: npm install
   ```
3. **Launch the Local Development Server**:
   ```bash
   yarn static:dev
   # Or: npm run static:dev
   ```
   *This launches a hot-reloading development server at `http://localhost:3000/` using Gulp and BrowserSync. Any edits you make to Pug layouts, SCSS variables, or JavaScript scripts will instantly refresh in the browser!*

4. **Compile a Production-Ready Build**:
   ```bash
   yarn static:build
   # Or: npm run static:build
   ```
   *This minifies and bundles all assets, transpiles JavaScript with Webpack, and correctly prefixes absolute/relative image paths for subdirectory hosting.*

---

### Option B: Single-Click Windows Compiler (Zero Global Setup)
If you are on Windows and do not want to install Node.js, Gulp, or Yarn globally, we have embedded a localized Node engine directly inside the repository for a zero-setup compilation experience:

1. Navigate to the **root of the repository**.
2. Double-click the **`build.bat`** file.
3. The script will automatically trigger and compile your modular styles, pages, and scripts, saving all optimized files directly into the `public/` directory ready for deployment!

---

## 📂 3. Repository Architecture & Directory Structure
* `build.bat` - Zero-install local compilation script for Windows.
* `restaurant/restaurant/` - Core project workspace.
  * `assets/` - Source development files:
    * `views/` - Pug templates (HTML structure, pages, layouts, and partials).
    * `scss/` - Modular stylesheets (dark glassmorphism, responsive grids, cookie banners).
    * `js/` - Interactive molecular mixology cart, tableside checkout, and order tracking.
  * `public/` - Fully compiled and optimized production files (this is the directory served to GitHub Pages):
    * `img/` - High-fidelity restaurant atmosphere images and gold product shots.
    * `css/` - Minified compiled stylesheets.
    * `js/` - Minified compiled JavaScript bundles.

---
*Curated with precision to deliver a five-star digital presence for Gourmet Haven.*
