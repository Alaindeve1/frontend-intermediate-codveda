import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
      <header className="flex flex-col items-center justify-center min-h-screen text-white">
        <img src={logo} className="h-32 w-32 animate-spin" alt="logo" />
        <h1 className="text-4xl font-bold mb-4">Weather Dashboard</h1>
        <p className="text-xl mb-6">Your weather companion</p>
        <a
          className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
