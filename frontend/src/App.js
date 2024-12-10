import { Grid, Box } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';

// Routes
import AppRoutes from './routes/index';

function App() {
  return (
    <Router>
      <Box>
        <Grid container>
          <Grid item xs={12}>
            <AppRoutes />
          </Grid>
        </Grid>
      </Box>
    </Router>
  );
}

export default App;
