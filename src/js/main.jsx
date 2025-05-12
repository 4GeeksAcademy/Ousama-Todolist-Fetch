import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import "../styles/index.css";

function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    getUserTodos();
  }, []);

  const userCreate = () => {
    fetch('https://playground.4geeks.com/todo/users/Ousama', {
      method: "POST"
    })
      .then(resp => {
        if (!resp.ok) throw new Error(`Error al crear usuario: ${resp.status}`);
        return resp.json();
      })
      .then(() => getUserTodos())
      .catch(err => console.log(err));
  };

  const getUserTodos = () => {
    fetch('https://playground.4geeks.com/todo/users/Ousama')
      .then(resp => {
        if (!resp.ok) throw new Error(`Error al obtener tareas: ${resp.status}`);
        return resp.json();
      })
      .then(data => setTareas(data.todos))
      .catch(err => userCreate());
  };

  const agregarTarea = (e) => {
    if (e.key === "Enter" && texto.trim() !== "") {
      const newTask = { label: texto, is_done: false };
      fetch('https://playground.4geeks.com/todo/todos/Ousama', {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(resp => {
          if (!resp.ok) throw new Error(`Error al agregar tarea: ${resp.status}`);
          return resp.json();
        })
        .then(() => {
          setTexto("");
          getUserTodos();
        })
        .catch(err => console.log(err));
    }
  };

  const borrarTarea = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE"
    })
      .then(resp => {
        if (!resp.ok) throw new Error(`Error al borrar tarea: ${resp.status}`);
        return true;
      })
      .then(() => getUserTodos())
      .catch(err => console.log(err));
  };

  const borrarTodasTareas = () => {
    Promise.all(tareas.map(tarea => 
      fetch(`https://playground.4geeks.com/todo/todos/${tarea.id}`, { method: "DELETE" })
    ))
    .then(() => getUserTodos())
    .catch(err => console.log(err));
  };

  return (
    <div className="lista-tareas">
      <h1>Mis Tareas</h1>

      <input
        value={texto}
        onChange={(a) => setTexto(a.target.value)}
        onKeyDown={agregarTarea}
        placeholder="Escribe una tarea y presiona Enter"
      />

      <ul>
        {tareas.length === 0 ? (
          <li>No hay tareas pendientes por realizar</li>
        ) : (
          tareas.map((tarea) => (
            <li key={tarea.id} className="tarea-item">
              {tarea.label}
              <button className="boton-borrar" onClick={() => borrarTarea(tarea.id)}>
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </li>
          ))
        )}
      </ul>

      <p>{tareas.length} {tareas.length === 1 ? "tarea pendiente" : "tareas pendientes"}</p>
      
      <button className="boton-borrar-todas" onClick={borrarTodasTareas}>
        Borrar Todas las Tareas
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Tareas />
  </React.StrictMode>
);
