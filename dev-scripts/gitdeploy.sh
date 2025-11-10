#!/bin/bash
# SCENIC Development Environment - Enhanced GitDeploy Script
# Supports dual-repository deployment workflow (dev/prod)

gitdeploy() {
    # Parse arguments
    local deploy_target="dev"  # default to development
    local force_prod=false
    
    # Check for arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -prod|--production)
                deploy_target="prod"
                shift
                ;;
            -dev|--development)
                deploy_target="dev"
                shift
                ;;
            -f|--force)
                force_prod=true
                shift
                ;;
            *)
                echo "Unknown option: $1"
                echo "Usage: gitdeploy [-dev|-prod] [-f]"
                echo "  -dev, --development  Deploy to development repository [default]"
                echo "  -prod, --production  Deploy to production repository"
                echo "  -f, --force         Force production deployment without confirmation"
                return 1
                ;;
        esac
    done
    
    # Get current branch and repository info
    local current_branch=$(git branch --show-current)
    local current_repo=$(basename $(git rev-parse --show-toplevel))
    
    # Production deployment logic
    if [[ "$deploy_target" == "prod" ]]; then
        echo "🚀 PRODUCTION DEPLOYMENT MODE"
        echo "Current repo: $current_repo"
        
        # Make sure we're in the dev repository
        if [[ "$current_repo" != "Dev_Proj_Test" ]]; then
            echo "❌ Error: Production deployment must be run from the development repository (Dev_Proj_Test)"
            return 1
        fi
        
        # Safety check for production
        if [[ "$force_prod" != true ]]; then
            echo ""
            echo "⚠️  WARNING: You are about to deploy to PRODUCTION!"
            echo "This will:"
            echo "  1. Commit current dev changes"
            echo "  2. Copy clean code to production repository"
            echo "  3. Deploy to production GitHub Pages"
            echo "📍 Production URL: https://crambo70.github.io/DEV_PROJ_TEST-prod/"
            echo ""
            echo "Are you sure you want to continue? (y/N)"
            read confirm
            if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
                echo "Production deployment cancelled."
                return 1
            fi
        fi
        
        # First, commit any pending changes in dev
        if [[ -n $(git status --porcelain) ]]; then
            echo ""
            echo "=== Committing development changes first ==="
            
            # Show current changes
            git status --short
            echo ""
            
            # Generate commit message
            local changed_files=$(git status --porcelain | wc -l | tr -d ' ')
            local commit_msg="Update project files ($changed_files files changed)"
            
            if [[ $changed_files -eq 1 ]]; then
                local file=$(git status --porcelain | awk '{print $2}')
                commit_msg="Update $file"
            fi
            
            echo "Commit message: \"$commit_msg\""
            git add .
            git commit -m "$commit_msg"
            git push origin "$current_branch"
        fi
        
        echo ""
        echo "=== Deploying to Production Repository ==="
        
        # Navigate to production repository
        local prod_path="../DEV_PROJ_TEST-prod"
        if [[ ! -d "$prod_path" ]]; then
            echo "❌ Error: Production repository not found at $prod_path"
            echo "Make sure you have cloned the production repository."
            return 1
        fi
        
        cd "$prod_path"
        
        # Pull latest from production
        echo "Pulling latest production changes..."
        git pull origin main
        
        # Copy files from dev (excluding .git directory)
        echo "Copying files from development..."
        rsync -av --exclude='.git' ../Dev_Proj_Test/ ./
        
        # Remove dev-debug styling for production
        echo "Cleaning up for production (removing dev-debug)..."
        sed -i.bak 's/<body class="dev-debug">/<body>/g' index.html && rm -f index.html.bak
        
        # Commit and push production changes
        git add .
        git commit -m "Production deployment from dev - $(date '+%Y-%m-%d %H:%M')"
        git push origin main
        
        # Return to dev repository
        cd - > /dev/null
        
        echo ""
        echo "✅ PRODUCTION DEPLOYMENT COMPLETE!"
        echo "🌐 Production site: https://crambo70.github.io/DEV_PROJ_TEST-prod/"
        echo "🔧 Development site: https://crambo70.github.io/DEV_PROJ_TEST/"
        echo "📁 Back in development repository"
        
    else
        # Development deployment (original behavior)
        echo "🔧 DEVELOPMENT DEPLOYMENT MODE"
        echo "Current repo: $current_repo"
        echo "Current branch: $current_branch"
        
        # Check if there are any changes
        if [[ -z $(git status --porcelain) ]]; then
            echo "No changes to commit."
            return 1
        fi
        
        # Show current changes
        echo ""
        echo "=== Current Changes ==="
        git status --short
        echo ""
        
        # Generate automatic commit message based on changed files
        local changed_files=$(git status --porcelain | wc -l | tr -d ' ')
        local commit_msg="Update project files ($changed_files files changed)"
        
        # If only one file changed, be more specific
        if [[ $changed_files -eq 1 ]]; then
            local file=$(git status --porcelain | awk '{print $2}')
            commit_msg="Update $file"
        fi
        
        echo "=== Proposed Commit Message ==="
        echo "\"$commit_msg\""
        echo ""
        echo "Press ENTER to proceed with this commit message, or type a custom message:"
        read user_input
        
        # Use custom message if provided, otherwise use generated one
        if [[ -n "$user_input" ]]; then
            commit_msg="$user_input"
        fi
        
        echo ""
        echo "=== Executing Git Commands ==="
        echo "git add ."
        git add .
        
        echo "git commit -m \"$commit_msg\""
        git commit -m "$commit_msg"
        
        echo "git push origin $current_branch"
        git push origin "$current_branch"
        
        echo ""
        echo "✅ Development changes committed!"
        echo "🔧 Development site: https://crambo70.github.io/DEV_PROJ_TEST/"
        echo "🚀 To deploy to production, run: gitdeploy -prod"
    fi
}

# Export the function
export -f gitdeploy