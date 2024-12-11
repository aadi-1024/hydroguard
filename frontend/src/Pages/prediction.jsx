import './prediction.css'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
const prediction = () => {
 
   
 
  return (
    <Box className='inp'
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25vw' } }}
      noValidate
      autoComplete="off">
      <h1 className='hed'>Enter Details</h1>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" sx={{background:'white'}}/>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" sx={{background:'white'}}/>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" sx={{background:'white'}}/>
      

    </Box>
  );
}

   


export default prediction
