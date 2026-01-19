import { TreeNodeWithState } from "./types";

export interface VirtualRange {
  startIndex: number;
  endIndex: number;
}

export function getVirtualRange(
  scrollTop: number,
  containerHeight: number,
  rowHeight: number,
  totalCount: number
): VirtualRange {
  const startIndex = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(containerHeight / rowHeight);

  return {
    startIndex: Math.max(0, startIndex - 2),
    endIndex: Math.min(totalCount - 1, startIndex + visibleCount + 2),
  };
}

export function flattenVisibleNodes(
  nodes: Record<string, TreeNodeWithState>,
  rootIds: string[]
): TreeNodeWithState[] {
  const result: TreeNodeWithState[] = [];

  function dfs(id: string) {
    const node = nodes[id];
    if (!node) return;

    result.push(node);

    if (node.isExpanded) {
      Object.values(nodes)
        .filter((n) => n.parentId === id)
        .forEach((child) => dfs(child.id));
    }
  }

  rootIds.forEach(dfs);

  return result;
}
export function getDescendants(
  nodes: Record<string, TreeNodeWithState>,
  id: string
): TreeNodeWithState[] {
  const result: TreeNodeWithState[] = [];

  function dfs(parentId: string) {
    Object.values(nodes)
      .filter((n) => n.parentId === parentId)
      .forEach((child) => {
        result.push(child);
        dfs(child.id);
      });
  }

  dfs(id);
  return result;
}

export function updateParentSelection(
  nodes: Record<string, TreeNodeWithState>,
  id: string
) {
  let current = nodes[id]?.parentId;

  while (current) {
    const siblings = Object.values(nodes).filter(
      (n) => n.parentId === current
    );

    const allSelected = siblings.every(
      (s) => s.isSelected
    );
    const noneSelected = siblings.every(
      (s) => !s.isSelected && !s.isIndeterminate
    );

    nodes[current] = {
      ...nodes[current],
      isSelected: allSelected,
      isIndeterminate: !allSelected && !noneSelected,
    };

    current = nodes[current].parentId;
  }
}

import { TreeNode } from "./types";

export type LoadChildrenFn = (
  parentId: string | null
) => Promise<TreeNode[]>;

export const mockLoadChildren: LoadChildrenFn = async (
  parentId
) => {
  await new Promise((res) => setTimeout(res, 500));

  if (parentId === null) {
    return [
      { id: "1", label: "Frontend", hasChildren: true },
      { id: "2", label: "Backend", hasChildren: true },
    ];
  }

  if (parentId === "1") {
    return [
      { id: "1-1", label: "React", hasChildren: false },
      { id: "1-2", label: "Vue", hasChildren: false },
    ];
  }

  if (parentId === "2") {
    return [
      { id: "2-1", label: "Node.js", hasChildren: false },
      { id: "2-2", label: "Django", hasChildren: false },
    ];
  }

  return [];
};
