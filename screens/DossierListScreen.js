// screens/DossierListScreen.js
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import colors from "../components/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { dossierService } from "../services/dossierService";
import { authService } from "../services/authService";

const DossierListScreen = ({ navigation }) => {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadDossiers(user.uid);
      } else {
        navigation.replace("Login");
      }
    });

    return unsubscribe;
  }, []);

  const loadDossiers = async (userId) => {
    setLoading(true);
    const result = await dossierService.getUserDossiers(userId);
    setLoading(false);
    
    if (result.success) {
      setDossiers(result.dossiers);
    } else {
      Alert.alert("Erreur", "Impossible de charger les dossiers");
    }
  };

  const onRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    await loadDossiers(user.uid);
    setRefreshing(false);
  };

  const getStatutColor = (statut) => {
    switch(statut) {
      case 'En cours': return colors.WarningOrange;
      case 'Terminé': return colors.SuccessGreen;
      case 'Validé': return colors.PrimaryBlue;
      case 'En attente': return colors.ErrorRed;
      default: return colors.GrayLight;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'auto': return 'directions-car';
      case 'habitation': return 'home';
      case 'sante': return 'local-hospital';
      case 'vie': return 'account-balance';
      case 'pro': return 'business';
      case 'voyage': return 'flight';
      default: return 'folder';
    }
  };

  const handleFilterPress = () => {
    Alert.alert("Filtrer", "Sélectionnez vos critères de filtrage");
  };

  const handleStatusFilterPress = (status) => {
    Alert.alert(`Filtrer par: ${status}`, `Afficher seulement les dossiers ${status.toLowerCase()}`);
  };

  const handleSearchPress = () => {
    Alert.alert("Recherche", "Recherche avancée");
  };

  const handleAddDossier = async () => {
    Alert.alert(
      "Nouveau dossier",
      "Sélectionnez le type de dossier à créer",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Assurance Auto", 
          onPress: () => createDossier("auto", "Dossier d'Assurance Auto") 
        },
        { 
          text: "Assurance Habitation", 
          onPress: () => createDossier("habitation", "Dossier d'Assurance Habitation") 
        },
        { 
          text: "Assurance Santé", 
          onPress: () => createDossier("sante", "Dossier d'Assurance Santé") 
        },
      ]
    );
  };

  const createDossier = async (type, title) => {
    if (!user) return;
    
    const dossierData = {
      title: title,
      type: type,
      description: `Dossier d'assurance ${type}`,
      insuranceType: type,
      status: 'En cours'
    };
    
    const result = await dossierService.createDossier(user.uid, dossierData);
    
    if (result.success) {
      Alert.alert("Succès", `Nouveau dossier ${title} créé`);
      loadDossiers(user.uid);
    } else {
      Alert.alert("Erreur", "Impossible de créer le dossier");
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Déconnexion", 
          style: "destructive",
          onPress: async () => {
            await authService.logout();
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PrimaryBlue} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Mes Dossiers</Text>
              <Text style={styles.headerSubtitle}>
                {loading ? "Chargement..." : `${dossiers.length} dossiers`}
              </Text>
              <Text style={styles.userWelcome}>
                Bonjour, {user.firstName || user.email}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
                <Icon name="filter-list" size={24} color={colors.White} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Icon name="logout" size={20} color={colors.White} />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={styles.searchContainer} onPress={handleSearchPress}>
            <Icon name="search" size={20} color={colors.GrayLight} style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Rechercher un dossier...</Text>
          </TouchableOpacity>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.statusFilter}
            contentContainerStyle={styles.statusFilterContent}
          >
            <TouchableOpacity 
              style={[styles.statusFilterItem, styles.statusFilterActive]}
              onPress={() => handleStatusFilterPress("Tous")}
            >
              <Text style={[styles.statusFilterText, styles.statusFilterTextActive]}>Tous</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statusFilterItem}
              onPress={() => handleStatusFilterPress("En cours")}
            >
              <View style={[styles.statusDot, { backgroundColor: colors.WarningOrange }]} />
              <Text style={styles.statusFilterText}>En cours</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statusFilterItem}
              onPress={() => handleStatusFilterPress("Terminé")}
            >
              <View style={[styles.statusDot, { backgroundColor: colors.SuccessGreen }]} />
              <Text style={styles.statusFilterText}>Terminé</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.PrimaryBlue]}
              tintColor={colors.PrimaryBlue}
            />
          }
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.PrimaryBlue} />
              <Text style={styles.loadingText}>Chargement des dossiers...</Text>
            </View>
          ) : dossiers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="folder-open" size={60} color={colors.GrayLight} />
              <Text style={styles.emptyTitle}>Aucun dossier</Text>
              <Text style={styles.emptyText}>
                Commencez par créer votre premier dossier d'assurance
              </Text>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleAddDossier}
              >
                <Icon name="add" size={20} color={colors.White} />
                <Text style={styles.createButtonText}>Créer un dossier</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {dossiers.map((dossier) => (
                <TouchableOpacity 
                  key={dossier.id}
                  style={styles.card}
                  onPress={() => navigation.navigate("DossierDetailScreen", { 
                    dossierId: dossier.id,
                    dossierTitle: dossier.title,
                    userId: user.uid
                  })}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardIconContainer}>
                      <Icon name={getTypeIcon(dossier.type)} size={24} color={colors.PrimaryBlue} />
                    </View>
                    
                    <View style={styles.cardTitleContainer}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {dossier.title}
                      </Text>
                      <Text style={styles.dossierNumber}>{dossier.id}</Text>
                    </View>
                    
                    <View style={[styles.statusBadge, { backgroundColor: getStatutColor(dossier.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatutColor(dossier.status) }]}>
                        {dossier.status}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.cardDivider} />
                  
                  <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Icon name="calendar-today" size={14} color={colors.GrayLight} />
                        <Text style={styles.infoLabel}>Créé le </Text>
                        <Text style={styles.infoValue}>
                          {dossier.createdAt ? dossier.createdAt.toLocaleDateString('fr-FR') : 'Date inconnue'}
                        </Text>
                      </View>
                      
                      {dossier.description && (
                        <Text style={styles.descriptionText} numberOfLines={2}>
                          {dossier.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.cardFooter}>
                    <TouchableOpacity 
                      style={styles.detailsButton}
                      onPress={() => navigation.navigate("DossierDetailScreen", { 
                        dossierId: dossier.id,
                        dossierTitle: dossier.title,
                        userId: user.uid
                      })}
                    >
                      <Text style={styles.detailsButtonText}>Voir les détails</Text>
                      <Icon name="arrow-forward" size={16} color={colors.PrimaryBlue} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity style={styles.addButton} onPress={handleAddDossier}>
                <Icon name="add-circle-outline" size={24} color={colors.White} />
                <Text style={styles.addButtonText}>Nouveau dossier</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.MidnightBlue },
  keyboardView: { flex: 1 },
  header: { paddingTop: Platform.OS === 'ios' ? 10 : 20, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: colors.MidnightBlue },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.White, marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: colors.GrayLight },
  userWelcome: { fontSize: 12, color: colors.GrayLight, marginTop: 2 },
  headerActions: { flexDirection: "row", alignItems: "center" },
  filterButton: { padding: 8, marginRight: 10 },
  logoutButton: { padding: 8 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: colors.TransparentWhite, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, marginBottom: 20, borderWidth: 1, borderColor: colors.GrayDark },
  searchIcon: { marginRight: 10 },
  searchPlaceholder: { color: colors.GrayLight, fontSize: 16, flex: 1 },
  statusFilter: { marginBottom: 5 },
  statusFilterContent: { paddingRight: 20 },
  statusFilterItem: { flexDirection: "row", alignItems: "center", backgroundColor: colors.TransparentWhite, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 10, borderWidth: 1, borderColor: colors.GrayDark },
  statusFilterActive: { backgroundColor: colors.TransparentBlue, borderColor: colors.PrimaryBlue },
  statusFilterText: { color: colors.GrayLight, fontSize: 14, fontWeight: "500" },
  statusFilterTextActive: { color: colors.White },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30, minHeight: '100%' },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  loadingText: { marginTop: 15, color: colors.White, fontSize: 16 },
  emptyContainer: { alignItems: "center", justifyContent: "center", padding: 40, marginTop: 50 },
  emptyTitle: { fontSize: 22, fontWeight: "600", color: colors.White, marginTop: 20, marginBottom: 10 },
  emptyText: { fontSize: 16, color: colors.GrayLight, textAlign: "center", marginBottom: 30, lineHeight: 22 },
  createButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colors.PrimaryBlue, paddingHorizontal: 25, paddingVertical: 15, borderRadius: 12 },
  createButtonText: { color: colors.White, fontSize: 16, fontWeight: "600", marginLeft: 10 },
  card: { backgroundColor: colors.TransparentWhite, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: colors.GrayDark },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  cardIconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.TransparentBlue, justifyContent: "center", alignItems: "center", marginRight: 15 },
  cardTitleContainer: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: "600", color: colors.White, marginBottom: 4 },
  dossierNumber: { fontSize: 13, color: colors.GrayLight },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "600" },
  cardDivider: { height: 1, backgroundColor: colors.GrayDark, marginBottom: 15 },
  cardBody: { marginBottom: 15 },
  infoRow: { flexDirection: "column" },
  infoItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoLabel: { fontSize: 13, color: colors.GrayLight, marginLeft: 6, marginRight: 4 },
  infoValue: { fontSize: 13, fontWeight: "500", color: colors.White },
  descriptionText: { fontSize: 14, color: colors.GrayLight, marginTop: 8, lineHeight: 20 },
  cardFooter: { borderTopWidth: 1, borderTopColor: colors.GrayDark, paddingTop: 15 },
  detailsButton: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end" },
  detailsButtonText: { color: colors.PrimaryBlue, fontSize: 14, fontWeight: "600", marginRight: 8 },
  addButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colors.TransparentBlue, borderWidth: 2, borderColor: colors.LightBlue, borderStyle: "dashed", borderRadius: 16, paddingVertical: 20, marginTop: 10 },
  addButtonText: { color: colors.PrimaryBlue, fontSize: 16, fontWeight: "600", marginLeft: 10 },
});

export default DossierListScreen;