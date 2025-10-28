import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate('/dashboard')} className="back-button">
      Back to Dashboard
    </button>
  );
};

export default BackButton;
