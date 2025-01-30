#!/bin/bash

# Text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print colored message
print_message() {
    echo -e "${GREEN}==>${NC} $1"
}

print_error() {
    echo -e "${RED}Error:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}Warning:${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_message "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        echo "Please install Node.js v18 or higher from https://nodejs.org"
        exit 1
    fi

    # Check Node.js version
    node_version=$(node -v | cut -d'v' -f2)
    if [ "$(printf '%s\n' "18.0.0" "$node_version" | sort -V | head -n1)" = "18.0.0" ]; then
        print_message "Node.js v$node_version detected"
    else
        print_error "Node.js v18 or higher is required (current: v$node_version)"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_message "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_message "npm $(npm -v) detected"
}

# Create .env file
create_env() {
    print_message "Creating .env file..."
    if [ -f .env ]; then
        print_warning ".env file already exists, skipping..."
        return
    fi

    cat > .env << EOL
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
EOL

    print_message ".env file created successfully"
}

# Install dependencies
install_dependencies() {
    print_message "Installing dependencies..."
    if [ ! -f package.json ]; then
        print_error "package.json not found"
        exit 1
    fi
    npm install
}

# Main installation process
main() {
    echo -e "${GREEN}Starting Chicken Run installation...${NC}\n"
    
    # Run checks
    check_node
    check_npm
    
    # Install
    create_env
    install_dependencies
    
    # Success message
    echo -e "\n${GREEN}Installation completed successfully!${NC}"
    echo -e "\nTo start the development servers:"
    echo -e "1. In terminal 1 (Frontend):"
    echo -e "   ${YELLOW}npm run dev${NC}"
    echo -e "\n2. In terminal 2 (Backend):"
    echo -e "   ${YELLOW}npm run server:dev${NC}"
    echo -e "\nThe game will be available at:"
    echo -e "- Frontend: http://localhost:5173"
    echo -e "- Backend: http://localhost:3000"
}

# Run the installation
main
