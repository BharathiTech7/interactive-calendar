# 📅 Interactive Wall Calendar — Premium React Component

An interactive, high-fidelity React component inspired by physical wall calendars. This project translates a static design concept into a tactile, responsive digital experience with 3D animations and persistent functionality.

![Wall Calendar Preview](https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&w=1200&q=80) 

## 🚀 Features

### 1. **Wall Calendar Aesthetic**
- **Physical Depth**: Implemented a "Stacked Paper" effect with multiple offset layers to simulate the volume of a 12-month calendar.
- **Hardware Details**: Custom SVG wall hook and a realistic metallic spiral binding (wire-o style) for an authentic look.
- **Premium Hero Overlays**: Modern geometric "Jagged Chevron" overlays with glassmorphism and dynamic color gradients.

### 2. **Interactive Date Grid**
- **Day Range Selection**: Full support for selecting start and end dates with clear visual states for the start/end circles and the highlighted range band.
- **Holiday Awareness**: Integrated holiday detection with festive markers and custom hover tooltips.
- **Dynamic Theming**: Each month features a unique, high-resolution hero image (Nature/Landscape) and a synchronized accent color theme.

### 3. **Integrated Notes Section**
- **Contextual Note-Taking**: Notes are saved per-selection or per-month. The header dynamically updates based on your range (e.g., "Apr 6 – Apr 12").
- **Physical Feel**: Designed with a "lined paper" texture to match the tactile calendar theme.
- **Persistence**: All notes are automatically saved to `localStorage` and persist through page reloads.

### 4. **Motion & UX**
- **3D Page Flips**: Powered by `framer-motion` with custom spring physics (mass, damping, stiffness) for a weighted, physical transition.
- **Instant Theme Matching**: Optimized with unique SVG Gradient IDs per month to ensure theme colors update synchronously with the image flip (eliminating visual lag).
- **Responsive Layout**: Seamless transition from a desktop side-by-side view to a mobile-optimized vertical stack.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Utility**: [Date-fns](https://date-fns.org/) for robust date arithmetic.
- **Styling**: Vanilla CSS (Modern CSS Variables, `color-mix`, `clip-path`).
- **Data Persistence**: Browser `localStorage`.

---

## ⚙️ Running Locally

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd calendar-react
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🎨 Design Choices & Rationale

- **Vertical Mobile Stack**: On smaller screens, the layout shifts to a vertical orientation where the Hero image anchors the top and the Notes panel moves below the grid. This ensures accessibility and prevents horizontal scrolling.
- **Unique Theme ID Isolation**: We discovered that browsers sometimes cache SVG gradient IDs across transitions. To ensure multiple months could be in the DOM simultaneously during a flip without color "jumping," I implemented unique `chevronGrad-{month}` IDs for each page.
- **Physics-Based Animation**: Rather than simple faders, we used `mass: 1.2` and `damping: 28` in our spring physics to give the pages a realistic "heavy" feel when flipping.

---

## 📦 Submission Requirements Checklist

- [x] **Source Code**: Full project structure in current repository.
- [x] **Day Range Selection**: Fully functional with interactive range states.
- [x] **Notes Feature**: Persistent data storage with contextual headers.
- [x] **Mobile Responsiveness**: Layout adapts fluidly for all screen sizes.

---
**Author**: [Bharathi Doma]
*Frontend Engineering Challenge submission.*
