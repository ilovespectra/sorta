#!/bin/bash
# Complete Sorta Reference - All Commands

# ============================================
# SORTA - Terminal File Organization System
# ============================================

# PROJECT STRUCTURE:
# src/app/pages/api/
# ├── create-metadata.ts      # Step 1: Always run first
# ├── sorta-pics.ts           # Organize images
# ├── sorta-vids.ts           # Organize videos  
# ├── sorta-audio.ts          # Organize audio
# ├── sorta-else.ts           # Organize documents/archives/etc
# ├── sorta-by-name.ts        # Find screenshots by name
# ├── sorta.ts                # Generic extension sort (no metadata)
# ├── delete-duplicates.ts    # Remove duplicate files
# └── inspect.ts              # Debug file metadata

# ============================================
# BASIC COMMANDS
# ============================================

# 1. CREATE METADATA (ALWAYS DO THIS FIRST!)
ts-node src/app/pages/api/create-metadata.ts /source/directory [output_file.json]
# Example:
ts-node src/app/pages/api/create-metadata.ts ~/Downloads
# Creates: file_metadata.json with file hashes and timestamps

# 2. ORGANIZE IMAGES
ts-node src/app/pages/api/sorta-pics.ts /source/directory /destination/directory
# Example:
ts-node src/app/pages/api/sorta-pics.ts ~/Downloads ~/Pictures/Organized
# Creates: destination/images/jpg/, destination/images/png/, etc.
# Renames: files to YYYY-MM-DD_originalname.ext

# 3. ORGANIZE VIDEOS
ts-node src/app/pages/api/sorta-vids.ts /source/directory /destination/directory
# Example:
ts-node src/app/pages/api/sorta-vids.ts ~/Downloads ~/Videos/Organized
# Creates: destination/videos/mp4/, destination/videos/mov/, etc.

# 4. ORGANIZE AUDIO
ts-node src/app/pages/api/sorta-audio.ts /source/directory /destination/directory
# Example:
ts-node src/app/pages/api/sorta-audio.ts ~/Music/Unsorted ~/Music/Organized
# Creates: destination/audio/mp3/, destination/audio/flac/, etc.

# 5. ORGANIZE OTHER FILES (documents, archives, scripts, fonts)
ts-node src/app/pages/api/sorta-else.ts /source/directory /destination/directory
# Example:
ts-node src/app/pages/api/sorta-else.ts ~/Downloads ~/Documents/Organized

# 6. ORGANIZE SCREENSHOTS (by name only, no metadata needed)
ts-node src/app/pages/api/sorta-by-name.ts /source/directory
# Example:
ts-node src/app/pages/api/sorta-by-name.ts ~/Desktop
# Creates: source/screenshots/ folder with all files containing "screenshot"

# 7. GENERIC SORT BY EXTENSION (no metadata, copies files, interactive)
ts-node src/app/pages/api/sorta.ts /source/directory /destination/directory
# Example:
ts-node src/app/pages/api/sorta.ts ~/Downloads ~/Downloads/Sorted
# Prompts: Skip/Replace/Add suffix for duplicates

# ============================================
# COMPLETE WORKFLOWS
# ============================================

# WORKFLOW 1: Organize Phone Backup
ts-node src/app/pages/api/create-metadata.ts /Volumes/iPhone
ts-node src/app/pages/api/sorta-pics.ts /Volumes/iPhone ~/Pictures/iPhone_Backup
ts-node src/app/pages/api/sorta-vids.ts /Volumes/iPhone ~/Videos/iPhone_Backup
ts-node src/app/pages/api/sorta-audio.ts /Volumes/iPhone ~/Music/iPhone_Backup

# WORKFLOW 2: Clean Downloads Folder
ts-node src/app/pages/api/create-metadata.ts ~/Downloads
ts-node src/app/pages/api/sorta-pics.ts ~/Downloads ~/Downloads/Organized
ts-node src/app/pages/api/sorta-vids.ts ~/Downloads ~/Downloads/Organized
ts-node src/app/pages/api/sorta-audio.ts ~/Downloads ~/Downloads/Organized
ts-node src/app/pages/api/sorta-else.ts ~/Downloads ~/Downloads/Organized
ts-node src/app/pages/api/sorta-by-name.ts ~/Downloads

