// screens/RegisterFormScreen.js
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
  Image,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import colors from "../components/Colors";
import { authService } from "../services/authService";

const RegisterFormScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", 
    password: "", confirmPassword: "", address: "", city: "", postalCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { firstName, lastName, email, phone, password, confirmPassword } = formData;
    
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
      return;
    }
    
    const phoneRegex = /^[0-9\-\+\s\(\)]{10,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      Alert.alert("Erreur", "Numéro de téléphone invalide (minimum 10 chiffres)");
      return;
    }
    
    if (password.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Erreur mot de passe", "Les mots de passe ne correspondent pas");
      return;
    }
    
    if (!agreeToTerms) {
      Alert.alert("Conditions requises", "Vous devez accepter les conditions d'utilisation");
      return;
    }
    
    setLoading(true);
    const result = await authService.register(formData);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        "Inscription réussie!",
        "Votre compte a été créé avec succès",
        [
          {
            text: "Se connecter",
            onPress: () => navigation.navigate("Login")
          }
        ]
      );
    } else {
      let errorMessage = "Erreur lors de l'inscription";
      if (result.error.includes('email-already-in-use')) {
        errorMessage = "Cet email est déjà utilisé";
      } else if (result.error.includes('weak-password')) {
        errorMessage = "Le mot de passe est trop faible";
      } else if (result.error.includes('network-request-failed')) {
        errorMessage = "Problème de connexion internet";
      }
      Alert.alert("Erreur", errorMessage);
    }
  };

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
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
              <Text style={styles.backText}>Retour</Text>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={styles.headerLogo}>GRaCE</Text>
            </View>
            
            <View style={{ width: 70 }} />
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressStep}>
              <View style={styles.progressCircleActive}>
                <Text style={styles.progressNumber}>1</Text>
              </View>
              <Text style={styles.progressLabelActive}>Informations</Text>
            </View>
            
            <View style={styles.progressLine} />
            
            <View style={styles.progressStep}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressNumber}>2</Text>
              </View>
              <Text style={styles.progressLabel}>Validation</Text>
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Créer votre compte</Text>
            <Text style={styles.subtitle}>
              Remplissez vos informations personnelles pour commencer
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Icon name="person" size={18} color={colors.GrayLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Prénom"
                  placeholderTextColor={colors.GrayLight}
                  value={formData.firstName}
                  onChangeText={(text) => updateFormData("firstName", text)}
                />
              </View>
              
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                <Icon name="person-outline" size={18} color={colors.GrayLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nom"
                  placeholderTextColor={colors.GrayLight}
                  value={formData.lastName}
                  onChangeText={(text) => updateFormData("lastName", text)}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="email" size={18} color={colors.GrayLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Adresse email"
                placeholderTextColor={colors.GrayLight}
                value={formData.email}
                onChangeText={(text) => updateFormData("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="phone" size={18} color={colors.GrayLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Téléphone"
                placeholderTextColor={colors.GrayLight}
                value={formData.phone}
                onChangeText={(text) => updateFormData("phone", text)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="home" size={18} color={colors.GrayLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Adresse"
                placeholderTextColor={colors.GrayLight}
                value={formData.address}
                onChangeText={(text) => updateFormData("address", text)}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Icon name="location-city" size={18} color={colors.GrayLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ville"
                  placeholderTextColor={colors.GrayLight}
                  value={formData.city}
                  onChangeText={(text) => updateFormData("city", text)}
                />
              </View>
              
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                <Icon name="markunread-mailbox" size={18} color={colors.GrayLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Code postal"
                  placeholderTextColor={colors.GrayLight}
                  value={formData.postalCode}
                  onChangeText={(text) => updateFormData("postalCode", text)}
                  keyboardType="number-pad"
                />
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Sécurité du compte</Text>
            
            <View style={styles.inputContainer}>
              <Icon name="lock" size={18} color={colors.GrayLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={colors.GrayLight}
                value={formData.password}
                onChangeText={(text) => updateFormData("password", text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Icon 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color={colors.GrayLight}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={18} color={colors.GrayLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor={colors.GrayLight}
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData("confirmPassword", text)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                <Icon 
                  name={showConfirmPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color={colors.GrayLight}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                {agreeToTerms && <Icon name="check" size={14} color={colors.White} />}
              </View>
              <Text style={styles.termsText}>
                J'accepte les conditions générales et la politique de confidentialité de GRaCE
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.White} />
              ) : (
                <>
                  <Text style={styles.registerButtonText}>Créer mon compte</Text>
                  <Icon name="arrow-forward" size={20} color={colors.White} style={styles.buttonIcon} />
                </>
              )}
            </TouchableOpacity>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Vous avez déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.MidnightBlue },
  keyboardView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 },
  backButton: { flexDirection: "row", alignItems: "center", padding: 8 },
  backText: { color: colors.White, fontSize: 16, marginLeft: 5, fontWeight: "500" },
  headerCenter: { alignItems: "center" },
  headerLogo: { fontSize: 24, fontWeight: "700", color: colors.White },
  progressContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 40, marginTop: 10, marginBottom: 30 },
  progressStep: { alignItems: "center" },
  progressCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.TransparentWhite, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  progressCircleActive: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.PrimaryBlue, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  progressNumber: { color: colors.White, fontSize: 14, fontWeight: "600" },
  progressLabel: { color: colors.GrayLight, fontSize: 12 },
  progressLabelActive: { color: colors.PrimaryBlue, fontSize: 12, fontWeight: "600" },
  progressLine: { flex: 1, height: 2, backgroundColor: colors.TransparentWhite, marginHorizontal: 10, marginTop: -18 },
  titleContainer: { paddingHorizontal: 25, marginBottom: 25 },
  title: { fontSize: 28, fontWeight: "700", color: colors.White, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.GrayLight, lineHeight: 22 },
  formSection: { paddingHorizontal: 25, marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: colors.White, marginBottom: 15 },
  row: { flexDirection: "row", marginBottom: 15 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: colors.TransparentWhite, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, borderWidth: 1, borderColor: colors.GrayDark, marginBottom: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: colors.White, fontSize: 16, paddingVertical: 2 },
  eyeButton: { padding: 4 },
  termsContainer: { paddingHorizontal: 25, marginBottom: 25 },
  checkboxContainer: { flexDirection: "row", alignItems: "flex-start" },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.GrayLight, marginRight: 12, marginTop: 2, justifyContent: "center", alignItems: "center" },
  checkboxChecked: { backgroundColor: colors.PrimaryBlue, borderColor: colors.PrimaryBlue },
  termsText: { flex: 1, color: colors.GrayLight, fontSize: 14, lineHeight: 20 },
  buttonsContainer: { paddingHorizontal: 25, marginTop: 10 },
  registerButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colors.PrimaryBlue, paddingVertical: 17, borderRadius: 12, marginBottom: 20 },
  disabledButton: { backgroundColor: colors.GrayDark, opacity: 0.7 },
  registerButtonText: { color: colors.White, fontSize: 18, fontWeight: "600" },
  buttonIcon: { marginLeft: 10 },
  loginContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  loginText: { color: colors.GrayLight, fontSize: 16 },
  loginLink: { color: colors.PrimaryBlue, fontSize: 16, fontWeight: "600" },
});

export default RegisterFormScreen;