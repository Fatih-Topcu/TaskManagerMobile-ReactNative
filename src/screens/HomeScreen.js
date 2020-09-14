import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import HeaderButtons from "../components/HeaderButtons";
import ProfileComponent from "../components/ProfileComponent";
import TaskListComponent from "../components/TaskListComponent";

const HomeScreen = () => {
  return (
    <View style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <ProfileComponent />
      <HeaderButtons />
      <TaskListComponent />
    </View>
  );
};

export default HomeScreen;

HomeScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("AddTask");
        }}
      >
        <View
          style={{
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome5 name="plus-circle" size={30} color="#dd4b39" />
          <Text style={styles.googleLoginText}>Add Task</Text>
        </View>
      </TouchableOpacity>
    ),
  };
};

const styles = StyleSheet.create({
  googleLoginText: {
    color: "#dd4b39",
    fontSize: 12,
  },
});