# WORKFLOW 3: Organize External Drive
DRIVE="/Volumes/MyBackupDrive"
DEST="/Volumes/Organized_Backup"
ts-node src/app/pages/api/create-metadata.ts "$DRIVE"
ts-node src/app/pages/api/sorta-pics.ts "$DRIVE" "$DEST"
ts-node src/app/pages/api/sorta-vids.ts "$DRIVE" "$DEST"
ts-node src/app/pages/api/sorta-audio.ts "$DRIVE" "$DEST"
ts-node src/app/pages/api/sorta-else.ts "$DRIVE" "$DEST"

# ============================================
# FILE TYPE SUPPORT
# ============================================

# IMAGES (sorta-pics.ts):
# .jpg, .jpeg, .png, .gif, .bmp, .tiff, .webp, .ico, .heic, .heif
# .raw, .cr2, .nef, .orf, .arw, .sr2, .dng, .raf, .rw2, .pef
# .svg, .img, .psd, .xcf, .pcx, .jp2

# VIDEOS (sorta-vids.ts):
# .mp4, .m4v, .mov, .avi, .wmv, .flv, .mkv, .webm, .mpg, .mpeg
# .hevc, .h265, .rm, .rmvb, .3gp, .asf, .vob, .dat, .swf, .ts
# .m2ts, .f4v, .mxf, .ogv, .yuv, .mjpg, .mjpeg, .divx, .xvid

# AUDIO (sorta-audio.ts):
# .mp3, .wav, .flac, .aac, .ogg, .m4a, .wma, .alac, .aiff, .opus

# OTHER (sorta-else.ts):
# Documents: .pdf, .doc, .docx, .txt, .md, .xls, .xlsx, .csv
# Archives: .zip, .rar, .tar, .gz, .7z
# Scripts: .js, .ts, .py, .java, .cpp, .html, .css, .json, .xml
# Databases: .sql, .sqlite, .db
# Fonts: .ttf, .otf, .woff
# Other: .iso, .dmg, .apk, .jar, .bin

# ============================================
# DEBUGGING & INSPECTION
# ============================================

# Check file metadata (must edit inspect.ts first)
ts-node src/app/pages/api/inspect.ts

# View file_metadata.json
cat file_metadata.json | jq '.files[] | {filename, timestamp, hash}'

# Count files by type
cat file_metadata.json | jq '.files | group_by(.filename | split(".") | .[-1]) | map({ext: .[0].filename | split(".") | .[-1], count: length})'

# Find duplicates in metadata
cat file_metadata.json | jq '[.files | group_by(.hash) | .[] | select(length > 1)] | length'

# ============================================
# IMPORTANT NOTES
# ============================================

# ⚠️  MOVES vs COPIES:
# - sorta-pics.ts, sorta-vids.ts, sorta-audio.ts, sorta-else.ts: MOVE files (files leave source)
# - sorta-by-name.ts: MOVES files
# - sorta.ts: COPIES files (originals remain)

# ⚠️  METADATA REQUIRED:
# - sorta-pics.ts ✅ Needs metadata
# - sorta-vids.ts ✅ Needs metadata
# - sorta-audio.ts ✅ Needs metadata
# - sorta-else.ts ✅ Needs metadata
# - sorta-by-name.ts ❌ No metadata needed
# - sorta.ts ❌ No metadata needed

# ⚠️  DUPLICATE DETECTION:
# - All metadata-based scripts detect duplicates by SHA-256 hash
# - Skips duplicate transfers and reports space saved
# - sorta.ts prompts interactively for duplicates

# ⚠️  FILE NAMING:
# - Metadata scripts rename to: YYYY-MM-DD_originalname.ext
# - Uses birthtime or mtime from file metadata
# - Invalid timestamps (1980-01-01) default to current date

# ============================================
# TIPS & BEST PRACTICES
# ============================================

