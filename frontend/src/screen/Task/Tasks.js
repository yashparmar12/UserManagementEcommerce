import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { BookType, ClipboardPenLine, BookOpen } from 'lucide-react';


const Tasks = (props) => {
    const [taskOpen, settaskOpen] = useState(false);
    const [taskText, settaskText] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [addTask, setAddTask] = useState(false);
    const [ids, setids] = useState([]);
    
    const closeTask = () => {
        setAddTask(false);
    };
    const taskContent = [
        {
            taskName: taskText,  
            startTime:  "",  
            endTime:  "",
            totalTime:  "",
        },
    ];


    const submitTask = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://usermanagementecommerce-1.onrender.com/api/user/task", {
            // const response = await fetch("http://localhost:8000/api/user/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ids: ids || [], content: taskContent }),
            });

            const result = await response.json();
            // console.log(result);

            if (result.success) {
                setShowAlert(true);
                settaskText("");
            }
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);

            closeTask();
        } catch (error) {
            console.log(error);
        }
    };

    const addTaskModalShow = () => {
        setAddTask(true);
        settaskOpen(false);
    };

    useEffect(() => {
        if (props.userIds) {
            setids(props.userIds);
        }
    }, [props.userIds]); 

    return (
        <div>
            {showAlert && (
                <div
                    className="bg-green-500 text-white font-semibold tracking-wide flex items-center w-max max-w-sm p-4 rounded-md shadow-md shadow-blue-200"
                    style={{
                        position: "fixed",
                        top: "30px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1000,
                    }}
                    role="alert"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-[18px] shrink-0 fill-white inline mr-3"
                        viewBox="0 0 512 512"
                    >
                        <ellipse
                            cx="256"
                            cy="256"
                            fill="#fff"
                            data-original="#fff"
                            rx="256"
                            ry="255.832"
                        />
                        <path
                            class="fill-green-500"
                            d="m235.472 392.08-121.04-94.296 34.416-44.168 74.328 57.904 122.672-177.016 46.032 31.888z"
                            data-original="#ffffff"
                        />
                    </svg>

                    <span class="block sm:inline text-sm mr-3">Sent Successfully</span>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3 cursor-pointer shrink-0 fill-white ml-auto"
                        viewBox="0 0 320.591 320.591"
                        onClick={() => setShowAlert(false)}
                    >
                        <path
                            d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                            data-original="#000000"
                        />
                        <path
                            d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                            data-original="#000000"
                        />
                    </svg>
                </div>
            )}

            <div className="">
            <button
                onClick={() => settaskOpen(!taskOpen)}
                className="inline-flex items-center  bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none transition duration-150 ease-in-out "
                style={{ width: "80px", marginLeft: "-110px", marginTop: "5px" }}
            >
                <BookType className="h-5 "/>

                Task
            </button>
            </div>
            {taskOpen && (
                <div
                    className="origin-top-right absolute mt-2 rounded-md shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none z-20 transition-all duration-300 ease-in-out"
                    style={{ marginLeft: "-130px", width: "120px" }}
                >
                    <div
                        className="py-2"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        <button
                            onClick={() => addTaskModalShow()}
                            className="!bg-gray-100 !text-gray-700 hover:!bg-blue-500 hover:!text-white flex items-center w-full px-8 py-2 text-sm rounded-t-md focus:outline-none transition duration-150 ease-in-out"
                            role="menuitem"
                        >
                            <ClipboardPenLine className="h-4 mr-1"/>
                            <span>Add</span>
                        </button>

                        <Link
                            to="/allTasks"
                            className="!bg-gray-100 !text-gray-700 hover:!bg-blue-500 hover:!text-white flex items-center w-full px-8 py-2 text-sm rounded-b-md focus:outline-none transition duration-150 ease-in-out"
                            role="menuitem"
                        >
                            <BookOpen className="h-4 mr-2"/>
                            <span>Show</span>
                            
                        </Link>
                    </div>
                </div>
            )}

            {/* ---------------Add Task Modal--------------------- */}
            <Modal
                isOpen={addTask}
                onRequestClose={closeTask}
                style={{
                    overlay: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 10s ease-in-out",
                    },
                    content: {
                        position: "relative",
                        width: "400px",
                        margin: "auto",
                        borderRadius: "10px",
                        padding: "20px",
                        border: "none",
                        backgroundColor: "#fff",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    },
                }}
                contentLabel="Are you sure you want to delete?"
            >
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0, color: "#333" }}>Add Tasks</h3>
                    <textarea
                        placeholder="Enter your task here..."
                        style={{
                            width: "100%",
                            height: "100px",
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                        value={taskText}
                        onChange={(e) => settaskText(e.target.value)}
                    ></textarea>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                    }}
                >
                    <button
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#f0f0f0",
                            border: "none",
                            borderRadius: "5px",
                            color: "#333",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                        onClick={closeTask}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500"
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "5px",
                            color: "#fff",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                        onClick={submitTask}
                    >
                        Submit
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Tasks;
