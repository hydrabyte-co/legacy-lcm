# Git Submodule Ignore Guide

## 🎯 Problem
Submodule folder shows changes in `git status` even when only file permissions/timestamps change (no actual content changes).

## ✅ Quick Solution

### Step 1: Configure Local Git
```bash
git config submodule.src/common.ignore dirty
```

### Step 2: Update .gitmodules File
Add `ignore = dirty` to your submodule configuration:

```ini
[submodule "src/common"]
    path = src/common
    url = git@gitlab.com:bitthing.io/service-common.git
    ignore = dirty
```

### Step 3: Commit Changes
```bash
git add .gitmodules
git commit -m "feat: Configure submodule to ignore dirty changes

- Prevents git from showing spurious changes from permission/timestamp changes
- Still tracks actual submodule commit updates
- Improves developer experience with cleaner git status"
```

## 🧪 Test Results

### Before:
```bash
$ chmod 755 src/common/some-file.txt
$ git status
modified:   src/common    # ❌ Annoying noise
```

### After:
```bash
$ chmod 755 src/common/some-file.txt
$ git status
nothing to commit, working tree clean    # ✅ Clean!
```

## 📋 What Gets Ignored vs Tracked

### ✅ IGNORED (noise reduction):
- File permission changes
- Timestamp modifications  
- New untracked files in submodule
- Content modifications in submodule

### 🔍 STILL TRACKED (security):
- Submodule commit updates
- Real submodule pointer changes

## 💡 Benefits
- **Clean git status** - No more noise
- **Team consistency** - Same behavior for everyone  
- **Security maintained** - Important updates still tracked
- **CI/CD friendly** - No false triggers

## ⚠️ Alternative Options

If you need different behavior:

```bash
# Ignore everything (including commit updates) - BE CAREFUL!
ignore = all

# Only ignore untracked files (still shows modifications)
ignore = untracked

# Disable ignore (default behavior)
ignore = none
```

## 🎯 Recommended
Use `ignore = dirty` - perfect balance of noise reduction while maintaining security.