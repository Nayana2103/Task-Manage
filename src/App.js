import { HashRouter as Router, Routes, Route } from "react-router-dom";
import TaskTable from "./components/TaskTable";

import "./styles/style.css";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskTable />} />
      </Routes>
    </Router>
  );
}

export default App;
