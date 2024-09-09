import React from 'react';

interface PersonProps {
  id: number;
  first_name: string;
  last_name: string;
  x: number;
  y: number;
  isYou?: boolean;
  onDelete: (id: number) => void;
}

export default function Person({ id, first_name, last_name, x, y, isYou, onDelete }: PersonProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${first_name} ${last_name}?`)) {
      onDelete(id);
    }
  };

  return (
    <div 
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        padding: '10px 20px',
        borderRadius: '50%',
        background: isYou ? '#2a4d69' : '#1e1e1e',
        border: `2px solid ${isYou ? '#4b86b4' : '#6e6e6e'}`,
        color: 'var(--foreground)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '100px',
        minHeight: '100px',
        textAlign: 'center',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
      }}
    >
      {isYou && <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>You</div>}
      {first_name} {last_name}
      {!isYou && (
        <button 
          onClick={handleDelete}
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          X
        </button>
      )}
    </div>
  );
}