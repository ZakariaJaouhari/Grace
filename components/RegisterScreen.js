import {
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import React from "react";
import colors from "./Colors";
import InputForm from "./InputForm";
import Buttons from "./Buttons";
import { useState } from "react";
function RegisterScreen () {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [numero, setNumero] = useState("");
  const [adresse, setAdresse] = useState("");
  const [contrat, setContrat] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        style={styles.insidecontainer}
        contentContainerStyle={styles.scrollContent}
      >
        <Image
          style={styles.imageLogo}
          source={require("../assets/HomeImage.jpg")}
        />
        <InputForm
          type="nom"
          value={nom}
          onChangeText={setNom}
          placeholder={"Entrez votre nom"}
        />
        <InputForm
          type="prenom"
          value={prenom}
          onChangeText={setPrenom}
          placeholder={"Entrez votre prenom"}
        />
        <InputForm
          type="numero"
          value={numero}
          onChangeText={setNumero}
          placeholder={"Entrez votre numero"}
        />
        <InputForm
          type="adresse"
          value={adresse}
          onChangeText={setAdresse}
          placeholder={"Entrez votre adresse"}
        />
        <InputForm
          type="contrat"
          value={contrat}
          onChangeText={setContrat}
          placeholder={"Entrez votre contrat"}
        />
        <InputForm
         type="email"
          value={email}
          onChangeText={setEmail}
          placeholder={"Entrez votre email"}
        />
        <InputForm
          type="password"
          value={password}
          onChangeText={setPassword}
          placeholder={"Entrez votre Mot de passe"}
        />
        <Buttons title="Créer Votre Compte"></Buttons>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  insidecontainer: {
    backgroundColor: colors.MidnightBlue,
    padding: 30,
    height: "100%",
  },
  imageLogo: {
    height: 200,
    width: 200,
    borderRadius: 45,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});
export default RegisterScreen;
