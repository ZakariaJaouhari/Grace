// 7. screens/PDFViewerScreen.js - New screen for PDF viewing
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import colors from "../components/Colors";

function PDFViewerScreen({ route, navigation }) {
  const { pdfName, pdfUrl } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleLoadComplete = (numberOfPages) => {
    setTotalPages(numberOfPages);
    setLoading(false);
  };

  const handleError = (error) => {
    console.error("PDF Error:", error);
    setError("Impossible de charger le PDF");
    setLoading(false);
  };

  const handleShare = () => {
    Alert.alert("Partager", `Partager ${pdfName || "le document"}`);
  };

  const handleDownload = () => {
    Alert.alert("Télécharger", `Téléchargement de ${pdfName || "le document"}...`);
  };

  const handlePrint = () => {
    Alert.alert("Imprimer", "Fonction d'impression");
  };

  const handleBookmark = () => {
    Alert.alert("Marquer", "Document ajouté aux favoris");
  };

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
          <Text style={styles.headerTitle} numberOfLines={1}>
            {pdfName || "Document PDF"}
          </Text>
          <Text style={styles.pageInfo}>
            Page {page} sur {totalPages || "?"}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleDownload}>
            <Icon name="file-download" size={22} color={colors.White} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Icon name="share" size={22} color={colors.White} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.pdfContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.PrimaryBlue} />
            <Text style={styles.loadingText}>Chargement du PDF...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Icon name="error" size={60} color={colors.ErrorRed} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setLoading(true);
                setError(null);
              }}
            >
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        {!error && !loading && (
          <View style={styles.pdfPlaceholder}>
            <Icon name="picture-as-pdf" size={100} color={colors.PrimaryBlue} />
            <Text style={styles.pdfPlaceholderText}>Prévisualisation PDF</Text>
            <Text style={styles.pdfPlaceholderSubtext}>
              {pdfName || "Document.pdf"}
            </Text>
            <Text style={styles.pdfPlaceholderSubtext}>
              Utilisez react-native-pdf pour l'intégration réelle
            </Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="zoom-out" size={22} color={colors.White} />
          <Text style={styles.controlText}>Zoom -</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="zoom-in" size={22} color={colors.White} />
          <Text style={styles.controlText}>Zoom +</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handlePrint}>
          <Icon name="print" size={22} color={colors.White} />
          <Text style={styles.controlText}>Imprimer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleBookmark}>
          <Icon name="bookmark" size={22} color={colors.White} />
          <Text style={styles.controlText}>Marquer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.MidnightBlue },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 12, backgroundColor: colors.SecondaryBlue, borderBottomWidth: 1, borderBottomColor: colors.GrayDark },
  backButton: { padding: 5, marginRight: 10 },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: "600", color: colors.White, marginBottom: 2 },
  pageInfo: { fontSize: 12, color: colors.GrayLight },
  headerActions: { flexDirection: "row", alignItems: "center" },
  headerButton: { padding: 8, marginLeft: 5 },
  pdfContainer: { flex: 1, justifyContent: "center", backgroundColor: colors.White },
  loadingContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: colors.White },
  loadingText: { marginTop: 15, color: colors.MidnightBlue, fontSize: 16 },
  errorContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: colors.White, padding: 30 },
  errorText: { marginTop: 20, color: colors.ErrorRed, fontSize: 16, textAlign: "center", marginBottom: 30 },
  retryButton: { backgroundColor: colors.PrimaryBlue, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 8 },
  retryButtonText: { color: colors.White, fontSize: 16, fontWeight: "600" },
  pdfPlaceholder: { alignItems: "center", justifyContent: "center", padding: 20 },
  pdfPlaceholderText: { fontSize: 20, fontWeight: "600", color: colors.MidnightBlue, marginTop: 20, marginBottom: 10 },
  pdfPlaceholderSubtext: { fontSize: 14, color: colors.GrayDark, textAlign: "center", marginBottom: 5 },
  controls: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, backgroundColor: colors.SecondaryBlue, borderTopWidth: 1, borderTopColor: colors.GrayDark },
  controlButton: { alignItems: "center", padding: 8 },
  controlText: { color: colors.White, fontSize: 12, marginTop: 4 },
});

export default PDFViewerScreen;