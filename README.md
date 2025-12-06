# 🗂️ Sorta

**Sorta** is a powerful terminal-based file organization tool that automatically sorts and manages your files by type, date, and content. It features intelligent duplicate detection using SHA-256 hashing and can organize thousands of files in minutes.

## ✨ Features

- 📊 **Smart Organization** - Automatically sorts files by type, extension, and date
- 🔍 **Duplicate Detection** - SHA-256 hash-based duplicate detection saves storage space
- 📅 **Date Renaming** - Renames files with `YYYY-MM-DD` prefixes based on creation date
- 🚀 **Fast Processing** - Concurrent processing handles thousands of files efficiently
- 📁 **130+ File Types** - Supports images, videos, audio, documents, archives, and more
- 📈 **Progress Tracking** - Real-time progress bars and statistics
- 🛡️ **Safe Operations** - Skips system folders and handles permissions gracefully

## 📋 Requirements

- **Node.js** (v16 or higher)
- **TypeScript** 
- **npm** or **yarn** for package management
- **macOS/Linux/Windows** with terminal access

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/ilovespectra/sorta.git
cd sorta

# Install dependencies
npm install
```

### 2. Basic Usage (Two-Step Process)

**⚠️ IMPORTANT: Always run `create-metadata.ts` FIRST!**

```bash
# Step 1: Create metadata database
ts-node src/app/pages/api/create-metadata.ts /path/to/source

# Step 2: Organize files by type
ts-node src/app/pages/api/sorta-pics.ts /path/to/source /path/to/destination
```

### 3. Common Use Cases

#### Organize Phone Backup
```bash
ts-node src/app/pages/api/create-metadata.ts /Volumes/iPhone
ts-node src/app/pages/api/sorta-pics.ts /Volumes/iPhone ~/Pictures/Organized
ts-node src/app/pages/api/sorta-vids.ts /Volumes/iPhone ~/Videos/Organized
ts-node src/app/pages/api/sorta-audio.ts /Volumes/iPhone ~/Music/Organized
```

#### Clean Downloads Folder
```bash
ts-node src/app/pages/api/create-metadata.ts ~/Downloads
ts-node src/app/pages/api/sorta-pics.ts ~/Downloads ~/Downloads/Organized
ts-node src/app/pages/api/sorta-vids.ts ~/Downloads ~/Downloads/Organized
ts-node src/app/pages/api/sorta-else.ts ~/Downloads ~/Downloads/Organized
```

#### Quick Extension Sort (No Metadata)
```bash
# Copies files (originals remain) - no metadata needed
ts-node src/app/pages/api/sorta.ts ~/Desktop ~/Desktop/Sorted
```

---

## 📚 Available Scripts

| Script | Purpose | Needs Metadata? | Action | File Types |
|--------|---------|-----------------|--------|------------|
| `create-metadata.ts` | **Creates hash database** | N/A | Neither | All files |
| `sorta-pics.ts` | Organize images | ✅ Yes | **MOVES** | 50+ image formats |
| `sorta-vids.ts` | Organize videos | ✅ Yes | **MOVES** | 30+ video formats |
| `sorta-audio.ts` | Organize audio | ✅ Yes | **MOVES** | 10+ audio formats |
| `sorta-else.ts` | Organize documents/etc | ✅ Yes | **MOVES** | Documents, archives, scripts |
| `sorta-by-name.ts` | Find screenshots | ❌ No | **MOVES** | Files with "screenshot" |
| `sorta.ts` | Generic extension sort | ❌ No | **COPIES** | All files |
| `inspect.ts` | Debug file metadata | ❌ No | Neither | Debug tool |

### ⚠️ Important Differences

**MOVES vs COPIES:**
- ✅ `sorta-pics/vids/audio/else` - **MOVES** files (originals removed from source)
- ✅ `sorta-by-name` - **MOVES** files
- 📋 `sorta.ts` - **COPIES** files (originals remain)

---

## 🎯 How It Works

### The Two-Step Process

```
┌─────────────────────────────────────────────────────┐
│  STEP 1: Create Metadata (ALWAYS FIRST!)           │
│  → Scans all files                                  │
│  → Calculates SHA-256 hashes                        │
│  → Extracts timestamps                              │
│  → Creates file_metadata.json                       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  STEP 2: Run Organizer Script                      │
│  → Reads metadata                                   │
│  → Detects duplicates by hash                       │
│  → Organizes by type & extension                    │
│  → Renames with dates (YYYY-MM-DD_filename.ext)    │
│  → Reports space saved from skipped duplicates      │
└─────────────────────────────────────────────────────┘
```

### What Gets Created

**Before Sorta:**
```
Downloads/
├── IMG_1234.jpg
├── VID_5678.mp4
├── document.pdf
└── Screenshot 2024-11-20.png
```

**After Sorta:**
```
Organized/
├── images/
│   ├── jpg/
│   │   └── 2024-06-15_IMG_1234.jpg
│   └── png/
│       └── 2024-11-20_Screenshot 2024-11-20.png
├── videos/
│   └── mp4/
│       └── 2024-08-30_VID_5678.mp4
└── pdf/
    └── 2024-12-01_document.pdf
