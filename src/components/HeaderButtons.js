import React, { useContext } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Context as TaskContext } from "../context/TaskManagerContext";

const HeaderButtons = () => {
  const { state, setDisplay } = useContext(TaskContext);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={
          state.display === "All" ? styles.highlightedButton : styles.button
        }
        onPress={() => setDisplay("All")}
      >
        <FontAwesome5
          name="tasks"
          size={24}
          color={state.display === "All" ? "#dd4b39" : "#cacaca"}
        />
        <Text
          style={
            state.display === "All"
              ? styles.highlightedButtonText
              : styles.buttonText
          }
        >
          All
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={
          state.display === "Active" ? styles.highlightedButton : styles.button
        }
        onPress={() => setDisplay("Active")}
      >
        <FontAwesome5
          name="clock"
          size={24}
          color={state.display === "Active" ? "#dd4b39" : "#cacaca"}
        />
        <Text
          style={
            state.display === "Active"
              ? styles.highlightedButtonText
              : styles.buttonText
          }
        >
          Active
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={
          state.display === "Done" ? styles.highlightedButton : styles.button
        }
        onPress={() => setDisplay("Done")}
      >
        <FontAwesome5
          name="check-circle"
          size={24}
          color={state.display === "Done" ? "#dd4b39" : "#cacaca"}
        />
        <Text
          style={
            state.display === "Done"
              ? styles.highlightedButtonText
              : styles.buttonText
          }
        >
          Done
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderButtons;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: 40,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#cacaca",
  },
  highlightedButton: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: 40,
    borderRightWidth: 1,
    borderColor: "#cacaca",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 24,
    marginLeft: 5,
    color: "#cacaca",
  },
  highlightedButtonText: {
    textAlign: "center",
    fontSize: 24,
    marginLeft: 5,
    color: "#dd4b39",
  },
});
