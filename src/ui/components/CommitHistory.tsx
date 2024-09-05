import React from 'react';

interface CommitHistoryProps {
  history: any[];
}

export const CommitHistory: React.FC<CommitHistoryProps> = ({
  history,
}) => (
  <div className="commit-history">
    <ul>
      {history.map((commit, index) => (
        <li key={index}>
          {commit.message} - {commit.author} (
          {new Date(commit.date).toLocaleString()})
        </li>
      ))}
    </ul>
  </div>
);
