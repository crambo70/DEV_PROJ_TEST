#!/bin/bash
# SCENIC Development Environment Setup Script
# This script sets up the complete development environment on any Unix-like system

set -e  # Exit on any error

echo "🚀 SCENIC Development Environment Setup"
echo "======================================="
echo ""

# Detect shell
SHELL_NAME=$(basename "$SHELL")
echo "🔍 Detected shell: $SHELL_NAME"

# Determine shell configuration file
case "$SHELL_NAME" in
    "zsh")
        SHELL_CONFIG="$HOME/.zshrc"
        ;;
    "bash")
        if [[ "$OSTYPE" == "darwin"* ]]; then
            SHELL_CONFIG="$HOME/.bash_profile"
        else
            SHELL_CONFIG="$HOME/.bashrc"
        fi
        ;;
    *)
        echo "⚠️  Unsupported shell: $SHELL_NAME"
        echo "Supported shells: zsh, bash"
        exit 1
        ;;
esac

echo "📝 Shell configuration file: $SHELL_CONFIG"
echo ""

# Check for required tools
echo "🔧 Checking required tools..."

# Check for git
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git and try again."
    exit 1
fi
echo "✅ Git found: $(git --version)"

# Check for rsync
if ! command -v rsync &> /dev/null; then
    echo "❌ rsync is not installed. Please install rsync and try again."
    exit 1
fi
echo "✅ rsync found"

echo ""

# Get current directory (should be inside Dev_Proj_Test)
CURRENT_DIR=$(pwd)
if [[ ! -f "$CURRENT_DIR/dev-scripts/gitdeploy.sh" ]]; then
    echo "❌ Error: This script must be run from the Dev_Proj_Test directory"
    echo "Expected to find: $CURRENT_DIR/dev-scripts/gitdeploy.sh"
    exit 1
fi

echo "📂 Current directory: $CURRENT_DIR"
echo "✅ Development scripts found"
echo ""

# Backup existing shell configuration
if [[ -f "$SHELL_CONFIG" ]]; then
    echo "💾 Backing up existing shell configuration..."
    cp "$SHELL_CONFIG" "${SHELL_CONFIG}.scenic-backup-$(date +%Y%m%d-%H%M%S)"
    echo "✅ Backup created: ${SHELL_CONFIG}.scenic-backup-$(date +%Y%m%d-%H%M%S)"
fi

# Install gitdeploy function
echo ""
echo "🔧 Installing gitdeploy function..."

# Remove any existing gitdeploy function
if grep -q "gitdeploy()" "$SHELL_CONFIG" 2>/dev/null; then
    echo "🔄 Removing existing gitdeploy function..."
    # Create temporary file without gitdeploy function
    grep -v -A 200 "gitdeploy()" "$SHELL_CONFIG" | grep -v -B 200 "export -f gitdeploy" > "${SHELL_CONFIG}.tmp" || true
    mv "${SHELL_CONFIG}.tmp" "$SHELL_CONFIG"
fi

# Add SCENIC development environment marker
echo "" >> "$SHELL_CONFIG"
echo "# SCENIC Development Environment - Auto-generated $(date)" >> "$SHELL_CONFIG"
echo "# Source: $CURRENT_DIR/dev-scripts/" >> "$SHELL_CONFIG"

# Source the gitdeploy script
echo "source \"$CURRENT_DIR/dev-scripts/gitdeploy.sh\"" >> "$SHELL_CONFIG"

echo "✅ gitdeploy function installed"
echo ""

# Check for production repository
PARENT_DIR=$(dirname "$CURRENT_DIR")
PROD_DIR="$PARENT_DIR/DEV_PROJ_TEST-prod"

echo "🔍 Checking for production repository..."
if [[ -d "$PROD_DIR" ]]; then
    echo "✅ Production repository found: $PROD_DIR"
else
    echo "⚠️  Production repository not found: $PROD_DIR"
    echo ""
    echo "📋 To complete the setup, you need to:"
    echo "1. Clone the production repository:"
    echo "   cd \"$PARENT_DIR\""
    echo "   git clone https://github.com/crambo70/DEV_PROJ_TEST-prod.git"
    echo ""
    echo "2. Or if the repository doesn't exist yet, create it on GitHub first:"
    echo "   https://github.com/new"
    echo "   Repository name: DEV_PROJ_TEST-prod"
    echo ""
fi

echo ""
echo "🎯 Setup Summary"
echo "================"
echo "✅ Shell configuration updated: $SHELL_CONFIG"
echo "✅ gitdeploy function installed"
echo "📂 Development repository: $CURRENT_DIR"
echo "📂 Production repository: $PROD_DIR"
echo ""
echo "🚀 Next Steps:"
echo "1. Restart your terminal or run: source $SHELL_CONFIG"
echo "2. Test the setup: gitdeploy --help"
echo "3. For development: gitdeploy -dev"
echo "4. For production: gitdeploy -prod"
echo ""
echo "📚 Command Reference:"
echo "  gitdeploy          # Deploy to development (default)"
echo "  gitdeploy -dev     # Deploy to development (explicit)"
echo "  gitdeploy -prod    # Deploy to production (with confirmation)"
echo "  gitdeploy -prod -f # Deploy to production (force, no confirmation)"
echo ""
echo "✨ SCENIC Development Environment setup complete!"