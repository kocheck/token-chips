import React from 'react';
import { VariableChange } from '../../types';

interface ChangelogProps {
  changes: VariableChange[];
}

export const Changelog: React.FC<ChangelogProps> = ({ changes }) => (
  <div className="changelog">
    <h2>Changelog</h2>
    <ul>
      {changes.map((change, index) => (
        <li key={index}>
          {change.type}: {change.variable.name}
        </li>
      ))}
    </ul>
  </div>
);
