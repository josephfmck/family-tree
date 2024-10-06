'use client';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3'; // D3.js library
import { nodes as importedNodes, links as importedLinks } from '@/data/data'; // Import data

// Define the Node interface
interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'person';
}

// Adjust the Link interface to allow source to be a Node or a point
interface Link {
  source: Node | { x: number; y: number }; // Source can be a node or a midpoint
  target: Node;
  relationship: string;
}

const FamilyTree = () => {
  const svgRef = useRef<SVGSVGElement | null>(null); // Reference to the SVG element

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const initVisualization = () => {
      // Set dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Initialize the SVG canvas
      d3.select(svgElement).attr('width', width).attr('height', height);
      d3.select(svgElement).selectAll('*').remove();

      // Add background
      d3.select(svgElement)
        .append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#333333');

      // Map node IDs to nodes for easy lookup
      const nodeById: Record<string, Node> = {};

      // Define levels (generations) with the desired ordering
      const levels = [
        ['10', '11'], // Great-Grandparents
        ['6', '7'],   // Grandparents
        ['2', '1', '8', '9'], // Parents and Siblings
        ['3', '4', '5', '12', '13'], // Children
      ];

      // Assign positions to nodes based on levels
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

      // Create an array of nodes with positions
      const nodes: Node[] = importedNodes.map((n) => nodeById[n.id]).filter((n): n is Node => n !== undefined);

      // Map links to include source and target nodes
      let links: Link[] = importedLinks
        .filter((l) => nodeById[l.sourceId] && nodeById[l.targetId]) // Filter out links with missing nodes
        .map((l) => ({
          source: nodeById[l.sourceId],
          target: nodeById[l.targetId],
          relationship: l.relationship,
        }));

      // Keep 'Spouse' links to show green spouse lines
      // Adjust parent-child links to originate from the midpoint between spouses

      // Map spouse pairs to their midpoints
      const spousePairs = new Map<string, { x: number; y: number }>();

      // Collect positions of all nodes
      const parentPositions: { [id: string]: { x: number; y: number } } = {};
      nodes.forEach((node) => {
        parentPositions[node.id] = { x: node.x, y: node.y };
      });

      // Identify spouse pairs and calculate midpoints
      links.forEach((link) => {
        if (link.relationship === 'Spouse') {
          const id1 = (link.source as Node).id;
          const id2 = link.target.id;
          const key = [id1, id2].sort().join('-');
          const x1 = parentPositions[id1].x;
          const y1 = parentPositions[id1].y;
          const x2 = parentPositions[id2].x;
          const y2 = parentPositions[id2].y;
          const midpoint = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
          spousePairs.set(key, midpoint);
        }
      });

      // Build a mapping from children to their parents
      const childToParents: { [childId: string]: string[] } = {};
      links.forEach((link) => {
        if (link.relationship === 'Parent') {
          const parentId = (link.source as Node).id;
          const childId = link.target.id;
          if (!childToParents[childId]) {
            childToParents[childId] = [];
          }
          childToParents[childId].push(parentId);
        }
      });

      // Adjust parent-child links to originate from the midpoint
      const adjustedLinks: Link[] = [];
      Object.keys(childToParents).forEach((childId) => {
        const parents = childToParents[childId];
        if (parents.length === 2) {
          const [parent1Id, parent2Id] = parents;
          const spouseKey = [parent1Id, parent2Id].sort().join('-');
          if (spousePairs.has(spouseKey)) {
            // Parents are spouses
            const midpoint = spousePairs.get(spouseKey)!;
            // Remove existing parent-child links from parents to child
            links = links.filter(
              (link) =>
                !(
                  link.relationship === 'Parent' &&
                  link.target.id === childId &&
                  ((link.source as Node).id === parent1Id || (link.source as Node).id === parent2Id)
                )
            );
            // Add a new link from the midpoint to the child
            const childNode = nodeById[childId];
            adjustedLinks.push({
              source: midpoint,
              target: childNode,
              relationship: 'Parent',
            });
          }
        }
      });

      // Add the adjusted links to the links array
      links = links.concat(adjustedLinks);

      // Define a color scale for relationship types
      const colorScale = d3
        .scaleOrdinal<string>()
        .domain(['Parent', 'Sibling', 'Spouse'])
        .range(['#ff0000', '#0000ff', '#00ff00']); // Red for Parent, Blue for Sibling, Green for Spouse

      // Tooltip setup
      const tooltip = d3
        .select('#tooltip-container')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      // Define the link generator
      const linkGenerator = d3
        .linkVertical<any, any>()
        .x((d) => d.x)
        .y((d) => d.y);

      // Draw links
      const link = d3
        .select(svgElement)
        .append('g')
        .attr('class', 'links')
        .selectAll('path')
        .data(links)
        .enter()
        .append('path')
        .attr('d', (d) => {
          const source = 'x' in d.source ? d.source : d.source as Node;
          const target = d.target;
          return linkGenerator({ source, target });
        })
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
        .attr('x', (d: Link) => {
          const sourceX = 'x' in d.source ? d.source.x : (d.source as Node).x;
          const targetX = d.target.x;
          return (sourceX + targetX) / 2;
        })
        .attr('y', (d: Link) => {
          const sourceY = 'y' in d.source ? d.source.y : (d.source as Node).y;
          const targetY = d.target.y;
          return (sourceY + targetY) / 2;
        })
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.35em')
        .attr('fill', 'white')
        .text((d: Link) => d.relationship);

      // Draw person nodes
      d3.select(svgElement)
        .append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('cx', (d: Node) => d.x)
        .attr('cy', (d: Node) => d.y)
        .attr('r', 25)
        .attr('fill', '#69b3a2')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5);

      // Add labels for person nodes
      d3.select(svgElement)
        .append('g')
        .attr('class', 'labels')
        .selectAll('text.name')
        .data(nodes)
        .enter()
        .append('text')
        .attr('class', 'name')
        .attr('x', (d: Node) => d.x)
        .attr('y', (d: Node) => d.y - 35)
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('fill', 'white')
        .text((d: Node) => d.name);

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

    // Initialize the visualization
    initVisualization();

    // Handle window resize
    function handleResize() {
      initVisualization();
    }
    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Render the SVG container
  return (
    <div id="tooltip-container" style={{ position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100vh' }}></svg>
    </div>
  );
};

export default FamilyTree;
