import {
  saveVariablesToGitHub,
  pullVariablesFromGitHub,
  applyVariablesFromGitHub,
  getCommitHistory,
} from './services/figmaService';

figma.showUI(__html__, { width: 300, height: 500 });

figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'save-variables':
        await saveVariablesToGitHub(msg.commitMessage);
        figma.ui.postMessage({ type: 'save-complete' });
        break;

      case 'pull-variables':
        const changelog = await pullVariablesFromGitHub();
        figma.ui.postMessage({ type: 'changelog', changelog });
        break;

      case 'apply-variables':
        await applyVariablesFromGitHub();
        figma.ui.postMessage({ type: 'apply-complete' });
        break;

      case 'get-commit-history':
        const history = await getCommitHistory(msg.limit);
        figma.ui.postMessage({ type: 'commit-history', history });
        break;

      case 'get-current-variables':
        const currentVariables =
          await figma.variables.getLocalVariables();
        figma.ui.postMessage({
          type: 'current-variables',
          variables: currentVariables,
        });
        break;

      default:
        console.error('Unknown message type:', msg.type);
    }
  } catch (error) {
    console.error('Error in main.ts:', error);
    figma.ui.postMessage({
      type: 'error',
      message: (error as Error).message,
    });
  }
};

// Notify the UI that the plugin has finished loading
figma.ui.postMessage({ type: 'plugin-loaded' });
