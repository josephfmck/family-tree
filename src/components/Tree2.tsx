'use client';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3'; // D3.js library
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

// Define the Node interface
interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'person' | 'family';
}

// Adjust the Link interface
interface Link {
  source: Node | { x: number; y: number };
  target: Node;
  relationship: string;
}

const FamilyTree = () => {
  const svgRef = useRef<SVGSVGElement | null>(null); // Reference to the SVG element

  // Fetch persons and relationships from Redux store
  const persons = useSelector((state: RootState) => state.persons);
  const relationships = useSelector((state: RootState) => state.relationships);
  const relationshipTypes = useSelector((state: RootState) => state.relationshipTypes);

  // ! useffect
  useEffect(() => {
    // Check if data is loaded
    if (
      !persons ||
      !relationships ||
      !relationshipTypes ||
      persons.length === 0 ||
      relationships.length === 0 ||
      relationshipTypes.length === 0
    ) {
      console.log('Data not loaded yet.');
      return;
    }

    console.log('Persons:', persons);
    console.log('Relationships:', relationships);
    console.log('Relationship Types:', relationshipTypes);

    const svgElement = svgRef.current;
    if (!svgElement) return;

    // ! Visualization logic
    const initVisualization = () => {
      // Set dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Initialize the SVG canvas
      d3.select(svgElement).attr("width", width).attr("height", height);
      d3.select(svgElement).selectAll("*").remove();

      // Add background
      d3.select(svgElement)
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#333333");

      // ! Mapping information
      // Create a mapping from relationship type IDs to relationship names
      const relationshipTypeMap = relationshipTypes.reduce((map, type) => {
        map[type.id] = type.relationship;
        return map;
      }, {} as Record<string, string>);

      // Map persons to nodes
      const nodes: Node[] = persons.map((person) => ({
        id: person.id,
        name: `${person.first_name} ${person.last_name}`,
        x: 0, // Will be assigned later
        y: 0, // Will be assigned later
        type: "person",
      }));

      // Map node IDs to nodes for easy lookup
      const nodeById: Record<string, Node> = {};
      nodes.forEach((node) => {
        nodeById[node.id] = node;
      });

      // Map relationships to links
      const links: Link[] = relationships
        .filter((rel) => nodeById[rel.person_id_1] && nodeById[rel.person_id_2]) // Ensure both nodes exist
        .map((rel) => ({
          source: nodeById[rel.person_id_1],
          target: nodeById[rel.person_id_2],
          relationship:
            relationshipTypeMap[rel.relationship_type_id] || "Unknown",
        }));

      // ! Positioning logic
      // Assign levels to nodes based on relationships
      const levels: Record<string, number> = {};
      const visited = new Set<string>();
      const queue: { id: string; level: number }[] = [];

      // Use 'Joe McKinney' as the root person
      const rootPerson = nodes.find((n) => n.name === "Joe McKinney");
      if (!rootPerson) {
        console.error("Root person not found in the dataset.");
        return;
      }

      levels[rootPerson.id] = 0;
      visited.add(rootPerson.id);
      queue.push({ id: rootPerson.id, level: 0 });

      // ! Links logic
      while (queue.length > 0) {
        // queue through  { id, level } relationship Link objs
        const current = queue.shift();
        if (!current) continue;

        const currentNode = nodeById[current.id];

        // Find all relationships involving the current person
        const relatedLinks = links.filter(
          (l) =>
            (l.source as Node).id === current.id || l.target.id === current.id
        );

        relatedLinks.forEach((link) => {
          // console.log(link);
          // the current source (the id were looking for)
          const isCurrentSource = (link.source as Node).id === current.id;

          const otherNodeId = isCurrentSource
            ? link.target.id
            : (link.source as Node).id;

          // TODO: this doesnt make sense, when logging each relationship only one is chosen out of the two.
          // ! problem its avoiding double relationships but it ends up ignoring others i.e. grandparent
          // for instance sibling-sibling, parent-child/child-parent. theres always at least two.
          // grandparent would also be that but that person also hass a parent-child relationship
          // always assume: all persons can have many relationships but only one for each person
          // when theres a relationship theres a relationship for both people involved.

          // console.log(current);
          // console.log(isCurrentSource, otherNodeId);

          if (!visited.has(otherNodeId)) {
            visited.add(otherNodeId);
            let levelAdjustment = 0;
            // Adjust level based on relationship type and direction
            console.log(link);
            // TODO: find granparent line and remove it
            if (link.relationship === "Grandparent") {
              levelAdjustment = isCurrentSource ? 0 : 2;
            } else if (link.relationship === "Parent") {
              levelAdjustment = isCurrentSource ? -1 : 1;
            } else if (link.relationship === "Child") {
              levelAdjustment = isCurrentSource ? 1 : -1;
            } else if (
              link.relationship === "Sibling" ||
              link.relationship === "Spouse"
            ) {
              levelAdjustment = 0;
            }

            levels[otherNodeId] = current.level + levelAdjustment;
            console.log(levels[otherNodeId], levelAdjustment);
            queue.push({ id: otherNodeId, level: levels[otherNodeId] });
          }
        });
      }

      //! Group nodes by their levels
      const levelsArray: { [level: number]: Node[] } = {};
      nodes.forEach((node) => {
        const level = levels[node.id] || 0;
        if (!levelsArray[level]) {
          levelsArray[level] = [];
        }
        levelsArray[level].push(node);
      });

      // TODO: fix this for spouses 
      //! Assign x and y positions to nodes
      // Find the maximum and minimum levels in the levelsArray object
      const maxLevel = Math.max(...Object.keys(levelsArray).map(Number));
      const minLevel = Math.min(...Object.keys(levelsArray).map(Number));

      // Calculate the total number of levels in the hierarchy
      const totalLevels = maxLevel - minLevel + 1;

      // Calculate the height for each level to spread nodes evenly across the vertical space
      const levelHeight = height / (totalLevels + 1);

      // Iterate over each level to assign positions to nodes
      Object.keys(levelsArray).forEach((levelStr) => {
        const level = Number(levelStr); // Convert the level string to a number

        // Calculate the y-coordinate for the nodes on the current level
        // The levels are inverted, so we subtract from maxLevel to place higher levels at the top
        const y = (maxLevel - level + 1) * levelHeight;

        // Get all nodes that belong to the current level
        const nodesAtLevel = levelsArray[level];

        let currentX = 0; // Starting x position for nodes, incremented as we place nodes horizontally
        const fixedSpacing = 150; // Fixed spacing between nodes (can be adjusted for wider/narrower spacing)

        // Assign x and y positions to nodes at the current level with uniform horizontal spacing
        nodesAtLevel.forEach((node, index) => {
          // Set x position for the current node based on its index
          node.x = (index + 1) * fixedSpacing;

          // Set y position for the current node (same for all nodes in the level)
          node.y = y;
        });

        // Handle the spouse and sibling positioning separately for each node at the current level
        nodesAtLevel.forEach((node) => {
          // Find the spouse relationship for the current node
          const spouseLink = links.find(
            (link) =>
              (link.source as Node).id === node.id &&
              link.relationship === "Spouse"
          );

          // Find all sibling relationships for the current node
          const siblingLinks = links.filter(
            (link) =>
              (link.source as Node).id === node.id &&
              link.relationship === "Sibling"
          );

          // If a spouse link is found, position the spouse relative to the current node
          if (spouseLink) {
            const spouse = spouseLink.target; // Get the spouse node from the link

            //! Position the spouse to the right of the current node
            spouse.x = node.x + fixedSpacing;

            // Handle the siblings of the current node - position them to the left of the current node
            siblingLinks.forEach((siblingLink, siblingIndex) => {
              const sibling = siblingLink.target;

              // Position each sibling to the left of the current node, incrementing with fixed spacing
              sibling.x = node.x - (siblingIndex + 1) * fixedSpacing;
            });

            // Handle the siblings of the spouse separately
            const spouseSiblingLinks = links.filter(
              (link) =>
                (link.source as Node).id === spouse.id &&
                link.relationship === "Sibling"
            );

            // Position each sibling of the spouse to the right of the spouse node
            spouseSiblingLinks.forEach((siblingLink, siblingIndex) => {
              const sibling = siblingLink.target;

              // Position the sibling to the right of the spouse, incrementing with fixed spacing
              sibling.x = spouse.x + (siblingIndex + 1) * fixedSpacing;
            });
          }
        });
        console.log(nodesAtLevel);
      });

      // ! unused tooltip?
      // Tooltip setup
      const tooltip = d3
        .select("#tooltip-container")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // ! family nodes
      // Identify spouse pairs and create family nodes
      const familyNodes: Node[] = [];
      const familyLinks: Link[] = [];

      // Map to store spouse pairs
      const spousePairs: { [key: string]: Node[] } = {};

      // ! Spouse family
      // Identify spouse relationships
      links.forEach((link) => {
        if (link.relationship === "Spouse") {
          const sourceId = (link.source as Node).id;
          const targetId = link.target.id;
          const key = [sourceId, targetId].sort().join("-"); // Ensure consistency

          if (!spousePairs[key]) {
            spousePairs[key] = [link.source as Node, link.target];
          }
        }
      });

      // Create family nodes at midpoints of spouse pairs
      Object.values(spousePairs).forEach(([spouse1, spouse2], index) => {
        const familyNode: Node = {
          id: `family-${index}`,
          name: "",
          x: (spouse1.x + spouse2.x) / 2,
          y: spouse1.y, // Same level as spouses
          type: "family",
        };
        familyNodes.push(familyNode);

        // Add links from spouses to family node
        familyLinks.push(
          {
            source: spouse1,
            target: familyNode,
            relationship: "Family",
          },
          {
            source: spouse2,
            target: familyNode,
            relationship: "Family",
          }
        );
      });

      // ! Parent family
      // Map from person IDs to family nodes (for parents)
      const personIdToFamilyNode: { [personId: string]: Node } = {};

      Object.values(spousePairs).forEach(([spouse1, spouse2], index) => {
        const familyNode = familyNodes[index];
        personIdToFamilyNode[spouse1.id] = familyNode;
        personIdToFamilyNode[spouse2.id] = familyNode;
      });

      // Adjust parent/child links to originate from family nodes
      const adjustedLinks: Link[] = [];

      // ! Links
      links.forEach((link) => {
        if (link.relationship === "Parent") {
          const parent = link.source as Node;
          const child = link.target;
          const familyNode = personIdToFamilyNode[parent.id];

          if (familyNode) {
            // Redirect parent link to family node
            adjustedLinks.push({
              source: familyNode,
              target: child,
              relationship: "Parent",
            });
          } else {
            // No spouse, keep link as is
            adjustedLinks.push(link);
          }
        } else if (link.relationship === "Child") {
          const child = link.source as Node;
          const parent = link.target;
          const familyNode = personIdToFamilyNode[parent.id];

          if (familyNode) {
            // Redirect child link to family node
            adjustedLinks.push({
              source: familyNode,
              target: child,
              relationship: "Parent",
            });
          } else {
            // No spouse, keep link as is
            adjustedLinks.push(link);
          }
        } else {
          // Keep other relationships
          adjustedLinks.push(link);
        }
      });

      //! Combine all nodes and links
      const allNodes = nodes.concat(familyNodes);
      const allLinks = adjustedLinks.concat(familyLinks);

      // Combine labels for links between the same pair of nodes
      const labelMap: {
        [key: string]: { relationships: string[]; x: number; y: number };
      } = {};

      // ! Final Links
      allLinks.forEach((d) => {
        const sourceId = (d.source as Node).id;
        const targetId = d.target.id;
        const key = [sourceId, targetId].sort().join("-"); // Ensure consistency regardless of direction

        // Calculate the position for the label
        const sourceX = "x" in d.source ? d.source.x : (d.source as Node).x;
        const sourceY = "y" in d.source ? d.source.y : (d.source as Node).y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        const x = (sourceX + targetX) / 2;
        const y = (sourceY + targetY) / 2;

        if (!labelMap[key]) {
          labelMap[key] = {
            relationships: [],
            x,
            y,
          };
        }

        // Exclude 'Family' relationship from labels
        if (
          d.relationship !== "Family" &&
          !labelMap[key].relationships.includes(d.relationship)
        ) {
          labelMap[key].relationships.push(d.relationship);
        }
      });

      // ! Relationship order
      // Define the desired relationship order
      const relationshipOrder = [
        "Parent",
        "Child",
        "Sibling",
        "Spouse",
        "Other",
      ];

      // ! D3 Visualization
      //! Define the link generator
      const linkGenerator = d3
        .linkVertical<any, any>()
        .x((d) => d.x)
        .y((d) => d.y);

      //! Draw links
      const link = d3
        .select(svgElement)
        .append("g")
        .attr("class", "links")
        .selectAll("path")
        .data(
          allLinks.filter(
            (d) => d.relationship !== "Grandparent" || "Grandchild"
          )
        )
        .enter()
        .append("path")
        .attr("d", (d) => {
          const source = "x" in d.source ? d.source : (d.source as Node);
          const target = d.target;
          return linkGenerator({ source, target });
        })
        .attr("stroke-width", 2)
        .attr("stroke", (d: Link) => {
          if (d.relationship === "Spouse") {
            return "red";
          } else if (d.relationship === "Sibling") {
            return "blue";
          } else if (d.relationship === "Family") {
            return "none"; // Invisible line to family node
          } else if (
            d.relationship === "Grandparent" ||
            d.relationship === "Grandchild"
          ) {
            return "none"; // invisible line to grandparent/grandchild
          } else {
            return "green";
          }
        })
        .attr("fill", "none");

      //! Add combined relationship labels
      d3.select(svgElement)
        .append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(Object.values(labelMap))
        .enter()
        .append("text")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("text-anchor", "middle")
        .attr("dy", "-0.35em") // positions above node

        .attr("fill", (d: any) => {
          // Hide grandparent/grandchild labels
          const hasGrandparentRelationship =
            d.relationships &&
            d.relationships.some(
              (r: string) => r === "Grandparent" || r === "Grandchild"
            );
          return hasGrandparentRelationship ? "none" : "white";
        })
        .style("font-size", "10px")
        .text((d) => {
          // Sort relationships according to the defined order
          const sortedRelationships = d.relationships.sort((a, b) => {
            const indexA =
              relationshipOrder.indexOf(a) >= 0
                ? relationshipOrder.indexOf(a)
                : relationshipOrder.length;
            const indexB =
              relationshipOrder.indexOf(b) >= 0
                ? relationshipOrder.indexOf(b)
                : relationshipOrder.length;
            return indexA - indexB;
          });
          return sortedRelationships.join("/");
        });

      //! Draw person nodes
      d3.select(svgElement)
        .append("g")
        .attr("class", "nodes")
        .selectAll("circle.person")
        .data(allNodes.filter((d) => d.type === "person"))
        .enter()
        .append("circle")
        .attr("class", "person")
        .attr("cx", (d: Node) => d.x)
        .attr("cy", (d: Node) => d.y)
        .attr("r", 20)
        .attr("fill", "#69b3a2")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1.5);

      //! Draw family nodes (invisible or as small circles)
      d3.select(svgElement)
        .append("g")
        .attr("class", "family-nodes")
        .selectAll("circle.family")
        .data(familyNodes)
        .enter()
        .append("circle")
        .attr("class", "family")
        .attr("cx", (d: Node) => d.x)
        .attr("cy", (d: Node) => d.y)
        .attr("r", 0) // radius size
        .attr("fill", "black"); // You can make this invisible by setting 'fill' to 'none'

      //! Add labels for person nodes
      d3.select(svgElement)
        .append("g")
        .attr("class", "labels")
        .selectAll("text.name")
        .data(allNodes.filter((d) => d.type === "person"))
        .enter()
        .append("text")
        .attr("class", "name")
        .attr("x", (d: Node) => d.x)
        .attr("y", (d: Node) => d.y - 35)
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("fill", "white")
        .style("font-size", "10px") // Adjust the font size here
        .text((d: Node) => d.name);

      //! Tooltip interactions
      link
        .on("mouseover", (event: any, d: Link) => {
          const sourceId = (d.source as Node).id;
          const targetId = d.target.id;
          const key = [sourceId, targetId].sort().join("-");
          let relationships = labelMap[key]?.relationships || [d.relationship];

          //! Sort relationships according to the defined order
          relationships = relationships.sort((a, b) => {
            const indexA =
              relationshipOrder.indexOf(a) >= 0
                ? relationshipOrder.indexOf(a)
                : relationshipOrder.length;
            const indexB =
              relationshipOrder.indexOf(b) >= 0
                ? relationshipOrder.indexOf(b)
                : relationshipOrder.length;
            return indexA - indexB;
          });

          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(`Relationship: ${relationships.join("/")}`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });
    };

    //! Initialize the visualization
    initVisualization();
  }, [persons, relationships, relationshipTypes]);

  // Render the SVG container
  return (
    <div id="tooltip-container" style={{ position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100vh' }}></svg>
    </div>
  );
};

export default FamilyTree;
