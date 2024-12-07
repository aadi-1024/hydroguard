
import { Typography } from '@mui/material';

export default function Sidebarfooter() {
  return (
    <Typography
      variant="caption"
      sx={{
        m: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textAlign: 'center', // Optional for centering the text
      }}
    >
      {`© ${new Date().getFullYear()} Made with ❤️ by Team Chakravyuh`}
    </Typography>
  );
}
