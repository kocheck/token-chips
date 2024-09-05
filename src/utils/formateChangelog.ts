import { VariableChange } from '../types';

export function formatChangelog(changes: VariableChange[]): string {
  if (changes.length === 0) {
    return 'No changes detected.';
  }

  const sections: { [key: string]: string[] } = {
    added: [],
    modified: [],
    deleted: [],
  };

  changes.forEach((change) => {
    const { type, variable } = change;
    let message = `${variable.name} (${variable.id})`;

    switch (type) {
      case 'added':
        message += ` - New variable added`;
        break;
      case 'modified':
        message += ` - Variable modified`;
        break;
      case 'deleted':
        message += ` - Variable deleted`;
        break;
    }

    sections[type].push(message);
  });

  let formattedChangelog = '';

  for (const [sectionName, messages] of Object.entries(sections)) {
    if (messages.length > 0) {
      formattedChangelog += `\n${sectionName.toUpperCase()}:\n`;
      formattedChangelog += messages
        .map((msg) => `- ${msg}`)
        .join('\n');
      formattedChangelog += '\n';
    }
  }

  return formattedChangelog.trim();
}
