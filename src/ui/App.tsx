import React, { useState, useEffect } from 'react';
import { Changelog } from './components/Changelog';
import { CommitMessage } from './components/CommitMessage';
import { StatusMessage } from './components/StatusMessage';
import { CommitHistory } from './components/CommitHistory';
import { VariableList } from './components/VariableList';
import { VariableChange } from '../types';

export function App() {
  const [changelog, setChangelog] = useState<VariableChange[]>([]);
  const [status, setStatus] = useState('');
  const [commitHistory, setCommitHistory] = useState<any[]>([]);
  const [currentVariables, setCurrentVariables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.onmessage = (event) => {
      const message = event.data.pluginMessage;
      setIsLoading(false);

      switch (message.type) {
        case 'save-complete':
          setStatus('Variables saved successfully');
          break;
        case 'changelog':
          setChangelog(message.changelog);
          break;
        case 'apply-complete':
          setStatus('Variables applied successfully');
          break;
        case 'commit-history':
          setCommitHistory(message.history);
          break;
        case 'current-variables':
          setCurrentVariables(message.variables);
          break;
        case 'error':
          setStatus(`Error: ${message.message}`);
          break;
        case 'plugin-loaded':
          handleGetCurrentVariables();
          handleGetCommitHistory();
          break;
      }
    };
  }, []);

  const handleSaveVariables = (commitMessage: string) => {
    setIsLoading(true);
    parent.postMessage(
      { pluginMessage: { type: 'save-variables', commitMessage } },
      '*'
    );
  };

  const handlePullVariables = () => {
    setIsLoading(true);
    parent.postMessage(
      { pluginMessage: { type: 'pull-variables' } },
      '*'
    );
  };

  const handleApplyVariables = () => {
    setIsLoading(true);
    parent.postMessage(
      { pluginMessage: { type: 'apply-variables' } },
      '*'
    );
  };

  const handleGetCommitHistory = () => {
    setIsLoading(true);
    parent.postMessage(
      { pluginMessage: { type: 'get-commit-history', limit: 10 } },
      '*'
    );
  };

  const handleGetCurrentVariables = () => {
    setIsLoading(true);
    parent.postMessage(
      { pluginMessage: { type: 'get-current-variables' } },
      '*'
    );
  };

  return (
    <div className="app">
      <h1>Figma GitHub Variables Sync</h1>

      <div className="actions">
        <button
          onClick={() => handlePullVariables()}
          disabled={isLoading}
        >
          Pull from GitHub
        </button>
        <button
          onClick={() => handleApplyVariables()}
          disabled={isLoading}
        >
          Apply Variables
        </button>
        <CommitMessage
          onCommit={handleSaveVariables}
          disabled={isLoading}
        />
      </div>

      <StatusMessage message={status} />

      {isLoading && <div className="loading">Loading...</div>}

      <Changelog changes={changelog} />

      <h2>Current Variables</h2>
      <VariableList variables={currentVariables} />

      <h2>Commit History</h2>
      <CommitHistory history={commitHistory} />
    </div>
  );
}
