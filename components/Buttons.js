// 9. components/Buttons.js - Fixed button component
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import React from "react";
import colors from "./Colors";

const Buttons = (props) => {
  return (
    <TouchableOpacity
      style={[styles.buttonsubmit, props.disabled && styles.disabledButton]}
      onPress={props.action}
      disabled={props.disabled}
    >
      <Text style={styles.buttonText}>{props.title || "Button"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonsubmit: {
    backgroundColor: colors.White,
    width: 140,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: colors.GrayLight,
    opacity: 0.7,
  },
  buttonText: {
    color: colors.MidnightBlue,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Buttons;