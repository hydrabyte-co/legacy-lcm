#!/bin/bash

# LCM Service Git Workflow Helper
# TranGPT Company - Simplified git operations for LCM development
# Usage: ./scripts/git-workflow.sh <command> [options]

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }
warn() { echo -e "${YELLOW}[WARNING] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; }
info() { echo -e "${BLUE}[INFO] $1${NC}"; }

show_help() {
    echo "LCM Service Git Workflow Helper"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  feature <name>           Create and switch to new feature branch"
    echo "  release <version>        Create release branch and prepare for deployment"
    echo "  hotfix <name>            Create hotfix branch from main"
    echo "  sync-submodule           Update submodule to latest and commit"
    echo "  status                   Show status of main repo and submodule"
    echo "  prepare-deploy           Prepare branch for deployment (build test)"
    echo "  merge-feature <branch>   Merge feature branch to develop"
    echo "  finish-release           Merge release to main and tag version"
    echo "  cleanup                  Clean up merged branches"
    echo ""
    echo "Examples:"
    echo "  $0 feature customer-encryption     # Create feature/customer-encryption"
    echo "  $0 release v1.2.0                  # Create release/v1.2.0"
    echo "  $0 hotfix payment-bug               # Create hotfix/payment-bug"
    echo "  $0 sync-submodule                   # Update common submodule"
    echo "  $0 prepare-deploy                   # Test build before deployment"
}

# Check if we're in LCM service directory
check_repo() {
    if [[ ! -f "package.json" ]] || ! grep -q '"name".*"lcm-service"' package.json 2>/dev/null; then
        error "Not in LCM service directory"
        exit 1
    fi
}

# Create feature branch
create_feature() {
    local feature_name=$1
    if [[ -z "$feature_name" ]]; then
        error "Feature name is required"
        exit 1
    fi
    
    local branch_name="feature/$feature_name"
    
    log "🌿 Creating feature branch: $branch_name"
    
    # Ensure we're on develop and up to date
    git checkout develop
    git pull origin develop
    
    # Update submodule
    log "📦 Updating submodule..."
    git submodule update --recursive
    
    # Create and switch to feature branch
    git checkout -b "$branch_name"
    
    log "✅ Feature branch '$branch_name' created and checked out"
    log "💡 You can now start working on your feature"
    log "💡 When done, use: $0 merge-feature $branch_name"
}

# Create release branch
create_release() {
    local version=$1
    if [[ -z "$version" ]]; then
        error "Version is required (e.g., v1.2.0)"
        exit 1
    fi
    
    local branch_name="release/$version"
    
    log "🚀 Creating release branch: $branch_name"
    
    # Ensure we're on develop and up to date
    git checkout develop
    git pull origin develop
    
    # Update submodule to stable version
    log "📦 Updating submodule to main..."
    cd src/common
    git checkout main
    git pull origin main
    cd ../..
    
    git add src/common
    if git diff --staged --quiet; then
        log "📦 Submodule already up to date"
    else
        git commit -m "chore: update common submodule to stable version"
    fi
    
    # Create release branch
    git checkout -b "$branch_name"
    
    # Update version in package.json
    if command -v npm >/dev/null 2>&1; then
        npm version "$version" --no-git-tag-version
        git add package.json package-lock.json
        git commit -m "chore: bump version to $version"
    fi
    
    log "✅ Release branch '$branch_name' created"
    log "💡 Test thoroughly, then use: $0 finish-release"
}

# Create hotfix branch
create_hotfix() {
    local hotfix_name=$1
    if [[ -z "$hotfix_name" ]]; then
        error "Hotfix name is required"
        exit 1
    fi
    
    local branch_name="hotfix/$hotfix_name"
    
    log "🔥 Creating hotfix branch: $branch_name"
    
    # Create from main (production)
    git checkout main
    git pull origin main
    git checkout -b "$branch_name"
    
    log "✅ Hotfix branch '$branch_name' created from main"
    log "💡 Fix the issue, then merge back to main and develop"
}

# Sync submodule to latest
sync_submodule() {
    log "📦 Syncing common submodule..."
    
    cd src/common
    current_branch=$(git branch --show-current)
    log "📦 Current submodule branch: $current_branch"
    
    # Pull latest changes
    git pull origin "$current_branch"
    cd ../..
    
    # Check if submodule changed
    if git diff --quiet src/common; then
        log "📦 Submodule already up to date"
        return 0
    fi
    
    # Commit submodule update
    git add src/common
    submodule_commit=$(cd src/common && git rev-parse --short HEAD)
    git commit -m "chore: update common submodule to $submodule_commit"
    
    log "✅ Submodule synced and committed"
}

# Show comprehensive status
show_status() {
    log "📊 LCM Service Repository Status"
    echo ""
    
    # Main repo status
    info "📁 Main Repository:"
    current_branch=$(git branch --show-current)
    echo "   Current branch: $current_branch"
    echo "   Status:"
    git status --short | sed 's/^/     /'
    
    echo ""
    
    # Submodule status
    info "📦 Common Submodule:"
    cd src/common
    sub_branch=$(git branch --show-current)
    sub_commit=$(git rev-parse --short HEAD)
    echo "   Branch: $sub_branch"
    echo "   Commit: $sub_commit"
    echo "   Status:"
    git status --short | sed 's/^/     /'
    cd ../..
    
    echo ""
    
    # Recent commits
    info "📝 Recent Main Repo Commits:"
    git log --oneline -5 | sed 's/^/   /'
    
    echo ""
    info "📝 Recent Submodule Commits:"
    cd src/common
    git log --oneline -3 | sed 's/^/   /'
    cd ../..
}

# Prepare for deployment (test build)
prepare_deploy() {
    local current_branch=$(git branch --show-current)
    log "🔨 Preparing '$current_branch' for deployment..."
    
    # Ensure clean working directory
    if [[ -n $(git status --porcelain) ]]; then
        error "Working directory is not clean. Please commit changes first."
        exit 1
    fi
    
    # Test build
    log "🔨 Testing build process..."
    if npm run build; then
        log "✅ Build test successful"
        log "💡 Branch '$current_branch' is ready for deployment"
        log "💡 Use: ./scripts/deploy-production.sh -b $current_branch"
    else
        error "❌ Build test failed"
        error "Please fix build errors before deployment"
        exit 1
    fi
}

# Merge feature to develop
merge_feature() {
    local feature_branch=$1
    if [[ -z "$feature_branch" ]]; then
        error "Feature branch name is required"
        exit 1
    fi
    
    log "🔀 Merging $feature_branch to develop..."
    
    # Switch to develop and update
    git checkout develop
    git pull origin develop
    
    # Merge feature branch
    git merge "$feature_branch" --no-ff -m "feat: merge $feature_branch into develop"
    
    # Push to remote
    git push origin develop
    
    # Ask about cleanup
    read -p "Delete feature branch $feature_branch? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git branch -d "$feature_branch"
        # Try to delete remote branch (might not exist)
        git push origin --delete "$feature_branch" 2>/dev/null || true
    fi
    
    log "✅ Feature merged successfully"
}

# Finish release (merge to main and tag)
finish_release() {
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch =~ ^release/ ]]; then
        error "Must be on a release branch to finish release"
        exit 1
    fi
    
    local version=$(echo "$current_branch" | sed 's/release\///')
    
    log "🏁 Finishing release: $version"
    
    # Test build first
    log "🔨 Testing build..."
    if ! npm run build; then
        error "Build failed. Fix errors before finishing release."
        exit 1
    fi
    
    # Merge to main
    log "🔀 Merging to main..."
    git checkout main
    git pull origin main
    git merge "$current_branch" --no-ff -m "release: $version"
    
    # Create tag
    git tag "$version" -m "Release $version"
    
    # Push main and tags
    git push origin main
    git push origin "$version"
    
    # Merge back to develop
    log "🔀 Merging back to develop..."
    git checkout develop
    git pull origin develop
    git merge main --no-ff -m "chore: merge release $version back to develop"
    git push origin develop
    
    # Cleanup release branch
    git branch -d "$current_branch"
    
    log "✅ Release $version completed successfully!"
    log "💡 You can now deploy using: ./scripts/deploy-production.sh"
}

