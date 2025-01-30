# Chicken Run Game 🐔

A fun browser-based game built with React, TypeScript, and Canvas where players guide a chicken across traffic lanes while earning multipliers.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chicken-run
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The game will be available at `http://localhost:5173`

## Building for Production

1. Create a production build:
```bash
npm run build
```

2. Preview the production build locally:
```bash
npm run preview
```

## Deployment

### Static Hosting (Recommended)

The game can be deployed to any static hosting service. The production build will be in the `dist` directory.

1. Build the project:
```bash
npm run build
```

2. Deploy the contents of the `dist` directory to your hosting service.

Common hosting options:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

### Server Requirements

If deploying to your own server:

- Node.js v18+
- 512MB RAM minimum
- 1GB storage minimum
- HTTPS certificate (recommended for production)

### Environment Variables

Create a `.env` file in the root directory with these variables:

```env
# Game Difficulty Settings
EASY_BASE_MULTIPLIER=1.05
EASY_INCREMENT=0.15
MEDIUM_BASE_MULTIPLIER=1.10
MEDIUM_INCREMENT=0.20
HARD_BASE_MULTIPLIER=1.15
HARD_INCREMENT=0.25

# Betting Settings
MIN_BET_AMOUNT=0.05
MAX_BET_AMOUNT=2.00
DEFAULT_BET_AMOUNT=0.25

# Vehicle Settings
MIN_VEHICLE_SPEED=2
MAX_VEHICLE_SPEED=4
VEHICLE_SPAWN_RATE=0.01
```

## Project Structure

```
chicken-run/
├── src/
│   ├── components/       # React components
│   ├── game/            # Game logic and mechanics
│   │   ├── assets/      # Game assets and resources
│   │   ├── renderer/    # Canvas rendering logic
│   │   └── types/       # TypeScript type definitions
│   └── main.tsx         # Application entry point
├── public/              # Static assets
└── package.json         # Project dependencies and scripts
```

## Dependencies

Main dependencies:
- React 18.3.1
- TypeScript 5.5.3
- Vite 5.4.2
- Tailwind CSS 3.4.1
- Lucide React 0.344.0

Dev dependencies:
- ESLint 9.9.1
- PostCSS 8.4.35
- Autoprefixer 10.4.18

## Browser Support

The game supports modern browsers:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Performance Considerations

For optimal performance:
- Serve assets through a CDN
- Enable HTTP/2
- Enable browser caching
- Compress static assets
- Use a production build

## Security Notes

- All game logic runs client-side
- Session storage is used for game state
- No server-side validation is implemented
- Add your own authentication if needed

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]
"# chicken-crash" 
