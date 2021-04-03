import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './logo.svg';

function App() {
  const [state, setState] = useState();

  useEffect(() => {
    const id = 'dc028e99-fb32-48bd-bcc0-dda4ead5448e';
    fetch(`http://localhost:3030/otto/${id}`)
      .then((response: any) => response.json())
      .then((data: any) => setState(() => data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
          {state && <img src={`data:image/png;base64,${(state as any).data}`}></img>}
        </p>
        <a
          className="App-link"
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
