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
            # macOS prefers .bash_profile
            SHELL_CONFIG="$HOME/.bash_profile"
        else
            # Linux typically uses .bashrc
            SHELL_CONFIG="$HOME/.bashrc"
        fi
        ;;
    "fish")
        echo "⚠️  Fish shell detected. Manual setup required:"
        echo "Add this to your ~/.config/fish/config.fish:"
        echo "source \"$CURRENT_DIR/dev-scripts/gitdeploy.sh\""
        exit 1
        ;;
    *)
        echo "⚠️  Unsupported shell: $SHELL_NAME"
        echo "Supported shells: zsh, bash"
        echo "For manual setup, add this to your shell config:"
        echo "source \"$CURRENT_DIR/dev-scripts/gitdeploy.sh\""
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
    echo "Visit: https://git-scm.com/downloads"
    exit 1
fi

# Check git version (need at least 2.0 for some features)
GIT_VERSION=$(git --version | grep -oE '[0-9]+\.[0-9]+' | head -1)
if [[ $(echo "$GIT_VERSION 2.0" | tr ' ' '\n' | sort -V | head -1) != "2.0" ]]; then
    echo "⚠️  Git version $GIT_VERSION detected. Some features may not work."
    echo "Recommended: Git 2.0 or newer"
fi
echo "✅ Git found: $(git --version)"

# Check for rsync
if ! command -v rsync &> /dev/null; then
    echo "❌ rsync is not installed. Please install rsync and try again."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "On macOS: Install Xcode Command Line Tools"
        echo "  xcode-select --install"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "On Ubuntu/Debian: sudo apt install rsync"
        echo "On RHEL/CentOS: sudo yum install rsync"
    fi
    exit 1
fi
echo "✅ rsync found"

# Check bash/zsh features
if [[ "$SHELL_NAME" == "bash" ]]; then
    # Check bash version (need at least 4.0 for associative arrays)
    BASH_VERSION=$(bash --version | head -1 | grep -oE '[0-9]+\.[0-9]+' | head -1)
    if [[ $(echo "$BASH_VERSION 4.0" | tr ' ' '\n' | sort -V | head -1) != "4.0" ]]; then
        echo "⚠️  Bash version $BASH_VERSION detected. Some features may not work optimally."
        echo "Recommended: Bash 4.0 or newer"
    fi
fi

echo ""

# Get current directory (should be inside Dev_Proj_Test)
CURRENT_DIR=$(pwd)
if [[ ! -f "$CURRENT_DIR/dev-scripts/gitdeploy.sh" ]]; then
    echo "❌ Error: This script must be run from the development repository directory"
    echo "Expected to find: $CURRENT_DIR/dev-scripts/gitdeploy.sh"
    echo ""
    echo "Make sure you:"
    echo "1. Are in the correct directory (should contain dev-scripts folder)"
    echo "2. Have cloned the complete repository with all files"
    exit 1
fi

echo "📂 Current directory: $CURRENT_DIR"
echo "✅ Development scripts found"
echo ""

# Backup existing shell configuration
if [[ -f "$SHELL_CONFIG" ]]; then
    echo "💾 Backing up existing shell configuration..."
    BACKUP_FILE="${SHELL_CONFIG}.scenic-backup-$(date +%Y%m%d-%H%M%S)"
    if cp "$SHELL_CONFIG" "$BACKUP_FILE"; then
        echo "✅ Backup created: $BACKUP_FILE"
    else
        echo "❌ Failed to create backup. Check permissions."
        exit 1
    fi
else
    echo "📝 Creating new shell configuration file: $SHELL_CONFIG"
    touch "$SHELL_CONFIG" || {
        echo "❌ Cannot create shell configuration file. Check permissions."
        exit 1
    }
fi

# Install gitdeploy function
echo ""
echo "🔧 Installing gitdeploy function..."

# Remove any existing gitdeploy function (safer approach)
if [[ -f "$SHELL_CONFIG" ]] && grep -q "SCENIC Development Environment" "$SHELL_CONFIG"; then
    echo "🔄 Removing existing SCENIC development environment..."
    # Create temporary file without SCENIC section
    awk '
    /# SCENIC Development Environment/ { skip=1 }
    /# End SCENIC Development Environment/ { skip=0; next }
    !skip { print }
    ' "$SHELL_CONFIG" > "${SHELL_CONFIG}.tmp"
    
    if [[ -s "${SHELL_CONFIG}.tmp" ]]; then
        mv "${SHELL_CONFIG}.tmp" "$SHELL_CONFIG"
        echo "✅ Previous installation removed"
    else
        echo "❌ Error processing shell configuration. Using backup."
        rm -f "${SHELL_CONFIG}.tmp"
        return 1
    fi
fi

# Add SCENIC development environment marker with end marker for safer removal
echo "" >> "$SHELL_CONFIG"
echo "# SCENIC Development Environment - Auto-generated $(date)" >> "$SHELL_CONFIG"
echo "# Source: $CURRENT_DIR/dev-scripts/" >> "$SHELL_CONFIG"

# Source the gitdeploy script
echo "source \"$CURRENT_DIR/dev-scripts/gitdeploy.sh\"" >> "$SHELL_CONFIG"

echo "# End SCENIC Development Environment" >> "$SHELL_CONFIG"

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