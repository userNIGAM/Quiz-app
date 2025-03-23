import { React } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Game from "./Components/Game";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Game />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
