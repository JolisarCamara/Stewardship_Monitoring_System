import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function CustomizedInputBase({ onSearch}) {

   const handleSearchChange = (event) => {
        onSearch(event.target.value); // Call the onSearch callback with the input value
    };
    
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 1350 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search by Name or Email"
        inputProps={{ 'arial': 'search name' }}
        onChange={handleSearchChange}
      />
      <IconButton>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}