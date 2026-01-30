import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function AccountListItem({ name, email, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center justify-between border border-gray-100 shadow-sm">
      <div>
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant='contained'
          sx={{
          backgroundColor: '#C9A227',
          color: '#fff',
          height: 32,
          fontSize: '0.875rem',
          px: 2,
          '&:hover': {
            backgroundColor: '#B8960F',
          },
        }}
          onClick={onEdit}
        >
           Edit
        </Button>
        <Button
        sx={{
        height: 32,
        backgroundColor: '#D3D3D3',
        fontSize: '0.875rem',
        color: '#000000',
        borderColor: '#D1D5DB',
        '&:hover': {
          backgroundColor: '#F9FAFB',
          borderColor: '#D1D5DB',
          },
        }}

         onClick={onDelete}
          variant="contained"

        >
          Delete
        </Button>
      </div>
    </div>
  );
}