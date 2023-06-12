import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Appbar } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function EarthScreen({ navigation, route }) {
  const [pin, setPin] = useState({
    latitude: 8.95489573492476,
    longitude: 125.56566099922811,
  });
  const [markerPosition, setMarkerPosition] = useState(pin);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (route.params?.text) {
      console.log("Report Successfully Sent!");
    }
  }, [route.params?.text]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setPin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setMarkerPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      navigation.setParams({
        latitude: markerPosition.latitude,
        longitude: markerPosition.longitude,
      });

      const fetchReports = async () => {
        const reportsCollection = collection(db, "reports");
        const querySnapshot = await getDocs(reportsCollection);
        const fetchedReports = [];
        querySnapshot.forEach((doc) => {
          const report = doc.data();
          if (report.done === false) {
            fetchedReports.push(report);
          }
        });
        setReports(fetchedReports);
      };

      fetchReports();
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={styles.Appbar}>
        <Appbar.Content title="GeoCare Map" fontSize={15} />
        <Appbar.Action
          icon={() => (
            <Ionicons name="chevron-forward-outline" size={29} color="black" />
          )}
          onPress={() => navigation.navigate("Report")}
        />
      </Appbar.Header>
      <MapView
        style={{
          width: "100%",
          height: "100%",
        }}
        initialRegion={{
          latitude: pin.latitude,
          longitude: pin.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {/* Render markers for each report */}
        {reports.map((report, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: report.location.latitude,
              longitude: report.location.longitude,
            }}
          >
            <Callout>
              <View style={styles.pop}>
                <Image
                  style={styles.img}
                  resizeMode="contain"
                  source={{ uri: report.photo }}
                />
                <View>
                  <Text>Report: {report.reportText}</Text>
                  <Text>Latitude: {report.location.latitude.toFixed(4)}</Text>
                  <Text>Longitude: {report.location.longitude.toFixed(4)}</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
const styles = StyleSheet.create({
  Appbar: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 120,
    height: 80,
  },
  pop:{ 
    flex: 1, 
    alignItems: "center", 
    flexDirection:"row" 
  },
});
