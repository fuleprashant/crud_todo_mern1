import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [todo, setTodo] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const navigate = useNavigate();

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/todo/gettodo", {
        withCredentials: true,
      });
      setTodo(response.data.todos);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch the data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const todocreate = async () => {
    if (!newTodo) return;
    try {
      const response = await axios.post(
        "http://localhost:4000/todo/create",
        { text: newTodo, completed: false },
        { withCredentials: true }
      );
      setTodo([...todo, response.data.newTodo]);
      setNewTodo("");
      toast.success("Todo added successfully!");
    } catch (error) {
      console.log(error);
      setError("Failed to create a todo");
    }
  };

  const editTodo = async () => {
    if (!editingTodo || !newTodo) return;

    try {
      const response = await axios.put(
        `http://localhost:4000/todo/updatetodo/${editingTodo._id}`,
        { text: newTodo },
        { withCredentials: true }
      );

      setTodo(
        todo.map((t) => (t._id === editingTodo._id ? response.data.todo : t))
      );
      setNewTodo(""); // Clear input field
      setEditingTodo(null); // Reset editing state
      toast.success("Todo updated successfully!");
    } catch (error) {
      console.error("Error updating todo:", error);
      setError("Failed to update the todo");
      toast.error("Failed to update todo");
    }
  };

  const updateTodo = async (id) => {
    const todoUpdate = todo.find((t) => t._id === id);

    try {
      const response = await axios.put(
        `http://localhost:4000/todo/updatetodo/${id}`,
        { completed: !todoUpdate.completed },
        { withCredentials: true }
      );
      setTodo(todo.map((t) => (t._id === id ? response.data.todo : t)));
    } catch (error) {
      console.error("Error updating todo:", error);
      setError("Failed to update the todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/todo/delete/${id}`, {
        withCredentials: true,
      });

      setTodo(todo.filter((t) => t._id !== id));
    } catch (error) {
      setError("Failed to delete the todo");
    }
  };

  const Logout = async () => {
    try {
      const response = await axios.get("http://localhost:4000/user/logout", {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("jwt");
      navigate("/login");
    } catch (error) {
      setError("Failed to logout");
      toast.error("Failed to logout");
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo); // Set the todo being edited
    setNewTodo(todo.text); // Set the input field value
  };

  const handleSubmit = () => {
    if (editingTodo) {
      editTodo(); // Update existing todo
    } else {
      todocreate(); // Create new todo
    }
  };

  return (
    <div className="bg-gray-100 max-w-lg lg:max-w-xl rounded-lg mx-auto mt-11">
      <h1 className="text-2xl font-semibold text-center mb-2 p-3">Todo App</h1>
      <div>
        <input
          type="text"
          placeholder="Add a new todo"
          className="flex-grow p-2 border rounded-r-md focus:outline-none ml-28"
          onChange={(e) => setNewTodo(e.target.value)}
          value={newTodo}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          className="bg-blue-600 border rounded-r-md text-white px-4 py-2 hover:bg-blue-900 duration-300"
          onClick={handleSubmit}
        >
          {editingTodo ? "Update" : "Add"}
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <span className="text-gray-500">Loading....</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 font-semibold">{error}</div>
      ) : (
        <ul className="space-y-2 m-10">
          {todo.map((tod) => (
            <li
              key={tod._id}
              className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={tod.completed}
                  onChange={() => updateTodo(tod._id)}
                />
                <span
                  className={`${
                    tod.completed
                      ? "line-through text-gray-800 font-semibold"
                      : ""
                  }`}
                >
                  {tod.text}
                </span>
              </div>
              <button
                className="text-red-500 hover:text-red-800 duration-300"
                onClick={() => deleteTodo(tod._id)}
              >
                Delete
              </button>
              <button
                className="ml-2 text-blue-500 hover:text-blue-800 duration-300"
                onClick={() => handleEditClick(tod)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-center text-sm text-gray-700">
        {todo.filter((t) => !t.completed).length} todos remaining
      </p>
      <button
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800 duration-500 mx-auto block"
        onClick={Logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
