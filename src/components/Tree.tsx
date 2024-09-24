'use client';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { HierarchyPointNode, HierarchyPointLink } from 'd3';

// Defining the structure of a family member, which may optionally have children
interface FamilyMember {
  name: string;
  children?: FamilyMember[];
}

const FamilyTree = ({ familyData }: { familyData: FamilyMember }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return; // Early return if svgRef is not yet attached

    // Set up the dimensions and margins
    const width = 600;
    const height = 600;  // Increase height for vertical layout
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create the tree layout
    const treemap = d3.tree<FamilyMember>().size([width, height]);

    // Convert the data to a D3 hierarchy
    const root = d3.hierarchy<FamilyMember>(familyData);

    // Apply the tree layout to root
    const treeData = treemap(root as HierarchyPointNode<FamilyMember>); 

    // ! LINES
    // Add the links (lines) between nodes
    svg.selectAll(".link")
      .data(treeData.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2)
      .attr("d", d3.linkVertical<HierarchyPointLink<FamilyMember>, [number, number]>()
        .source(d => [d.source.x, d.source.y])  // Map source to [x, y]
        .target(d => [d.target.x, d.target.y])  // Map target to [x, y]
      );

    // ! NODES
    // Add the nodes (group of circle and text)
    const node = svg.selectAll(".node")
      .data(treeData.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);  // Correct node position

    // Add circles to the nodes
    node.append("circle")
      .attr("r", 10)
      .attr("fill", "steelblue");

    // Add text labels to the nodes
    node.append("text")
      .attr("dy", ".35em")
      .attr("x", d => d.children ? -15 : 15)  // Offset text depending on the presence of children
      .style("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name);

  }, [familyData]);

  return <svg ref={svgRef}></svg>;
};

export default FamilyTree;
