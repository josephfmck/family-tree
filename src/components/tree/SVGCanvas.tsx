import React, { useEffect } from 'react';
import * as d3 from 'd3';
import Links from './Links';
import Nodes from './Nodes';
import Labels from './Labels';

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'person' | 'family';
}

interface Link {
  source: Node | { x: number; y: number };
  target: Node;
  relationship: string;
}

const SVGCanvas = ({ svgRef, persons, relationships, relationshipTypes }) => {
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    d3.select(svgElement).attr('width', width).attr('height', height).selectAll('*').remove();
    
    d3.select(svgElement).append('rect').attr('width', width).attr('height', height).attr('fill', '#333333');

    // Create a mapping from relationship type IDs to relationship names
    const relationshipTypeMap = relationshipTypes.reduce((map, type) => {
      map[type.id] = type.relationship;
      return map;
    }, {} as Record<string, string>);

    // Map persons to nodes
    const nodes: Node[] = persons.map((person) => ({
      id: person.id,
      name: `${person.first_name} ${person.last_name}`,
      x: 0,
      y: 0,
      type: 'person',
    }));

    const nodeById: Record<string, Node> = {};
    nodes.forEach((node) => (nodeById[node.id] = node));

    // Map relationships to links
    const links: Link[] = relationships
      .filter((rel) => nodeById[rel.person_id_1] && nodeById[rel.person_id_2])
      .map((rel) => ({
        source: nodeById[rel.person_id_1],
        target: nodeById[rel.person_id_2],
        relationship: relationshipTypeMap[rel.relationship_type_id] || 'Unknown',
      }));

    // Set up the visualization layout logic here (node levels, etc.)

    // Draw Links, Nodes, and Labels
    d3.select(svgElement).append('g').attr('class', 'links').call(() => <Links links={links} />);
    d3.select(svgElement).append('g').attr('class', 'nodes').call(() => <Nodes nodes={nodes} />);
    d3.select(svgElement).append('g').attr('class', 'labels').call(() => <Labels nodes={nodes} />);
  }, [svgRef, persons, relationships, relationshipTypes]);

  return <svg ref={svgRef} style={{ width: '100%', height: '100vh' }}></svg>;
};

export default SVGCanvas;
