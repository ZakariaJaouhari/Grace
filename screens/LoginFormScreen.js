// screens/LoginFormScreen.js
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

function LoginFormScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    const result = await authService.login(email, password);
    setLoading(false);

    if (result.success) {
      Alert.alert("Connexion", "Connexion réussie!");
      navigation.navigate("DossierListScreen");
    } else {
      let errorMessage = "Identifiants incorrects";
      if (result.error.includes('user-not-found')) {
        errorMessage = "Utilisateur non trouvé";
      } else if (result.error.includes('wrong-password')) {
        errorMessage = "Mot de passe incorrect";
      } else if (result.error.includes('too-many-requests')) {
        errorMessage = "Trop de tentatives. Réessayez plus tard";
      } else if (result.error.includes('network-request-failed')) {
        errorMessage = "Problème de connexion internet";
      }
      Alert.alert("Erreur", errorMessage);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("Recuperation");
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
            <Text style={styles.headerTitle}>Connexion</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Icon name="lock" size={60} color={colors.PrimaryBlue} />
            </View>
            <Text style={styles.welcomeText}>Bienvenue sur GRaCE</Text>
            <Text style={styles.subtitle}>Connectez-vous à votre espace</Text>
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
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color={colors.GrayLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={colors.GrayLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color={colors.GrayLight}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword} 
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.disabledButton]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.White} />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Se connecter</Text>
                  <Icon name="arrow-forward" size={20} color={colors.White} style={{ marginLeft: 10 }} />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Pas encore de compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.registerLink}>S'inscrire</Text>
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
  logoContainer: { alignItems: "center", marginTop: 20, marginBottom: 40 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.TransparentBlue, justifyContent: "center", alignItems: "center", marginBottom: 20, borderWidth: 2, borderColor: colors.LightBlue },
  welcomeText: { fontSize: 28, fontWeight: "700", color: colors.White, marginBottom: 5 },
  subtitle: { fontSize: 16, color: colors.GrayLight },
  formContainer: { paddingHorizontal: 25 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: colors.TransparentWhite, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, marginBottom: 20, borderWidth: 1, borderColor: colors.GrayDark },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: colors.White, fontSize: 16, paddingVertical: 5 },
  forgotPassword: { alignSelf: "flex-end", marginBottom: 30 },
  forgotPasswordText: { color: colors.PrimaryBlue, fontSize: 14, fontWeight: "500" },
  loginButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colors.PrimaryBlue, paddingVertical: 16, borderRadius: 12, marginBottom: 25 },
  disabledButton: { backgroundColor: colors.GrayDark, opacity: 0.7 },
  loginButtonText: { color: colors.White, fontSize: 18, fontWeight: "600" },
  divider: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.GrayDark },
  dividerText: { color: colors.GrayLight, paddingHorizontal: 15, fontSize: 14 },
  registerContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  registerText: { color: colors.GrayLight, fontSize: 16 },
  registerLink: { color: colors.PrimaryBlue, fontSize: 16, fontWeight: "600" },
});

export default LoginFormScreen;