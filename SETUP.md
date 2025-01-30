# Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd chicken-run
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
# Game Difficulty Settings
EASY_BASE_MULTIPLIER=1.05
EASY_INCREMENT=0.15
MEDIUM_BASE_MULTIPLIER=1.10
MEDIUM_INCREMENT=0.20
HARD_BASE_MULTIPLIER=1.15
HARD_INCREMENT=0.25

# Betting Settings
MIN_BET_AMOUNT=1.00
MAX_BET_AMOUNT=5.00
DEFAULT_BET_AMOUNT=2.00

# Vehicle Settings
MIN_VEHICLE_SPEED=2
MAX_VEHICLE_SPEED=4
VEHICLE_SPAWN_RATE=0.01

# API Settings
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

4. Start the development servers:

In terminal 1 (Frontend):
```bash
npm run dev
```

In terminal 2 (Backend):
```bash
npm run server:dev
```

The game will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
