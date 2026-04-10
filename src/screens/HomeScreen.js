import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import PartDetailModal from '../components/PartDetailModal';
import partStorage from '../storage/partStorage';
import { sortPartsByDate, formatDateDisplay } from '../utils/dateUtils';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#131314',
  surface: '#131314',
  surfaceContainer: '#1f1f20',
  surfaceContainerLow: '#1b1b1c',
  surfaceContainerHigh: '#2a2a2b',
  surfaceContainerHighest: '#353436',
  surfaceContainerLowest: '#0e0e0f',
  primary: '#ffb77d',
  primaryContainer: '#ff8c00',
  onPrimary: '#4d2600',
  onPrimaryFixed: '#2f1500',
  secondary: '#bcc8ce',
  onSurface: '#e5e2e3',
  onSurfaceVariant: '#ddc1ae',
  outlineVariant: '#564334',
  errorContainer: '#93000a',
  error: '#ffb4ab',
  onError: '#690005',
  onErrorContainer: '#ffdad6',
  tertiary: '#85cfff',
  onTertiary: '#00344c',
};

const HomeScreen = ({ navigation }) => {
  const [parts, setParts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  const loadParts = useCallback(async () => {
    const data = await partStorage.loadParts();
    setParts(sortPartsByDate(data));
  }, []);

  useEffect(() => {
    loadParts();
  }, [loadParts]);

  // Recarga la lista cada vez que la pantalla obtiene foco (ej: al volver de AddPart)
  useFocusEffect(
    useCallback(() => {
      loadParts();
    }, [loadParts])
  );

  const handleOpenDetail = (part) => {
    setSelectedPart(part);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    await partStorage.deletePart(id);
    loadParts();
  };

  const sortedParts = sortPartsByDate(parts);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surfaceContainerLow} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <MaterialIcons name="settings-input-component" size={24} color={COLORS.primary} />
          <Text style={styles.headerTitle}>TECHNICAL INVENTORY</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons name="search" size={24} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons name="notifications-none" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View>
            <Text style={styles.heroSubtitle}>SISTEMA DE GESTIÓN</Text>
            <Text style={styles.heroTitle}>Piezas.</Text>
          </View>
          <Text style={styles.heroDescription}>
            Control de mantenimiento industrial y automotriz de alta precisión.
          </Text>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity 
          style={styles.primaryButton} 
          activeOpacity={0.9}
          onPress={() => navigation.navigate('AddPart')}
        >
          <MaterialIcons name="add-circle" size={24} color={COLORS.onPrimaryFixed} />
          <Text style={styles.primaryButtonText}>Agregar Pieza</Text>
        </TouchableOpacity>

        {/* Inventory Header */}
        <View style={styles.inventoryHeader}>
          <View style={styles.inventoryTitleContainer}>
            <Text style={styles.inventoryTitle}>Piezas Registradas</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{String(sortedParts.length).padStart(2, '0')} TOTAL</Text>
            </View>
          </View>
          <View style={styles.inventoryHeaderActions}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="filter-list" size={24} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="sort" size={24} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>

        {/* List Items */}
        <View style={styles.listContainer}>
          {sortedParts.map((part) => (
            <TouchableOpacity
              key={part.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => handleOpenDetail(part)}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardIconContainer}>
                  <MaterialIcons name="build" size={32} color={COLORS.primary} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardCode}>NO. SERIE: {part.noSerie}</Text>
                  <Text style={styles.cardTitle}>Pieza: {part.pieza}</Text>
                  <Text style={styles.cardDate}>Fecha de Cambio: {formatDateDisplay(part.fechaCambio)}</Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>MARCA</Text>
                  <Text style={[styles.statusValue, { color: COLORS.tertiary }]}>{part.marca}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDelete(part.id);
                  }}
                >
                  <MaterialIcons name="delete" size={16} color={COLORS.error} />
                  <Text style={styles.deleteButtonText}>ELIMINAR</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State — solo visible cuando no hay piezas */}
        {sortedParts.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconCircle}>
              <MaterialIcons name="inventory" size={40} color={COLORS.onSurfaceVariant} />
            </View>
            <Text style={styles.emptyStateTitle}>No hay piezas, Agregue una</Text>
            <Text style={styles.emptyStateDescription}>
              Tu inventario está vacío. Presiona "Agregar Pieza" para comenzar el seguimiento.
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => navigation.navigate('AddPart')}
            >
              <MaterialIcons name="add" size={16} color={COLORS.primary} />
              <Text style={styles.emptyStateButtonText}>Registrar primer repuesto</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Fleets Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>RESUMEN DE FLOTA</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>24</Text>
              <Text style={styles.summaryLabel}>DÍAS PROMEDIO</Text>
            </View>
            <View style={[styles.summaryItem, { borderTopWidth: 2, borderTopColor: COLORS.tertiary }]}>
              <Text style={[styles.summaryValue, { color: COLORS.tertiary }]}>98%</Text>
              <Text style={styles.summaryLabel}>EFICIENCIA</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>12</Text>
              <Text style={styles.summaryLabel}>PENDIENTES</Text>
            </View>
            <View style={[styles.summaryItem, { borderTopWidth: 2, borderTopColor: COLORS.primary }]}>
              <Text style={[styles.summaryValue, { color: COLORS.primary }]}>04</Text>
              <Text style={styles.summaryLabel}>CRÍTICOS</Text>
            </View>
          </View>
        </View>

        {/* Spacer for Bottom Nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <MaterialIcons name="precision-manufacturing" size={24} color={COLORS.primary} />
          <Text style={styles.navTextActive}>INVENTORY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="history" size={24} color="#9ca3af" />
          <Text style={styles.navText}>HISTORY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="build" size={24} color="#9ca3af" />
          <Text style={styles.navText}>SUPPORT</Text>
        </TouchableOpacity>
      </View>

      {/* Part Detail Modal */}
      <PartDetailModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
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
    paddingHorizontal: 24,
    paddingVertical: 16,
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
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.primary,
    fontFamily: 'System', // Will use Space Grotesk if loaded
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  heroSection: {
    marginBottom: 40,
    flexDirection: 'column',
  },
  heroSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.primary,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 60,
    fontWeight: '700',
    letterSpacing: -2,
    color: COLORS.onSurface,
  },
  heroDescription: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    maxWidth: 200,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 48,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.onPrimaryFixed,
  },
  inventoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  inventoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inventoryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginRight: 10,
  },
  badge: {
    backgroundColor: COLORS.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  inventoryHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  listContainer: {
    gap: 16,
    marginBottom: 64,
  },
  card: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(255, 183, 125, 0.2)',
    flexDirection: 'column',
  },
  cardIndicator: {
    position: 'absolute',
    left: 0,
    top: 20,
    bottom: 20,
    width: 4,
    backgroundColor: COLORS.primary,
    opacity: 0, // In hover state in CSS, we can just make it default here or keep it subtler
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(86, 67, 52, 0.1)',
  },
  cardTextContainer: {
    marginLeft: 20,
    flex: 1,
  },
  cardCode: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.primary,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  cardDate: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  cardFooter: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(86, 67, 52, 0.1)',
  },
  statusContainer: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(86, 67, 52, 0.2)',
    paddingRight: 24,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(147, 0, 10, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.error,
  },
  emptyStateContainer: {
    marginTop: 40,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(86, 67, 52, 0.1)',
    borderRadius: 20,
    padding: 64,
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
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
  },
  emptyStateDescription: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(229, 226, 227, 0.6)',
    textAlign: 'center',
    maxWidth: 240,
  },
  emptyStateButton: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyStateButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  summarySection: {
    marginTop: 64,
    marginBottom: 48,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.primary,
    marginBottom: 24,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryItem: {
    width: (width - 48 - 16) / 2,
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 24,
    borderRadius: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(86, 67, 52, 0.15)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20, // Adjustment for safe area/pill
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  navItemActive: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 8,
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
});

export default HomeScreen;
