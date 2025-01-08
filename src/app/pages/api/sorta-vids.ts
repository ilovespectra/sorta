import * as fs from 'fs/promises';
import * as path from 'path';
import pLimit from 'p-limit';
import chalk from 'chalk';
import { SingleBar, Presets } from 'cli-progress';

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

const videoExtensions = new Set([
    '.mp4', '.m4v', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.webm',
    '.mpg', '.mpeg', '.hevc', '.h265', '.rm', '.rmvb', '.3gp', '.asf',
    '.vob', '.dat', '.swf', '.ts', '.m2ts', '.f4v', '.mxf', '.ogv',
    '.yuv', '.mjpg', '.mjpeg', '.divx', '.xvid', '.amv', '.vid', '.scm',
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

    const relevantFiles = allFiles.filter(filePath =>
        videoExtensions.has(path.extname(filePath).toLowerCase())
    );

    const totalFiles = relevantFiles.length;
    if (totalFiles === 0) {
        console.log('No videos to organize.');
        return;
    }

    console.log(`Found ${totalFiles} videos. Starting organization...`);

    const progressBar = new SingleBar({
        format: `Processing |${chalk.cyan('{bar}')}| {percentage}% | {value}/{total} Videos`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
    }, Presets.shades_classic);

    progressBar.start(totalFiles, 0);

    let processedFiles = 0;

    const processFile = async (filePath: string) => {
        const ext = path.extname(filePath).toLowerCase();

        const metadata = fileMetadataMap[filePath];
        if (!metadata) {
            console.log(chalk.yellow(`No metadata for video: ${filePath}`));
            progressBar.increment();
            return;
        }

        if (metadata.copied) {
            console.log(chalk.cyan(`Video already copied: ${filePath}`));
            progressBar.increment();
            return;
        }

        const typeDir = path.join(destDir, 'videos', ext.replace('.', ''));
        if (!(await directoryExists(typeDir))) {
            await fs.mkdir(typeDir, { recursive: true });
        }

        const formattedTimestamp = formatTimestamp(metadata.timestamp);
        const baseName = path.basename(filePath, ext);

        let destFileName = `${formattedTimestamp}_${baseName}${ext}`;
        let destPath = path.join(typeDir, destFileName);
        let suffix = 1;
        while (await directoryExists(destPath)) {
            destFileName = `${formattedTimestamp}_${baseName}_${suffix}${ext}`;
            destPath = path.join(typeDir, destFileName);
            suffix++;
        }

        await limit(async () => {
            await fs.copyFile(filePath, destPath);
            metadata.copied = true; 
        });

        processedFiles++;
        progressBar.update(processedFiles);
        if (processedFiles % 10 === 0) await updateMetadataFile(); 
    };

    for (const file of relevantFiles) {
        await processFile(file);
    }

    progressBar.stop();
    await updateMetadataFile(); 
    console.log('\nVideo organization complete!');
}

// Replace with your source and destination directories
const srcDir = '/path/to/source';
const destDir = '/path/to/destination';

organizeFilesByType(srcDir, destDir);
