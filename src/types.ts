export interface VariableChange {
  type: 'added' | 'modified' | 'deleted';
  variable: any; // Replace 'any' with a more specific type for Figma variables
}
