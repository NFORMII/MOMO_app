import React from 'react';
import Sidebar from './components/Sidebar';  // Import the Sidebar
import Dashboard from './components/Dashboard';  // Import the Dashboard
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';  // If you want routing

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />  {/* Include Sidebar */}
        <div className="flex-1 p-6">
          <Switch>
            <Route path="/" exact component={Dashboard} /> {/* Main Dashboard */}
            {/* You can add more routes for other views */}
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;