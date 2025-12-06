# Sorta v2.0 - Enhanced Features Guide

## 🚀 Major Improvements

### 1. **Automatic Metadata Creation**
The script now automatically runs `create-metadata.ts` before organizing files. No need to run it separately!

```bash
ts-node sorta.ts ~/Downloads ~/organized
```

This will:
1. Create metadata with SHA-256 hashing
2. Validate metadata (compare file counts)
3. Organize files by extension

---

### 2. **Metadata Validation**
Before organizing, the script validates that metadata matches the source directory:

```
Files in source directory: 1234
Files in metadata:         1234
✓ Metadata validation passed - counts match
```

If counts don't match, you'll be prompted to continue or abort.

---

### 3. **Resume Capability** ⭐
If your process is interrupted (drive disconnection, system crash, Ctrl+C), you can resume exactly where you left off:

```bash
# Start organization
ts-node sorta.ts ~/Downloads ~/organized

# Process interrupted!
# ... later ...

# Resume from where you left off
ts-node sorta.ts --resume
```

**How it works:**
- State saved to `.sorta_state.json` every 100 files
- Metadata tracks which files have been copied
- On resume, skips already-copied files
- No duplicates, no incomplete transfers

---

### 4. **Enhanced Duplicate Detection**

#### Hash-Based Duplicate Detection
Files are compared by SHA-256 hash. If identical files exist at destination:
- Automatically skips (no prompt needed)
- Logs the skip action
- Prevents unnecessary copies

#### Interactive Duplicate Handling
For non-identical files with same name:
```
File conflict: /path/to/file.jpg
Options:
  (s) Skip - Do not copy this file
  (r) Replace - Overwrite the existing file
  (a) Add suffix - Create a new file with suffix (file(1).ext)
Your choice (s/r/a): a
Apply this action to all future duplicates? (y/n): y
```

**Apply to all** feature remembers your choice for the entire session!

---

### 5. **Comprehensive Logging**

#### Console Logging
Color-coded output for easy reading:
- 🔵 **Blue**: Info messages
- 🟡 **Yellow**: Warnings
- 🔴 **Red**: Errors
- 🟢 **Green**: Success messages

#### File Logging
All operations logged to `.sorta_log.txt`:
```
[2025-12-06T10:30:15.123Z] Starting organization...
[2025-12-06T10:30:16.456Z] Skipping identical file (hash match): photo.jpg
[2025-12-06T10:30:17.789Z] Copied file: document.pdf
```

---

### 6. **Enhanced Progress Bar**

Real-time progress with detailed stats:
```
Progress: [████████████████░░░░] 75.5% (755/1000) Copied: 720 Skipped: 35 ETA: 45s
```

Shows:
- Visual progress bar
- Percentage complete
- Files processed / total
- Files copied
- Files skipped
- Estimated time remaining

---

### 7. **Final Summary Report**

After completion:
```
================================================================================
✓ ORGANIZATION COMPLETE
================================================================================
Total Files:     1000
Copied:          965
Skipped:         35
Errors:          0
Time Elapsed:    125.45s
Files/Second:    7.97
================================================================================
```

---

### 8. **Error Handling**

#### Robust Error Recovery
- Permission errors: Logged and skipped, process continues
- File access errors: Logged, process continues
- Drive disconnection: State saved, resume with `--resume`
- Keyboard interrupt: Graceful shutdown with save

#### Error Reporting
Top 10 errors displayed, full list in log file:
```
Errors encountered (15):
  - Failed to copy file1.dat: EACCES
  - Failed to copy file2.bin: ENOSPC
  ... and 13 more (see .sorta_log.txt)
```

---

## 📋 Usage Examples

### Basic Usage
```bash
# Organize files with auto-metadata
ts-node sorta.ts ~/Downloads ~/organized
```

### Resume After Interruption
```bash
# If process was interrupted
ts-node sorta.ts --resume
```

### Check Logs
```bash
# View full log
cat .sorta_log.txt

# View last 50 lines
tail -n 50 .sorta_log.txt

# Search for errors
grep "Error" .sorta_log.txt
```

---

## 🔧 Configuration

