import createDataContext from "./createDataContext";
import Toast from "react-native-tiny-toast";


const taskReducer = (state, action) => {
  switch (action.type) {
    case "SIGN_IN":
      return Object.assign({}, state, {
        user: {
          id: action.payload.id,
          photoUrl: action.payload.photoUrl,
          name: action.payload.name,
        },
        signedIn: true,
      });

    case "SIGN_OUT":
      return Object.assign({}, state, {
        user: {
          id: null,
          photoUrl: null,
          name: null,
        },
        signedIn: false,
      });
    case "SET_DISPLAY":
      return { ...state, display: action.payload };
    case "ADD_TASK":
      let date = new Date();
      const newTask = {
        id: state.lastId,
        dateCreated:
          date.getDate() +
          "." +
          (date.getMonth() + 1) +
          "." +
          date.getFullYear(),
        dateCompleted: null,
        description: action.payload,
        show: state.display === "Done" ? true : false,
        done: false,
      };

      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "UPDATE_TASK_STATUS":
      date = new Date();
      date =
        date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();

      const newTasks = state.tasks.map((task) => {
        if (task.id === action.payload) {
          task.done = !task.done;
          task.done ? (task.dateCompleted = date) : (task.dateCompleted = null);

          return task;
        } else return task;
      });

      return { ...state, tasks: newTasks };

    case "GET_STATE_AT_SIGN_IN":
      if (action.payload !== null) {
        return {
          ...state,
          tasks: action.payload.tasks,
          lastId: action.payload.lastId,
        };
      } else return state;

    case "INCREASE_ID":
      return { ...state, lastId: state.lastId + 1 };
    case "FIREBASE_UPDATE_REQUIRED":
      return {
        ...state,
        firebaseUpdateRequired: action.payload === true ? true : false,
      };
    default:
      return state;
  }
};

const signIn = (dispatch) => {
  return (user) => {
    Toast.showLoading("Loading", {
      textColor: "#ffffff",
      duration: 5000,
      mask: true,
      maskColor: "rgba(0,0,0,0.3)",
    });
    dispatch({ type: "SIGN_IN", payload: user });
  };
};

const getStateAtSignIn = (dispatch) => {
  return (newState) => {
    dispatch({ type: "GET_STATE_AT_SIGN_IN", payload: newState });
  };
};

const signOut = (dispatch) => {
  return () => {
    dispatch({ type: "SIGN_OUT" });
  };
};

const setDisplay = (dispatch) => {
  return (type) => {
    dispatch({ type: "SET_DISPLAY", payload: type });
  };
};

const addTask = (dispatch, callback) => {
  return (description) => {
    dispatch({ type: "INCREASE_ID" });
    dispatch({ type: "ADD_TASK", payload: description });
    dispatch({ type: "FIREBASE_UPDATE_REQUIRED", payload: true });
    Toast.showSuccess("Added New Task", {
      textColor: "#ffffff",
    });
    if (callback) {
      callback();
    }
  };
};

const updateTaskStatus = (dispatch) => {
  return (id) => {
    dispatch({ type: "UPDATE_TASK_STATUS", payload: id });
    Toast.show("Task Updated", { textColor: "#ffffff" });
    dispatch({ type: "FIREBASE_UPDATE_REQUIRED", payload: true });
  };
};

const deleteTask = (dispatch) => {
  return (id) => {
    dispatch({ type: "DELETE_TASK", payload: id });
    Toast.show("Task Deleted", { textColor: "#ffffff" });
    dispatch({ type: "FIREBASE_UPDATE_REQUIRED", payload: true });
  };
};

const firebaseUpdateRequired = (dispatch) => {
  return (required) => {
    dispatch({ type: "FIREBASE_UPDATE_REQUIRED", payload: required });
  };
};



export const { Context, Provider } = createDataContext(
  taskReducer,
  {
    signIn,
    signOut,
    setDisplay,
    addTask,
    updateTaskStatus,
    deleteTask,
    getStateAtSignIn,
    firebaseUpdateRequired,
  },
  { display: "All", lastId: 0, tasks: [], firebaseUpdateRequired: false }
);
