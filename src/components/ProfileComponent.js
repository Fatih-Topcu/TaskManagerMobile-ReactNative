import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as Google from "expo-google-app-auth";
import { Context as TaskContext } from "../context/TaskManagerContext";

const ANDROID_CLIENT_ID =
  "#############################################.apps.googleusercontent.com";

const signInWithGoogle = async (signIn) => {
  try {
    const result = await Google.logInAsync({
      androidClientId: ANDROID_CLIENT_ID,
      scopes: ["profile", "email"],
    });

    if (result.type === "success") {
      signIn({
        id: result.user.email.replace(/\./g, ":"),
        name: result.user.name,
        photoUrl: result.user.photoUrl,
      });
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    console.log("LoginScreen.js.js 30 | Error with login", e);
    return { error: true };
  }
};



const signOutFromGoogle = (signOut) => {
  signOut();
};

const ProfileComponent = () => {
  
  const { state, signIn, signOut, getStateAtSignIn } = useContext(TaskContext);

  return (
    <View style={{ backgroundColor: "#353a3e" }}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            state.signedIn
              ? signOutFromGoogle(signOut)
              : signInWithGoogle(signIn);
          }}
          style={styles.button}
        >
          <View style={{ padding: 10, alignItems: "center" }}>
            <AntDesign name="google" size={35} color="#ffffff" />
            <Text style={{ color: "#ffffff", fontSize: 16 }}>
              {state.signedIn ? "Logout" : "Login"}
            </Text>
          </View>
        </TouchableOpacity>

        {state.signedIn ? (
          <>
            <View style={styles.userInfo}>
              <Text style={styles.username}>{state.user.name}</Text>
              <Text style={styles.usermail}>
                {state.user.id.replace(/:/g, ".")}
              </Text>
            </View>

            <Image
              style={styles.image}
              source={{
                uri: state.user.photoUrl,
              }}
            />
          </>
        ) : null}
      </View>
    </View>
  );
};

export default ProfileComponent;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  username: {
    fontSize: 20,
    color: "#ffffff",
  },
  usermail: {
    fontSize: 12,
    color: "#ffffff",
  },
  userInfo: {
    left: 30,
  },
  button: {
    borderRadius: 20,
    backgroundColor: "#dd4b39",
  },
});
