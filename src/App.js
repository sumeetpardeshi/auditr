import logo from './logo.svg';
import './App.css';
import Flow from './components/Flow';
import { Box,AppBar,Toolbar,IconButton,Typography,Button } from '@mui/material';
import { Menu as MenuIcon, VerifiedUser} from '@mui/icons-material';
import { ReactFlowProvider } from 'reactflow';

function App() {
  return (
    <div className="App">
      <header>
     
      <AppBar position="static" >
        <Toolbar disableGutters style={{marginLeft:'1rem'}}>
        <VerifiedUser/>
        <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              ml: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            AuditR
          </Typography>
          
          
        </Toolbar>
      </AppBar>
       
      </header>
      <section>
        <ReactFlowProvider>
        <Flow></Flow>
        </ReactFlowProvider>
      </section>
    </div>
  );
}

export default App;
