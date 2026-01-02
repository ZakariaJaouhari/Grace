// screens/DossierDetailScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import colors from "../components/Colors";
import { dossierService } from "../services/dossierService";

function DossierDetailScreen({ route, navigation }) {
  const { dossierId, dossierTitle, userId } = route.params || {};
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (userId && dossierId) {
      loadDossier();
    }
  }, [userId, dossierId]);

  const loadDossier = async () => {
    setLoading(true);
    const result = await dossierService.getDossier(userId, dossierId);
    setLoading(false);
    
    if (result.success) {
      setDossier(result.dossier);
      // Load documents would go here
    } else {
      Alert.alert("Erreur", "Impossible de charger le dossier");
      navigation.goBack();
    }
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

  const handleOpenPDF = (pdf) => {
    navigation.navigate("PDFViewer", { 
      pdfName: pdf.name, 
      pdfUrl: `https://example.com/${pdf.name}` 
    });
  };

  const handleSharePDF = (pdfName) => {
    Alert.alert("Partager", `Partager ${pdfName}?`);
  };

  const handleDownloadPDF = (pdfName) => {
    Alert.alert("Télécharger", `Téléchargement de ${pdfName}...`);
  };

  const handleAddDocument = () => {
    Alert.alert("Ajouter un document", "Fonctionnalité à implémenter");
  };

  const handleShareDossier = () => {
    Alert.alert("Partager le dossier", "Fonctionnalité à implémenter");
  };

  const handleDeleteDossier = () => {
    Alert.alert(
      "Supprimer le dossier",
      "Êtes-vous sûr de vouloir supprimer ce dossier?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: async () => {
            const result = await dossierService.deleteDossier(userId, dossierId);
            if (result.success) {
              Alert.alert("Succès", "Dossier supprimé");
              navigation.goBack();
            } else {
              Alert.alert("Erreur", "Impossible de supprimer le dossier");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PrimaryBlue} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.White} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{dossier?.title || dossierTitle || "Dossier"}</Text>
          <Text style={styles.dossierId}>ID: {dossierId}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteDossier}>
          <Icon name="delete" size={20} color={colors.ErrorRed} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Statut:</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatutColor(dossier?.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatutColor(dossier?.status) }]}>
                {dossier?.status || 'En cours'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoValue}>{dossier?.type || 'Non spécifié'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date création:</Text>
            <Text style={styles.infoValue}>
              {dossier?.createdAt ? dossier.createdAt.toLocaleDateString('fr-FR') : 'Date inconnue'}
            </Text>
          </View>
          
          {dossier?.description && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Description:</Text>
              <Text style={styles.infoValue}>{dossier.description}</Text>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Icon name="folder" size={20} color={colors.White} />
          <Text style={styles.sectionTitle}>Documents du dossier</Text>
          <Text style={styles.fileCount}>{documents.length} fichiers</Text>
        </View>

        {documents.length === 0 ? (
          <View style={styles.emptyDocuments}>
            <Icon name="insert-drive-file" size={50} color={colors.GrayLight} />
            <Text style={styles.emptyDocumentsText}>Aucun document</Text>
            <Text style={styles.emptyDocumentsSubtext}>
              Ajoutez des documents à votre dossier
            </Text>
          </View>
        ) : (
          documents.map((pdf) => (
            <TouchableOpacity 
              key={pdf.id} 
              style={styles.pdfCard}
              onPress={() => handleOpenPDF(pdf)}
            >
              <View style={styles.pdfIconContainer}>
                <Icon name="picture-as-pdf" size={32} color={colors.ErrorRed} />
              </View>
              
              <View style={styles.pdfInfo}>
                <Text style={styles.pdfName} numberOfLines={1}>
                  {pdf.name}
                </Text>
                <View style={styles.pdfDetails}>
                  <Text style={styles.pdfDetail}>{pdf.size}</Text>
                  <Text style={styles.pdfDetail}>•</Text>
                  <Text style={styles.pdfDetail}>{pdf.date}</Text>
                </View>
              </View>
              
              <View style={styles.pdfActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleOpenPDF(pdf)}
                >
                  <Icon name="visibility" size={20} color={colors.PrimaryBlue} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDownloadPDF(pdf.name)}
                >
                  <Icon name="file-download" size={20} color={colors.SuccessGreen} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddDocument}>
            <Icon name="add" size={20} color={colors.White} />
            <Text style={styles.primaryButtonText}>Ajouter un document</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleShareDossier}>
            <Icon name="share" size={20} color={colors.PrimaryBlue} />
            <Text style={styles.secondaryButtonText}>Partager le dossier</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.MidnightBlue },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.MidnightBlue },
  loadingText: { marginTop: 15, color: colors.White, fontSize: 16 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15, backgroundColor: colors.MidnightBlue, borderBottomWidth: 1, borderBottomColor: colors.GrayDark },
  backButton: { padding: 5, marginRight: 15 },
  deleteButton: { padding: 5 },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "600", color: colors.White, marginBottom: 2 },
  dossierId: { fontSize: 14, color: colors.GrayLight },
  content: { flex: 1, paddingHorizontal: 20 },
  infoCard: { backgroundColor: colors.TransparentWhite, borderRadius: 12, padding: 20, marginTop: 20, marginBottom: 25, borderWidth: 1, borderColor: colors.GrayDark },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  infoLabel: { fontSize: 14, color: colors.GrayLight },
  infoValue: { fontSize: 14, fontWeight: "500", color: colors.White, flex: 1, marginLeft: 10, textAlign: "right" },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: "600" },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: colors.White, marginLeft: 10, flex: 1 },
  fileCount: { fontSize: 14, color: colors.GrayLight },
  emptyDocuments: { alignItems: "center", justifyContent: "center", padding: 40, backgroundColor: colors.TransparentWhite, borderRadius: 12, marginBottom: 20 },
  emptyDocumentsText: { fontSize: 18, fontWeight: "600", color: colors.White, marginTop: 15, marginBottom: 5 },
  emptyDocumentsSubtext: { fontSize: 14, color: colors.GrayLight, textAlign: "center" },
  pdfCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.TransparentWhite, borderRadius: 12, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: colors.GrayDark },
  pdfIconContainer: { marginRight: 15 },
  pdfInfo: { flex: 1 },
  pdfName: { fontSize: 15, fontWeight: "500", color: colors.White, marginBottom: 4 },
  pdfDetails: { flexDirection: "row", alignItems: "center" },
  pdfDetail: { fontSize: 12, color: colors.GrayLight, marginRight: 8 },
  pdfActions: { flexDirection: "row", alignItems: "center" },
  actionButton: { padding: 8, marginLeft: 5 },
  actionsContainer: { marginTop: 30, marginBottom: 40 },
  primaryButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colors.PrimaryBlue, paddingVertical: 15, borderRadius: 12, marginBottom: 12 },
  primaryButtonText: { color: colors.White, fontSize: 16, fontWeight: "600", marginLeft: 10 },
  secondaryButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colors.TransparentWhite, paddingVertical: 15, borderRadius: 12, borderWidth: 1, borderColor: colors.GrayDark },
  secondaryButtonText: { color: colors.PrimaryBlue, fontSize: 16, fontWeight: "600", marginLeft: 10 },
});

export default DossierDetailScreen;