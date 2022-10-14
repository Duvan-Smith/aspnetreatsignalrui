import "./App.css";
import { ListWeatherForecast } from "./Components/ListWeatherForecast";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <ListWeatherForecast />
      </header>
    </div>
  );
}

export default App;
