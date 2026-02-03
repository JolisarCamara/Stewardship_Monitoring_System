import React from 'react';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

export default function AccountListItem({ name, email, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm border border-gray-100 transition-all hover:border-gray-200">
      
      {/* User Info Section */}
      <div className="flex flex-col gap-1.5">
        {/* Name with Icon */}
        <div className="flex items-center gap-2.5">
          <PersonIcon sx={{ fontSize: 18, color: '#3D5A80' }} />
          <p className="font-semibold text-gray-800 leading-none">{name}</p>
        </div>
        
        {/* Email with Icon */}
        <div className="flex items-center gap-2.5">
          <EmailIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
          <p className="text-sm text-gray-500 leading-none">{email}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant='contained'
          onClick={onEdit}
          sx={{
            backgroundColor: '#C9A227',
            color: '#fff',
            height: 32,
            minWidth: 80,
            fontSize: '0.8125rem',
            textTransform: 'none',
            boxShadow: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#B8960F',
              boxShadow: 'none',
            },
          }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          onClick={onDelete}
          sx={{
            height: 32,
            minWidth: 80,
            backgroundColor: '#F1F4F9', // Matches your Rules table background color
            fontSize: '0.8125rem',
            color: '#4B5563',
            textTransform: 'none',
            boxShadow: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#E5E7EB',
              boxShadow: 'none',
            },
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}