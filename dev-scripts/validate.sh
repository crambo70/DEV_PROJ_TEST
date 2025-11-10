#!/bin/bash
# SCENIC Development Environment Validation Script
# Checks if the development environment is properly configured

echo "🔍 SCENIC Development Environment Validation"
echo "============================================="
echo ""

# Check if gitdeploy function exists
if command -v gitdeploy &> /dev/null; then
    echo "✅ gitdeploy command available"
    
    # Test gitdeploy help
    echo "📋 Testing gitdeploy help..."
    if gitdeploy --help &> /dev/null; then
        echo "✅ gitdeploy help works"
    else
        echo "⚠️  gitdeploy help returned error (might be expected behavior)"
    fi
else
    echo "❌ gitdeploy command not found"
    echo "💡 Run: ./dev-scripts/setup.sh"
fi

echo ""

# Check repository structure
echo "📂 Checking repository structure..."

# Check if we're in Dev_Proj_Test
CURRENT_DIR=$(basename $(pwd))
if [[ "$CURRENT_DIR" == "Dev_Proj_Test" ]]; then
    echo "✅ In development repository: Dev_Proj_Test"
else
    echo "⚠️  Current directory: $CURRENT_DIR (expected: Dev_Proj_Test)"
fi

# Check for production repository
PARENT_DIR=$(dirname $(pwd))
PROD_DIR="$PARENT_DIR/DEV_PROJ_TEST-prod"

if [[ -d "$PROD_DIR" ]]; then
    echo "✅ Production repository found: $PROD_DIR"
else
    echo "❌ Production repository not found: $PROD_DIR"
    echo "💡 Clone it with: git clone https://github.com/crambo70/DEV_PROJ_TEST-prod.git"
fi

echo ""

# Check development scripts
echo "🔧 Checking development scripts..."

if [[ -f "dev-scripts/gitdeploy.sh" ]]; then
    echo "✅ gitdeploy.sh found"
else
    echo "❌ gitdeploy.sh not found"
fi

if [[ -f "dev-scripts/setup.sh" ]]; then
    echo "✅ setup.sh found"
else
    echo "❌ setup.sh not found"
fi

if [[ -f "dev-scripts/README.md" ]]; then
    echo "✅ README.md found"
else
    echo "❌ README.md not found"
fi

echo ""

# Check git configuration
echo "🔗 Checking git configuration..."

# Check if git is configured
if git config user.name &> /dev/null && git config user.email &> /dev/null; then
    echo "✅ Git user configured: $(git config user.name) <$(git config user.email)>"
else
    echo "⚠️  Git user not configured"
    echo "💡 Configure with:"
    echo "   git config --global user.name 'Your Name'"
    echo "   git config --global user.email 'your.email@example.com'"
fi

# Check remote repositories
echo ""
echo "🌐 Checking remote repositories..."

DEV_REMOTE=$(git remote get-url origin 2>/dev/null || echo "not configured")
echo "Development remote: $DEV_REMOTE"

if [[ -d "$PROD_DIR" ]]; then
    PROD_REMOTE=$(cd "$PROD_DIR" && git remote get-url origin 2>/dev/null || echo "not configured")
    echo "Production remote: $PROD_REMOTE"
fi

echo ""
echo "🎯 Environment Status Summary"
echo "=============================="

# Overall assessment
ISSUES=0

# Count issues
if ! command -v gitdeploy &> /dev/null; then
    ((ISSUES++))
fi

if [[ "$CURRENT_DIR" != "Dev_Proj_Test" ]]; then
    ((ISSUES++))
fi

if [[ ! -d "$PROD_DIR" ]]; then
    ((ISSUES++))
fi

if [[ $ISSUES -eq 0 ]]; then
    echo "🎉 All checks passed! Environment is ready for development."
    echo ""
    echo "🚀 Available commands:"
    echo "  gitdeploy          # Deploy to development"
    echo "  gitdeploy -dev     # Deploy to development (explicit)"
    echo "  gitdeploy -prod    # Deploy to production"
    echo "  gitdeploy -prod -f # Deploy to production (force)"
else
    echo "⚠️  Found $ISSUES issue(s) that need attention."
    echo ""
    echo "💡 To fix issues:"
    echo "  1. Run: ./dev-scripts/setup.sh"
    echo "  2. Clone production repository if missing"
    echo "  3. Configure git if needed"
fi

echo ""