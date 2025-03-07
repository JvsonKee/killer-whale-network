import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Whale } from '@/app/types/whale';
import { Node } from '@/app/types/node';
import { Link } from '@/app/types/link';

interface NetworkGraphProps {
    data: {
        whales: Whale[],
        links: Link[]
    }
}

export default function NetworkGraph({ data } : NetworkGraphProps) {
    const filter : string = 'pod';
    const svgRef = useRef<SVGSVGElement>(null);

    const genderColors = d3.scaleOrdinal<string>()
        .domain(['male', 'female', 'unknown'])
        .range(['#389bff', '#e647ff', '#c6c6c6']);

    const podColors = d3.scaleOrdinal<string>()
        .domain(['J', 'K', 'L'])
        .range(['#cab6ff', '#ffb297', '#addaff'])

    useEffect(() => {
        const whales = data.whales.map(d => ({...d}));
        const links = data.links.map(d => ({...d}));

        const width = 1400;
        const height = 1200;

        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        svg.append('defs')
            .selectAll('marker')
            .data(links)
            .join('marker')
            .attr('id', (_, i) => `arrowhead-${i}`)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 9) // space from the arrow to the end of the link
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 6)
            .attr('markerHeight', 8)
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5') // Create the arrow shape
            .attr('fill', d => {
                const node = whales.find(whale => whale.whale_id === d.target);
                return getNodeColor(node, filter);
            }); // Color of the arrowhead

        const simulation = d3.forceSimulation<Node>(whales)
            .force('link', d3.forceLink<Node, Link>(links).id(d => d.whale_id).distance(50))
            .force('charge', d3.forceManyBody().strength(-100))
            .force("x", d3.forceX(width / 2))
            .force("y", d3.forceY(height / 2));

        const link = svg.append('g')
            .attr('stroke-width', 1)
            .attr('opacity', 0.6)
            .attr('fill', 'none')
            .selectAll<SVGPathElement, Link>('path')
            .data(links)
            .join('path')
            .attr('stroke', d => getNodeColor(d.target, filter))
            .attr('marker-end', (_, i) => `url(#arrowhead-${i})`);

        const node = svg.append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll<SVGCircleElement, Node>('circle')
            .data(whales, d => d.whale_id)
            .join('circle')
            .attr('r', 8)
            .attr('fill', d => getNodeColor(d, filter))
            .attr('fill-opacity', 0.7)
            .attr('stroke', d => getNodeColor(d, filter))
            .attr('stroke-width', 3)
            .call(drag(simulation));

        const text = svg.append('g')
            .selectAll<SVGTextElement, Node>('text')
            .data(whales, d => d.whale_id)
            .join('text')
            .text(d => d.whale_id)
            .attr('font-size', 12)
            .attr('fill', "white")
            .attr('dx', 14)
            .attr('dy', '.35em');

        simulation.on('tick', () => {
            link.attr('d', d => {
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
                const curveStrength = 3; // play with this number
                const normalLength = Math.sqrt(normal.x ** 2 + normal.y ** 2);
                const offsetX = midX + (normal.x / normalLength) * curveStrength;
                const offsetY = midY + (normal.y / normalLength) * curveStrength;

                const gap = 12; // The gap size
                const gapOffsetX1 = sourceX + (dx / Math.sqrt(dx * dx + dy * dy)) * gap;
                const gapOffsetY1 = sourceY + (dy / Math.sqrt(dx * dx + dy * dy)) * gap;
                const gapOffsetX2 = targetX - (dx / Math.sqrt(dx * dx + dy * dy)) * gap;
                const gapOffsetY2 = targetY - (dy / Math.sqrt(dx * dx + dy * dy)) * gap;

                return `M${gapOffsetX1},${gapOffsetY1} Q${offsetX},${offsetY} ${gapOffsetX2},${gapOffsetY2}`;
            });

            node
                .attr("cx", d => (d as Node).x!)
                .attr("cy", d => (d as Node).y!);

            text
                .attr('x', d => (d as Node).x!)
                .attr('y', d => (d as Node).y!);
        });

        function drag(simulation: d3.Simulation<Node, Link>) {
            function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, unknown>, d: Node) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }

            function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, unknown>, d: Node) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, unknown>, d: Node) {
                if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }

            return d3.drag<SVGCircleElement, Node>()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        }

    }, [data]);

    function getNodeColor(d : Node, filter : string) { 
        switch(filter) {
            case 'gender': 
                return genderColors(d.gender);
            case 'pod':
                return podColors(d.pod_id);
            default:
                return "white";
        }
    }

    return <svg ref={svgRef}></svg>
}
