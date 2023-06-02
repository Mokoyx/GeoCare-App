import {
  KeyboardAvoidingView,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Home");
      }
    });

    return unsubscribe;
  }, []);

  const onSignUpPressed = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        uid: user.uid,
        isStaff: false,
      });
      navigation.navigate("Home");
      console.log("Registered with:", user.email);
    } catch (error) {
      console.error(error);
    }
  };
  const onSignInPressed = () => {
    navigation.navigate("SignIn");
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
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={{
              backgroundColor: "white",
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 10,
              marginTop: 5,
            }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
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
            onPress={onSignUpPressed}
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
              Register
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSignInPressed}
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
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
