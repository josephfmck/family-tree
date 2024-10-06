'use client';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { nodes as importedNodes, links as importedLinks } from '../data/data';

interface Node {
  id: string;
  name?: string;
  x: number;
  y: number;
  type: 'person' | 'marriage';
}

interface PersonNode extends Node {
  name: string;
  type: 'person';
}

interface Link {
  source: Node;
  target: Node;
  relationship: string;
}

const FamilyTree = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const initVisualization = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      d3.select(svgElement).attr('width', width).attr('height', height);

      d3.select(svgElement).selectAll('*').remove();

      d3.select(svgElement)
        .append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#333333');

      // Map node IDs to nodes
      const nodeById: Record<string, Node> = {};

      // Define levels (generations)
      const levels = [
        ['10', '11'], // Great-Grandparents
        ['6', '7', '8', '9'], // Grandparents / Siblings of Grandparents
        ['1', '2', '12', '13'], // Parents / Cousins
        ['3', '4', '5'], // Children
      ];

      // Assign positions to nodes
      const levelHeight = height / (levels.length + 1);

      levels.forEach((levelIds, i) => {
        const y = (i + 1) * levelHeight;
        const spacing = width / (levelIds.length + 1);
        levelIds.forEach((id, j) => {
          const x = (j + 1) * spacing;
          const node = importedNodes.find((n) => n.id === id);
          if (node) {
            node.x = x;
            node.y = y;
            nodeById[id] = node as Node;
          }
        });
      });

      // Position marriage nodes between partners
      importedNodes.forEach((node) => {
        if (node.type === 'marriage') {
          const partners = importedLinks
            .filter(
              (link) =>
                link.targetId === node.id && link.relationship === 'Spouse'
            )
            .map((link) => nodeById[link.sourceId]);

          if (partners.length === 2) {
            node.x = (partners[0].x + partners[1].x) / 2;
            node.y = partners[0].y + 20;
          } else {
            node.x = width / 2;
            node.y = height / 2;
          }
          nodeById[node.id] = node as Node;
        }
      });

      const nodes: Node[] = importedNodes.map((n) => nodeById[n.id]);

      // Map links to include source and target nodes
      const links: Link[] = importedLinks
        .map((l) => {
          const sourceNode = nodeById[l.sourceId];
          const targetNode = nodeById[l.targetId];
          return sourceNode && targetNode
            ? {
                source: sourceNode,
                target: targetNode,
                relationship: l.relationship,
              }
            : null;
        })
        .filter((l): l is Link => l !== null);

      const colorScale = d3
        .scaleOrdinal<string>()
        .domain([
          'Parent',
          'Sibling',
          'Spouse',
          'Grandparent',
          'Aunt/Uncle',
          'Cousin',
        ])
        .range([
          '#ff0000',
          '#0000ff',
          '#00ff00',
          '#ff9900',
          '#ff00ff',
          '#00ffff',
        ]);

      const tooltip = d3
        .select('#tooltip-container')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      // Use d3.linkVertical() to create curved links
      const linkGenerator = d3
        .linkVertical<any, any>()
        .x((d) => d.x)
        .y((d) => d.y);

      // Add links
      const link = d3
        .select(svgElement)
        .append('g')
        .attr('class', 'links')
        .selectAll('path')
        .data(links)
        .enter()
        .append('path')
        .attr('d', (d) =>
          linkGenerator({ source: d.source, target: d.target })
        )
        .attr('stroke-width', 2)
        .attr('stroke', (d: Link) => colorScale(d.relationship))
        .attr('fill', 'none');

      // Add relationship labels
      d3.select(svgElement)
        .append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(links)
        .enter()
        .append('text')
        .attr('x', (d: Link) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: Link) => (d.source.y + d.target.y) / 2)
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.35em')
        .attr('fill', 'white')
        .text((d: Link) => d.relationship);

      const personNodes = nodes.filter(
        (node): node is PersonNode => node.type === 'person'
      );

      // Add person nodes
      d3.select(svgElement)
        .append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(personNodes)
        .enter()
        .append('circle')
        .attr('cx', (d: PersonNode) => d.x)
        .attr('cy', (d: PersonNode) => d.y)
        .attr('r', 25)
        .attr('fill', '#69b3a2')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5);

      // Add labels for person nodes
      d3.select(svgElement)
        .append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(personNodes)
        .enter()
        .append('text')
        .attr('x', (d: PersonNode) => d.x)
        .attr('y', (d: PersonNode) => d.y - 35)
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('fill', 'white')
        .text((d: PersonNode) => d.name);

      // Tooltip interactions
      link
        .on('mouseover', (event: any, d: Link) => {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip
            .html(`Relationship: ${d.relationship}`)
            .style('left', event.pageX + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', () => {
          tooltip.transition().duration(500).style('opacity', 0);
        });
    };

    initVisualization();

    function handleResize() {
      initVisualization();
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div id="tooltip-container" style={{ position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100vh' }}></svg>
    </div>
  );
};

export default FamilyTree;
