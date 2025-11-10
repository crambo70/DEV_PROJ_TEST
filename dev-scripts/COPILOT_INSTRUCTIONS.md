# 🤖 Copilot Setup Instructions for SCENIC Development Environment

## Quick Setup Guide for AI Assistants

When a user asks you to help them set up the SCENIC development environment on a new system, follow this streamlined process:

### 1. Repository Setup
```bash
# Help user clone both repositories
git clone https://github.com/crambo70/DEV_PROJ_TEST.git
cd DEV_PROJ_TEST
cd ..
git clone https://github.com/crambo70/DEV_PROJ_TEST-prod.git
cd DEV_PROJ_TEST
```

### 2. Automated Setup
```bash
# Run the automated setup
./dev-scripts/setup.sh
```

### 3. Validation
```bash
# Validate the setup
./dev-scripts/validate.sh
```

### 4. Test Installation
```bash
# Reload shell and test
source ~/.zshrc  # or ~/.bashrc
gitdeploy --help
```

## 🔧 If Automation Fails

### Manual Installation Steps:
1. **Check shell type**: `echo $SHELL`
2. **Add to config**:
   - **zsh**: `echo 'source "'$(pwd)'/dev-scripts/gitdeploy.sh"' >> ~/.zshrc`
   - **bash (macOS)**: `echo 'source "'$(pwd)'/dev-scripts/gitdeploy.sh"' >> ~/.bash_profile`
   - **bash (Linux)**: `echo 'source "'$(pwd)'/dev-scripts/gitdeploy.sh"' >> ~/.bashrc`
3. **Reload**: `source ~/.zshrc` (or appropriate config)

## 🎯 Expected Outcomes

After successful setup:
- ✅ `gitdeploy --help` shows usage information
- ✅ Directory structure: `parent/DEV_PROJ_TEST/` and `parent/DEV_PROJ_TEST-prod/`
- ✅ Commands work: `gitdeploy -dev` and `gitdeploy -prod`

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "command not found" | Run `source ~/.zshrc` |
| "Production repo not found" | Clone DEV_PROJ_TEST-prod in parent directory |
| "Permission denied" | Run `chmod +x dev-scripts/*.sh` |
| Setup script fails | Use manual installation steps |

## 📋 Validation Checklist

Use this to verify successful setup:
- [ ] User can run `gitdeploy --help`
- [ ] Both repositories exist in correct structure
- [ ] Development deployment works: `gitdeploy -dev`
- [ ] Production deployment prompts correctly: `gitdeploy -prod`

## 🎪 GitHub Pages Configuration

Remind users to configure GitHub Pages:
1. **Production repo**: Settings → Pages → Deploy from main branch
2. **Dev repo** (optional): Same settings
3. URLs will be:
   - Dev: https://crambo70.github.io/DEV_PROJ_TEST/
   - Prod: https://crambo70.github.io/DEV_PROJ_TEST-prod/

---

*Use the full README.md for comprehensive documentation*