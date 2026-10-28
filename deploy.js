// Run manually only after owner approval; never run as part of setup or tests.
const { execFile } = require('node:child_process');
require('dotenv').config();

const token = process.env.VERCEL_TOKEN;
if (!token) {
  console.error('VERCEL_TOKEN is required for manual deployment.');
  process.exitCode = 1;
} else {
  execFile('vercel', ['--token', token, '--prod', '--yes'], (error) => {
    if (error) {
      // CLI output and error.message can contain credentials. Do not echo them.
      console.error('Deployment failed. Review the provider dashboard.');
      process.exitCode = 1;
    } else {
      console.log('Deployment completed.');
    }
  });
}
