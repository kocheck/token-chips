import React, { useState } from 'react';

interface CommitMessageProps {
  onCommit: (message: string) => void;
  disabled: boolean;
}

export const CommitMessage: React.FC<CommitMessageProps> = ({
  onCommit,
  disabled,
}) => {
  const [message, setMessage] = useState('');

  return (
    <div className="commit-message">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Commit message"
        disabled={disabled}
      />
      <button
        onClick={() => onCommit(message)}
        disabled={disabled || !message}
      >
        Save to GitHub
      </button>
    </div>
  );
};
