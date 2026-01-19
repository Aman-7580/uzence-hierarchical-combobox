import { useCallback, useState } from "react";
import { TreeNodeWithState } from "./types";
import { LoadChildrenFn } from "./utils";
import {
  getDescendants,
  updateParentSelection,
} from "./utils";

export function useTreeState(loadChildren: LoadChildrenFn) {
  const [nodes, setNodes] = useState<Record<string, TreeNodeWithState>>({});
  const [rootIds, setRootIds] = useState<string[]>([]);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  // Load root nodes (parentId = null)
  const loadRoot = useCallback(async () => {
    const children = await loadChildren(null);

    const nextNodes: Record<string, TreeNodeWithState> = {};
    const ids: string[] = [];

    for (const child of children) {
      nextNodes[child.id] = {
        ...child,
        depth: 0,
        parentId: null,
        isExpanded: false,
        isSelected: false,
        isIndeterminate: false,
      };
      ids.push(child.id);
    }

    setNodes(nextNodes);
    setRootIds(ids);
  }, [loadChildren]);

  // Expand / collapse a node (async children loading)
  const toggleExpand = useCallback(
    async (id: string) => {
      const node = nodes[id];
      if (!node || !node.hasChildren) return;

      // Collapse
      if (node.isExpanded) {
        setNodes((prev) => ({
          ...prev,
          [id]: { ...prev[id], isExpanded: false },
        }));
        return;
      }

      // Prevent duplicate loads
      if (loadingIds.has(id)) return;

      setLoadingIds((prev) => new Set(prev).add(id));

      const children = await loadChildren(id);

      setNodes((prev) => {
        const updated = { ...prev };

        updated[id] = {
          ...updated[id],
          isExpanded: true,
        };

        for (const child of children) {
          if (updated[child.id]) continue;

          updated[child.id] = {
            ...child,
            depth: updated[id].depth + 1,
            parentId: id,
            isExpanded: false,
            isSelected: false,
            isIndeterminate: false,
          };
        }

        return updated;
      });

      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [nodes, loadChildren, loadingIds]
  );

  // Select / unselect node with indeterminate propagation
  const toggleSelect = useCallback((id: string) => {
    setNodes((prev) => {
      const next = { ...prev };
      const node = next[id];
      if (!node) return prev;

      const shouldSelect = !node.isSelected;

      // Update current node
      next[id] = {
        ...node,
        isSelected: shouldSelect,
        isIndeterminate: false,
      };

      // Update all descendants
      const descendants = getDescendants(next, id);
      descendants.forEach((child) => {
        next[child.id] = {
          ...child,
          isSelected: shouldSelect,
          isIndeterminate: false,
        };
      });

      // Update parents
      updateParentSelection(next, id);

      return next;
    });
  }, []);

  return {
    nodes,
    rootIds,
    loadingIds,
    loadRoot,
    toggleExpand,
    toggleSelect,
  };
}
