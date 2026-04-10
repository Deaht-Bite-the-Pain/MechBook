import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';
import { getIconForPart } from '../constants/partIcons';
import { formatDateDisplay } from '../utils/dateUtils';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const PartDetailModal = ({ visible, onClose, part }) => {
  // Mantener el componente montado para que la animación de cierre funcione,
  // pero evitar renderizar contenido si no hay pieza seleccionada.
  const safePart = part || {};

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          <View style={styles.grabHandle} />

          <View style={styles.header}>
            <View style={styles.headerSubtitleContainer}>
              <View style={styles.headerDot} />
              <Text style={styles.headerSubtitle}>ESPECIFICACIONES TÉCNICAS</Text>
            </View>
            <Text style={styles.headerTitle}>DETALLE DE LA PIEZA</Text>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: SPACING.xl }}
          >
            {/* Hero / Imagen o icono */}
            <View style={styles.heroContainer}>
              {safePart.foto ? (
                <Image source={{ uri: safePart.foto }} style={styles.heroPhoto} />
              ) : (
                <View style={styles.heroIconWrapper}>
                  <MaterialIcons
                    name={getIconForPart(safePart.pieza)}
                    size={72}
                    color={COLORS.primary}
                  />
                </View>
              )}
              <View style={styles.idBadge}>
                <Text style={styles.idBadgeText}>NO. SERIE: {safePart.noSerie || '-'}</Text>
              </View>
            </View>

            {/* Datos */}
            <View style={styles.dataGrid}>
              <View style={styles.dataRow}>
                <Text style={styles.label}>PIEZA</Text>
                <Text style={styles.partName}>{safePart.pieza || '-'}</Text>
              </View>

              <View style={styles.flexRow}>
                <View style={[styles.recessedPanel, { flex: 1, marginRight: SPACING.sm }]}>
                  <Text style={styles.label}>MARCA</Text>
                  <Text style={styles.panelValue}>{safePart.marca || '-'}</Text>
                </View>
                <View style={[styles.recessedPanel, { flex: 1, marginLeft: SPACING.sm }]}>
                  <Text style={styles.label}>NO. SERIE</Text>
                  <Text style={styles.panelValue}>{safePart.noSerie || '-'}</Text>
                </View>
              </View>

              <View style={styles.flexRow}>
                <View style={[styles.borderPanel, { borderLeftColor: COLORS.primary, flex: 1, marginRight: SPACING.sm }]}>
                  <Text style={styles.label}>PRECIO</Text>
                  <Text style={styles.priceValue}>
                    ${typeof safePart.precio === 'number' ? safePart.precio.toFixed(2) : '0.00'}
                  </Text>
                </View>
                <View style={[styles.borderPanel, { borderLeftColor: COLORS.outlineVariant, flex: 1, marginLeft: SPACING.sm }]}>
                  <Text style={styles.label}>FECHA DE CAMBIO</Text>
                  <Text style={styles.panelValue}>{formatDateDisplay(safePart.fechaCambio)}</Text>
                </View>
              </View>

              <View style={styles.noteContainer}>
                <Text style={styles.noteText}>
                  Información de solo lectura. Para modificar este registro debes eliminarlo y crear uno nuevo.
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={20} color={COLORS.secondary} />
              <Text style={styles.closeButtonText}>CERRAR</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.backdropLayer,
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: SCREEN_HEIGHT * 0.92,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxl - 8 : SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.modalBorder,
  },
  grabHandle: {
    width: 48,
    height: 4,
    backgroundColor: COLORS.modalHandle,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.sm + 4,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  headerDot: {
    height: 4,
    width: 32,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginRight: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.onSurface,
    lineHeight: 32,
  },
  content: {
    paddingHorizontal: SPACING.lg,
  },
  heroContainer: {
    height: 200,
    backgroundColor: COLORS.surfaceContainerHighest,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderOverlay,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPhoto: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  idBadge: {
    position: 'absolute',
    bottom: SPACING.md,
    backgroundColor: COLORS.containerOverlay,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primaryOverlayMedium,
  },
  idBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  dataGrid: {
    gap: SPACING.lg,
  },
  dataRow: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
  },
  partName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  flexRow: {
    flexDirection: 'row',
  },
  recessedPanel: {
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.sm + 2,
  },
  panelValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '500',
    color: COLORS.secondary,
  },
  borderPanel: {
    paddingLeft: SPACING.sm + 4,
    borderLeftWidth: 2,
    justifyContent: 'center',
  },
  priceValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  noteContainer: {
    backgroundColor: COLORS.surfaceContainer,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.infoOverlay,
  },
  noteText: {
    fontSize: FONT_SIZES.sm,
    fontStyle: 'italic',
    color: COLORS.onSurfaceVariant,
    lineHeight: 18,
  },
  closeButton: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.surfaceContainerHighest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderOverlay,
    gap: SPACING.sm,
  },
  closeButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.secondary,
    letterSpacing: 2,
  },
});

export default memo(PartDetailModal);
