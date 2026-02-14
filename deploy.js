// deploy.js (ESM)
//
// Builds the Svelte site with pnpm, and deploys via FTP.
//
// Usage examples:
//   node deploy.js                           - Build and deploy
//   node deploy.js --clean                   - Clear remote directory before upload
//   node deploy.js --skip-deploy             - Build only, don't deploy
//   node deploy.js --preserve-dist           - Keep build/ folder after deployment
//
// Arguments:
//   --clean          Clear all files in the remote directory before uploading
//   --skip-deploy    Only build locally, skip FTP upload step
//   --preserve-dist  Don't delete build/ folder after successful deployment
//
// Config via .env or environment variables:
//   FTP_HOST, FTP_PORT, FTP_USER, FTP_PASSWORD, FTP_SECURE, FTP_TLS_INSECURE
//   REMOTE_DIR, LOCAL_DIR

import 'dotenv/config';
import path from 'node:path';
import * as fs from 'node:fs';
import { promises as fsp } from 'node:fs';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { Client as FtpClient } from 'basic-ftp';

const execAsync = promisify(exec);

function boolFromEnv(value, def = false) {
    if (value == null) return def;
    const v = String(value).trim().toLowerCase();
    return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}

function parseArgs() {
    const args = new Set(process.argv.slice(2));
    return {
        clean: args.has('--clean'),
        skipDeploy: args.has('--skip-deploy'),
        preserveDist: args.has('--preserve-dist'),
    };
}

async function pathExists(p) {
    try {
        await fsp.access(p);
        return true;
    } catch {
        return false;
    }
}

async function deleteDist(distPath) {
    if (!(await pathExists(distPath))) return;
    console.log(`Deleting ${distPath} ...`);
    await fsp.rm(distPath, { recursive: true, force: true });
    console.log('Build folder deleted.');
}

async function buildSite() {
    console.log('Building Svelte site with pnpm...');
    try {
        const { stdout, stderr } = await execAsync('pnpm run build');
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        console.log('Build completed successfully.');
    } catch (err) {
        console.error('Build failed:', err.message);
        if (err.stdout) console.log(err.stdout);
        if (err.stderr) console.error(err.stderr);
        throw err;
    }
}

async function deploy() {
    const {
        FTP_HOST,
        FTP_PORT,
        FTP_USER,
        FTP_PASSWORD,
        FTP_SECURE,
        REMOTE_DIR,
        LOCAL_DIR,
    } = process.env;

    if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
        throw new Error('Missing FTP credentials: set FTP_HOST, FTP_USER, FTP_PASSWORD (via .env or environment).');
    }

    const port = FTP_PORT ? Number(FTP_PORT) : 21;
    const secure = boolFromEnv(FTP_SECURE, false);
    const remoteDir = REMOTE_DIR || '/public_html/';
    const localDir = LOCAL_DIR || 'dist';

    if (!fs.existsSync(localDir) || !fs.statSync(localDir).isDirectory()) {
        throw new Error(`Build directory not found: ${localDir}. Build step may have failed.`);
    }

    const { clean } = parseArgs();

    const client = new FtpClient();
    client.ftp.verbose = true;

    try {
        const masked = (s) => (s ? '*'.repeat(Math.min(8, s.length)) : '(none)');
        console.log(`FTP target: ${FTP_HOST}:${port} secure=${secure} user=${FTP_USER} pass=${masked(FTP_PASSWORD)}`);
        console.log(`Connecting to ${FTP_HOST}:${port} (secure=${secure}) ...`);
        await client.access({
            host: FTP_HOST,
            port,
            user: FTP_USER,
            password: FTP_PASSWORD,
            secure,
        });

        console.log(`Ensuring remote directory: ${remoteDir}`);
        await client.ensureDir(remoteDir);
        await client.cd(remoteDir);

        if (clean) {
            console.log('Clearing remote directory (--clean)...');
            await client.clearWorkingDir();
        }

        console.log(`Uploading ${path.resolve(localDir)} -> ${remoteDir}`);
        await client.uploadFromDir(localDir);

        console.log('Deployment completed successfully.');
    } finally {
        client.close();
    }
}

(async function main() {
    try {
        const { skipDeploy, preserveDist } = parseArgs();
        const localDir = process.env.LOCAL_DIR || 'dist';

        await buildSite();

        if (skipDeploy) {
            console.log('Skipping deploy (--skip-deploy). Done.');
            return;
        }

        await deploy();

        if (!preserveDist) {
            await deleteDist(path.resolve(localDir));
        } else {
            console.log(`Preserving ${localDir}/ folder (--preserve-dist).`);
        }
    } catch (err) {
        console.error('Failed:', err);
        process.exitCode = 1;
    }
})();