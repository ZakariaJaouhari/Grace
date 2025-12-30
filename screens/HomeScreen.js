// 4. screens/HomeScreen.js - Fixed with working buttons
import { ScrollView, Text, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../components/Colors";
import Buttons from "../components/Buttons";

function HomeScreen({ navigation }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.mainContent}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.appImage}
            source={require("../assets/HomeImage.jpg")}
          />
          <View style={styles.overlayShape} />
          <View style={styles.textContainer}>
            <Text style={styles.graceText}>GRaCE</Text>
          </View>
        </View>
        
        <View style={styles.buttonsContainer}>
          <Buttons 
            title="Login" 
            action={() => navigation.navigate("Login")}
          />
          <Buttons 
            title="Register" 
            action={() => navigation.navigate("Register")}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.DeepNavy },
  contentContainer: { flexGrow: 1 },
  mainContent: { width: "100%", height: "100%", position: "relative" },
  logoContainer: { position: "relative", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" },
  appImage: { width: "100%", height: "100%", resizeMode: "cover", borderBottomRightRadius: 100 },
  overlayShape: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(10, 10, 18, 0.5)", borderBottomRightRadius: 100, width: "100%" },
  textContainer: { position: "absolute", zIndex: 2, top: "25%", left: 0, right: 0, justifyContent: "flex-start", alignItems: "center" },
  graceText: { fontSize: 76, fontWeight: "800", color: "rgba(255, 255, 255, 0.6)", letterSpacing: 6, textShadowColor: "rgba(0, 0, 0, 0.4)", textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 6 },
  buttonsContainer: { position: "absolute", bottom: 50, width: "100%", paddingHorizontal: 40, flexDirection: "row", gap: 30, alignItems: "center", justifyContent: "center", zIndex: 3 },
});

export default HomeScreen;