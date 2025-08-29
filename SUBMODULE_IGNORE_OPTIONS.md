# Git Submodule Ignore Options

## 🎯 Problem
Submodule `src/common` shows changes in main repo even when only file attributes (permissions, timestamps) change without actual content changes.

## ✅ Solution Implemented
**Option: `ignore = dirty`** (RECOMMENDED)

### Configuration:
```bash
# Local git config
git config submodule.src/common.ignore dirty

# .gitmodules file
[submodule "src/common"]
    path = src/common  
    url = git@gitlab.com:bitthing.io/service-common.git
    ignore = dirty
```

### What this does:
- ✅ **Ignores dirty changes**: File modifications, permission changes, new untracked files
- ✅ **Still tracks commits**: Submodule commit updates are still shown
- ✅ **Best for shared repos**: Team members won't see spurious submodule changes
- ✅ **Deployment safe**: Real submodule updates still tracked

## 📋 Other Available Options

### Option 1: `ignore = all` (Nuclear option)
```bash
git config submodule.src/common.ignore all
# .gitmodules: ignore = all
```
**Effect**: Completely ignore ALL submodule changes (even commit updates)
**Risk**: ⚠️ Might miss important submodule updates

### Option 2: `ignore = untracked` (Minimal)
```bash
git config submodule.src/common.ignore untracked
# .gitmodules: ignore = untracked  
```
**Effect**: Only ignore untracked files, still show modified files
**Risk**: Permission/timestamp changes still show

### Option 3: Skip submodule in status (Command-level)
```bash
git status --ignore-submodules=dirty
git status --ignore-submodules=all
```
**Effect**: Temporary ignore per command
**Risk**: Must remember to use flag every time

## 🧪 Testing Results

### ✅ With `ignore = dirty`:
```bash
# File content changes → IGNORED ✅
echo "test" > src/common/test.txt

# Permission changes → IGNORED ✅  
chmod 755 src/common/readme.md

# New untracked files → IGNORED ✅
touch src/common/newfile.txt

# Submodule commit updates → STILL TRACKED ✅
cd src/common && git pull origin main
```

### Git Status Output:
```bash
$ git status
On branch trangpt
nothing to commit, working tree clean  # ✅ Clean!
```

## 💡 Benefits

1. **Clean git status**: No more spurious submodule changes
2. **Team productivity**: Developers don't get confused by permission-only changes  
3. **CI/CD friendly**: Build processes won't be triggered by non-content changes
4. **Still secure**: Real submodule updates are tracked for security

## 🚨 Important Notes

- **Commit the .gitmodules change** so all team members get the same behavior
- **This affects everyone** who clones the repo
- **Can be overridden locally** with `git config submodule.src/common.ignore none`

## ✅ Recommendation

Use `ignore = dirty` - it's the perfect balance of ignoring noise while maintaining security.