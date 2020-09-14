import React, { useContext, useState, useEffect } from "react";
import { Context as TaskManagerContext } from "../context/TaskManagerContext";
import { StyleSheet, View, TextInput, Text, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";


const AddTaskScreen = ({ navigation }) => {
  const { addTask } = useContext(TaskManagerContext);
  const [content, setContent] = useState(null);
  const [pressed, setPressed] = useState();

  useEffect(() => {
    setPressed(false);
  }, []);

  return (
    <>
      <Text style={styles.title}>Add a New Task</Text>
      <View style={styles.container}>
        <TextInput
          placeholder="Task Description.."
          placeholderTextColor="#cacaca"
          autoCapitalize="none"
          multiline
          textAlignVertical="top"
          style={styles.input}
          onChangeText={(text) => setContent(text)}
          value={content}
        />
        <TouchableOpacity
          onPress={() => {
            if (!pressed && content !== "" && /\S/.test(content) && content) {
              setPressed(true);
              addTask(content, navigation.navigate("Home"));            
            }
          }}
          style={styles.button}
        >
          <Text style={{ color: "#ffffff" }}>ADD</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  input: {
    width: 320,
    height: 200,
    borderWidth: 1,
    borderColor: "#cacaca",
    bottom: 25,
    fontSize: 16,
    padding: 5,
  },
  title: {
    fontSize: 24,
    padding: 5,
    backgroundColor: "#ffffff",
    color: "#dd4b39",
  },
  button: {
    backgroundColor: "#dd4b39",
    width: 100,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default AddTaskScreen;
