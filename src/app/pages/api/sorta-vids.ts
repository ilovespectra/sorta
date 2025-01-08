import * as fs from 'fs/promises';
import * as path from 'path';
import pLimit from 'p-limit';
import chalk from 'chalk';

// Load metadata
const metadataFilePath = './file_metadata.json';

let fileMetadata: Record<string, string> = {};

try {
    const metadataFile = await fs.readFile(metadataFilePath, 'utf-8');
    fileMetadata = JSON.parse(metadataFile);
} catch (err) {
    console.error(chalk.red(`Error reading metadata file: ${err}`));
}

let globalDuplicateAction: 's' | 'r' | 'a' | null = null;

const videoExtensions = new Set([
    '.mp4', '.m4v', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.webm',
    '.mpg', '.mpeg', '.hevc', '.h265', '.rm', '.rmvb', '.3gp', '.asf',
    '.vob', '.dat', '.swf', '.ts', '.m2ts', '.f4v', '.mxf', '.ogv',
    '.yuv', '.mjpg', '.mjpeg', '.divx', '.xvid', '.amv', '.vid', '.scm',
]);

// Function to format timestamp as "yyyy-mm-dd"
function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
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

async function promptUserForDuplicateAction(): Promise<'s' | 'r' | 'a'> {
    return new Promise((resolve) => {
        console.log(
            chalk.yellow('File conflict! What would you like to do? ') +
            chalk.cyan('(s) Skip, (r) Replace, (a) Add suffix')
        );
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim() as 's' | 'r' | 'a');
        });
    });
}

async function askApplyToAll(): Promise<boolean> {
    return new Promise((resolve) => {
        console.log(chalk.green('Apply this action to all duplicates? (y/n)'));
        process.stdin.once('data', (data) => {
            const answer = data.toString().trim().toLowerCase();
            resolve(answer === 'y');
        });
    });
}

async function handleFileConflict(
    destPath: string,
    baseName: string,
    ext: string
): Promise<string | null> {
    if (await directoryExists(destPath)) {
        if (globalDuplicateAction) {
            return await handleDuplicateAction(globalDuplicateAction, destPath, baseName, ext);
        }

        console.log(chalk.yellow(`\nFile conflict: ${destPath}`));
        const userChoice = await promptUserForDuplicateAction();

        if (userChoice === 'a') {
            const applyToAll = await askApplyToAll();
            if (applyToAll) {
                globalDuplicateAction = userChoice;
            }
        }

        return await handleDuplicateAction(userChoice, destPath, baseName, ext);
    }
    return destPath;
}

async function handleDuplicateAction(
    action: 's' | 'r' | 'a',
    destPath: string,
    baseName: string,
    ext: string
): Promise<string | null> {
    switch (action) {
        case 's':
            return null;
        case 'r':
            return destPath;
        case 'a':
            return await getUniqueDestPath(destPath, baseName, ext);
        default:
            return null;
    }
}

async function getUniqueDestPath(destPath: string, baseName: string, ext: string): Promise<string> {
    let suffix = 1;
    let newDestPath = destPath;

    while (await fs.access(newDestPath).then(() => true).catch(() => false)) {
        newDestPath = path.join(
            path.dirname(destPath),
            `${baseName}(${suffix})${ext}`
        );
        suffix++;
    }
    return newDestPath;
}

function updateProgressBar(processedFiles: number, totalFiles: number) {
    const barLength = 30;
    const progress = Math.min((processedFiles / totalFiles) * barLength, barLength);
    const filledBar = '█'.repeat(progress);
    const emptyBar = '░'.repeat(barLength - progress);
    const percentage = ((processedFiles / totalFiles) * 100).toFixed(2);

    process.stdout.write(
        `\r${chalk.green('Progress:')} [${chalk.blue(filledBar)}${emptyBar}] ${percentage}%`
    );
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
        console.log('No video files to organize.');
        return;
    }

    console.log(`Found ${totalFiles} files. Starting organization...`);

    let processedFiles = 0;

    const processFile = async (filePath: string) => {
        const ext = path.extname(filePath).toLowerCase();
        const baseName = path.basename(filePath, ext);
    
        if (videoExtensions.has(ext)) {
            const typeDir = path.join(destDir, 'video', ext.replace('.', ''));
            if (!(await directoryExists(typeDir))) {
                await fs.mkdir(typeDir, { recursive: true });
            }
    
            // Get timestamp from metadata for the file
            const timestamp = fileMetadata[filePath];

            if (!timestamp) {
                console.log(chalk.yellow(`No timestamp metadata for: ${filePath}`));
                return;
            }

            // Format the timestamp to "yyyy-mm-dd"
            const formattedTimestamp = formatTimestamp(timestamp);
            const timestampedBaseName = `${formattedTimestamp}_${baseName}`;
            const destPath = await handleFileConflict(
                path.join(typeDir, `${timestampedBaseName}${ext}`),
                timestampedBaseName,
                ext
            );
    
            if (!destPath) {
                console.log(chalk.yellow(`Skipped file: ${filePath}`));
                return;
            }
    
            await limit(async () => {
                await fs.copyFile(filePath, destPath);
            });
    
            processedFiles++;
            updateProgressBar(processedFiles, totalFiles);
        }
    };
    
    for (const file of allFiles) {
        await processFile(file);
    }

    console.log('\nVideo organization complete!');
}

// Replace with your source and destination
const srcDir = '/path/to/source';
const destDir = '/path/to/destination';

organizeFilesByType(srcDir, destDir);
