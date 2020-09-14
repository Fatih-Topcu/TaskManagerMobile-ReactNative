import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Context as TaskContext } from "../context/TaskManagerContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import firebase from "../../firebaseConfig";
import AsyncStorage from "@react-native-community/async-storage";

getFirebaseState = (id, getStateAtSignIn) => {
  const db = firebase.database();

  db.ref(`users/${id}/state`).on("value", (snapshot) => {
    getStateAtSignIn(snapshot.val());
  });
};

updateFirebase = (state, firebaseUpdateRequired) => {
  const { tasks, lastId, user } = state;
  let toUpdate = {
    tasks: tasks,
    lastId: lastId,
  };
  toUpdate = JSON.parse(JSON.stringify(toUpdate));
  if (state.signedIn) {
    firebase.database().ref(`users/${user.id}/state/`).set(toUpdate);
  } else {
    storeToLocalState(toUpdate);
  }

  firebaseUpdateRequired(false);
};

const storeToLocalState = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("@TASKMANAGER_STATE", jsonValue);
  } catch (e) {
    // saving error
  }
};

const getLocalState = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@TASKMANAGER_STATE");
    return JSON.parse(jsonValue);
  } catch (e) {
    // error reading value
  }
};

const TaskListCompoenent = () => {
  const [taskInView, setTaskInView] = useState("");
  const {
    state,
    updateTaskStatus,
    deleteTask,
    getStateAtSignIn,
    firebaseUpdateRequired,
  } = useContext(TaskContext);

  useEffect(() => {
    if (getLocalState() !== null)
      getLocalState().then((res) => {
        getStateAtSignIn(res);
      });
  }, []);

  useEffect(() => {
    if (state.signedIn === true) {
      getFirebaseState(state.user.id, getStateAtSignIn);
    } else {
      getLocalState().then((res) => {
        getStateAtSignIn(res);
      });
    }
  }, [state.signedIn]);

  useEffect(() => {
    if (state.firebaseUpdateRequired === true) {
      updateFirebase(state, firebaseUpdateRequired);
    }
  }, [state.firebaseUpdateRequired]);

  let listData;
  if (state.display === "Done") {
    listData = state.tasks.filter((task) => task.done === true);
  } else if (state.display === "Active") {
    listData = state.tasks.filter((task) => task.done === false);
  } else {
    listData = [...state.tasks];
  }

  return listData.length > 0 ? (
    <FlatList
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      data={listData}
      keyExtractor={(item) => "" + item.id}
      renderItem={({ item }) => {
        return (
          <View style={styles.taskOuter}>
            <View style={styles.task}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => updateTaskStatus(item.id)}
              >
                {item.done ? (
                  <Fontisto name="checkbox-active" size={28} color="#dd4b39" />
                ) : (
                  <Fontisto name="checkbox-passive" size={30} color="#dd4b39" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTaskInView(item.id)}
                style={styles.description}
              >
                <Text
                  style={
                    item.done
                      ? styles.descriptionDone
                      : styles.descriptionActive
                  }
                  numberOfLines={taskInView === item.id ? 100 : 3}
                >
                  {item.description}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  deleteTask(item.id);
                }}
              >
                <MaterialIcons name="delete" size={36} color="#dd4b39" />
              </TouchableOpacity>
            </View>
            <View style={styles.dates}>
              <Text style={styles.dateText}>Created On:{item.dateCreated}</Text>
              {item.done ? (
                <Text style={styles.dateText}>
                  Completed On:{item.dateCompleted}
                </Text>
              ) : null}
            </View>
          </View>
        );
      }}
    />
  ) : null;
};

export default TaskListCompoenent;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 10,
    borderColor: "rgb(202, 202, 202)",
    borderWidth: 0.5,
    flex: 1,
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskOuter: {
    borderBottomColor: "rgb(202, 202, 202)",
    borderBottomWidth: 0.75,
  },
  description: {
    flex: 1,
    marginHorizontal: 10,
    alignSelf: "center",
  },
  descriptionActive: {
    fontSize: 18,
    fontFamily: "Roboto",
  },
  descriptionDone: {
    color: "#9c9a9a",
    textDecorationLine: "line-through",
    fontStyle: "italic",
    fontSize: 18,
    fontFamily: "Roboto",
  },
  button: {
    alignSelf: "center",
  },
  dates: {
    justifyContent: "space-between",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  dateText: {
    color: "#dd4b39",
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: "bold",
  },
});
