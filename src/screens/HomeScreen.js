import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import PartCard from '../components/PartCard';
import PartDetailModal from '../components/PartDetailModal';
import partStorage from '../storage/partStorage';
import { sortPartsByDate } from '../utils/dateUtils';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const HomeScreen = ({ navigation }) => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  const loadParts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await partStorage.loadParts();
      setParts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParts();
  }, [loadParts]);

  useFocusEffect(
    useCallback(() => {
      loadParts();
    }, [loadParts])
  );

  // Memoizado: solo recalcula cuando cambian parts, searchQuery o sortAsc
  const visibleParts = useMemo(() => {
    const sorted = sortPartsByDate(parts);
    const ordered = sortAsc ? [...sorted].reverse() : sorted;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ordered;
    return ordered.filter(
      (p) =>
        p.pieza.toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q) ||
        p.noSerie.toLowerCase().includes(q)
    );
  }, [parts, searchQuery, sortAsc]);

  const handleOpenDetail = useCallback((part) => {
    setSelectedPart(part);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      const ok = await partStorage.deletePart(id);
      if (ok) loadParts();
    },
    [loadParts]
  );

  const handleAddPart = useCallback(() => {
    navigation.navigate('AddPart');
  }, [navigation]);

  const toggleSort = useCallback(() => setSortAsc((v) => !v), []);

  const renderItem = useCallback(
    ({ item }) => (
      <PartCard part={item} onPress={handleOpenDetail} onDelete={handleDelete} />
    ),
    [handleOpenDetail, handleDelete]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const ListHeader = (
    <View>
      {/* Hero */}
      <View style={styles.heroSection}>
        <Text style={styles.heroSubtitle}>SISTEMA DE GESTIÓN</Text>
        <Text style={styles.heroTitle}>Piezas.</Text>
        <Text style={styles.heroDescription}>
          Control de mantenimiento automotriz de alta precisión.
        </Text>
      </View>

      {/* Botón principal */}
      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={handleAddPart}>
        <MaterialIcons name="add-circle" size={24} color={COLORS.onPrimaryFixed} />
        <Text style={styles.primaryButtonText}>Agregar Pieza</Text>
      </TouchableOpacity>

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={COLORS.onSurfaceVariant} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por pieza, marca o serie..."
          placeholderTextColor={COLORS.onSurfaceVariantOverlayPlaceholderMedium}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </View>

      {/* Header del inventario */}
      <View style={styles.inventoryHeader}>
        <View style={styles.inventoryTitleContainer}>
          <Text style={styles.inventoryTitle}>Piezas Registradas</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {String(visibleParts.length).padStart(2, '0')} TOTAL
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={toggleSort}>
          <MaterialIcons
            name={sortAsc ? 'arrow-upward' : 'arrow-downward'}
            size={22}
            color={COLORS.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListEmpty = !loading && (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconCircle}>
        <MaterialIcons name="inventory" size={40} color={COLORS.onSurfaceVariant} />
      </View>
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'Sin resultados' : 'No hay piezas, Agregue una'}
      </Text>
      <Text style={styles.emptyStateDescription}>
        {searchQuery
          ? 'Intenta con otra búsqueda.'
          : 'Tu inventario está vacío. Presiona "Agregar Pieza" para comenzar.'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddPart}>
          <MaterialIcons name="add" size={16} color={COLORS.primary} />
          <Text style={styles.emptyStateButtonText}>Registrar primer repuesto</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surfaceContainerLow} />

      {/* Header simplificado */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <MaterialIcons name="settings-input-component" size={24} color={COLORS.primary} />
          <Text style={styles.headerTitle}>MECATRACK</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={visibleParts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: SPACING.md }} />}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          removeClippedSubviews
        />
      )}

      <PartDetailModal
        visible={modalVisible}
        onClose={handleCloseModal}
        part={selectedPart}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: SPACING.sm + 4,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.primary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  heroSection: {
    marginBottom: SPACING.xl + 8,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  heroTitle: {
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -2,
    color: COLORS.onSurface,
  },
  heroDescription: {
    marginTop: SPACING.sm + 4,
    fontSize: FONT_SIZES.md,
    color: COLORS.onSurfaceVariant,
    maxWidth: 220,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    elevation: 5,
  },
  primaryButtonText: {
    marginLeft: SPACING.sm + 2,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.onPrimaryFixed,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  searchInput: {
    flex: 1,
    color: COLORS.onSurface,
    fontSize: FONT_SIZES.md,
    padding: 0,
  },
  inventoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  inventoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inventoryTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginRight: SPACING.sm + 2,
  },
  badge: {
    backgroundColor: COLORS.surfaceContainerHighest,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  iconButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.sm,
  },
  emptyStateContainer: {
    marginTop: SPACING.xl,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: COLORS.borderOverlayMedium,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
  emptyStateDescription: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.onSurfaceVariantOverlayText,
    textAlign: 'center',
    maxWidth: 240,
  },
  emptyStateButton: {
    marginTop: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyStateButtonText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default HomeScreen;
