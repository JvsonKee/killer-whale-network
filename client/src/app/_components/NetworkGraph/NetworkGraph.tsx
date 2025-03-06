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
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        //const whales = data.whales.map(d => ({...d}));
        //const links = data.links.map(d => ({...d}));

        const { whales, links } = data;

        const width = 1200;
        const height = 800;

        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        const simulation = d3.forceSimulation<Node>(whales)
            .force('link', d3.forceLink<Node, Link>(links).id(d => d.whale_id).distance(2))
            .force('charge', d3.forceManyBody().strength(-75))
            .force("x", d3.forceX(width / 2))
            .force("y", d3.forceY(height / 2));

        const link = svg.append('g')
            .attr('stroke', '#aaa')
            .selectAll<SVGLineElement, Link>('line')
            .data(links)
            .join('line');

        const node = svg.append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll<SVGCircleElement, Node>('circle')
            .data(whales, d => d.whale_id)
            .join('circle')
            .attr('r', 6)
            .attr('fill', 'teal')
            .call(drag(simulation));

        const text = svg.append('g')
            .selectAll<SVGTextElement, Node>('text')
            .data(whales, d => d.whale_id)
            .join('text')
            .text(d => d.whale_id)
            .attr('font-size', 12)
            .attr('dx', 14)
            .attr('dy', '.35em');

        simulation.on('tick', () => {
            link
                .attr('x1', d => (d.source as Node).x!)
                .attr('y1', d => (d.source as Node).y!)
                .attr('x2', d => (d.target as Node).x!)
                .attr('y2', d => (d.target as Node).y!);


            node
                .attr("cx", d => d.x!)
                .attr("cy", d => d.y!);

            text
                .attr('x', d => d.x!)
                .attr('y', d => d.y!);
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

    return <svg ref={svgRef}></svg>
}
