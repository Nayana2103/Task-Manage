import React, { useState, useEffect } from "react";
import "./TaskTable.css";
import { FaSort, FaCalendarAlt } from "react-icons/fa";
import TaskModal from "./TaskModal";

const TaskTable = () => {
  const [activeTab, setActiveTab] = useState("Open");
  const [search, setSearch] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [openTasks, setOpenTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // NEW: counts kept separate so they’re correct immediately
  const [tabCounts, setTabCounts] = useState({
    Open: 0,
    Pending: 0,
    "In Progress": 0,
    Completed: 0,
  });

  //  NEW: stash tasks created via modal before their tab is opened
  const [addedTasks, setAddedTasks] = useState({
    Open: [],
    Pending: [],
    "In Progress": [],
    Completed: [],
  });

  //  dummy data (your future API results)
  const dummyData = {
    Open: [
      { id: "T001", priority: "High", createdBy: "Alice", type: "Bug", subType: "UI", name: "Fix navbar issue" },
      { id: "T002", priority: "Low", createdBy: "Bob", type: "Task", subType: "Docs", name: "Update README" },
    ],
    Pending: [
      { id: "T010", priority: "Medium", createdBy: "Charlie", type: "Feature", subType: "API", name: "Add login API" },
    ],
    "In Progress": [
      { id: "T020", priority: "High", createdBy: "David", type: "Bug", subType: "Backend", name: "Fix DB crash" },
      { id: "T021", priority: "Medium", createdBy: "Eve", type: "Task", subType: "Testing", name: "Write unit tests" },
      { id: "T022", priority: "Low", createdBy: "Frank", type: "Feature", subType: "Frontend", name: "Add search bar" },
    ],
    Completed: [
      { id: "T030", priority: "Low", createdBy: "Grace", type: "Task", subType: "Docs", name: "Code cleanup" },
    ],
  };

  //  NEW: initialize counts ONCE (simulate /counts API)
  useEffect(() => {
    setTabCounts({
      Open: dummyData.Open.length,
      Pending: dummyData.Pending.length,
      "In Progress": dummyData["In Progress"].length,
      Completed: dummyData.Completed.length,
    });
  }, []);

  //  Load list data ONLY when switching to that tab (simulate /list?status=...)
  useEffect(() => {
    if (activeTab === "Open") {
      setOpenTasks([...dummyData.Open, ...addedTasks.Open]);
    }
    if (activeTab === "Pending") {
      setPendingTasks([...dummyData.Pending, ...addedTasks.Pending]);
    }
    if (activeTab === "In Progress") {
      setInProgressTasks([...dummyData["In Progress"], ...addedTasks["In Progress"]]);
    }
    if (activeTab === "Completed") {
      setCompletedTasks([...dummyData.Completed, ...addedTasks.Completed]);
    }
  }, [activeTab, addedTasks]); // addedTasks ensures newly created items appear when you later open the tab

  //  pick tasks for active tab
  const currentTasks =
    activeTab === "Open"
      ? openTasks
      : activeTab === "Pending"
      ? pendingTasks
      : activeTab === "In Progress"
      ? inProgressTasks
      : completedTasks;

  //  Handle new task creation
  const handleTaskCreate = (newTask) => {
    const status = newTask.status || "Open";

    // 1) bump counts immediately
    setTabCounts((prev) => ({ ...prev, [status]: (prev[status] || 0) + 1 }));

    // 2) remember this task for that tab
    setAddedTasks((prev) => ({
      ...prev,
      [status]: [...prev[status], newTask],
    }));

    // 3) if currently on that tab, also append to visible list
    if (status === activeTab) {
      if (status === "Open") setOpenTasks((prev) => [...prev, newTask]);
      if (status === "Pending") setPendingTasks((prev) => [...prev, newTask]);
      if (status === "In Progress") setInProgressTasks((prev) => [...prev, newTask]);
      if (status === "Completed") setCompletedTasks((prev) => [...prev, newTask]);
    }
  };
 
  //  export CSV
  const exportToCSV = () => {
    if (!currentTasks.length) return;

    const headers = ["Task Id", "Priority", "Created By", "Type", "Sub Type", "Task Name"];
    const rows = currentTasks.map((task) => [
      task.id,
      task.priority,
      task.createdBy,
      task.type,
      task.subType,
      task.name,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `${activeTab}_Tasks.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //  counts now come from tabCounts (correct on first render)
  const tabs = [
    { name: "Open", count: tabCounts.Open },
    { name: "Pending", count: tabCounts.Pending },
    { name: "In Progress", count: tabCounts["In Progress"] },
    { name: "Completed", count: tabCounts.Completed },
  ];

  return (
    <div className="task-table">
      <div className="task-container">
        {/* Header */}
        <div className="task-header-box">
          <div>
            <h2 className="task-title">Tasks</h2>
            <p className="task-desc">
              <FaCalendarAlt className="calendar-icon" /> Manage your tasks.
            </p>
          </div>
          <button className="create-btn" onClick={() => setIsModalOpen(true)}>
            + Create
          </button>
        </div>

        {/* Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTask={handleTaskCreate}
        />

        {/* Body */}
        <div className="task-body-box">
          <h3 className="filter-heading">Filter:</h3>
          <div className="filter-row-wrapper">
            <div className="filter-row">
              {/* column selector removed per your snippet */}
              <input
                type="text"
                placeholder="Type to search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="filter-btn">Filter</button>
            </div>
            <div className="side-buttons">
              <button className="footer-btn">⟳ Refresh</button>
              <button className="footer-btn" onClick={exportToCSV}>
                Export to CSV
              </button>
            </div>
          </div>

          {/* Tabs with counts */}
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`tab ${activeTab === tab.name ? "active" : ""}`}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.name} <span className="count">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="task-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th><div className="th-content"><span>Task Id</span><FaSort className="sort-icon" /></div></th>
                  <th><div className="th-content"><span>Priority</span><FaSort className="sort-icon" /></div></th>
                  <th><div className="th-content"><span>Created By</span><FaSort className="sort-icon" /></div></th>
                  <th><div className="th-content"><span>Type</span><FaSort className="sort-icon" /></div></th>
                  <th><div className="th-content"><span>Sub Type</span><FaSort className="sort-icon" /></div></th>
                  <th><div className="th-content"><span>Task Name</span><FaSort className="sort-icon" /></div></th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.length > 0 ? (
                  currentTasks.map((task, idx) => (
                    <tr key={idx}>
                      <td><button>⋮</button></td>
                      <td>{task.id}</td>
                      <td>{task.priority}</td>
                      <td>{task.createdBy}</td>
                      <td>{task.type}</td>
                      <td>{task.subType}</td>
                      <td>{task.name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-records">
                      <i>No record found to display.</i>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>Total Records: {currentTasks.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskTable;
