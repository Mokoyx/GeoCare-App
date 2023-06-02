import * as React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Appbar } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("SignIn");
      })

      .catch((error) => {
        console.log(error);
        console.warn("Sign Out");
      });
  };
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        style={{
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 2,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Appbar.Action
          icon={() => (
            <Ionicons name="chevron-back-outline" size={29} color="black" />
          )}
          onPress={() => navigation.navigate("Report")}
        />
        <Appbar.Content title="GeoCare Profile" fontSize={15} />
      </Appbar.Header>

      <View
        style={{
          flex: 1,
          marginTop: 50,
          alignItems: "center",
        }}
      >
        <Image
          source={require("../images/app.png")}
          style={{ width: 150, height: 150, marginBottom: 40 }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
          }}
        >
          Hello user
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
          }}
        >
          {auth.currentUser?.email}
        </Text>
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            backgroundColor: "#0782F9",
            width: "60%",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            marginTop: 40,
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            Sign out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
