# 📋 Sorta Quick Reference Guide

## 🎯 What is Sorta?

**Sorta** is a terminal-based file organization tool that:
- Runs entirely in your terminal (no web interface)
- Organizes files by type, date, and name
- Detects and skips duplicates to save space
- Supports images, videos, audio, documents, and more

---

## ⚡ Quick Start

```bash
# 1. Create metadata (ALWAYS FIRST!)
ts-node src/app/pages/api/create-metadata.ts /path/to/source

# 2. Organize files
ts-node src/app/pages/api/sorta-pics.ts /path/to/source /path/to/destination
```

---

## 📚 Script Comparison

| Script | Purpose | Needs Metadata? | Action | Output Example |
|--------|---------|----------------|--------|----------------|
| `create-metadata.ts` | Scan files & create hash database | N/A - Creates it | Neither | `file_metadata.json` |
| `sorta-pics.ts` | Organize images | ✅ Yes | **MOVES** | `dest/images/jpg/2024-12-06_photo.jpg` |
| `sorta-vids.ts` | Organize videos | ✅ Yes | **MOVES** | `dest/videos/mp4/2024-12-06_video.mp4` |
| `sorta-audio.ts` | Organize audio | ✅ Yes | **MOVES** | `dest/audio/mp3/2024-12-06_song.mp3` |
| `sorta-else.ts` | Organize documents/etc | ✅ Yes | **MOVES** | `dest/pdf/2024-12-06_doc.pdf` |
| `sorta-by-name.ts` | Find "screenshot" files | ❌ No | **MOVES** | `source/screenshots/` |
| `sorta.ts` | Generic extension sort | ❌ No | **COPIES** | `dest/jpg/`, `dest/pdf/` |
| `inspect.ts` | Debug file metadata | ❌ No | Neither | Terminal output |
| `delete-duplicates.ts` | Remove duplicate files | ✅ Yes | **DELETES** | Removes dupes |

---

## 🎬 Complete Workflows

### Phone Backup Organization
```bash
SOURCE="/Volumes/iPhone"
DEST="$HOME/Organized_Backup"

# Step 1: Create metadata
ts-node src/app/pages/api/create-metadata.ts "$SOURCE"

# Step 2-4: Organize by type
ts-node src/app/pages/api/sorta-pics.ts "$SOURCE" "$DEST"
ts-node src/app/pages/api/sorta-vids.ts "$SOURCE" "$DEST"
ts-node src/app/pages/api/sorta-audio.ts "$SOURCE" "$DEST"
```

### Downloads Folder Cleanup
```bash
# Organize everything + screenshots
ts-node src/app/pages/api/create-metadata.ts ~/Downloads
ts-node src/app/pages/api/sorta-pics.ts ~/Downloads ~/Downloads/Organized
ts-node src/app/pages/api/sorta-vids.ts ~/Downloads ~/Downloads/Organized
ts-node src/app/pages/api/sorta-audio.ts ~/Downloads ~/Downloads/Organized
ts-node src/app/pages/api/sorta-else.ts ~/Downloads ~/Downloads/Organized
ts-node src/app/pages/api/sorta-by-name.ts ~/Downloads
```

### Quick Extension Sort (No Metadata)
```bash
# Simple, fast, copies files
ts-node src/app/pages/api/sorta.ts ~/Downloads ~/Downloads/Sorted
```

---

## 📁 Output Structure

After running sorta scripts, your files will be organized like this:

```
destination/
├── images/
│   ├── jpg/
│   │   ├── 2024-06-15_vacation_photo.jpg
│   │   ├── 2024-06-16_beach_sunset.jpg
│   │   └── 2024-12-06_family_pic.jpg
│   ├── png/
│   │   └── 2024-11-20_screenshot.png
│   ├── heic/
│   └── raw/
├── videos/
│   ├── mp4/
│   │   ├── 2024-07-01_birthday_party.mp4
│   │   └── 2024-08-15_vacation_clip.mp4
│   ├── mov/
│   └── avi/
├── audio/
│   ├── mp3/
│   │   └── 2024-09-10_podcast_recording.mp3
│   ├── flac/
│   └── wav/
└── [other folders by extension]/
```

---

## 🔧 Supported File Types

### Images (50+ formats)
`.jpg`, `.png`, `.gif`, `.heic`, `.raw`, `.cr2`, `.nef`, `.psd`, `.svg`, `.webp`, `.tiff`, `.bmp`, `.ico`, etc.

### Videos (30+ formats)
`.mp4`, `.mov`, `.avi`, `.mkv`, `.webm`, `.flv`, `.wmv`, `.mpeg`, `.m4v`, `.3gp`, etc.

### Audio (10+ formats)
`.mp3`, `.wav`, `.flac`, `.aac`, `.ogg`, `.m4a`, `.wma`, `.alac`, `.aiff`, `.opus`

