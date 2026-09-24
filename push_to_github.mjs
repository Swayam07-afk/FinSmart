/**
 * FinSmart GitHub Publisher Script
 * Creates or updates a GitHub repository and pushes code to any specified branch
 * directly via GitHub's REST / Git Database API.
 * Does not require Git or GitHub CLI to be installed.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments (--key value or --flag)
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        parsed[key] = args[i + 1];
        i++;
      } else {
        parsed[key] = true;
      }
    }
  }
  return parsed;
}

const cliArgs = parseArgs();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

async function githubRequest(endpoint, token, method = 'GET', body = null) {
  const cleanToken = token.trim();
  const headers = {
    'Authorization': cleanToken.startsWith('Bearer ') || cleanToken.startsWith('token ') ? cleanToken : `Bearer ${cleanToken}`,
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

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    const errorMsg = data.message || `GitHub API error: ${res.status}`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
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
    if (
      entry.name === '.git' ||
      entry.name === 'node_modules' ||
      entry.name === '.system_generated' ||
      entry.name.endsWith('.log')
    ) {
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
  console.log('   FinSmart — Create & Push Branch to GitHub');
  console.log('======================================================\n');

  try {
    // 1. Authenticate
    let token = cliArgs.token || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (!token) {
      console.log('A GitHub Personal Access Token (classic or fine-grained) with "repo" permission is required.');
      console.log('You can generate one at: https://github.com/settings/tokens (classic, tick "repo")\n');
      token = await askQuestion('Enter your GitHub Personal Access Token: ');
    }

    if (!token || !token.trim()) {
      console.error('\n❌ Error: GitHub Token is required to authenticate with your account.');
      process.exit(1);
    }

    console.log('\nAuthenticating with GitHub...');
    const user = await githubRequest('/user', token);
    console.log(`✓ Authenticated as @${user.login} (${user.name || user.login})`);

    // 2. Select Repository
    const defaultRepoName = 'finsmart';
    let repoName = cliArgs.repo || process.env.GITHUB_REPO;
    if (!repoName) {
      const repoInput = await askQuestion(`\nEnter repository name [default: ${defaultRepoName}]: `);
      repoName = repoInput.trim() || defaultRepoName;
    }

    let repo;
    try {
      repo = await githubRequest(`/repos/${user.login}/${repoName}`, token);
      console.log(`✓ Found existing repository: ${repo.html_url}`);
    } catch (err) {
      if (err.status === 404) {
        console.log(`\nRepository "${repoName}" not found. Creating it now on your GitHub...`);
        const isPrivate = cliArgs.private ? true : (cliArgs.public ? false : false);
        repo = await githubRequest('/user/repos', token, 'POST', {
          name: repoName,
          description: 'FinSmart — Financial Literacy Survey, Assessment, Education, and Research Platform',
          private: isPrivate,
          auto_init: false
        });
        console.log(`✓ Repository created: ${repo.html_url}`);
      } else {
        throw err;
      }
    }

    // 3. Select Target Branch
    const defaultBranchName = 'feature/v2-auth-update';
    let targetBranch = cliArgs.branch || process.env.GITHUB_BRANCH;
    if (!targetBranch) {
      console.log(`\nDefault primary branch on repo: ${repo.default_branch || 'main'}`);
      const branchInput = await askQuestion(`Enter branch name to create/push [default: ${defaultBranchName}]: `);
      targetBranch = branchInput.trim() || defaultBranchName;
    }
    // Clean branch name
    targetBranch = targetBranch.replace(/^refs\/heads\//, '').trim();

    // 4. Commit Message
    let commitMessage = cliArgs.message || process.env.GITHUB_COMMIT_MESSAGE;
    if (!commitMessage) {
      const defaultMsg = 'feat: add email/mobile user authentication and 10-question diagnostic survey';
      const msgInput = await askQuestion(`\nEnter commit message [default: "${defaultMsg}"]: `);
      commitMessage = msgInput.trim() || defaultMsg;
    }

    // 5. Determine Parent Commit
    let parentCommitSha = null;
    let branchExists = false;

    // First check if target branch already exists
    try {
      const targetRef = await githubRequest(`/repos/${user.login}/${repoName}/git/refs/heads/${targetBranch}`, token);
      parentCommitSha = targetRef.object.sha;
      branchExists = true;
      console.log(`ℹ Branch "${targetBranch}" already exists at commit ${parentCommitSha.slice(0, 7)}.`);
    } catch (e) {
      // Branch doesn't exist yet; branch off from default branch (main/master)
      const baseBranch = repo.default_branch || 'main';
      try {
        const baseRef = await githubRequest(`/repos/${user.login}/${repoName}/git/refs/heads/${baseBranch}`, token);
        parentCommitSha = baseRef.object.sha;
        console.log(`ℹ Branching off "${baseBranch}" (commit ${parentCommitSha.slice(0, 7)})...`);
      } catch (e2) {
        console.log('ℹ Repository is currently empty. Creating root initial commit for new branch...');
      }
    }

    // 6. Collect and Upload Files as Blobs
    const files = getFilesRecursively(__dirname);
    console.log(`\nFound ${files.length} project files to upload to branch "${targetBranch}":`);

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

    // 7. Create Tree
    console.log('\nCreating Git tree...');
    const tree = await githubRequest(`/repos/${user.login}/${repoName}/git/trees`, token, 'POST', {
      tree: treeItems
    });

    // 8. Create Commit
    console.log(`Creating commit on branch "${targetBranch}"...`);
    const commitData = {
      message: commitMessage,
      tree: tree.sha
    };
    if (parentCommitSha) {
      commitData.parents = [parentCommitSha];
    }

    const commit = await githubRequest(`/repos/${user.login}/${repoName}/git/commits`, token, 'POST', commitData);
    console.log(`✓ Commit created: ${commit.sha.slice(0, 7)}`);

    // 9. Update or Create Branch Ref
    console.log(`Updating branch reference "refs/heads/${targetBranch}"...`);
    if (branchExists) {
      await githubRequest(`/repos/${user.login}/${repoName}/git/refs/heads/${targetBranch}`, token, 'PATCH', {
        sha: commit.sha,
        force: true
      });
      console.log(`✓ Branch "${targetBranch}" updated.`);
    } else {
      await githubRequest(`/repos/${user.login}/${repoName}/git/refs`, token, 'POST', {
        ref: `refs/heads/${targetBranch}`,
        sha: commit.sha
      });
      console.log(`✓ Branch "${targetBranch}" created successfully.`);
    }

    const baseBranch = repo.default_branch || 'main';
    const branchUrl = `${repo.html_url}/tree/${encodeURIComponent(targetBranch)}`;
    const prUrl = `${repo.html_url}/compare/${encodeURIComponent(baseBranch)}...${encodeURIComponent(targetBranch)}?expand=1`;

    console.log('\n======================================================');
    console.log('  🎉 SUCCESS! Project uploaded to GitHub!');
    console.log(`  Repository: ${repo.html_url}`);
    console.log(`  New Branch: ${branchUrl}`);
    if (targetBranch !== baseBranch) {
      console.log(`  Create Pull Request: ${prUrl}`);
    }
    console.log('======================================================\n');

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    if (error.data && error.data.errors) {
      console.error('Details:', error.data.errors);
    }
  } finally {
    rl.close();
  }
}

main();
