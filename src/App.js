import './App.css';
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux"
import {setTodo, deleteTodo, completedTodo, bgTodo, editedTodo} from "./store/todosSlice";
import { nanoid } from 'nanoid'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { IoIosColorPalette } from 'react-icons/io';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  const todoDispatch = useDispatch();
  const data = useSelector((state)=> state.todos);
  const inputRef = useRef("");

  const [todos, setTodos] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");


  const [name, setName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editTodo, setEditTodo] = useState({});


  useEffect(()=>{   
    setTodos([...data]);
  },[data])

  useEffect(()=>{   
    
  },[todos])


  const hexToRgb = hex => {
    // turn hex val to RGB
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          }
        : null
}
const setContrast = rgb =>
    (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 125 ? 'black' : 'white'


  function handleAddTodo(){
    if(inputRef.current.value?.trim() !== ""){
       if(!isEdit){
          todoDispatch(setTodo({
            id: nanoid(),
            isCompleted: false,
            name: inputRef.current.value,
            bgcolor: "#ffffff",
            color: "#000000"
          }))
          setName("");
          setFilterStatus("all");
       }else{
         todoDispatch(editedTodo({
          id: editTodo.id,
          name
         }))
         setName("")
         setIsEdit(false);
       }
    }else{
      alert("Please enter todo...")
    }
    inputRef.current.value = "";
  }


  function handleDeleteTodo(id){      
     todoDispatch(deleteTodo(id))   
  }

  function handleCompleted(id, e){
    todoDispatch(completedTodo({id, isCompleted:e.currentTarget.checked}))   
 }

 const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

 function handleChangeColor(id, e){ 
  let textColor = setContrast(hexToRgb(e.target.value));  
  throttle(todoDispatch(bgTodo({id, bgcolor:e.target.value, color:textColor}))  , 100);
 }

 function handleEdit(todo){ 
   setIsEdit(true);
   setName(todo.name)    
   setEditTodo({...todo});   
 }


 function handleFilterCompleted(){    
  setFilterStatus("completed");
  let todos = data.filter(v => v.isCompleted === true)
  setTodos([...todos]);
 }

 function handleFilterUnCompleted(){ 
  setFilterStatus("uncompleted");
  let todos = data.filter(v => v.isCompleted === false)
  setTodos([...todos]);
 }

  
  return (
    <div className="container pt-5">
    
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <form action="" onSubmit={ e => e.preventDefault()}>
                <div className="input-group mb-3">
                    <input className="form-control" ref={inputRef} onChange={()=>setName(inputRef.current.value)} value={name} type="text" />
                    <button className="btn btn-dark" type="submit" onClick={handleAddTodo}>
                      {!isEdit? "Add Todo":"Save Edit"}
                    </button>
                </div>
            </form>

             <div className="row">
                 <div className="col-12">
                     <ul className="list-unstyled list-group">
                        {!todos.length ? <p className="text-center">Your list is clear!</p>:""}

                        <ul className="nav justify-content-center">
                            <li className="p-2"><button onClick={()=>{setTodos([...data]);setFilterStatus("all")}} className={`btn ${filterStatus === "all"? "btn-primary":"btn-light"}`}>All</button></li>
                            <li className="p-2"><button onClick={handleFilterCompleted} className={`btn ${filterStatus === "completed"? "btn-primary":"btn-light"}`}>Completed</button></li>
                            <li className="p-2"><button onClick={handleFilterUnCompleted} className={`btn ${filterStatus === "uncompleted"? "btn-primary":"btn-light"}`}>Uncompleted</button></li>
                        </ul>

                        {                          
                          todos.map((todo)=>{
                            return (
                              <li className="list-group-item d-flex align-items-center p-0" style={{backgroundColor:todo.bgcolor, color:todo.color}} key={todo.id}>
                                <div className="form-check lh-sm py-2 ps-4 ms-2 mb-0">
                                  <input onChange={(e)=> handleCompleted(todo.id, e)} className="form-check-input" type="checkbox" checked={todo.isCompleted} id={todo.id} />
                                  <label className={`form-check-label ${todo.isCompleted &&"text-decoration-line-through"}`} htmlFor={todo.id}>
                                     {todo.name}
                                  </label>
                                </div> 
                                <div className="icons d-flex ms-auto ps-3">
                                  <button onClick={()=> handleEdit(todo)} className="btn p-2" style={{color:todo.color}}><AiOutlineEdit /></button>
                                  <button onClick={()=> handleDeleteTodo(todo.id)} className="btn p-2" style={{color:todo.color}}><AiOutlineDelete /></button>
                                  <input style={{width:"1px",height:"1px",opacity:0}} onChange={(e)=>handleChangeColor(todo.id, e)} value={todo.bgcolor} type="color" id={`a${todo.id}`} />
                                  <label htmlFor={`a${todo.id}`} className="btn p-2" style={{color:todo.color}}><IoIosColorPalette /></label>
                                </div>
                              </li>
                            )
                          })
                        }
                     </ul>
                 </div>
             </div>
          </div>
        </div> 
    </div>
  );
}

export default App;
