# Sorta System Architecture & Workflows

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           SORTA SYSTEM                              │
│                    Terminal-Based File Organizer                     │
└─────────────────────────────────────────────────────────────────────┘

                              │
                              ▼
            ┌─────────────────────────────────┐
            │  STEP 1: Create Metadata        │
            │  (create-metadata.ts)           │
            │                                 │
            │  Scans: Source Directory        │
            │  Creates: file_metadata.json    │
            │  Contains: Hash, Timestamp      │
            └─────────────────────────────────┘
                              │
                              ▼
            ┌─────────────────────────────────┐
            │  STEP 2: Choose Organizer       │
            └─────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┬──────────────┬────────────┐
                ▼                           ▼              ▼            ▼
    ┌───────────────────┐      ┌──────────────────┐  ┌─────────────┐  ┌────────────────┐
    │  sorta-pics.ts    │      │  sorta-vids.ts   │  │ sorta-      │  │ sorta-else.ts  │
    │  Images           │      │  Videos          │  │ audio.ts    │  │ Documents/etc  │
    │  50+ formats      │      │  30+ formats     │  │ 10+ formats │  │ 40+ formats    │
    └───────────────────┘      └──────────────────┘  └─────────────┘  └────────────────┘
                │                       │                    │                  │
                └───────────────────────┴────────────────────┴──────────────────┘
                                        │
                                        ▼
                        ┌──────────────────────────┐
                        │  Organized Destination   │
                        │  ├── images/             │
                        │  ├── videos/             │
                        │  ├── audio/              │
                        │  └── [other types]/      │
                        └──────────────────────────┘
```

## Script Types & Data Flow

### Type A: Metadata-Based Organizers (Hash & Date)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Source Dir  │────▶│  Metadata    │────▶│ Destination  │
│              │     │  file_meta-  │     │ Organized    │
│ /Downloads   │     │  data.json   │     │ by date      │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Hash Check    │
                    │ Duplicate?    │
                    └───────────────┘
                         │      │
                    Yes  │      │  No
                         ▼      ▼
                    ┌────────┐ ┌────────┐
                    │ SKIP   │ │ MOVE   │
                    │ Save   │ │ Rename │
                    │ Space  │ │ w/Date │
                    └────────┘ └────────┘

Scripts: sorta-pics.ts, sorta-vids.ts, sorta-audio.ts, sorta-else.ts
```

### Type B: Name-Based Organizer (No Metadata)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Source Dir  │────▶│ Search for   │────▶│ source/      │
│              │     │ "screenshot" │     │ screenshots/ │
│ /Desktop     │     │ in filename  │     └──────────────┘
└──────────────┘     └──────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ MOVE files    │
                    │ No rename     │
                    └───────────────┘

Script: sorta-by-name.ts
```

### Type C: Generic Extension Sort (Copies)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Source Dir  │────▶│ Group by     │────▶│ Destination  │
│              │     │ Extension    │     │ /jpg/        │
│ /Downloads   │     │ .jpg → jpg/  │     │ /pdf/        │
└──────────────┘     │ .pdf → pdf/  │     │ /mp4/        │
                     └──────────────┘     └──────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ COPY files    │
                    │ Interactive   │
                    │ duplicates    │
                    └───────────────┘

Script: sorta.ts
```

## Complete Workflow Examples

### Workflow 1: Phone Backup (Most Common)

