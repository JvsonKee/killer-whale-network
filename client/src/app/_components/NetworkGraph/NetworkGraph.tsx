"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Whale } from "@/app/types/whale";
import { Node } from "@/app/types/node";
import { Link } from "@/app/types/link";
import { useRouter } from "next/navigation";

interface NetworkGraphProps {
  data: {
    whales: Whale[];
    links: Link[];
    activeColour: string;
  };
}

export default function NetworkGraph({ data }: NetworkGraphProps) {
  const filterColour: string = data.activeColour;
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);

  const router = useRouter();

  const genderColours = d3
    .scaleOrdinal<string>()
    .domain(["male", "female", "unknown"])
    .range(["#389bff", "#e647ff", "#c6c6c6"]);

  const podColours = d3
    .scaleOrdinal<string>()
    .domain(["J", "K", "L"])
    .range(["#DC9FFF", "#FFAB81", "#ADDAFF"]);

  useEffect(() => {
    const width = 900;
    const height = 900;

    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    const { whales, links } = data;

    const manyNodes = whales.length > 99;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.selectAll("*").remove();

    svg
      .append("defs")
      .selectAll("marker")
      .data(links)
      .join("marker")
      .attr("id", (_, i) => `arrowhead-${i}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 9)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", manyNodes ? 5 : 4)
      .attr("markerHeight", manyNodes ? 7 : 6)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", (d) => {
        const node = whales.find((whale) => whale.whale_id === d.target);
        return getNodeColor(node, filterColour);
      });

    const distance = manyNodes ? 43 : 70;
    const forceStrength = manyNodes ? -75 : -200;

    const simulation = d3
      .forceSimulation<Node>(whales)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(links)
          .id((d) => d.whale_id)
          .distance(distance),
      )
      .force("charge", d3.forceManyBody().strength(forceStrength))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    simulationRef.current = simulation;

    const link = svg
      .append("g")
      .attr("stroke-width", manyNodes ? 1 : 1.75)
      .attr("opacity", 0.6)
      .attr("fill", "none")
      .selectAll<SVGPathElement, Link>("path")
      .data(links, (d) => {
        return typeof d.target === "string" ? d.target : d.target.whale_id;
      })
      .join("path")
      .attr("stroke", (d) => {
        const targetId =
          typeof d.target === "string" ? d.target : d.target.whale_id;
        const node = whales.find((whale) => whale.whale_id === targetId);
        return getNodeColor(node, filterColour);
      })
      .attr("marker-end", (_, i) => `url(#arrowhead-${i})`);

    const nodeGroup = svg
      .append("g")
      .selectAll<SVGElement, Node>("g")
      .data(whales, (d) => d.whale_id)
      .join("g")
      .call(drag(simulation));

    nodeGroup
      .append("circle")
      .attr("r", manyNodes ? 9 : 15)
      .attr("fill", (d) => getNodeColor(d, filterColour))
      .attr("fill-opacity", 0.7)
      .attr("stroke", (d) => getNodeColor(d, filterColour))
      .attr("stroke-width", 3)
      .attr("opacity", (d) => (d.death_year ? 0.3 : 1))
      .style("cursor", "pointer")
      .on("click", (_, d) => {
        router.push(`/whales/${d.whale_id}`);
      });

    nodeGroup
      .append("text")
      .text((d) => d.whale_id)
      .attr("font-size", manyNodes ? 8 : 10)
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("dy", 2.5)
      .style("pointer-events", "none");

    if (!manyNodes) {
      nodeGroup
        .append("text")
        .text((d) => d.name)
        .attr("font-size", 10)
        .attr("fill", "white")
        .attr("x", 19)
        .attr("dy", 2.5)
        .style("pointer-events", "none");
    }

    simulation.on("tick", () => {
      link.attr("d", (d) => {
        const sourceX = (d.source as Node).x!;
        const sourceY = (d.source as Node).y!;
        const targetX = (d.target as Node).x!;
        const targetY = (d.target as Node).y!;

        // Midpoint between source and target
        const midX = (sourceX + targetX) / 2;
        const midY = (sourceY + targetY) / 2;

        // Offset for the curve control point
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const normal = { x: -dy, y: dx }; // perpendicular direction
        const curveStrength = manyNodes ? 5 : 3; // play with this number
        const normalLength = Math.sqrt(normal.x ** 2 + normal.y ** 2);
        const offsetX = midX + (normal.x / normalLength) * curveStrength;
        const offsetY = midY + (normal.y / normalLength) * curveStrength;

        const gap = manyNodes ? 12 : 20; // The gap size
        const gapOffsetX1 = sourceX + (dx / Math.sqrt(dx * dx + dy * dy)) * gap;
        const gapOffsetY1 = sourceY + (dy / Math.sqrt(dx * dx + dy * dy)) * gap;
        const gapOffsetX2 = targetX - (dx / Math.sqrt(dx * dx + dy * dy)) * gap;
        const gapOffsetY2 = targetY - (dy / Math.sqrt(dx * dx + dy * dy)) * gap;

        return `M${gapOffsetX1},${gapOffsetY1} Q${offsetX},${offsetY} ${gapOffsetX2},${gapOffsetY2}`;
      });

      link.attr("stroke", (d) => {
        const targetId =
          typeof d.target === "string" ? d.target : d.target.whale_id;
        const node = whales.find((whale) => whale.whale_id === targetId);
        return getNodeColor(node, filterColour);
      });

      link.attr("marker-end", (_, i) => `url(#arrowhead-${i})`);

      svg
        .selectAll("marker path")
        .data(links)
        .attr("fill", (d) => {
          const targetId =
            typeof d.target === "string" ? d.target : d.target.whale_id;
          const node = whales.find((whale) => whale.whale_id === targetId);
          return getNodeColor(node, filterColour);
        });

      nodeGroup.attr(
        "transform",
        (d) => `translate(${(d as Node).x},${(d as Node).y})`,
      );
    });

    function drag(simulation: d3.Simulation<Node, Link>) {
      function dragstarted(
        event: d3.D3DragEvent<SVGElement, Node, unknown>,
        d: Node,
      ) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(
        event: d3.D3DragEvent<SVGElement, Node, unknown>,
        d: Node,
      ) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(
        event: d3.D3DragEvent<SVGElement, Node, unknown>,
        d: Node,
      ) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag<SVGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }, [data]);

  function getNodeColor(d: Node | undefined, filter: string) {
    if (!d) return "white";

    switch (filter) {
      case "gender":
        return genderColours(d.gender);
      case "pod":
        return podColours(d.pod_id);
      default:
        return "white";
    }
  }

  return (
    <div className="flex align-center justify-center w-full h-100vh">
      <svg ref={svgRef}></svg>
    </div>
  );
}
