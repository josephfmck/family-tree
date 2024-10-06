export interface Person {
    id: string;
    first_name?: string;
    last_name?: string;
    name: string;
  }
  
  export interface Relationship {
    person_id_1: string;
    person_id_2: string;
    relationship_type_id: string;
  }
  
  export interface RelationshipType {
    id: string;
    relationship: string;
  }
  
  export interface Node {
    id: string;
    name: string;
    x?: number;
    y?: number;
    type: 'person';
  }
  
  export interface Link {
    sourceId: string;
    targetId: string;
    relationship: string;
  }
  
  // Nodes: Only person nodes, no marriage nodes
  export const nodes: Node[] = [
    // Great-Grandparents
    { id: '10', name: 'Albert Doe', type: 'person' },
    { id: '11', name: 'Betty Doe', type: 'person' },
    // Grandparents
    { id: '6', name: 'Robert Doe', type: 'person' },
    { id: '7', name: 'Susan Doe', type: 'person' },
    // Parents
    { id: '1', name: 'John Doe', type: 'person' },
    { id: '2', name: 'Jane Doe', type: 'person' },
    // Children
    { id: '3', name: 'Jim Doe', type: 'person' },
    { id: '4', name: 'Jill Doe', type: 'person' },
    { id: '5', name: 'Jack Doe', type: 'person' },
    // Siblings (Cousins)
    { id: '8', name: 'Tom Doe', type: 'person' },
    { id: '9', name: 'Mary Doe', type: 'person' },
    // Cousins
    { id: '12', name: 'Nina Doe', type: 'person' },
    { id: '13', name: 'Liam Doe', type: 'person' },
  ];
  
  // Relationship types: Only primary relationships
  export const relationshipTypes: RelationshipType[] = [
    { id: '1', relationship: 'Parent' },
    { id: '2', relationship: 'Sibling' },
    { id: '3', relationship: 'Spouse' },
    // Note: 'Child' is the inverse of 'Parent'; we can infer it if needed
  ];
  
  // Relationships: Using only primary relationships
  export const relationships: Relationship[] = [
    // Spouse relationships
    { person_id_1: '10', person_id_2: '11', relationship_type_id: '3' },
    { person_id_1: '6', person_id_2: '7', relationship_type_id: '3' },
    { person_id_1: '1', person_id_2: '2', relationship_type_id: '3' },
    { person_id_1: '8', person_id_2: '9', relationship_type_id: '3' },
  
    // Parent relationships
    { person_id_1: '10', person_id_2: '6', relationship_type_id: '1' },
    { person_id_1: '11', person_id_2: '6', relationship_type_id: '1' },
    { person_id_1: '6', person_id_2: '1', relationship_type_id: '1' },
    { person_id_1: '7', person_id_2: '1', relationship_type_id: '1' },
    { person_id_1: '6', person_id_2: '8', relationship_type_id: '1' },
    { person_id_1: '7', person_id_2: '8', relationship_type_id: '1' },
    { person_id_1: '1', person_id_2: '3', relationship_type_id: '1' },
    { person_id_1: '2', person_id_2: '3', relationship_type_id: '1' },
    { person_id_1: '1', person_id_2: '4', relationship_type_id: '1' },
    { person_id_1: '2', person_id_2: '4', relationship_type_id: '1' },
    { person_id_1: '1', person_id_2: '5', relationship_type_id: '1' },
    { person_id_1: '2', person_id_2: '5', relationship_type_id: '1' },
    { person_id_1: '8', person_id_2: '12', relationship_type_id: '1' },
    { person_id_1: '9', person_id_2: '12', relationship_type_id: '1' },
    { person_id_1: '8', person_id_2: '13', relationship_type_id: '1' },
    { person_id_1: '9', person_id_2: '13', relationship_type_id: '1' },
  
    // Sibling relationships
    { person_id_1: '1', person_id_2: '8', relationship_type_id: '2' },
    { person_id_1: '3', person_id_2: '4', relationship_type_id: '2' },
    { person_id_1: '3', person_id_2: '5', relationship_type_id: '2' },
    { person_id_1: '4', person_id_2: '5', relationship_type_id: '2' },
    { person_id_1: '12', person_id_2: '13', relationship_type_id: '2' },
  ];
  
  // Generate links based on relationships
  export const links: Link[] = relationships.map((rel) => {
    const relType = relationshipTypes.find((type) => type.id === rel.relationship_type_id);
    const relationship = relType ? relType.relationship : 'Unknown';
    return {
      sourceId: rel.person_id_1,
      targetId: rel.person_id_2,
      relationship,
    };
  });
  