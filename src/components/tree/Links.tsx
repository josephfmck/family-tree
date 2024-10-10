import React from 'react';
import * as d3 from 'd3';

const Links = ({ links }) => {
  const linkGenerator = d3.linkVertical().x((d) => d.x).y((d) => d.y);

  return links.map((link, index) => (
    <path
      key={index}
      d={linkGenerator({ source: link.source, target: link.target })}
      stroke={link.relationship === 'Spouse' ? 'red' : link.relationship === 'Sibling' ? 'blue' : 'green'}
      strokeWidth={2}
      fill="none"
    />
  ));
};

export default Links;
