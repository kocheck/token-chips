import React from 'react';

interface StatusMessageProps {
  message: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
}) => <div className="status-message">{message}</div>;
