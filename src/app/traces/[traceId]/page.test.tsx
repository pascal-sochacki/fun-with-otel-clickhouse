import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TraceViewer from "./TraceView";

describe("Page", () => {
  it("renders a root", () => {
    render(
      <TraceViewer
        spans={[
          {
            ParentSpanId: "root",
            SpanName: "Not",
            TraceId: "",
            SpanId: "child2",
          },
          {
            ParentSpanId: "",
            SpanName: "Root Span",
            TraceId: "",
            SpanId: "root",
          },
          {
            ParentSpanId: "root",
            SpanName: "Not",
            TraceId: "",
            SpanId: "child1",
          },
        ]}
      />,
    );

    const root = screen.getByTestId("depth-0");

    expect(root).toBeInTheDocument();
    expect(root).toHaveTextContent("Root Span");

    const children = screen.getAllByTestId("depth-1");
    expect(children).toHaveLength(2);
  });
});
