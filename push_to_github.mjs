/**
 * FinSmart GitHub Publisher Script
 * Creates a GitHub repository and pushes all project files directly using GitHub's REST API.
 * Does not require Git or GitHub CLI to be installed.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

async function githubRequest(endpoint, token, method = 'GET', body = null) {
  const headers = {
    'Authorization': `Bearer ${token.trim()}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'FinSmart-Publisher',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`https://api.github.com${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `GitHub API error: ${res.status}`);
  }
  return data;
}

function getFilesRecursively(dir, baseDir = dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    // Skip ignored files and directories
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'push_to_github.mjs') {
      continue;
    }

    if (entry.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, baseDir));
    } else {
      results.push({ fullPath, relPath });
    }
  }

  return results;
}

async function main() {
  console.log('\n======================================================');
  console.log('   FinSmart — Create & Push to GitHub Repository');
  console.log('======================================================\n');

  try {
    let token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.log('To create a repository on your GitHub account, we need a GitHub Personal Access Token (classic or fine-grained) with "repo" permissions.');
      console.log('You can generate one here: https://github.com/settings/tokens (select scope: "repo")\n');
      token = await askQuestion('Enter your GitHub Personal Access Token: ');
    }

    if (!token || !token.trim()) {
      console.error('\nError: GitHub Token is required to authenticate with your account.');
      process.exit(1);
    }

    console.log('\nAuthenticating with GitHub...');
    const user = await githubRequest('/user', token);
    console.log(`✓ Authenticated as @${user.login} (${user.name || user.login})`);

    const defaultRepoName = 'finsmart';
    const repoInput = await askQuestion(`\nEnter repository name [default: ${defaultRepoName}]: `);
    const repoName = repoInput.trim() || defaultRepoName;

    const privateInput = await askQuestion('Make repository private? (y/N) [default: Public]: ');
    const isPrivate = privateInput.trim().toLowerCase() === 'y';

    console.log(`\nCreating repository "${repoName}" on GitHub...`);
    let repo;
    try {
      repo = await githubRequest('/user/repos', token, 'POST', {
        name: repoName,
        description: 'FinSmart — Financial Literacy Survey, Assessment, Education, and Research Platform',
        private: isPrivate,
        auto_init: false
      });
      console.log(`✓ Repository created: ${repo.html_url}`);
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`ℹ Repository "${repoName}" already exists on your account. Pushing code update...`);
        repo = await githubRequest(`/repos/${user.login}/${repoName}`, token);
      } else {
        throw err;
      }
    }

    const files = getFilesRecursively(__dirname);
    console.log(`\nFound ${files.length} project files to upload:`);

    // Upload blobs
    const treeItems = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      process.stdout.write(`  [${i + 1}/${files.length}] Uploading ${file.relPath}... `);
      
      const fileBuffer = fs.readFileSync(file.fullPath);
      const base64Content = fileBuffer.toString('base64');

      const blob = await githubRequest(`/repos/${user.login}/${repoName}/git/blobs`, token, 'POST', {
        content: base64Content,
        encoding: 'base64'
      });

      treeItems.push({
        path: file.relPath,
        mode: '100644',
        type: 'blob',
        sha: blob.sha
      });

      console.log('✓');
    }

    // Create tree
    console.log('\nCreating Git commit tree...');
    const tree = await githubRequest(`/repos/${user.login}/${repoName}/git/trees`, token, 'POST', {
      tree: treeItems
    });

    // Check if main branch exists for parent commit
    let parentCommitSha = null;
    try {
      const ref = await githubRequest(`/repos/${user.login}/${repoName}/git/refs/heads/main`, token);
      parentCommitSha = ref.object.sha;
    } catch (e) {
      // First commit on empty repo
    }

    // Create commit
    console.log('Creating commit: "Initial commit: FinSmart financial literacy platform"...');
    const commitData = {
      message: 'Initial commit: FinSmart financial literacy platform',
      tree: tree.sha
    };
    if (parentCommitSha) {
      commitData.parents = [parentCommitSha];
    }

    const commit = await githubRequest(`/repos/${user.login}/${repoName}/git/commits`, token, 'POST', commitData);

    // Update or create main ref
    console.log('Updating branch reference "main"...');
    if (parentCommitSha) {
      await githubRequest(`/repos/${user.login}/${repoName}/git/refs/heads/main`, token, 'PATCH', {
        sha: commit.sha,
        force: true
      });
    } else {
      await githubRequest(`/repos/${user.login}/${repoName}/git/refs`, token, 'POST', {
        ref: 'refs/heads/main',
        sha: commit.sha
      });
    }

    console.log('\n======================================================');
    console.log('  🎉 SUCCESS! Project pushed to GitHub!');
    console.log(`  Repository URL: ${repo.html_url}`);
    console.log('======================================================\n');

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  } finally {
    rl.close();
  }
}

main();
