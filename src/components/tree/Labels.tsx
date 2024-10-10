import React from 'react';

const Labels = ({ nodes }) => {
  return nodes.map((node, index) => (
    <text
      key={index}
      x={node.x}
      y={node.y - 35}
      textAnchor="middle"
      dy=".35em"
      fill="white"
    >
      {node.name}
    </text>
  ));
};

export default Labels;
