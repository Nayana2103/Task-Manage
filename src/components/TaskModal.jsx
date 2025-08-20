import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import { useForm } from "react-hook-form";
import "../styles/TaskModal.css";

const TaskModal = ({ isOpen, onClose, onAddTask}) => {
  const [priority, setPriority] = useState("Medium");
  const [messageApi, contextHolder] = message.useMessage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger, // 👈 used for live validation
  } = useForm();

  const emailValue = watch("email");
  const phoneValue = watch("phone");

  // Live validation when one of them changes
  useEffect(() => {
    if (emailValue) {
      trigger("phone");
    }
    if (phoneValue) {
      trigger("email");
    }
  }, [emailValue, phoneValue, trigger]);

  const getPriorityClass = () => {
    switch (priority) {
      case "Low":
        return "text-green-600";
      case "Medium":
        return "text-orange-500";
      case "High":
        return "text-red-600";
      default:
        return "";
    }
  };

  /**const onSubmit = (data) => {
    if (onAddTask) {
      onAddTask({
        ...data,
        id: Date.now(), // unique ID for table
        priority,
        status: data.status || "Open",
      });
    }
    console.log("Form Submitted:", data);
    messageApi.success("Task created successfully");
    reset();
    onClose();
  };**/
  const onSubmit = (data) => {
  if (onAddTask) {
    onAddTask({
      id: "T" + Date.now(),        // similar format as dummyData
      priority,
      createdBy: "Mohamed Rifthy", // hardcoded for now
      type: data.taskType,
      subType: data.engagement || "-", 
      name: data.taskName,
      status: data.status || "Open",
    });
  }
  messageApi.success("Task created successfully");
  reset();
  onClose();
};


  return (
    <>
      {contextHolder}
      <Modal
        title="Create Task"
        open={isOpen}
        onCancel={() => {
          reset();
          onClose();
        }}
        footer={null}
        width={600}
        centered
        closable
        transitionName=""
        maskTransitionName=""
      >
        <div className="TaskModal">
          <div className="task-form">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* ==== Guest Details ==== */}
              <h3 className="section-title">Guest Details</h3>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="error">{errors.name.message}</p>}
                </div>
              </div>

              {/* Email OR Phone */}
              <div className="form-grid-inline">
                {/* Email */}
                <div className="form-group half">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    {...register("email", {
                      validate: (v) => {
                        if (!v && !phoneValue) {
                          return "Email is required";
                        }
                        if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
                          return "Invalid email format";
                        }
                        return true;
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="error">{errors.email.message}</p>
                  )}
                </div>

                {/* OR separator */}
                <div className="or-center">OR</div>

                {/* Phone */}
                <div className="form-group half">
                  <label>Phone</label>
                  <input
                    type="tel"
                    placeholder="Enter Phone"
                    {...register("phone", {
                      validate: (v) => {
                        if (!v && !emailValue) {
                          return "Phone is required";
                        }
                        if (v && !/^[0-9]{10}$/.test(v)) {
                          return "Invalid phone number";
                        }
                        return true;
                      },
                    })}
                  />
                  {errors.phone && (
                    <p className="error">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <hr className="form-divider" />

              {/* ==== Task Details ==== */}
              <h3 className="section-title">Task Details</h3>
              <div className="form-grid">
                <div className="form-group half">
                  <label>Created By</label>
                  <input type="text" value="Mohamed Rifthy" disabled />
                </div>

                <div className="form-group half">
                  <label>Assigned To</label>
                  <select
                    {...register("assignedTo", {
                      required: "Please select an agent",
                    })}
                  >
                    <option value="">Select Agent</option>
                    <option value="Agent A">Agent A</option>
                    <option value="Agent B">Agent B</option>
                  </select>
                  {errors.assignedTo && (
                    <p className="error">{errors.assignedTo.message}</p>
                  )}
                </div>

                <div className="form-group full">
                  <label>Task Name</label>
                  <input
                    type="text"
                    placeholder="Enter Task Name"
                    {...register("taskName", { required: "Task name is required" })}
                  />
                  {errors.taskName && (
                    <p className="error">{errors.taskName.message}</p>
                  )}
                </div>

                <div className="form-group full">
                  <label>Task Type</label>
                  <select
                    {...register("taskType", {
                      required: "Task type is required",
                    })}
                  >
                    <option value="">Select Type</option>
                    <option value="Bug">Bug</option>
                    <option value="Feature">Feature</option>
                    <option value="Improvement">Improvement</option>
                  </select>
                  {errors.taskType && (
                    <p className="error">{errors.taskType.message}</p>
                  )}
                </div>

                <div className="form-group full">
                  <label>Task Details</label>
                  <textarea
                    placeholder="Enter Details"
                    {...register("details", {
                      required: "Task details are required",
                    })}
                  ></textarea>
                  {errors.details && (
                    <p className="error">{errors.details.message}</p>
                  )}
                </div>

                <div className="form-group half">
                  <label>Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    {...register("priority", { required: "Priority is required" })}
                    className={`${getPriorityClass()} font-semibold`}
                  >
                    <option value="Low" className="text-green-600">Low</option>
                    <option value="Medium" className="text-orange-500">Medium</option>
                    <option value="High" className="text-red-600">High</option>
                  </select>
                  {errors.priority && (
                    <p className="error">{errors.priority.message}</p>
                  )}
                </div>

                <div className="form-group half">
                  <label>Status</label>
                  <select defaultValue="Open" {...register("status")}>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div className="form-group full">
                  <label>Engagement</label>
                  <input
                    type="text"
                    placeholder="Enter Engagement"
                    {...register("engagement")}
                  />
                </div>

                <div className="form-group half">
                  <label>Start Date</label>
                  <input type="date" {...register("startDate")} />
                </div>
                <div className="form-group half">
                  <label>End Date</label>
                  <input type="date" {...register("endDate")} />
                </div>

                <div className="form-group full">
                  <label>Remarks</label>
                  <textarea
                    placeholder="Enter Remarks"
                    {...register("remarks")}
                  ></textarea>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TaskModal;
