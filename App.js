import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { registerAppWithFCM, requestUserPermission } from "./config/firebase";
import TabNavigator from "./src/navigation";
const App = () => {
  return (
    <SafeAreaView style={styles.root}>
      <TabNavigator />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
export default App;
