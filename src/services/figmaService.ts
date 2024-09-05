import { githubService } from './githubService';
import { compareVariables } from '../utils/compareVariables';
import { VariableChange } from '../types';

export async function saveVariablesToGitHub(
  commitMessage: string
): Promise<void> {
  try {
    const variables = await figma.variables.getLocalVariables();
    await githubService.saveVariables(variables, commitMessage);
    figma.notify('Variables successfully saved to GitHub');
  } catch (error) {
    console.error('Error saving variables to GitHub:', error);
    figma.notify('Failed to save variables to GitHub', {
      error: true,
    });
    throw error;
  }
}

export async function pullVariablesFromGitHub(): Promise<
  VariableChange[]
> {
  try {
    const githubVariables = await githubService.fetchVariables();
    const currentVariables =
      await figma.variables.getLocalVariables();

    const changelog = compareVariables(
      currentVariables,
      githubVariables
    );
    return changelog;
  } catch (error) {
    console.error('Error pulling variables from GitHub:', error);
    figma.notify('Failed to pull variables from GitHub', {
      error: true,
    });
    throw error;
  }
}

export async function applyVariablesFromGitHub(): Promise<void> {
  try {
    const githubVariables = await githubService.fetchVariables();

    // Create a map of existing variables for quick lookup
    const existingVariables = new Map(
      (await figma.variables.getLocalVariables()).map((v) => [
        v.key,
        v,
      ])
    );

    for (const variable of githubVariables) {
      const existingVariable = existingVariables.get(variable.key);

      if (existingVariable) {
        // Update existing variable
        await figma.variables.getVariableById(existingVariable.id);
      } else {
        // Create new variable
        await figma.variables.createVariable(
          variable.name,
          variable.collectionId,
          variable.resolvedType
        );
      }
    }

    figma.notify('Variables successfully updated from GitHub');
  } catch (error) {
    console.error('Error applying variables from GitHub:', error);
    figma.notify('Failed to apply variables from GitHub', {
      error: true,
    });
    throw error;
  }
}

export async function getCommitHistory(
  limit: number = 10
): Promise<any[]> {
  try {
    return await githubService.getCommitHistory(
      'figma-variables.json',
      limit
    );
  } catch (error) {
    console.error('Error fetching commit history:', error);
    figma.notify('Failed to fetch commit history', { error: true });
    throw error;
  }
}
