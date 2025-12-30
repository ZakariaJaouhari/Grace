// screens/RecuperationScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import colors from "../components/Colors";
import { authService } from "../services/authService";

function RecuperationScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Erreur", "Veuillez entrer votre adresse email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
      return;
    }

    setLoading(true);
    const result = await authService.resetPassword(email);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        "Email envoyé !",
        "Un lien de réinitialisation a été envoyé à votre adresse email.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          }
        ]
      );
    } else {
      let errorMessage = "Erreur lors de l'envoi de l'email";
      if (result.error.includes('user-not-found')) {
        errorMessage = "Aucun compte associé à cet email";
      } else if (result.error.includes('network-request-failed')) {
        errorMessage = "Problème de connexion internet";
      }
      Alert.alert("Erreur", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color={colors.White} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mot de passe oublié</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Icon name="lock-reset" size={60} color={colors.PrimaryBlue} />
            </View>
            <Text style={styles.welcomeText}>Réinitialisation</Text>
            <Text style={styles.subtitle}>
              Entrez votre email pour recevoir un lien de réinitialisation
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon name="email" size={20} color={colors.GrayLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Adresse email"
                placeholderTextColor={colors.GrayLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.instructionsContainer}>
              <Icon name="info" size={18} color={colors.PrimaryBlue} />
              <Text style={styles.instructionsText}>
                Vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.resetButton, loading && styles.disabledButton]} 
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.White} />
              ) : (
                <>
                  <Text style={styles.resetButtonText}>Envoyer le lien</Text>
                  <Icon name="send" size={20} color={colors.White} style={{ marginLeft: 10 }} />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Retour à la </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>connexion</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.MidnightBlue },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 30 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 15 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.White },
  logoContainer: { alignItems: "center", marginTop: 40, marginBottom: 50 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.TransparentBlue, justifyContent: "center", alignItems: "center", marginBottom: 20, borderWidth: 2, borderColor: colors.LightBlue },
  welcomeText: { fontSize: 28, fontWeight: "700", color: colors.White, marginBottom: 5 },
  subtitle: { fontSize: 16, color: colors.GrayLight, textAlign: "center", paddingHorizontal: 30, lineHeight: 22 },
  formContainer: { paddingHorizontal: 25 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: colors.TransparentWhite, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, marginBottom: 25, borderWidth: 1, borderColor: colors.GrayDark },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: colors.White, fontSize: 16, paddingVertical: 5 },
  instructionsContainer: { flexDirection: "row", backgroundColor: colors.TransparentBlue, borderRadius: 10, padding: 15, marginBottom: 30, alignItems: "flex-start" },
  instructionsText: { flex: 1, color: colors.GrayVeryLight, fontSize: 14, marginLeft: 10, lineHeight: 20 },
  resetButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colors.PrimaryBlue, paddingVertical: 16, borderRadius: 12, marginBottom: 25 },
  disabledButton: { backgroundColor: colors.GrayDark, opacity: 0.7 },
  resetButtonText: { color: colors.White, fontSize: 18, fontWeight: "600" },
  loginContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  loginText: { color: colors.GrayLight, fontSize: 16 },
  loginLink: { color: colors.PrimaryBlue, fontSize: 16, fontWeight: "600" },
});

export default RecuperationScreen;