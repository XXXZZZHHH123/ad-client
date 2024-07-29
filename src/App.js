import './App.css';
import Home from "./Home"
import CategoriesView from './components/admin/CategoriesView';

function App() {
  return (
    <div className="App">
      <h2>Welcome to our front end</h2>
      <Home></Home>
      <CategoriesView/>
    </div>
  );
}

export default App;