import { Fragment, useCallback, useMemo, useRef, useState, type KeyboardEvent, type ReactElement } from "react";
import { getProjectFile, projectFiles, projectTree, type ProjectTreeNode } from "../data/project";
import { TextWithTerms } from "./TextWithTerms";
import { CodeBlock } from "./CodeBlock";
import { Icon } from "./Icon";

type TreeBranchProps = {
  nodes: ProjectTreeNode[];
  ancestorsLast: boolean[];
  selectedPath: string;
  onSelect: (path: string) => void;
};

function collectFilePaths(nodes: ProjectTreeNode[] | undefined): string[] {
  if (!nodes) return [];
  const paths: string[] = [];
  for (const node of nodes) {
    if (node.children) paths.push(...collectFilePaths(node.children));
    else if (node.filePath) paths.push(node.filePath);
  }
  return paths;
}

function TreeGuides({ ancestorsLast, isLast }: { ancestorsLast: boolean[]; isLast: boolean }) {
  return (
    <span className="tree-guides" aria-hidden="true">
      {ancestorsLast.map((last, index) => (
        <Fragment key={index}>
          <span className="tree-gutter">{last ? " " : "│"}</span>
          <span className="tree-gutter"> </span>
          <span className="tree-gutter"> </span>
          <span className="tree-gutter"> </span>
        </Fragment>
      ))}
      <span className="tree-gutter">{isLast ? "└" : "├"}</span>
      <span className="tree-gutter">─</span>
      <span className="tree-gutter">─</span>
      <span className="tree-gutter"> </span>
    </span>
  );
}

function TreeLabel({
  node,
  kind,
}: {
  node: ProjectTreeNode;
  kind: "dir" | "file";
}) {
  return (
    <>
      <span className="tree-icon">
        <Icon name={kind === "dir" ? "folder" : "file"} size={14} />
      </span>
      <span className="tree-name">
        {node.name}
        {kind === "dir" ? "/" : ""}
      </span>
    </>
  );
}

function TreeBranch({ nodes, ancestorsLast, selectedPath, onSelect }: TreeBranchProps) {
  return (
    <>
      {nodes.map((node, index) => {
        const isLast = index === nodes.length - 1;
        return (
          <TreeNode
            key={`${ancestorsLast.length}-${node.name}-${index}`}
            node={node}
            ancestorsLast={ancestorsLast}
            isLast={isLast}
            selectedPath={selectedPath}
            onSelect={onSelect}
          />
        );
      })}
    </>
  );
}

function TreeNode({
  node,
  ancestorsLast,
  isLast,
  selectedPath,
  onSelect,
}: {
  node: ProjectTreeNode;
  ancestorsLast: boolean[];
  isLast: boolean;
  selectedPath: string;
  onSelect: (path: string) => void;
}): ReactElement {
  const guides = <TreeGuides ancestorsLast={ancestorsLast} isLast={isLast} />;

  if (node.children !== undefined) {
    return (
      <>
        <div className="tree-row tree-dir">
          {guides}
          <TreeLabel node={node} kind="dir" />
        </div>
        {node.children.length > 0 ? (
          <TreeBranch
            nodes={node.children}
            ancestorsLast={[...ancestorsLast, isLast]}
            selectedPath={selectedPath}
            onSelect={onSelect}
          />
        ) : null}
      </>
    );
  }

  if (node.filePath) {
    const active = selectedPath === node.filePath;
    return (
      <button
        type="button"
        className={`tree-row tree-file ${active ? "active" : ""}`}
        tabIndex={active ? 0 : -1}
        aria-current={active ? "true" : undefined}
        onClick={() => onSelect(node.filePath!)}
        title={node.filePath}
      >
        {guides}
        <TreeLabel node={node} kind="file" />
      </button>
    );
  }

  return (
    <div className="tree-row tree-file-dim">
      {guides}
      <TreeLabel node={node} kind="file" />
    </div>
  );
}

function ProjectTree({
  selectedPath,
  onSelect,
}: {
  selectedPath: string;
  onSelect: (path: string) => void;
}) {
  const listRef = useRef<HTMLElement>(null);
  const paths = useMemo(() => collectFilePaths(projectTree.children), []);
  const activeIndex = Math.max(0, paths.indexOf(selectedPath));

  const move = useCallback(
    (index: number) => {
      const next = paths[index];
      if (!next) return;
      onSelect(next);
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>(".tree-file");
      buttons?.[index]?.focus();
    },
    [onSelect, paths],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (paths.length === 0) return;
      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          move((activeIndex + 1) % paths.length);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          move((activeIndex - 1 + paths.length) % paths.length);
          break;
        case "Home":
          event.preventDefault();
          move(0);
          break;
        case "End":
          event.preventDefault();
          move(paths.length - 1);
          break;
        default:
          break;
      }
    },
    [activeIndex, move, paths.length],
  );

  return (
    <nav
      className="tree"
      aria-label="申請くんのディレクトリ"
      ref={listRef}
      onKeyDown={onKeyDown}
    >
      <div className="tree-row tree-root">
        <span className="tree-icon">
          <Icon name="folder" size={14} />
        </span>
        <span className="tree-name">{projectTree.name}/</span>
      </div>
      {projectTree.children ? (
        <TreeBranch nodes={projectTree.children} ancestorsLast={[]} selectedPath={selectedPath} onSelect={onSelect} />
      ) : null}
    </nav>
  );
}

export function ProjectExplorer() {
  const [selectedPath, setSelectedPath] = useState(projectFiles[0]?.path ?? "");
  const file = getProjectFile(selectedPath) ?? projectFiles[0];

  return (
    <section className="widget">
      <div className="widget-head">
        <div>
          <p className="kicker">SAMPLE APP</p>
          <strong>申請くん — ディレクトリ構成</strong>
        </div>
        <span className="tag">Maven + Spring Boot 2.7</span>
      </div>
      <div className="widget-body">
        <ProjectTree selectedPath={selectedPath} onSelect={setSelectedPath} />
        <div className="file-view widget-main">
          <p className="widget-path">{file.path}</p>
          <h3>{file.note}</h3>
          <p>
            <TextWithTerms text={file.why} />
          </p>
          <CodeBlock code={file.code} path={file.path} title="抜粋" />
        </div>
      </div>
    </section>
  );
}
