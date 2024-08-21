"use client";
import React from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { HeatmapRect } from "@visx/heatmap";

interface Bins {
  time: string;
  bins: Bin[];
}

interface Bin {
  bin: string;
  count: number;
}
const cool1 = "#122549";
const cool2 = "#b4fbde";
export const background = "#28272c";

// SELECT roundDown(Duration, [10000,20000,30000]), toStartOfMinute(Timestamp) as Time, count(*) FROM otel_traces GROUP by ALL ORDER BY Time;

function max<Datum>(data: Datum[], value: (d: Datum) => number): number {
  return Math.max(...data.map(value));
}
// accessors
const bins = (d: Bins) => d.bins;
const count = (d: Bin) => d.count;

export type HeatmapProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  separation?: number;
  events?: boolean;
};

const defaultMargin = { top: 10, left: 10, right: 10, bottom: 10 };

function HeatMap({
  width,
  height,
  events = false,
  margin = defaultMargin,
}: HeatmapProps) {
  // bounds

  const binData: Bins[] = [
    {
      time: "gestern",
      bins: [
        { bin: "12", count: 1 },
        { bin: "13", count: 1 },
      ],
    },
    {
      time: "heute",
      bins: [
        { bin: "12", count: 1 },
        { bin: "13", count: 2 },
      ],
    },
    {
      time: "morgen",
      bins: [
        { bin: "14", count: 4 },
        { bin: "12", count: 1 },
        { bin: "13", count: 3 },
      ],
    },
  ];

  const colorMax = max(binData, (d) => max(bins(d), count));
  const bucketSizeMax = max(binData, (d) => bins(d).length);

  // scales
  const xScale = scaleLinear<number>({
    domain: [0, binData.length],
  });
  const yScale = scaleLinear<number>({
    domain: [0, bucketSizeMax],
  });
  const rectColorScale = scaleLinear<string>({
    range: [cool1, cool2],
    domain: [0, colorMax],
  });
  const opacityScale = scaleLinear<number>({
    range: [0.1, 1],
    domain: [0, colorMax],
  });
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.bottom - margin.top;

  const binWidth = xMax / binData.length;
  const binHeight = yMax / bucketSizeMax;

  xScale.range([0, xMax]);
  yScale.range([0, yMax]);

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={14}
        fill={background}
      />

      <Group top={margin.top} left={margin.left}>
        <HeatmapRect<Bins, Bin>
          data={binData}
          xScale={(d) => xScale(d)}
          yScale={(d) => yScale(d)}
          colorScale={rectColorScale}
          opacityScale={opacityScale}
          binWidth={binWidth}
          binHeight={binHeight}
          gap={2}
        >
          {(heatmap) =>
            heatmap.map((heatmapBins) =>
              heatmapBins.map((bin) => (
                <rect
                  key={`heatmap-rect-${bin.row}-${bin.column}`}
                  className="visx-heatmap-rect"
                  width={bin.width}
                  height={bin.height}
                  x={bin.x}
                  y={bin.y}
                  fill={bin.color}
                  fillOpacity={bin.opacity}
                  onClick={() => {
                    if (!events) return;
                    const time = bin.datum.time;
                    const count = bin.bin.count;
                    alert(JSON.stringify({ time, count }));
                  }}
                />
              )),
            )
          }
        </HeatmapRect>
      </Group>
    </svg>
  );
}

export default HeatMap;
