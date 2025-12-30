// 11. components/DossierCard.js - Fixed component
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React from "react";
import colors from "../components/Colors";

const DossierCard = ({ navigation, title, dossier, statut, dateCreation, type = "folder" }) => {
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

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate("DossierDetailScreen", { 
        dossierId: dossier,
        dossierTitle: title 
      })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Icon name={getTypeIcon(type)} size={24} color={colors.PrimaryBlue} />
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.dossierNumber}>{dossier}</Text>
        </View>
        
        <View style={[styles.statusContainer, { backgroundColor: getStatutColor(statut) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatutColor(statut) }]}>
            {statut}
          </Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="calendar-today" size={14} color={colors.GrayLight} />
          <Text style={styles.infoLabel}>Créé le: </Text>
          <Text style={styles.infoValue}>{dateCreation}</Text>
        </View>
        
        <View style={styles.cardFooter}>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => navigation.navigate("DossierDetailScreen", { 
              dossierId: dossier,
              dossierTitle: title 
            })}
          >
            <Text style={styles.detailsText}>Voir détails</Text>
            <Icon name="arrow-forward" size={16} color={colors.PrimaryBlue} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.TransparentWhite, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: colors.GrayDark },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  iconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.TransparentBlue, justifyContent: "center", alignItems: "center", marginRight: 15 },
  titleContainer: { flex: 1 },
  title: { fontSize: 17, fontWeight: "600", color: colors.White, marginBottom: 4 },
  dossierNumber: { fontSize: 13, color: colors.GrayLight },
  statusContainer: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "600" },
  divider: { height: 1, backgroundColor: colors.GrayDark, marginBottom: 15 },
  cardBody: { marginBottom: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  infoLabel: { fontSize: 13, color: colors.GrayLight, marginLeft: 6, marginRight: 4 },
  infoValue: { fontSize: 13, fontWeight: "500", color: colors.White },
  cardFooter: { borderTopWidth: 1, borderTopColor: colors.GrayDark, paddingTop: 15 },
  detailsButton: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end" },
  detailsText: { color: colors.PrimaryBlue, fontSize: 14, fontWeight: "600", marginRight: 8 },
});

export default DossierCard;