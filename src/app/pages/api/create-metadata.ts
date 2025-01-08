import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

async function getFileHash(filePath: string): Promise<string | null> {
    try {
        const fileContent = await fs.readFile(filePath);
        const hash = crypto.createHash('sha256').update(fileContent).digest('hex');
        return hash;
    } catch (err) {
        console.error(`Error hashing file: ${filePath} - ${err}`);
        return null;
    }
}

async function getFileMetadata(dir: string, metadataFile: string) {
    const filesMetadata: { files: { filename: string; path: string; timestamp: string; copied: boolean; hash: string | null }[] } = {
        files: [],
    };

    const scanDirectory = async (currentDir: string) => {
        let items;
        try {
            items = await fs.readdir(currentDir, { withFileTypes: true });
        } catch (err) {
            if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'EPERM') {
                console.warn(`Skipping restricted folder: ${currentDir}`);
                return;
            } else {
                throw err;
            }
        }

        for (const item of items) {
            const filePath = path.join(currentDir, item.name);

            if (item.name.startsWith('.')) {
                continue;
            }

            if (item.isDirectory()) {
                await scanDirectory(filePath);
            } else {
                try {
                    const stats = await fs.stat(filePath);

                    console.log(`Checking file: ${filePath}`);
                    console.log(`Birthtime: ${stats.birthtime}`);
                    console.log(`Mtime: ${stats.mtime}`);

                    // Use `birthtime` if available, otherwise use `mtime` as fallback
                    const timestamp = stats.birthtime || stats.mtime;

                    if (timestamp) {
                        // Calculate file hash
                        const hash = await getFileHash(filePath);

                        // Push metadata for the file, including the hash
                        filesMetadata.files.push({
                            filename: item.name,
                            path: filePath,
                            timestamp: timestamp.toISOString(), // ISO format for consistency
                            copied: false, // Set default copied value to false
                            hash: hash || null, // Store the hash or null if it fails
                        });
                    } else {
                        console.warn(`No valid timestamp for file: ${filePath}`);
                    }
                } catch (err) {
                    if (err instanceof Error) {
                        console.warn(`Failed to read file: ${filePath} - ${err.message}`);
                    }
                }
            }
        }
    };

    await scanDirectory(dir);

    // Save the collected metadata to the specified output file
    await fs.writeFile(metadataFile, JSON.stringify(filesMetadata, null, 4), 'utf8');
    console.log(`Metadata saved to ${metadataFile}`);
}

// Get the source directory and metadata output file from command-line arguments
const sourceDir = process.argv[2];
const metadataOutputFile = process.argv[3] || 'file_metadata.json';

if (!sourceDir) {
    console.error('Usage: ts-node createMetadata.ts <sourceDir> [metadataOutputFile]');
    process.exit(1);
}

getFileMetadata(sourceDir, metadataOutputFile).catch((err) => {
    if (err instanceof Error) {
        console.error(`Error: ${err.message}`);
    } else {
        console.error('An unknown error occurred.');
    }
});