# 1. Always test on a small folder first
mkdir ~/sorta_test
cp -r ~/Pictures/sample_photos ~/sorta_test/
ts-node src/app/pages/api/create-metadata.ts ~/sorta_test
ts-node src/app/pages/api/sorta-pics.ts ~/sorta_test ~/sorta_test/output

# 2. Backup important data before running
cp -r ~/important_folder ~/important_folder_backup

# 3. Use absolute paths to avoid confusion
ts-node src/app/pages/api/create-metadata.ts /Users/username/Downloads
# Better than: ts-node src/app/pages/api/create-metadata.ts ~/Downloads

# 4. Check the metadata file before sorting
cat file_metadata.json | jq '.' | less

# 5. For large folders, run in screen/tmux
screen -S sorta_session
ts-node src/app/pages/api/create-metadata.ts /Volumes/BigDrive
# Detach: Ctrl+A, D
# Reattach: screen -r sorta_session

# 6. Monitor progress
# All scripts show progress bars and statistics
# Example output:
# Processing |████████████████░░░░| 75% | 1500/2000 Images
# Found 50 duplicates and saved 234.56 MB by skipping them.

# ============================================
# AUTOMATION EXAMPLES
# ============================================

# Cron job to organize Downloads daily at 2 AM
# crontab -e
# 0 2 * * * cd /Users/username/sorta && ts-node src/app/pages/api/create-metadata.ts ~/Downloads && ts-node src/app/pages/api/sorta-pics.ts ~/Downloads ~/Pictures/Auto

# Watch folder and auto-organize
# Using fswatch (install: brew install fswatch)
fswatch -o ~/Downloads | xargs -n1 -I{} bash -c 'cd ~/sorta && ts-node src/app/pages/api/create-metadata.ts ~/Downloads && ts-node src/app/pages/api/sorta-pics.ts ~/Downloads ~/Pictures/Auto'

# ============================================
# COMMON ERRORS & SOLUTIONS
# ============================================

# Error: "Cannot find module 'p-limit'"
# Solution: npm install

# Error: "Permission denied"
# Solution: Check folder permissions or use sudo (not recommended for personal files)

# Error: "No metadata for file"
# Solution: Run create-metadata.ts first

# Error: "EPERM: operation not permitted"
# Solution: Don't organize system folders (like /System, /Library)

# Error: Files not being found
# Solution: Check that file extensions are in the extension lists in the .ts files

# ============================================
# PROJECT SETUP
# ============================================

# First time setup:
# 1. Clone repo
git clone https://github.com/ilovespectra/sorta.git
cd sorta

# 2. Install dependencies
npm install

# 3. Build (if needed)
npm run build

# 4. Test with sample
mkdir test_folder
echo "test" > test_folder/test.txt
ts-node src/app/pages/api/create-metadata.ts test_folder
cat file_metadata.json

# ============================================
# ADVANCED: Customizing Scripts
# ============================================

# To add new file extensions:
# 1. Open the relevant .ts file (e.g., sorta-pics.ts)
# 2. Find the extensions Set (e.g., imageExtensions)
# 3. Add your extension: '.newext',

# Example - Adding .jxl to image types:
# Edit: src/app/pages/api/sorta-pics.ts
# Find: const imageExtensions = new Set([
# Add: '.jxl',

# To change date format:
# Edit the formatTimestamp() function in any sorta script
# Current: YYYY-MM-DD
# Change to: YYYY/MM/DD or DD-MM-YYYY, etc.

# ============================================
# PERFORMANCE NOTES
# ============================================

# Metadata creation: ~1-5 files per second (depends on file size)
# File organization: ~10-50 files per second
# Hashing: ~50-200 MB per second (depends on drive speed)

# Typical times:
# 1,000 files: 2-5 minutes
# 10,000 files: 15-30 minutes
# 100,000 files: 2-3 hours

# Bottlenecks:
# - External drives (slower than SSD)
# - Large video files (hashing takes time)
# - Network drives (much slower)

# ============================================
# GETTING HELP
# ============================================

# Check README
cat README.md

# Check examples
ls -la examples/
cat examples/README.md

# View script help
ts-node src/app/pages/api/create-metadata.ts
# (Will show usage if no args provided)

# GitHub issues
# https://github.com/ilovespectra/sorta/issues