# Clean up merged branches
cleanup() {
    log "🧹 Cleaning up merged branches..."
    
    # Prune remote branches
    git remote prune origin
    
    # Show branches that can be deleted
    echo ""
    info "🔍 Branches that may be safe to delete:"
    
    # Find merged feature branches
    git branch --merged develop | grep -E "feature/" | sed 's/^/   /' || echo "   No merged feature branches found"
    
    # Find merged release branches (merged to main)
    git branch --merged main | grep -E "release/" | sed 's/^/   /' || echo "   No merged release branches found"
    
    echo ""
    warn "⚠️  Review these branches carefully before deleting"
    warn "⚠️  You can delete them with: git branch -d <branch-name>"
}

# Main function
main() {
    local command=$1
    shift || true
    
    case $command in
        feature)
            check_repo
            create_feature "$@"
            ;;
        release)
            check_repo
            create_release "$@"
            ;;
        hotfix)
            check_repo
            create_hotfix "$@"
            ;;
        sync-submodule)
            check_repo
            sync_submodule
            ;;
        status)
            check_repo
            show_status
            ;;
        prepare-deploy)
            check_repo
            prepare_deploy
            ;;
        merge-feature)
            check_repo
            merge_feature "$@"
            ;;
        finish-release)
            check_repo
            finish_release
            ;;
        cleanup)
            check_repo
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        "")
            error "Command is required"
            show_help
            exit 1
            ;;
        *)
            error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"