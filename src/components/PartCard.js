import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';
import { getIconForPart } from '../constants/partIcons';
import { formatDateDisplay } from '../utils/dateUtils';

/**
 * Tarjeta visual de una pieza. Memoizada para evitar re-renders innecesarios
 * cuando otras piezas de la lista cambian.
 */
const PartCard = ({ part, onPress, onDelete }) => {
  const handlePress = useCallback(() => onPress(part), [part, onPress]);

  const handleDelete = useCallback(
    (e) => {
      e?.stopPropagation?.();
      Alert.alert(
        'Eliminar pieza',
        `¿Seguro que deseas eliminar "${part.pieza}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(part.id) },
        ]
      );
    },
    [part, onDelete]
  );

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={handlePress}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          {part.foto ? (
            <Image source={{ uri: part.foto }} style={styles.thumbnail} />
          ) : (
            <MaterialIcons name={getIconForPart(part.pieza)} size={32} color={COLORS.primary} />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.code} numberOfLines={1}>NO. SERIE: {part.noSerie}</Text>
          <Text style={styles.title} numberOfLines={1}>Pieza: {part.pieza}</Text>
          <Text style={styles.date}>Fecha de Cambio: {formatDateDisplay(part.fechaCambio)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>MARCA</Text>
          <Text style={styles.statusValue} numberOfLines={1}>{part.marca}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <MaterialIcons name="delete" size={16} color={COLORS.error} />
          <Text style={styles.deleteButtonText}>ELIMINAR</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg - 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primaryOverlay,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderOverlay,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    marginLeft: SPACING.lg - 4,
    flex: 1,
  },
  code: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  date: {
    fontSize: FONT_SIZES.md,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  footer: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderOverlay,
  },
  statusContainer: {
    borderRightWidth: 1,
    borderRightColor: COLORS.borderOverlayHigh,
    paddingRight: SPACING.lg,
    flex: 1,
  },
  statusLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    marginBottom: 2,
  },
  statusValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.tertiary,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorOverlay,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  deleteButtonText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.error,
  },
});

export default memo(PartCard);
