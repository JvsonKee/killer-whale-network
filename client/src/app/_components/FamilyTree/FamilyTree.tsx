'use client';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Whale {
    whale_id: string,
    name: string,
    gender?: 'male' | 'female' | 'unknown',
    parent?: string,
    death_year?: number
}

interface FamilyTreeProps {
    familyData: Array<Whale>,
    currentWhale: string
}

export default function FamilyTree({ familyData, currentWhale }: FamilyTreeProps) {
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    const router = useRouter();

    const svgRef = useRef<SVGSVGElement>(null);

    const genderColours = d3.scaleOrdinal<string>()
        .domain(['male', 'female', 'unknown'])
        .range(['#389bff', '#e647ff', '#c6c6c6']);

    useEffect(() => {
        function handleResize() {
            const container = svgRef.current?.parentElement;

            if (container) {
                setDimensions({
                    width: container.clientWidth,
                    height: window.innerHeight * 0.85
                })
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!familyData.length) return;

        // Clear previous SVG content
        d3.select(svgRef.current).selectAll("*").remove();

        // Set up SVG dimensions
        const { width, height } = dimensions;

        // Create the root hierarchy
        const root = d3.stratify<Whale>()
            .id(d => d.whale_id)
            .parentId(d => d.parent)
            (familyData);

        const manyNodes = familyData.length > 12;

        // Create a tidy tree layout
        const treeLayout = d3.tree<Whale>()
            .nodeSize([manyNodes ? 30 : 45, width / (root.height + 1)]);

        const treeData = treeLayout(root);

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / ((root.height + 1) * 2)}, ${height / 2})`);

        // Create links between nodes
        const link = svg.selectAll(".link")
            .data(treeData.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("opacity", 0.6)
            .attr("stroke", "#ccc")
            .attr("stroke-width", 1)
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
            .attr("r", d => d.data.whale_id === currentWhale ? 10 : 9)
            .attr("fill", d => d.data.whale_id === currentWhale ? '#B2FF6F' : genderColours(d.data.gender))
            .attr("fill-opacity", 0.7)
            .attr("stroke", d => d.data.whale_id === currentWhale ? '#B2FF6F' : genderColours(d.data.gender))
            .attr("stroke-width", 3)
            .attr("opacity", d => d.data.death_year ? 0.3 : 1)
            .style("cursor", "pointer")
            .on('click', (_, d) => {
                router.push(`/whales/${d.data.whale_id}`)
            })

        // Add text for the whale_id inside the circle
        node.append("text")
            .attr("dy", 2.5)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .attr("font-size", 8)
            .text(d => d.data.whale_id)
            .style("pointer-events", "none");

        // Add text beside the node for the whale name
        node.append("text")
            .attr("x", -15)
            .attr("dy", 4)
            .attr("font-size", 10)
            .attr("fill", "#fff")
            .attr("text-anchor", "end")
            .attr("paint-order", "stroke")
            .attr("stroke", "#303030")
            .attr("stroke-width", 3)
            .text(d => d.data.name);

    }, [familyData, dimensions, currentWhale, genderColours, router]);

    return <svg className='bg-blue' ref={svgRef}></svg>;
}
