import "./App.css";
import { Route, Routes } from "react-router-dom";

import Login from "./components/components/Login/Login";
import Layout from "./Layout/Layout";
import DialpadComponent from "./components/components/DialpadComponent/DialpadComponent";
import AnsweredComponent from "./components/components/AnsweredComponent/AnsweredComponent";

function App() {
  return (
    <div className="h-full w-full">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<DialpadComponent />} />
          <Route path="/answer" element={<AnsweredComponent />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
