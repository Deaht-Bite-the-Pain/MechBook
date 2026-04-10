import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  background: '#131314',
  surface: '#131314',
  surfaceContainer: '#1f1f20',
  surfaceContainerLow: '#1b1b1c',
  surfaceContainerHigh: '#2a2a2b',
  surfaceContainerHighest: '#353436',
  surfaceContainerLowest: '#0e0e0f',
  primary: '#ffb77d',
  onSurface: '#e5e2e3',
  onSurfaceVariant: '#ddc1ae',
  outlineVariant: '#564334',
  secondary: '#bcc8ce',
  tertiaryContainer: '#00b5fc',
};

const PartDetailModal = ({ visible, onClose, part }) => {
  if (!part) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalScroll}>
          <View style={styles.modalContainer}>
            {/* Grab Handle for Mobile */}
            <View style={styles.grabHandle} />

            {/* Modal Header */}
            <View style={styles.header}>
              <View style={styles.headerSubtitleContainer}>
                <View style={styles.headerDot} />
                <Text style={styles.headerSubtitle}>ESPECIFICACIONES TÉCNICAS</Text>
              </View>
              <Text style={styles.headerTitle}>DETALLE DE LA PIEZA</Text>
            </View>

            {/* Content Container */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Hero Visualization */}
              <View style={styles.heroContainer}>
                <ImageBackground 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcOmdJLMdgBmLFhUAnWs88DXwJBM1--0dfWunb77rN7qL3Pf5SzAxmetT4MEAMrz6UBWVkIMGQf_HbJ_bJCxUk_UQYrQrtisXo-4WhDG96Gp29AEggcI4OQl6eImkbXZ3l4PB2IWDivV6_VbNdNimMVPKrNxubbJtDzfObn6erb7bC7UbJQkW4JccCJcQK20e9Jl5xjTwCexrEk6JWUArR5d3xKl5pCQ3BS0EVf1aCZgSFULS-FT3W78ojRdBNci12FBRWt5iW-sh5' }}
                  style={styles.heroImage}
                  imageStyle={{ opacity: 0.2 }}
                >
                  <View style={styles.heroOverlay}>
                    <MaterialIcons name="precision-manufacturing" size={64} color={COLORS.primary} />
                    <View style={styles.idBadge}>
                      <Text style={styles.idBadgeText}>ID: {part.noSerie || '-'}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </View>

              {/* Data Grid */}
              <View style={styles.dataGrid}>
                {/* Pieza */}
                <View style={styles.dataRow}>
                  <Text style={styles.label}>PIEZA</Text>
                  <Text style={styles.partName}>{part.pieza}</Text>
                </View>

                {/* Brand & Serial Row */}
                <View style={styles.flexRow}>
                  <View style={[styles.recessedPanel, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>MARCA</Text>
                    <Text style={styles.panelValue}>{part.marca}</Text>
                  </View>
                  <View style={[styles.recessedPanel, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>NO. SERIE</Text>
                    <Text style={styles.panelValue}>{part.noSerie}</Text>
                  </View>
                </View>

                {/* Price & Date Row */}
                <View style={styles.flexRow}>
                  <View style={[styles.borderPanel, { borderLeftColor: COLORS.primary, flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>PRECIO</Text>
                    <Text style={styles.priceValue}>${part.precio}</Text>
                  </View>
                  <View style={[styles.borderPanel, { borderLeftColor: COLORS.outlineVariant, flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>FECHA DE CAMBIO</Text>
                    <Text style={styles.panelValue}>{part.fechaCambio}</Text>
                  </View>
                </View>

                {/* Note */}
                <View style={styles.noteContainer}>
                  <Text style={styles.noteText}>
                    Esta información es de solo lectura. Para actualizaciones de inventario, contacte al administrador del taller.
                  </Text>
                </View>
              </View>

              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <MaterialIcons name="close" size={20} color={COLORS.secondary} />
                <Text style={styles.closeButtonText}>CERRAR</Text>
              </TouchableOpacity>
              
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalScroll: {
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  modalContainer: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(164, 140, 122, 0.1)',
  },
  grabHandle: {
    width: 48,
    height: 4,
    backgroundColor: 'rgba(164, 140, 122, 0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  headerSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerDot: {
    height: 4,
    width: 32,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginRight: 8,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.onSurface,
    lineHeight: 32,
  },
  content: {
    paddingHorizontal: 24,
  },
  heroContainer: {
    height: 160,
    backgroundColor: COLORS.surfaceContainerHighest,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(86, 67, 52, 0.1)',
    marginBottom: 24,
  },
  heroImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    alignItems: 'center',
  },
  idBadge: {
    backgroundColor: 'rgba(255, 183, 125, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 125, 0.2)',
    marginTop: 8,
  },
  idBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  dataGrid: {
    gap: 24,
  },
  dataRow: {
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  partName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  flexRow: {
    flexDirection: 'row',
  },
  recessedPanel: {
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  panelValue: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.secondary,
  },
  borderPanel: {
    paddingLeft: 12,
    borderLeftWidth: 2,
    justifyContent: 'center',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  noteContainer: {
    backgroundColor: COLORS.surfaceContainer,
    padding: 16,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(0, 181, 252, 0.4)',
  },
  noteText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.onSurfaceVariant,
    lineHeight: 18,
  },
  closeButton: {
    marginTop: 32,
    backgroundColor: COLORS.surfaceContainerHighest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(86, 67, 52, 0.1)',
    gap: 8,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
    letterSpacing: 2,
  },
});

export default PartDetailModal;