```
START: iPhone connected at /Volumes/iPhone
GOAL: Organize all media to ~/Organized_Backup

Step 1: Create Metadata
┌─────────────────────────────────────────┐
│ $ ts-node create-metadata.ts \         │
│   /Volumes/iPhone                       │
│                                         │
│ Output: file_metadata.json              │
│ - 5,432 files scanned                   │
│ - SHA-256 hashes computed               │
│ - Timestamps extracted                  │
└─────────────────────────────────────────┘

Step 2: Organize Images
┌─────────────────────────────────────────┐
│ $ ts-node sorta-pics.ts \              │
│   /Volumes/iPhone \                     │
│   ~/Organized_Backup                    │
│                                         │
│ Processing: 2,340 images                │
│ Duplicates found: 45 (123 MB saved)    │
│ Output: ~/Organized_Backup/images/      │
│   ├── jpg/ (1,890 files)               │
│   ├── heic/ (405 files)                │
│   └── png/ (45 files)                  │
└─────────────────────────────────────────┘

Step 3: Organize Videos
┌─────────────────────────────────────────┐
│ $ ts-node sorta-vids.ts \              │
│   /Volumes/iPhone \                     │
│   ~/Organized_Backup                    │
│                                         │
│ Processing: 843 videos                  │
│ Duplicates found: 12 (567 MB saved)    │
│ Output: ~/Organized_Backup/videos/      │
│   ├── mp4/ (789 files)                 │
│   └── mov/ (54 files)                  │
└─────────────────────────────────────────┘

Step 4: Organize Audio
┌─────────────────────────────────────────┐
│ $ ts-node sorta-audio.ts \             │
│   /Volumes/iPhone \                     │
│   ~/Organized_Backup                    │
│                                         │
│ Processing: 234 audio files             │
│ Duplicates found: 3 (15 MB saved)      │
│ Output: ~/Organized_Backup/audio/       │
│   ├── m4a/ (198 files)                 │
│   └── mp3/ (36 files)                  │
└─────────────────────────────────────────┘

RESULT: 
✅ 3,417 files organized
✅ 60 duplicates skipped
✅ 705 MB saved
✅ Files renamed with dates
✅ Organized by type and extension
```

### Workflow 2: Downloads Cleanup

```
START: Messy ~/Downloads folder
GOAL: Organize everything + find screenshots

┌─────────────────────────────────────────┐
│ STEP 1: Metadata                        │
│ $ ts-node create-metadata.ts \         │
│   ~/Downloads                           │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│ STEP 2: Pics │        │ STEP 3: Vids │
└──────────────┘        └──────────────┘
        │                       │
        └───────────┬───────────┘
                    ▼
            ┌──────────────┐
            │ STEP 4: Audio│
            └──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │ STEP 5: Docs │
            │ sorta-else   │
            └──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │ STEP 6: SS   │
            │ by-name      │
            └──────────────┘

RESULT:
~/Downloads/Organized/
├── images/
├── videos/
├── audio/
└── [documents, archives, etc]/
~/Downloads/screenshots/
```

### Workflow 3: Quick Sort (No Metadata)

```
START: ~/Desktop needs quick cleanup
GOAL: Just sort by extension, keep copies

┌─────────────────────────────────────────┐
│ $ ts-node sorta.ts \                   │
│   ~/Desktop \                           │
│   ~/Desktop/Sorted                      │
│                                         │
│ Found: sample.jpg                       │
│ → Copying to: Sorted/jpg/sample.jpg    │
│                                         │
│ Found duplicate: Sorted/jpg/sample.jpg  │
│ What to do? (s/r/a): a                 │
│ Apply to all? (y/n): y                 │
│ → Copying to: Sorted/jpg/sample(1).jpg │
└─────────────────────────────────────────┘

RESULT:
✅ Files COPIED (originals remain)
✅ Interactive duplicate handling
✅ No date renaming
✅ Simple extension folders
```

## File Naming Convention

### Before Sorta
```
/Downloads/
├── IMG_1234.jpg
├── VID_5678.mp4
├── Screenshot 2024-11-20 at 3.45.23 PM.png
└── random_photo.heic
```

### After Metadata-Based Sorta
```
/Organized/
├── images/
│   ├── jpg/
│   │   └── 2024-06-15_IMG_1234.jpg
│   ├── png/
│   │   └── 2024-11-20_Screenshot 2024-11-20 at 3.45.23 PM.png
│   └── heic/
│       └── 2024-07-22_random_photo.heic
└── videos/
    └── mp4/
        └── 2024-08-30_VID_5678.mp4
```

## Duplicate Detection Flow

