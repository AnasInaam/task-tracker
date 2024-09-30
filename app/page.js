"use client";
import React, { useState, useEffect } from "react";

// Importing necessary packages for drag-and-drop
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Page = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [mainTask, setMainTask] = useState(() => {
    // Retrieve tasks from localStorage if available
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [darkMode, setDarkMode] = useState(false);

  // Save tasks to localStorage whenever mainTask changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(mainTask));
  }, [mainTask]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (title && desc) {
      setMainTask([...mainTask, { title, desc, completed: false }]); // Adding completed state
      setTitle("");
      setDesc("");
    }
  };

  const deleteHandler = (i) => {
    let copytask = [...mainTask];
    copytask.splice(i, 1);
    setMainTask(copytask);
  };

  const completeHandler = (i) => {
    const updatedTasks = [...mainTask];
    updatedTasks[i].completed = !updatedTasks[i].completed; // Toggle completed state
    setMainTask(updatedTasks);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(mainTask);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setMainTask(items);
  };

  let renderTask;
  if (mainTask.length === 0) {
    renderTask = (
      <h2 className="bg-slate-600 font-serif font-black p-4 text-white">
        No Task Available
      </h2>
    );
  } else {
    renderTask = (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              className="mt-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {mainTask.map((t, i) => (
                <Draggable key={i} draggableId={t.title + i} index={i}>
                  {(provided) => (
                   <li
                   className={`flex items-center justify-between p-4 ${
                     t.completed ? "bg-green-200" : "bg-gray-100"
                   } dark:bg-gray-800 rounded-lg shadow-md mb-2 transition-transform duration-200 ease-in-out`}
                   {...provided.draggableProps}
                   {...provided.dragHandleProps}
                   ref={provided.innerRef}
                 >
                   <div>
                     <h5
                       className={`font-bold text-lg ${
                         t.completed
                           ? "text-gray-500 line-through dark:text-gray-400"
                           : "text-black dark:text-white"
                       }`}
                     >
                       {t.title}
                     </h5>
                     <h6
                       className={`font-semibold ${
                         t.completed
                           ? "text-gray-400 line-through"
                           : "text-gray-700 dark:text-gray-300"
                       }`}
                     >
                       {t.desc}
                     </h6>
                   </div>
                 
                   {/* Right-aligned Buttons */}
                   <div className="ml-auto flex space-x-2">
                     {/* Complete Task Button */}
                     <button
                       onClick={() => completeHandler(i)}
                       className="bg-green-500 text-white font-semibold py-2 px-4 border border-green-600
                       rounded-lg hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2
                       focus:ring-green-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
                     >
                       {t.completed ? "Undo" : "Complete"}
                     </button>
                 
                     {/* Delete Button */}
                     <button
                       onClick={() => deleteHandler(i)}
                       className="bg-red-500 text-white font-semibold py-2 px-4 border border-red-600
                       rounded-lg hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2
                       focus:ring-red-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
                     >
                       Delete
                     </button>
                   </div>
                 </li>
                 
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-700 transition-colors duration-500">
        {/* Header */}
        <header className="flex justify-between items-center bg-slate-600 p-5">
        <div className="flex-1 text-center">
    <h1 className="text-3xl font-bold text-white">Task Manager</h1>
  </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-semibold py-2 px-4 border border-gray-300
            rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2
            focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </header>

        {/* Form */}
        <form
          className="flex flex-col md:flex-row items-center justify-center mt-8 px-4"
          onSubmit={submitHandler}
        >
          <input
            type="text"
            className="w-full md:w-1/3 text-xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 
            text-center text-black dark:text-white rounded-xl mb-4 md:mb-0 md:mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Task Here"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />

          <input
            type="text"
            className="w-full md:w-1/3 text-xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 
            text-center text-black dark:text-white rounded-xl mb-4 md:mb-0 md:mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Description here"
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />

          <button
            type="submit"
            className="w-full md:w-auto bg-violet-500 text-white font-semibold py-2 px-4 border border-violet-600
            rounded-lg hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring-2
            focus:ring-violet-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
          >
            Add Task
          </button>
        </form>

        <hr className="my-8 border-gray-300 dark:border-gray-700" />

        {/* Task List */}
        <div className="p-7 bg-slate-200 dark:bg-gray-700 transition-colors duration-500">
          {renderTask}
        </div>
      </div>
    </div>
  );
};

export default Page;
