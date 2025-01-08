import * as fs from 'fs/promises';
import * as path from 'path';

async function getFileMetadata(dir: string, metadataFile: string) {
    const filesMetadata: { files: { filename: string; path: string; timestamp: string; copied: boolean }[] } = {
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
                        filesMetadata.files.push({
                            filename: item.name,
                            path: filePath,
                            timestamp: timestamp.toISOString(), // ISO format for consistency
                            copied: false, // Set default copied value to false
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