```
┌──────────────┐
│  New File    │
└──────────────┘
        │
        ▼
┌──────────────┐
│ Calculate    │
│ SHA-256 Hash │
└──────────────┘
        │
        ▼
┌──────────────┐
│ Check Hash   │
│ in Metadata  │
└──────────────┘
        │
   ┌────┴────┐
   │         │
   ▼         ▼
┌──────┐  ┌──────┐
│ NEW  │  │ DUP  │
└──────┘  └──────┘
   │         │
   ▼         ▼
┌──────┐  ┌──────┐
│ MOVE │  │ SKIP │
│ FILE │  │ FILE │
└──────┘  └──────┘
   │         │
   ▼         ▼
┌──────┐  ┌──────┐
│ Mark │  │ Count│
│ Hash │  │ Space│
│Copied│  │Saved │
└──────┘  └──────┘
```

## Performance Metrics

```
FILE PROCESSING SPEEDS:
┌───────────────────┬──────────────────┐
│ Operation         │ Speed            │
├───────────────────┼──────────────────┤
│ Metadata Creation │ 1-5 files/sec    │
│ (depends on size) │                  │
├───────────────────┼──────────────────┤
│ Hash Calculation  │ 50-200 MB/sec    │
│ (depends on disk) │                  │
├───────────────────┼──────────────────┤
│ File Organization │ 10-50 files/sec  │
│ (depends on disk) │                  │
└───────────────────┴──────────────────┘

TYPICAL PROJECT TIMES:
┌───────────────────┬──────────────────┐
│ File Count        │ Time Estimate    │
├───────────────────┼──────────────────┤
│ 1,000 files       │ 2-5 minutes      │
│ 10,000 files      │ 15-30 minutes    │
│ 100,000 files     │ 2-3 hours        │
└───────────────────┴──────────────────┘

BOTTLENECKS:
• External USB drives (5-50 MB/s)
• Large video files (GB each)
• Network/NAS drives (very slow)
• Mechanical HDDs vs SSDs
```

## Error Handling

```
ERROR: "No metadata for file"
┌─────────────────────────────────────────┐
│ CAUSE: Metadata not created or missing  │
│ FIX:                                    │
│ $ ts-node create-metadata.ts /source   │
└─────────────────────────────────────────┘

ERROR: "Permission denied"
┌─────────────────────────────────────────┐
│ CAUSE: System folder or no permissions  │
│ FIX:                                    │
│ - Don't organize /System or /Library    │
│ - Check: ls -la /path                  │
│ - Consider sudo (risky)                │
└─────────────────────────────────────────┘

ERROR: "Cannot find module"
┌─────────────────────────────────────────┐
│ CAUSE: Dependencies not installed       │
│ FIX:                                    │
│ $ npm install                          │
└─────────────────────────────────────────┘
```

## Summary

```
╔════════════════════════════════════════════════════════╗
║                   SORTA SUMMARY                        ║
╠════════════════════════════════════════════════════════╣
║ System Type:      Terminal-based file organizer       ║
║ Platform:         macOS/Linux/Windows (Node.js)       ║
║ Language:         TypeScript                          ║
║ Primary Function: Organize files by type & date       ║
║ Duplicate Method: SHA-256 hash comparison             ║
║ Speed:            1,000 files in ~2-5 minutes         ║
║ File Support:     130+ file extensions                ║
╚════════════════════════════════════════════════════════╝

KEY FEATURES:
✅ Hash-based duplicate detection
✅ Date-based file renaming (YYYY-MM-DD prefix)
✅ Organized by type → extension folders
✅ Progress bars and statistics
✅ Space saved reporting
✅ Recursive directory scanning
✅ Concurrent processing (10 files at once)
✅ Error handling for permissions

SAFETY FEATURES:
⚠️  Skips system/hidden folders (.folders)
⚠️  Permission error handling
⚠️  Duplicate detection (no overwrites)
⚠️  File integrity (hash checking)

USE CASES:
📱 Phone backups
💾 External drive organization
📥 Downloads cleanup
📸 Photo library management
🎬 Video archive organization
🗂️  Document management
```
