import {
  View,
  Text,
  TextInput,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Location from "expo-location";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, storage } from "../../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

export default function CameraScreen() {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const navigation = useNavigation();

  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [photo, setPhoto] = useState();
  const [report, setReport] = useState();
  const [showButton, setShowButton] = useState(true);
  const [waste, setWaste] = useState(false);
  const [police, setPolice] = useState(false);
  const [vehicle, setVehicle] = useState(false);
  const [fire, setFire] = useState(false);
  const [calamity, setCalamity] = useState(false);
  const [traffic, setTraffic] = useState(false);

  useEffect(() => {
    (async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        // Get the current location
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setCurrentLocation({ latitude, longitude });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  const handleButtonPress = () => {
    setShowButton(false);
    setWaste(true);
  };
  const handleButtonPress2 = () => {
    setShowButton(false);
    setPolice(true);
  };
  const handleButtonPress3 = () => {
    setShowButton(false);
    setVehicle(true);
  };
  const handleButtonPress4 = () => {
    setShowButton(false);
    setFire(true);
  };
  const handleButtonPress5 = () => {
    setShowButton(false);
    setCalamity(true);
  };
  const handleButtonPress6 = () => {
    setShowButton(false);
    setTraffic(true);
  };
  const handleCancelPress = () => {
    setShowButton(true);
    setPhoto(undefined);
  };

  if (showButton) {
    return (
      <SafeAreaView style={styles.buttonContainer}>
        <Text
          style={{
            color: "orange",
            fontSize: 25,
            fontWeight: "bold",
            marginBottom: 40,
          }}
        >
          - SELECT TYPE OF REPORT -
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress("Waste")}
        >
          <Ionicons name="trash" size={30} color="green" />
          <Text style={{ color: "grey", fontSize: 18, fontWeight: "bold" }}>
            Waste Management
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress2("Police")}
        >
          <Ionicons name="star" size={30} color="gold" />
          <Text style={{ color: "grey", fontSize: 18, fontWeight: "bold" }}>
            Police Assistance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress3("Vehicle")}
        >
          <Ionicons name="medkit" size={30} color="firebrick" />
          <Text style={{ color: "grey", fontSize: 18, fontWeight: "bold" }}>
            First Aid Emergency
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress4("Fire")}
        >
          <Ionicons name="bonfire" size={30} color="orange" />
          <Text style={{ color: "grey", fontSize: 18, fontWeight: "bold" }}>
            Fire Emergency
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress5("Calamity")}
        >
          <Ionicons name="water" size={30} color="cornflowerblue" />
          <Text style={{ color: "grey", fontSize: 18, fontWeight: "bold" }}>
            Calamity / Flood
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress6("Traffic")}
        >
          <Ionicons name="car" size={30} color="darkcyan" />
          <Text style={{ color: "grey", fontSize: 18, fontWeight: "bold" }}>
            Traffic Management
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    const saveReport = async () => {
      try {
        const photoRef = ref(storage, `Images/image-${Date.now()}.jpg`);
        const response = await fetch(photo.uri);
        const blob = await response.blob();
        await uploadBytes(photoRef, blob);
        const photoUrl = await getDownloadURL(photoRef);

        const reportsCollection = collection(db, "reports");
        setDoc(doc(reportsCollection), {
          location: currentLocation, // Save the current location
          reportText: report,
          photo: photoUrl,
          done: false,
          waste: waste,
          police: police,
          vehicle: vehicle,
          fire: fire,
          calamity: calamity,
          traffic: traffic,
          date: Date.now(),
        }).then(() => {
          navigation.navigate("Map");
          console.log("Report saved successfully");
          // Clear the report text after saving
          setReport("");
          setPhoto("");
        });
      } catch (error) {
        console.error("Error saving report: ", error);
      }
    };

    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <SafeAreaView style={styles.safeView}>
          <View style={styles.mainContain}>
            <View style={styles.imageContain}>
              <Image
                style={styles.imageStyle}
                resizeMode="contain"
                source={{ uri: "data:image/jpg;base64," + photo.base64 }}
              />
            </View>

            <View style={styles.tripleButtonContain}>
              <TouchableOpacity
                style={styles.tripleTouchable}
                onPress={() => setPhoto(undefined)}
              >
                <View style={styles.tripleButtonView}>
                  <Ionicons name="trash-bin-outline" size={25} color="red" />
                  <Text style={styles.tripleText}>RETAKE PICTURE</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.reportMainContainer}>
              <View style={styles.reportContainer}>
                <View style={styles.reportView}>
                  <Text style={styles.reportText}>Enter Detail's Here:</Text>
                </View>
                <View
                  style={{
                    flex: 9,
                  }}
                >
                  <KeyboardAvoidingView>
                    <TextInput
                      value={report}
                      style={styles.reportInput}
                      placeholder="Type report here..."
                      onChangeText={(text) => setReport(text)}
                      multiline={true}
                    />
                  </KeyboardAvoidingView>
                </View>
              </View>
            </View>

            <View style={styles.doubleButtonContainer}>
              <TouchableOpacity
                style={styles.doubleTouchable}
                onPress={handleCancelPress}
              >
                <View style={styles.doubleTouchableView}>
                  <Ionicons name="trash-bin-outline" size={25} color="grey" />
                  <Text style={styles.doubleTouchableText}> Cancel</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.doubleTouchable}
                onPress={saveReport}
              >
                <View style={styles.doubleTouchableView}>
                  <Ionicons name="paper-plane-outline" size={25} color="grey" />
                  <Text style={styles.doubleTouchableText}> REPORT</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <Camera style={styles.cameraContainer} ref={cameraRef}>
      <TouchableOpacity style={styles.cameraTouchable} onPress={takePic}>
        <Ionicons name="camera-outline" size={40} color="grey" />
      </TouchableOpacity>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  mainContain: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  imageContain: {
    flex: 3,
    width: 395,
    height: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  imageStyle: {
    flex: 1,
    width: 200,
    height: 30,
    borderRadius: 10,
  },
  tripleButtonContain: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  tripleTouchable: {
    marginVertical: 20,
    marginHorizontal: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 20,
    width: "50%",
    height: "60%",
    backgroundColor: "gainsboro",
    padding: 10,
  },
  tripleButtonView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  tripleText: {
    textTransform: "uppercase",
    color: "#454545",
    fontSize: 15,
    alignItems: "center",
  },
  reportMainContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  reportContainer: {
    width: 395,
    height: "90%",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 5,
    justifyContent: "center",
  },
  reportView: {
    padding: 15,
    flex: 1,
    alignItems: "center",
    color: "white",
  },
  reportText: {
    fontSize: 15,
    textTransform: "uppercase",
    color: "#454545",
  },
  reportInput: {
    fontSize: 15,
    padding: 15,
    borderRadius: 5,
    color: "black",
    marginBottom: 20,
  },
  doubleButtonContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  doubleTouchable: {
    marginVertical: 20,
    marginHorizontal: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 20,
    width: "40%",
    height: "40%",
    backgroundColor: "white",
    padding: 10,
  },
  doubleTouchableView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  doubleTouchableText: {
    textTransform: "uppercase",
    color: "#454545",
    fontSize: 15,
    alignItems: "center",
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cameraTouchable: {
    backgroundColor: "white",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    height: "10%",
    width: "20%",
    marginBottom: 50,
  },
  buttonContainer: {
    flex: 1,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    height: "10%",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 40,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});