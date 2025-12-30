// 10. components/InputForm.js - Fixed input component
import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState } from "react";
import colors from "./Colors";

function InputForm(props) {
  const [isFocused, setIsFocused] = useState(false);
  
  const isPassword = String(props.type) === "password";
  
  const getKeyboardType = () => {
    if (props.type === "email") return "email-address";
    if (props.type === "numero") return "phone-pad";
    if (props.type === "numeric") return "numeric";
    return "default";
  };

  return (
    <View style={styles.ViewInput}>
      <View style={styles.form}>
        <Text style={styles.label}>{props.label || props.type}:</Text>
        <TextInput
          placeholder={props.placeholder}
          placeholderTextColor={colors.GrayLight}
          keyboardType={getKeyboardType()}
          style={[
            styles.input, 
            isFocused && styles.inputFocused,
            props.error && styles.inputError
          ]}
          value={props.value}
          onChangeText={props.onChangeText}
          secureTextEntry={isPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={props.type === "email" ? "none" : "sentences"}
          autoComplete={props.autoComplete || "off"}
          editable={!props.disabled}
        />
        {props.error && (
          <Text style={styles.errorText}>{props.error}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ViewInput: { width: "100%", justifyContent: "center", marginBottom: 15 },
  form: { width: "100%" },
  label: { color: colors.White, fontSize: 16, fontWeight: "500", marginBottom: 8 },
  input: { backgroundColor: colors.TransparentWhite, color: colors.White, padding: 12, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: colors.GrayDark },
  inputFocused: { borderColor: colors.PrimaryBlue, backgroundColor: colors.TransparentBlue },
  inputError: { borderColor: colors.ErrorRed, backgroundColor: "rgba(239, 68, 68, 0.05)" },
  errorText: { color: colors.ErrorRed, fontSize: 14, marginTop: 5, marginLeft: 5 },
});

export default InputForm;