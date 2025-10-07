import React from 'react';

// Each icon is a self-contained component with the color hardcoded.
// They are completely immune to external CSS.

export const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="white" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="white" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

export const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="#DC2626" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// --- THIS IS THE CORRECTED COMPONENT ---
export const CloseIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" height="20" viewBox="0 0 24 24" 
        fill="none" 
        stroke="#64748B" /* FIX: Hardcoded the correct gray color */
        strokeWidth="3" /* Bolder for better visibility */
        strokeLinecap="round" 
        strokeLinejoin="round" 
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);