import {createSlice} from "@reduxjs/toolkit";

JSON.parse(localStorage.getItem("todos")) ?? localStorage.setItem("todos", JSON.stringify([]))
const todosSlice = createSlice({
    name: "todos",
    initialState: JSON.parse(localStorage.getItem("todos")),
    reducers:{
        setTodo(state, action){       
            state.push(action.payload);
            localStorage.setItem("todos", JSON.stringify(state, action.payload));
        },
        deleteTodo(state, action){ 
            state = state.filter(v => v.id !== action.payload)
            localStorage.setItem("todos", JSON.stringify(state));
            return state;            
        },
        completedTodo(state, action){ 
            state = state.map(v => v.id === action.payload.id ? {...v, isCompleted: action.payload.isCompleted}: v);
            localStorage.setItem("todos", JSON.stringify(state));          
            return state;            
        },
        bgTodo(state, action){ 
            state = state.map(v => v.id === action.payload.id ? {...v, bgcolor: action.payload.bgcolor, color: action.payload.color}: v);
            localStorage.setItem("todos", JSON.stringify(state));
            return state;            
        },
        editedTodo(state, action){ 
            state = state.map(v => v.id === action.payload.id ? {...v, name: action.payload.name}: v);
            localStorage.setItem("todos", JSON.stringify(state));
            return state;            
        }
    }
})

export const {setTodo, deleteTodo, completedTodo, bgTodo, editedTodo} = todosSlice.actions;
export default todosSlice.reducer;