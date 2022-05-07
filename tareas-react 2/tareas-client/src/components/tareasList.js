import {useEffect, useState} from 'react';
import Tarea from './tarea';
import TareasForm from "./tareasForm";

const TareasList = () => {

    /* como arraylist
    const lista = [
        {
            name: "tarea1",
            id: 1,
            materia: "materia1",
            puntos: 100,
            fechaEntrega: "2022-03-20",
            fechaCreacion: "2022-03-19"
        },
        {
            name: "tarea2",
            id: 2,
            materia: "materia2",
            puntos: 100,
            fechaEntrega: "2022-03-25",
            fechaCreacion: "2022-03-19"
        }
    ];
    */

    const[tareas, setTareas] = useState([]);
    const[showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetch("https://tareasapi.azurewebsites.net/tareas/mensajes")
            .then((res) => res.json())
            .then((data) => setTareas(data.data))
            .catch((err) => console.log(`Error: " ${err}`))
    }, [])

    const getTareas = () => {
        fetch("https://tareasapi.azurewebsites.net/tareas/mensajes")
            .then((res) => res.json())
            .then((data) => setTareas(data.data))
            .then((err) => console.log(`Error: ${err}`));
    }

    const createTarea = (data) => {
        try {
            fetch("https://tareasapi.azurewebsites.net/tareas", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(dataResponse => {
                    setTareas([...tareas, dataResponse.data])
                    setShowForm(false)
                })
        } catch (err){
            console.log(err)
        }
    }

    const deleteTarea = (data) => {
        try {
            fetch(`https://tareasapi.azurewebsites.net/tareas/${data}`, {
                method: "DELETE"
            })
                .then(response => response.json())
                .then(dataResponse => {
                    console.log(dataResponse)
                    // setTareas([...tareas, dataResponse.data])
                })
                .then(() => {
                    getTareas()
                })
        } catch (err){
            console.log(err)
        }
    }

    const updateTarea = (data) => {
        try {
            fetch(`https://tareasapi.azurewebsites.net/tareas/${data._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(dataResponse => {
                    //setTareas(tareas.map(tarea => tarea.id === dataResponse.data.id ? dataResponse.data : tarea));
                    setShowForm(false);
                }).then(() =>{
                    getTareas()
            });
        } catch (err) {
            console.log(err);
        }
    }

    return(
        <div>
            {tareas.map((tarea, index) => (
                <Tarea
                key={index}
                index={index}
                tarea={tarea}
                onDelete={deleteTarea}
                onUpdate={updateTarea}
                />
            ))}
            <button className="new-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cerrar" : "Nueva tarea"}
            </button>
            {showForm && <TareasForm onClickFn={createTarea}></TareasForm>}
        </div>

    );
}

export default TareasList;