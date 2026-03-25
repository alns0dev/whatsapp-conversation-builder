# WhatsApp Mockup Builder

Create realistic WhatsApp iPhone conversation screenshots and export them as high-resolution PNGs or animated videos.

![WhatsApp Mockup Builder](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Realistic iPhone frame** with Dynamic Island, status bar, and WhatsApp-style UI
- **Editable conversations** — add, reorder, and remove text or image messages
- **Two participants** (Contact + Brand) with customizable names and avatars
- **Avatar uploads** — paste a URL or upload an image file (persisted in localStorage)
- **Multiple wallpapers** — solid gradients, WhatsApp-style doodle patterns, or a custom background image
- **Date picker** with calendar selection and editable clock/status bar
- **High-res PNG export** at 2x pixel ratio via html2canvas
- **Animated video export** that reveals each message bubble in sequence
- **Live preview** — all changes update the phone mockup in real time

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/wa-creator.git
cd wa-creator

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Export

Click **Export PNG** to download a screenshot of the phone mockup. The exported image is rendered at 2x resolution for crisp results on retina displays.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Calendar, Popover, Button)
- [html2canvas-pro](https://github.com/nicholasgasior/html2canvas-pro) for PNG export
- [date-fns](https://date-fns.org/) for date formatting
- [Lucide React](https://lucide.dev/) for icons

## Project Structure

```
app/
  page.tsx        # Main app — editor, preview, and export logic
  layout.tsx      # Root layout with Inter + Geist fonts
  globals.css     # Tailwind theme and base styles
components/
  ui/             # shadcn components (Button, Calendar, Popover)
```

## License

[MIT](LICENSE)
