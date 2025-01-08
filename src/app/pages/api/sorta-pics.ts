import * as fs from 'fs/promises';
import * as path from 'path';
import pLimit from 'p-limit';
import chalk from 'chalk';

const metadataFilePath = './file_metadata.json';

interface FileMetadata {
    filename: string;
    path: string;
    timestamp: string;
    copied: boolean;
}

let fileMetadataArray: FileMetadata[] = [];
let fileMetadataMap: Record<string, FileMetadata> = {};

try {
    const metadataFile = await fs.readFile(metadataFilePath, 'utf-8');
    fileMetadataArray = JSON.parse(metadataFile).files;

    // Create a quick lookup map for metadata by file path
    fileMetadataMap = fileMetadataArray.reduce((map, item) => {
        map[item.path] = item;
        return map;
    }, {} as Record<string, FileMetadata>);
} catch (err) {
    console.error(chalk.red(`Error reading metadata file: ${err}`));
}

const imageExtensions = new Set([
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp',
    '.ico', '.heic', '.heif', '.raw', '.cr2', '.nef', '.orf', '.arw',
    '.sr2', '.dng', '.raf', '.rw2', '.pef', '.svg', '.img', '.psd', '.xcf', '.pcx', '.jp2',
]);

function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function directoryExists(dir: string): Promise<boolean> {
    try {
        await fs.access(dir);
        return true;
    } catch {
        return false;
    }
}

async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function updateMetadataFile() {
    await fs.writeFile(metadataFilePath, JSON.stringify({ files: fileMetadataArray }, null, 4), 'utf-8');
}

async function organizeFilesByType(srcDir: string, destDir: string) {
    const limit = pLimit(10);
    const allFiles: string[] = [];

    const collectFiles = async (currentDir: string) => {
        try {
            const items = await fs.readdir(currentDir, { withFileTypes: true });

            for (const item of items) {
                const itemPath = path.join(currentDir, item.name);

                if (item.name.startsWith('.')) continue;

                if (item.isDirectory()) {
                    await collectFiles(itemPath);
                } else {
                    allFiles.push(itemPath);
                }
            }
        } catch (err) {
            console.error(chalk.red(`Error accessing folder: ${currentDir}, ${(err as Error).message}`));
        }
    };

    await collectFiles(srcDir);

    const totalFiles = allFiles.length;
    if (totalFiles === 0) {
        console.log('No image files to organize.');
        return;
    }

    console.log(`Found ${totalFiles} files. Starting organization...`);

    let processedFiles = 0;

    const processFile = async (filePath: string) => {
        const ext = path.extname(filePath).toLowerCase();

        if (!imageExtensions.has(ext)) return;

        const metadata = fileMetadataMap[filePath];
        if (!metadata) {
            console.log(chalk.yellow(`No metadata for file: ${filePath}`));
            return;
        }

        if (metadata.copied) {
            console.log(chalk.cyan(`File already copied: ${filePath}`));
            return;
        }

        const typeDir = path.join(destDir, 'image', ext.replace('.', ''));
        if (!(await directoryExists(typeDir))) {
            await fs.mkdir(typeDir, { recursive: true });
        }

        const formattedTimestamp = formatTimestamp(metadata.timestamp);
        const baseName = path.basename(filePath, ext);
        let destFileName = `${formattedTimestamp}_${baseName}${ext}`;
        let destPath = path.join(typeDir, destFileName);

        // Ensure uniqueness for duplicate files
        let suffix = 1;
        while (await fileExists(destPath)) {
            destFileName = `${formattedTimestamp}_${baseName}_${suffix}${ext}`;
            destPath = path.join(typeDir, destFileName);
            suffix++;
        }

        await limit(async () => {
            await fs.copyFile(filePath, destPath);
            metadata.copied = true; // Mark as copied
            metadata.filename = destFileName; // Update filename in metadata
        });

        processedFiles++;
        if (processedFiles % 10 === 0) await updateMetadataFile(); // Periodically save updates
    };

    for (const file of allFiles) {
        await processFile(file);
    }

    await updateMetadataFile(); // Final update
    console.log('\nImage organization complete!');
}

// Replace with your source and destination directories
const srcDir = '/path/to/source';
const destDir = '/path/to/destination';

organizeFilesByType(srcDir, destDir);
