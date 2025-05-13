// deploy.js

import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || 'kjau2Wpy954aOmJdJHX4vAh3';

(async () => {
  try {
    console.log('🚀 Deploying with Vercel...');
    const { stdout, stderr } = await execAsync(`vercel --token=${VERCEL_TOKEN} --prod --yes`);
    if (stdout) console.log('✅ Deployment output:\n', stdout);
    if (stderr) console.error('⚠️ Deployment warnings:\n', stderr);
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
  }
})();
