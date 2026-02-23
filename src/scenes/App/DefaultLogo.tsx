import Typography from '@mui/material/Typography';

export const DefaultLogo = ({ title }: { title: string }) => (
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'inherit' }}>
    {title}
  </Typography>
);
