"use client";
import { useState } from "react";
import { type Span } from "~/app/page";
import { Temporal } from "@js-temporal/polyfill";

interface Node {
  value: Span;
  children: Node[];
}
export default function TraceViewer(props: { spans: Span[] }) {
  const childrenMap = new Map<string, Node[]>();
  for (const iterator of props.spans) {
    if (childrenMap.has(iterator.ParentSpanId)) {
      const list = childrenMap.get(iterator.ParentSpanId)!;
      list.push({ value: iterator, children: [] });
    } else {
      childrenMap.set(iterator.ParentSpanId, [
        { value: iterator, children: [] },
      ]);
    }
  }

  for (const iterator of childrenMap.keys()) {
    const list = childrenMap.get(iterator)!;
    const sorted = list.sort((a, b) => {
      const aDate = new Date(a.value.Timestamp);
      const bDate = new Date(b.value.Timestamp);
      return aDate.getTime() - bDate.getTime();
    });
    childrenMap.set(iterator, sorted);
  }

  const rootSpan = childrenMap.get("")![0]!.value;
  const root: Node = {
    value: rootSpan,
    children: [],
  };

  const workList = new Array<Node>();
  workList.push(root);
  while (workList.length > 0) {
    const current = workList.shift()!;
    const children = childrenMap.get(current.value.SpanId);
    current.children = children ?? [];
    workList.push(...current.children);
  }

  const start = Temporal.PlainDateTime.from(rootSpan.Timestamp);
  return (
    <div>
      <SpanDisplay
        start={start}
        node={root}
        depth={0}
        maxDuration={Number(rootSpan.Duration) * 1.01}
      />
    </div>
  );
}

function SpanDisplay(props: {
  depth: number;
  node: Node;
  maxDuration: number;
  start: Temporal.PlainDateTime;
}) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        key={props.node.value.SpanId}
        className="flex"
      >
        <div className="relative h-6 w-80">
          <SpanName depth={props.depth} node={props.node} />
        </div>
        <SpanBar
          node={props.node}
          start={props.start}
          maxDuration={props.maxDuration}
        />
      </div>

      {open ? (
        props.node.children.map((n) => (
          <SpanDisplay
            start={props.start}
            depth={props.depth + 1}
            node={n}
            key={n.value.SpanId}
            maxDuration={props.maxDuration}
          />
        ))
      ) : (
        <></>
      )}
    </>
  );
}

function SpanName(props: { depth: number; node: Node }) {
  return (
    <div
      ref={(node) => {
        if (node) {
          node.style.setProperty("left", `${props.depth * 20}px`);
        }
      }}
      data-testid={`depth-${props.depth}`}
      className={`absolute overflow-hidden text-nowrap`}
    >
      {props.node.value.SpanName}
    </div>
  );
}

function SpanBar(props: {
  node: Node;
  maxDuration: number;
  start: Temporal.PlainDateTime;
}) {
  const spanStart = Temporal.PlainDateTime.from(props.node.value.Timestamp);
  const durationSinceStart = spanStart.since(props.start);
  const nano = durationSinceStart.total({ unit: "nanoseconds" });

  return (
    <div className="relative w-full">
      <div
        className="absolute inset-y-1 rounded bg-blue-600"
        ref={(node) => {
          if (node) {
            node.style.setProperty(
              "left",
              `${(nano / props.maxDuration) * 100}%`,
            );
            node.style.setProperty(
              "width",
              `${(Number(props.node.value.Duration) / props.maxDuration) * 100}%`,
            );
          }
        }}
      ></div>
    </div>
  );
}
