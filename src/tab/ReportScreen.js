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
  };

  if (showButton) {
    return (
      <SafeAreaView style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => console.log("Trash Problems button has been pressed!")}>
        <Ionicons name="trash-outline" size={30} color="darkgreen" />
          <Text style={{color: "darkgreen", fontSize: 18, fontWeight: "bold",}}>        Trash Problems</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log("First Aid Request button has been pressed!")}>
        <Ionicons name="medkit-outline" size={30} color="firebrick" />
          <Text style={{color: "firebrick", fontSize: 18, fontWeight: "bold",}}>       First Aid Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log("Fire Rescue Request button has been pressed!")}>
        <Ionicons name="bonfire-outline" size={30} color="orange" />
          <Text style={{color: "orange", fontSize: 18, fontWeight: "bold",}}>   Fire Rescue Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log("Fire Rescue Request button has been pressed!")}>
        <Ionicons name="car-outline" size={30}color="darkgrey"/>
          <Text style={{color: "darkgrey", fontSize: 18, fontWeight: "bold",}}>   Fire Rescue Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonCamera} onPress={handleButtonPress}>
        <Ionicons name="camera-outline" size={30} color="white" />
          <Text style={{color: "white", fontSize: 18, fontWeight: "bold",}}>Proceed to Camera</Text>
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
                  <Text style={styles.tripleText}> RETAKE PICTURE</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.reportMainContainer}>
              <View style={styles.reportContainer}>
                <View style={styles.reportView}>
                  <Text style={styles.reportText}>Enter Report Here:</Text>
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
                onPress={() => setPhoto(undefined)}
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
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems:"center",
    height: "8%",
    width:"60%",
    borderRadius: 10,
    marginBottom:10,
    flexDirection:"row",
  },
  buttonCamera: {
    backgroundColor: "dodgerblue",
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent:"space-evenly",
    alignItems:"center",
    height: "8%",
    width:"60%",
    borderRadius: 10,
    marginBottom:10,
    flexDirection:"row",
  },
});
s