### Other Files (40+ formats)
- **Documents**: `.pdf`, `.doc`, `.docx`, `.txt`, `.md`, `.xls`, `.xlsx`, `.csv`
- **Archives**: `.zip`, `.rar`, `.tar`, `.gz`, `.7z`
- **Scripts**: `.js`, `.ts`, `.py`, `.java`, `.cpp`, `.html`, `.css`, `.json`
- **Databases**: `.sql`, `.sqlite`, `.db`
- **Fonts**: `.ttf`, `.otf`, `.woff`
- **Other**: `.iso`, `.dmg`, `.apk`, `.jar`

---

## ⚠️ Important Warnings

### MOVES vs COPIES
- ⚠️ **sorta-pics/vids/audio/else**: FILES WILL BE **MOVED** (not in original location anymore!)
- ⚠️ **sorta-by-name**: FILES WILL BE **MOVED**
- ✅ **sorta.ts**: FILES ARE **COPIED** (originals remain)

### Always Required Steps
1. **Backup important data first**
2. **Test on a small folder before running on everything**
3. **Run `create-metadata.ts` BEFORE running any metadata-based scripts**

---

## 🐛 Common Issues

### "Cannot find module"
```bash
npm install
```

### "No metadata for file"
```bash
# Run metadata creation first!
ts-node src/app/pages/api/create-metadata.ts /source
```

### "Permission denied"
```bash
# Don't organize system folders
# Check permissions: ls -la /path
```

### Files not being sorted
- Check if file extension is supported (see lists above)
- View the extension sets in the .ts files

---

## 💡 Pro Tips

### Test First!
```bash
# Create test folder
mkdir ~/sorta_test
cp ~/Pictures/sample.jpg ~/sorta_test/
ts-node src/app/pages/api/create-metadata.ts ~/sorta_test
ts-node src/app/pages/api/sorta-pics.ts ~/sorta_test ~/sorta_test/output
```

### View Metadata
```bash
cat file_metadata.json | jq '.files[] | {filename, timestamp, hash}'
```

### Use Absolute Paths
```bash
# Good ✅
ts-node src/app/pages/api/create-metadata.ts /Users/tanny/Downloads

# Can be ambiguous ⚠️
ts-node src/app/pages/api/create-metadata.ts ~/Downloads
```

### For Large Folders
```bash
# Run in screen to prevent interruption
screen -S sorta
ts-node src/app/pages/api/create-metadata.ts /Volumes/BigDrive
# Detach: Ctrl+A then D
# Reattach later: screen -r sorta
```

---

## 📊 What You'll See

### Progress Bars
```
Processing |████████████░░░░░░░░| 60% | 600/1000 Images
```

### Duplicate Detection
```
Image already copied (duplicate hash): /path/to/duplicate.jpg
Found 50 duplicates and saved 234.56 MB by skipping them.
```

### File Moves
```
Moved: /source/photo.jpg -> /dest/images/jpg/2024-12-06_photo.jpg
```

---

## 🚀 Example Commands

```bash
# Organize photos from SD card
ts-node src/app/pages/api/create-metadata.ts /Volumes/SD_CARD
ts-node src/app/pages/api/sorta-pics.ts /Volumes/SD_CARD ~/Pictures/Camera

# Clean up downloads
ts-node src/app/pages/api/create-metadata.ts ~/Downloads
ts-node src/app/pages/api/sorta-pics.ts ~/Downloads ~/Downloads/Organized
ts-node src/app/pages/api/sorta-vids.ts ~/Downloads ~/Downloads/Organized
ts-node src/app/pages/api/sorta-else.ts ~/Downloads ~/Downloads/Organized

# Quick sort by extension (copies files)
ts-node src/app/pages/api/sorta.ts ~/Desktop ~/Desktop/Sorted

# Find all screenshots
ts-node src/app/pages/api/sorta-by-name.ts ~/Desktop
```

---

## 📦 Pre-made Scripts

Check the `examples/` folder for ready-to-use bash scripts:

```bash
./examples/organize-phone-backup.sh
./examples/organize-photos-only.sh
./examples/organize-downloads-folder.sh
./examples/quick-copy-by-extension.sh
./examples/external-drive-backup.sh
./examples/video-archive.sh
```

*Remember to edit the paths inside each script before running!*

---

## 🔗 More Resources

- **Detailed reference**: `REFERENCE.sh`
- **Example scripts**: `examples/` folder
- **Examples README**: `examples/README.md`
- **Project README**: `README.md`
- **GitHub**: https://github.com/ilovespectra/sorta

---

## 📞 Need Help?

1. Check `REFERENCE.sh` for detailed command documentation
2. Check `examples/README.md` for workflow examples
3. Open an issue on GitHub
4. Use `inspect.ts` to debug file metadata issues

---

**Created**: December 2024  
**Version**: 1.0  
**License**: Check LICENSE file in repository