```

---

## 🔧 Supported File Types

### Images (50+ formats)
`.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.tiff`, `.webp`, `.heic`, `.heif`, `.raw`, `.cr2`, `.nef`, `.orf`, `.arw`, `.sr2`, `.dng`, `.psd`, `.svg`, and more

### Videos (30+ formats)
`.mp4`, `.m4v`, `.mov`, `.avi`, `.wmv`, `.flv`, `.mkv`, `.webm`, `.mpg`, `.mpeg`, `.hevc`, `.3gp`, `.vob`, `.ts`, `.mxf`, and more

### Audio (10+ formats)
`.mp3`, `.wav`, `.flac`, `.aac`, `.ogg`, `.m4a`, `.wma`, `.alac`, `.aiff`, `.opus`

### Other Files (40+ formats)
- **Documents**: `.pdf`, `.doc`, `.docx`, `.txt`, `.md`, `.xls`, `.xlsx`, `.csv`
- **Archives**: `.zip`, `.rar`, `.tar`, `.gz`, `.7z`
- **Scripts**: `.js`, `.ts`, `.py`, `.java`, `.cpp`, `.html`, `.css`, `.json`, `.xml`
- **Databases**: `.sql`, `.sqlite`, `.db`
- **Fonts**: `.ttf`, `.otf`, `.woff`

---

## 📖 Documentation

### Quick Reference
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Fast lookup guide with examples and commands
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Visual workflows, diagrams, and system architecture
- **[REFERENCE.sh](REFERENCE.sh)** - Complete command reference with all options and tips

### Example Scripts
The `examples/` folder contains ready-to-use bash scripts:

- **[organize-phone-backup.sh](examples/organize-phone-backup.sh)** - Complete phone backup organization
- **[organize-photos-only.sh](examples/organize-photos-only.sh)** - Photos from camera/SD card
- **[organize-downloads-folder.sh](examples/organize-downloads-folder.sh)** - Clean up downloads
- **[quick-copy-by-extension.sh](examples/quick-copy-by-extension.sh)** - Fast extension sort
- **[external-drive-backup.sh](examples/external-drive-backup.sh)** - Organize entire drives
- **[video-archive.sh](examples/video-archive.sh)** - Video collection management
- **[inspect-files.sh](examples/inspect-files.sh)** - Debug file metadata

📚 **See [examples/README.md](examples/README.md)** for detailed usage instructions!

---

## 💡 Usage Examples

### Example 1: Organize SD Card Photos

```bash
# Step 1: Create metadata
ts-node src/app/pages/api/create-metadata.ts /Volumes/SD_CARD

# Step 2: Organize photos by date and type
ts-node src/app/pages/api/sorta-pics.ts /Volumes/SD_CARD ~/Pictures/Camera

# Output:
# Processing |████████████████████| 100% | 342/342 Images
# Found 12 duplicates and saved 45.67 MB by skipping them.
# ✅ Photos organized to: ~/Pictures/Camera/images/
```

### Example 2: External Drive Complete Backup

```bash
# Use the pre-made script (edit paths first!)
./examples/external-drive-backup.sh

# Or run manually:
ts-node src/app/pages/api/create-metadata.ts /Volumes/MyDrive
ts-node src/app/pages/api/sorta-pics.ts /Volumes/MyDrive ~/Backup
ts-node src/app/pages/api/sorta-vids.ts /Volumes/MyDrive ~/Backup
ts-node src/app/pages/api/sorta-audio.ts /Volumes/MyDrive ~/Backup
ts-node src/app/pages/api/sorta-else.ts /Volumes/MyDrive ~/Backup
```

### Example 3: Find All Screenshots

```bash
# No metadata needed - searches by filename
ts-node src/app/pages/api/sorta-by-name.ts ~/Desktop

# Creates: ~/Desktop/screenshots/ with all screenshot files
```

---

## ⚠️ Important Warnings

### Before You Start

1. **⚠️ BACKUP YOUR DATA** - Some scripts MOVE files (not copy)
2. **⚠️ TEST FIRST** - Try on a small folder before large operations
3. **⚠️ RUN METADATA FIRST** - Most scripts require `create-metadata.ts` first
4. **⚠️ USE ABSOLUTE PATHS** - Avoid confusion with relative paths

### What Gets Moved vs Copied

**MOVED (originals deleted from source):**
- `sorta-pics.ts`, `sorta-vids.ts`, `sorta-audio.ts`, `sorta-else.ts`, `sorta-by-name.ts`

**COPIED (originals remain):**
- `sorta.ts`

---

## 🐛 Troubleshooting

### Common Errors

**"Cannot find module 'p-limit'"**
```bash
npm install
```

**"No metadata for file"**
```bash
# Run metadata creation first!
ts-node src/app/pages/api/create-metadata.ts /source
```

**"Permission denied"**
```bash
# Don't organize system folders like /System or /Library
# Check permissions: ls -la /path/to/folder
```

**Files not being sorted**
- Check if file extension is supported (see lists above)
- View the extension sets in the TypeScript files

---

## 📊 Performance

- **Metadata Creation**: 1-5 files/second (depends on file size)
- **File Organization**: 10-50 files/second
- **Hash Calculation**: 50-200 MB/second (depends on drive speed)

**Typical Times:**
- 1,000 files: 2-5 minutes
- 10,000 files: 15-30 minutes  
- 100,000 files: 2-3 hours

---

## 🎓 Learn More

### Complete Documentation
1. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Start here for fast overview
2. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Understand how it works with diagrams
3. **[examples/README.md](examples/README.md)** - Practical examples and workflows
4. **[REFERENCE.sh](REFERENCE.sh)** - Every command and option explained

### Run Example Scripts
```bash
# Make scripts executable
chmod +x examples/*.sh

# Edit paths in the script, then run:
./examples/organize-phone-backup.sh
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## 📝 License

Check the LICENSE file in this repository.

---

## 🆘 Getting Help

1. Check **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** for common commands
2. Review **[examples/README.md](examples/README.md)** for workflows
3. Use `inspect.ts` to debug file metadata issues
4. Open an issue on GitHub

---

## 🚀 Next Steps

1. **Clone and install** (see Quick Start above)
2. **Read** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
3. **Test** on a small folder
4. **Use** the example scripts in `examples/`
5. **Organize** your files with confidence!

---

**Made with ❤️ for file organization enthusiasts**