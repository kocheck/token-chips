import { Octokit } from '@octokit/rest';
import { GITHUB_TOKEN, REPO_OWNER, REPO_NAME } from '../config';

class GitHubService {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({ auth: GITHUB_TOKEN });
  }

  async saveVariables(
    variables: any,
    commitMessage: string
  ): Promise<void> {
    const content = JSON.stringify(variables, null, 2);
    const path = 'figma-variables.json';

    interface ExistingFile {
      sha: string;
    }

    try {
      // Check if file already exists
      const { data: existingFile } = (await this.octokit.repos
        .getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path,
        })
        .catch(() => ({ data: null }))) as {
        data: ExistingFile | null;
      };

      const params = {
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path,
        message: commitMessage || 'Update Figma variables',
        content: Buffer.from(content).toString('base64'),
        sha: existingFile ? existingFile.sha : undefined,
      };

      await this.octokit.repos.createOrUpdateFileContents(params);
    } catch (error) {
      console.error('Error saving variables to GitHub:', error);
      throw new Error('Failed to save variables to GitHub');
    }
  }

  async fetchVariables(): Promise<any> {
    const path = 'figma-variables.json';

    try {
      const { data } = await this.octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path,
      });

      if ('content' in data) {
        const content = Buffer.from(
          data.content,
          'base64'
        ).toString();
        return JSON.parse(content);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching variables from GitHub:', error);
      throw new Error('Failed to fetch variables from GitHub');
    }
  }

  async getCommitHistory(
    path: string = 'figma-variables.json',
    limit: number = 10
  ): Promise<any[]> {
    try {
      const { data: commits } = await this.octokit.repos.listCommits({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path,
        per_page: limit,
      });

      return commits.map((commit) => ({
        sha: commit.sha,
        message: commit.commit.message,
        date: commit.commit.author?.date,
        author: commit.commit.author?.name,
      }));
    } catch (error) {
      console.error('Error fetching commit history:', error);
      throw new Error('Failed to fetch commit history');
    }
  }
}

export const githubService = new GitHubService();