### Concurrent Operations
Adjust the concurrency limit (default: 10):
```typescript
const limit = pLimit(10); // Change this number
```

### State Save Frequency
Change how often state is saved (default: every 100 files):
```typescript
if (state.processedFiles % 100 === 0) { // Change 100 to your preference
    await saveState(state, metadataFile);
}
```

---

## 📁 Generated Files

### `.sorta_state.json`
Stores resume state:
```json
{
  "totalFiles": 1000,
  "processedFiles": 750,
  "skippedFiles": 30,
  "copiedFiles": 720,
  "errors": [],
  "startTime": 1701860415123,
  "metadataFile": "/path/to/file_metadata.json",
  "lastSaved": "2025-12-06T10:30:45.123Z"
}
```

### `.sorta_log.txt`
Timestamped operation log

### `file_metadata.json`
SHA-256 hashes and copy status:
```json
{
  "files": [
    {
      "filename": "photo.jpg",
      "path": "/source/photo.jpg",
      "timestamp": "2025-12-06T10:00:00.000Z",
      "copied": true,
      "hash": "a1b2c3..."
    }
  ]
}
```

---

## 🛡️ Safety Features

✅ **No data loss**
- Files are COPIED (not moved)
- Originals remain in source
- Duplicates handled safely

✅ **Resume capability**
- Interrupt anytime (Ctrl+C)
- Resume without duplicates
- State saved automatically

✅ **Hash verification**
- SHA-256 for accuracy
- Skip identical files
- Prevent duplicate copies

✅ **Error recovery**
- Continue on errors
- Log all issues
- Comprehensive reporting

---

## 🚨 Important Notes

1. **First Run**: Metadata creation may take time for large directories
2. **Disk Space**: Ensure destination has enough space (files are copied)
3. **Permissions**: Script needs read access to source, write access to destination
4. **State Files**: Don't delete `.sorta_state.json` while resuming
5. **Metadata Tracking**: Metadata marks files as copied for resume functionality

---

## 🔄 Workflow Diagram

```
Start
  ↓
Run create-metadata.ts automatically
  ↓
Calculate SHA-256 hashes for all files
  ↓
Validate: source file count == metadata file count
  ↓
Begin organization (save state every 100 files)
  ↓
For each file:
  ├── Check if already copied (resume mode)
  ├── Check hash for duplicates
  ├── Handle conflicts (skip/replace/suffix)
  ├── Copy file
  └── Mark as copied in metadata
  ↓
Print summary report
  ↓
Clean up (if successful) or save for resume (if errors)
```

---

## 📊 Performance

**Typical Performance:**
- **Small files** (< 1MB): 10-20 files/second
- **Medium files** (1-10MB): 5-10 files/second
- **Large files** (> 10MB): 1-5 files/second

**Factors affecting speed:**
- Disk speed (SSD vs HDD)
- Network speed (if using network drives)
- File sizes
- Number of duplicates

---

## 🆘 Troubleshooting

### Process stuck?
- Check if waiting for user input (duplicate handling)
- Check disk space
- Check file permissions

### Resume not working?
- Ensure `.sorta_state.json` exists
- Don't change source/destination paths
- Check metadata file is intact

### High memory usage?
- Normal for large directories
- Concurrent operations limited to 10
- Consider processing in batches

---

## 🎯 Best Practices

1. **Test first**: Run on small directory to verify behavior
2. **Check space**: Ensure destination has 2x source size
3. **Backup**: Always backup important data first
4. **Monitor**: Watch first few files to ensure correct behavior
5. **Resume**: Don't delete state files until completion confirmed

---

## 📝 Version History

### v2.0 (Current)
- ✅ Automatic metadata creation
- ✅ Metadata validation
- ✅ Resume capability
- ✅ Enhanced duplicate detection
- ✅ Comprehensive logging
- ✅ Real-time progress with ETA
- ✅ Error recovery
- ✅ Graceful shutdown

### v1.0
- Basic file organization by extension
- Simple duplicate handling
- Basic progress bar

---

## 🤝 Contributing

Found a bug? Have a feature request? 
Open an issue on GitHub: https://github.com/ilovespectra/sorta
