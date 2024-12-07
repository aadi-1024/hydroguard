import React from 'react'
import { Typography } from '@mui/material'


export default function Sidebarfooter() {
  return (
    <Typography
        variant="caption"
        sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
      >
        {0 ? '© MUI' : `© ${new Date().getFullYear()} Made with ❤️ by Team Chakravyuh¹²³`}
      </Typography>
      
  )
}
