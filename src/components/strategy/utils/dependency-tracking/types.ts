
export interface UsageReference {
  nodeId: string;
  nodeName: string; // Display name of the node
  nodeType: string;
  context: string; // Where in the node it's used (e.g., "condition", "action")
}
