import React from 'react';

interface VariableListProps {
  variables: any[];
}

export const VariableList: React.FC<VariableListProps> = ({
  variables,
}) => (
  <div className="variable-list">
    <ul>
      {variables.map((variable, index) => (
        <li key={index}>
          {variable.name}: {variable.value}
        </li>
      ))}
    </ul>
  </div>
);
