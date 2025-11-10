# SCENIC Development Environment - Setup Instructions

## 📋 Overview
This folder contains portable development scripts for the SCENIC project dual-repository workflow. It enables seamless development and production deployments across different systems.

## 🎯 What This Provides
- **Dual Repository Workflow**: Separate development and production environments
- **Enhanced gitdeploy Command**: Intelligent deployment with safety features
- **Cross-Platform Compatibility**: Works on macOS, Linux, and WSL
- **Shell Support**: Compatible with zsh and bash

## 🚀 Quick Setup (For Copilot)

When helping a user set up this environment on a new system, follow these steps:

### Step 1: Prerequisites Check
Ensure the user has:
- Git installed and configured
- rsync available (usually pre-installed on Unix systems)
- Terminal access with zsh or bash shell

### Step 2: Repository Setup
Help the user clone both repositories:

```bash
# Clone development repository
git clone https://github.com/crambo70/DEV_PROJ_TEST.git
cd DEV_PROJ_TEST

# Clone production repository (in parent directory)
cd ..
git clone https://github.com/crambo70/DEV_PROJ_TEST-prod.git

# Return to development directory
cd DEV_PROJ_TEST
```

### Step 3: Automated Setup
Run the automated setup script:

```bash
# Make setup script executable
chmod +x dev-scripts/setup.sh

# Run the setup
./dev-scripts/setup.sh
```

### Step 4: Verify Installation
```bash
# Restart terminal or reload shell config
source ~/.zshrc  # or ~/.bashrc on Linux

# Test the installation
gitdeploy --help
```

## 🔧 Manual Setup (If Automated Fails)

If the automated setup encounters issues, follow these manual steps:

### For zsh users:
```bash
echo 'source "'$(pwd)'/dev-scripts/gitdeploy.sh"' >> ~/.zshrc
source ~/.zshrc
```

### For bash users (macOS):
```bash
echo 'source "'$(pwd)'/dev-scripts/gitdeploy.sh"' >> ~/.bash_profile
source ~/.bash_profile
```

### For bash users (Linux):
```bash
echo 'source "'$(pwd)'/dev-scripts/gitdeploy.sh"' >> ~/.bashrc
source ~/.bashrc
```

## 📚 Usage Guide

### Development Workflow
```bash
# Regular development deployment (default)
gitdeploy

# Explicit development deployment
gitdeploy -dev
```

### Production Deployment
```bash
# Production deployment with confirmation
gitdeploy -prod

# Production deployment without confirmation
gitdeploy -prod -f
```

## 🌐 GitHub Pages Setup

After setup, configure GitHub Pages for both repositories:

### Development Repository (Optional)
1. Go to: https://github.com/crambo70/DEV_PROJ_TEST
2. Settings → Pages
3. Source: "Deploy from a branch"
4. Branch: "main" / "/ (root)"
5. Save

### Production Repository (Required)
1. Go to: https://github.com/crambo70/DEV_PROJ_TEST-prod
2. Settings → Pages
3. Source: "Deploy from a branch"
4. Branch: "main" / "/ (root)"
5. Save

## 🔍 Expected URLs
- **Development**: https://crambo70.github.io/DEV_PROJ_TEST/
- **Production**: https://crambo70.github.io/DEV_PROJ_TEST-prod/

## 🛠️ Troubleshooting

### Common Issues

**"gitdeploy command not found"**
- Solution: Run `source ~/.zshrc` (or appropriate shell config)
- Verify: Check if the source line was added to your shell config

**"Production repository not found"**
- Solution: Ensure DEV_PROJ_TEST-prod is cloned in the parent directory
- Structure should be:
  ```
  parent-folder/
  ├── DEV_PROJ_TEST/          (development)
  └── DEV_PROJ_TEST-prod/     (production)
  ```

**"rsync command not found"**
- macOS: Install Xcode Command Line Tools
- Linux: `sudo apt install rsync` or equivalent

**Permission issues on setup**
- Run: `chmod +x dev-scripts/setup.sh`
- For manual setup, check file permissions

### System-Specific Notes

**macOS**
- Uses `sed -i.bak` for in-place editing
- Default shell is zsh (macOS 10.15+)

**Linux**
- Uses `sed -i` for in-place editing
- Default shell varies (usually bash)

**Windows (WSL)**
- Ensure you're using WSL, not PowerShell
- Git line endings should be configured properly

## 📁 File Structure
```
dev-scripts/
├── setup.sh           # Automated setup script
├── gitdeploy.sh        # Core deployment function
└── README.md           # This file
```

## 🔄 Updates
When the scripts are updated:
1. Pull latest changes: `git pull`
2. Re-run setup: `./dev-scripts/setup.sh`
3. Or manually source: `source ~/.zshrc`

## 🎯 For Other Copilot Instances

When helping users with this setup:
1. **Start with the automated setup** - it handles most cases
2. **Check prerequisites** before starting
3. **Verify directory structure** - this is the most common issue
4. **Test the final installation** with `gitdeploy --help`
5. **Guide through GitHub Pages setup** for both repositories

The automated setup script provides detailed feedback and error messages to help diagnose issues.

## 💡 Advanced Usage

### Custom Production Repository Name
If using a different production repository name, update the paths in `gitdeploy.sh`:
```bash
# Change this line in gitdeploy.sh
local prod_path="../YOUR_PROD_REPO_NAME"
```

### Adding Additional Scripts
Place additional development scripts in this folder and source them in `setup.sh` for automatic installation.

---

*This development environment was created to provide a portable, professional deployment workflow for the SCENIC project.*