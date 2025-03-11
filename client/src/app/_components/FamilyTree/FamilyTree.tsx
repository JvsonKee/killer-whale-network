'use client';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

interface FamilyTreeProps {
    familyData: {
        whale_id: string,
        name: string,
        parent?: string,
        children?: Array<Object>
    }[]
}

export default function FamilyTree({ familyData }: FamilyTreeProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!familyData.length) return;

        // Clear previous SVG content
        d3.select(svgRef.current).selectAll("*").remove();

        // Set up SVG dimensions
        const width = 800;
        const height = 600;

        console.log({familyData})

        // Create the root hierarchy
        const root = d3.stratify()
            .id(d => d.whale_id)
            .parentId(d => d.parent)
            (familyData);

        // Create a tidy tree layout
        const treeLayout = d3.tree().size([height, width - 200]);
        const treeData = treeLayout(root);

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(100, 20)");

        // Create links between nodes
        const link = svg.selectAll(".link")
            .data(treeData.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 2)
            .attr("d", d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x)
            );

        // Create nodes
        const node = svg.selectAll(".node")
            .data(treeData.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.y},${d.x})`);

        // Add circles for each node (with whale_id inside)
        node.append("circle")
            .attr("r", 10)
            .attr("fill", "#69b3a2")
            .attr("stroke", "#000");

        // Add text for the whale_id inside the circle
        node.append("text")
            .attr("dy", 4)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .text(d => d.data.whale_id);

        // Add text beside the node for the whale name
        node.append("text")
            .attr("x", 15)
            .attr("dy", 4)
            .attr("text-anchor", "start")
            .attr("fill", "#000")
            .text(d => d.data.name);

    }, [familyData]);

    return <svg ref={svgRef}></svg>;
}
