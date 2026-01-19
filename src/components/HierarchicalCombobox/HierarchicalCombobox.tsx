import { useEffect, useRef, useState } from "react";
import { useTreeState } from "./hooks";
import {
  flattenVisibleNodes,
  getVirtualRange,
  mockLoadChildren,
} from "./utils";

const ROW_HEIGHT = 36;
const CONTAINER_HEIGHT = 240;

export function HierarchicalCombobox() {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const {
    nodes,
    rootIds,
    loadRoot,
    toggleExpand,
    toggleSelect,
  } = useTreeState(mockLoadChildren);


  useEffect(() => {
    loadRoot();
  }, [loadRoot]);

  const flatNodes = flattenVisibleNodes(nodes, rootIds);

  
  const virtualRange = getVirtualRange(
    scrollTop,
    CONTAINER_HEIGHT,
    ROW_HEIGHT,
    flatNodes.length
  );

  const visibleNodes = flatNodes.slice(
    virtualRange.startIndex,
    virtualRange.endIndex + 1
  );

  return (
    <div
  role="combobox"
  aria-expanded="true"
  aria-haspopup="tree"
  className="w-80 border rounded-md bg-white text-sm shadow-sm"
>


      <div className="px-3 py-2 border-b font-medium">
        Select items
      </div>

      <div
  ref={containerRef}
  className="relative h-60 overflow-auto outline-none"
  tabIndex={0}
  role="tree"
  aria-multiselectable="true"
  onKeyDown={(e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) =>
        Math.min(i + 1, flatNodes.length - 1)
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) =>
        Math.max(i - 1, 0)
      );
    }

    const node = flatNodes[focusedIndex];
    if (!node) return;

    if (e.key === "ArrowRight" && node.hasChildren) {
      e.preventDefault();
      toggleExpand(node.id);
    }

    if (e.key === "ArrowLeft" && node.isExpanded) {
      e.preventDefault();
      toggleExpand(node.id);
    }

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggleSelect(node.id);
    }
  }}
  onScroll={(e) =>
    setScrollTop(e.currentTarget.scrollTop)
  }
>

      
        <div
          className="relative"
          style={{
            height: flatNodes.length * ROW_HEIGHT,
          }}
        >
          {visibleNodes.map((node) => {
            const index = flatNodes.indexOf(node);
            const top = index * ROW_HEIGHT;

            return (
              <div
                key={node.id}
                role="treeitem"
                aria-level={node.depth + 1}
                className={`absolute left-0 right-0 flex items-center px-2 cursor-pointer select-none
  ${
    flatNodes.indexOf(node) === focusedIndex
      ? "bg-blue-100"
      : "hover:bg-gray-100"
  }
`}
aria-selected={node.isSelected}

                style={{
                  top,
                  height: ROW_HEIGHT,
                  paddingLeft: node.depth * 16 + 8,
                }}
              >
                
                {node.hasChildren && (
                  <button
                    type="button"
                    className="mr-1 w-4 text-center"
                    onClick={() => toggleExpand(node.id)}
                    aria-label={
                      node.isExpanded
                        ? "Collapse"
                        : "Expand"
                    }
                  >
                    {node.isExpanded ? "▾" : "▸"}
                  </button>
                )}

              
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={node.isSelected}
                  ref={(el) => {
                    if (el) {
                      el.indeterminate =
                        node.isIndeterminate;
                    }
                  }}
                  onChange={() =>
                    toggleSelect(node.id)
                  }
                />

                
                <span>{node.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
