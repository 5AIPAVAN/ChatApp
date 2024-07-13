import logo from './logo.svg';
import './App.css';
// outlet is used to check page according to route
import { Outlet } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  return (
    <> 
    <Toaster/>
     <main >
      <Outlet/>
     </main>
 </>
  );
}

export default App;


// after any change to .env file we need to stop and restart server