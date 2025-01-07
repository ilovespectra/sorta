import * as fs from 'fs/promises';
import * as path from 'path';
import pLimit from 'p-limit';
import chalk from 'chalk';

let globalDuplicateAction: 's' | 'r' | 'a' | null = null;

async function directoryExists(dir: string): Promise<boolean> {
    try {
        await fs.access(dir);
        return true;
    } catch {
        return false;
    }
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

async function promptUserForDuplicateAction(): Promise<'s' | 'r' | 'a'> {
    return new Promise((resolve) => {
        console.log(
            chalk.yellow('What would you like to do? ') +
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
        const items = await fs.readdir(currentDir, { withFileTypes: true });

        for (const item of items) {
            const itemPath = path.join(currentDir, item.name);
            if (item.isDirectory()) {
                await collectFiles(itemPath);
            } else {
                allFiles.push(itemPath);
            }
        }
    };

    await collectFiles(srcDir);

    const totalFiles = allFiles.length;
    if (totalFiles === 0) {
        console.log("No files to organize.");
        return;
    }

    console.log(`Found ${totalFiles} files. Starting organization...`);

    let processedFiles = 0;

    const processFile = async (filePath: string) => {
        const ext = path.extname(filePath).toLowerCase();
        const baseName = path.basename(filePath, ext);
    
        if (ext) {
            const typeDir = path.join(destDir, ext.replace('.', ''));
            if (!(await directoryExists(typeDir))) {
                await fs.mkdir(typeDir, { recursive: true });
            }
    
            const destPath = await handleFileConflict(path.join(typeDir, path.basename(filePath)), baseName, ext);
    
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

    console.log("\nOrganization complete!");
}

const srcDirectory = process.argv[2];
const destDirectory = process.argv[3];

if (!srcDirectory || !destDirectory) {
    console.error('Usage: ts-node organize.ts <srcDir> <destDir>');
    process.exit(1);
}

organizeFilesByType(srcDirectory, destDirectory).catch((err) => {
    console.error(`Error: ${err.message}`);
});
