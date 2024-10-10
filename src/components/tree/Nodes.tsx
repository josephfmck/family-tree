import React from 'react';

const Nodes = ({ nodes }) => {
  return nodes.map((node, index) => (
    <circle
      key={index}
      cx={node.x}
      cy={node.y}
      r={node.type === 'person' ? 25 : 5}
      fill={node.type === 'person' ? '#69b3a2' : 'black'}
      stroke="#ffffff"
      strokeWidth={1.5}
    />
  ));
};

export default Nodes;
