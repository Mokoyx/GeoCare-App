import {
  KeyboardAvoidingView,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is already logged in, navigate to home screen
        navigation.navigate("Home");
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [navigation]);

  const navigation = useNavigation();
  const onSignInPressed = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate("Home");
        console.log("login success");
      })
      .catch((error) => {
        console.log("Oops", error);
        Alert.alert("Error", error.message);
      });
  };
  const onSignUpPressed = () => {
    navigation.navigate("SignUp");
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        behavior="padding"
      >
        <Image
          source={require("../images/app.png")}
          style={{ width: 150, height: 150, marginBottom: 40 }}
        />
        <View style={{ width: "80%" }}>
          <TextInput
            name="email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{
              backgroundColor: "white",
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 10,
              marginTop: 5,
            }}
          />
          <TextInput
            name="password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={{
              backgroundColor: "white",
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 10,
              marginTop: 5,
            }}
            secureTextEntry
          />
        </View>

        <View
          style={{
            width: "60%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
          }}
        >
          <TouchableOpacity
            onPress={onSignInPressed}
            style={{
              backgroundColor: "#0782F9",
              width: "100%",
              padding: 15,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSignUpPressed}
            style={[
              {
                backgroundColor: "#0782F9",
                width: "100%",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
              },
              {
                backgroundColor: "white",
                marginTop: 5,
                borderColor: "#0782F9",
                borderWidth: 2,
              },
            ]}
          >
            <Text
              style={{
                color: "#0782F9",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
