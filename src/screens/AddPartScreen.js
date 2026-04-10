import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import partStorage from '../storage/partStorage';

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
  onTertiary: '#00344c',
  tertiary: '#85cfff',
  primaryFixedDim: '#ffb77d',
};

const AddPartScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    pieza: '',
    marca: '',
    noSerie: '',
    precio: '',
    fechaCambio: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.pieza.trim())       newErrors.pieza       = 'El tipo de pieza es requerido';
    if (!formData.marca.trim())       newErrors.marca       = 'La marca es requerida';
    if (!formData.noSerie.trim())     newErrors.noSerie     = 'El número de serie es requerido';
    if (!formData.precio.trim())      newErrors.precio      = 'El precio es requerido';
    else if (isNaN(parseFloat(formData.precio))) newErrors.precio = 'El precio debe ser un número';
    if (!formData.fechaCambio.trim()) newErrors.fechaCambio = 'La fecha es requerida';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.fechaCambio)) newErrors.fechaCambio = 'Formato inválido. Use YYYY-MM-DD';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      Alert.alert('Campos incompletos', 'Por favor corrige los errores antes de guardar.');
      return;
    }
    const newPart = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      pieza:       formData.pieza.trim(),
      marca:       formData.marca.trim(),
      noSerie:     formData.noSerie.trim(),
      precio:      parseFloat(formData.precio),
      fechaCambio: formData.fechaCambio.trim(),
    };
    await partStorage.savePart(newPart);
    navigation.goBack();
  };

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
          <MaterialIcons name="search" size={24} color="#9ca3af" />
          <MaterialIcons name="notifications-none" size={24} color="#9ca3af" />
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.titleSection}>
            <Text style={styles.subtitle}>MÓDULO DE ADQUISICIÓN</Text>
            <Text style={styles.title}>Registro de piezas</Text>
          </View>

          {/* Bento-style Grid (Simple vertical for mobile) */}
          <View style={styles.formContainer}>
            {/* Technical Visual Card */}
            <View style={styles.visualCard}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ-x3rIRCNvE9y1dgF5ZYE-2A-8RUgFmmiWUeMAnqVlqv4Hug61CUIKzQUgITkHCZxPk5Tm08tRWNv06A--LbmCKAx_ZA-r1VtLCzpqJ-9B5yCKFXEeGgnQ3FqzKprYDg_7rOgd_2A5W1d3f0JYXDlgYcnocC6uN6BXpY8EIXUH6uy6nfGvoYwCR8fzxTDRyeof8fnSb5T6tKiXF8Ch_3dRx67syp7XMBCi2M9GzGg-0kedPYT6ELlg8N0IG7GWEgpiJ3pvqLHh__-' }}
                style={styles.visualImage}
                resizeMode="cover"
              />
              <View style={styles.visualOverlay}>
                <Text style={styles.visualStatus}>STATUS: ENGINEERING MODE</Text>
                <Text style={styles.visualDescription}>
                  Asegúrese de validar el número de serie OEM antes de confirmar el registro.
                </Text>
              </View>
            </View>

            {/* Specs System Card */}
            <View style={styles.specsCard}>
              <View style={styles.specsHeader}>
                <MaterialIcons name="terminal" size={14} color={COLORS.primary} />
                <Text style={styles.specsTitle}>SPECS SYSTEM</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>ENCRYPTED ID</Text>
                <Text style={styles.specValue}>SYS-992-PX</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>PRIORITY</Text>
                <Text style={[styles.specValue, { color: COLORS.tertiary }]}>Critical</Text>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formContent}>
              {/* Pieza */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PIEZA</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, errors.pieza && styles.inputError]}
                    placeholder="ej. Bujía de Iridio"
                    placeholderTextColor="rgba(221, 193, 174, 0.3)"
                    value={formData.pieza}
                    onChangeText={(text) => setFormData({...formData, pieza: text})}
                  />
                  <MaterialIcons name="precision-manufacturing" size={20} color={COLORS.primary} style={styles.inputIcon} />
                </View>
                {errors.pieza && <Text style={styles.errorText}>{errors.pieza}</Text>}
              </View>

              {/* Marca */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>MARCA</Text>
                <TextInput
                  style={[styles.input, errors.marca && styles.inputError]}
                  placeholder="ej. Bosch"
                  placeholderTextColor="rgba(221, 193, 174, 0.3)"
                  value={formData.marca}
                  onChangeText={(text) => setFormData({...formData, marca: text})}
                />
                {errors.marca && <Text style={styles.errorText}>{errors.marca}</Text>}
              </View>

              {/* No. Serie */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NO. SERIE</Text>
                <TextInput
                  style={[styles.input, errors.noSerie && styles.inputError]}
                  placeholder="Número de serie alfanumérico"
                  placeholderTextColor="rgba(221, 193, 174, 0.3)"
                  value={formData.noSerie}
                  onChangeText={(text) => setFormData({...formData, noSerie: text})}
                />
                {errors.noSerie && <Text style={styles.errorText}>{errors.noSerie}</Text>}
              </View>

              {/* Precio */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PRECIO (USD)</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.currencyPrefix}>$</Text>
                  <TextInput
                    style={[styles.input, { paddingLeft: 30 }, errors.precio && styles.inputError]}
                    placeholder="0.00"
                    placeholderTextColor="rgba(221, 193, 174, 0.3)"
                    keyboardType="numeric"
                    value={formData.precio}
                    onChangeText={(text) => setFormData({...formData, precio: text})}
                  />
                </View>
                {errors.precio && <Text style={styles.errorText}>{errors.precio}</Text>}
              </View>

              {/* Fecha de Cambio */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FECHA DE CAMBIO</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, errors.fechaCambio && styles.inputError]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="rgba(221, 193, 174, 0.3)"
                    value={formData.fechaCambio}
                    onChangeText={(text) => setFormData({...formData, fechaCambio: text})}
                  />
                  <MaterialIcons name="calendar-today" size={18} color="rgba(221, 193, 174, 0.4)" style={styles.inputIcon} />
                </View>
                {errors.fechaCambio && <Text style={styles.errorText}>{errors.fechaCambio}</Text>}
              </View>

              {/* CTA Actions */}
              <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>GUARDAR</Text>
                  <MaterialIcons name="check-circle" size={16} color={COLORS.onPrimaryFixed} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => navigation?.goBack()}
                >
                  <Text style={styles.cancelButtonText}>CANCELAR</Text>
                  <MaterialIcons name="close" size={16} color={COLORS.onSurface} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Technical Metadata Footer */}
          <View style={styles.metadataFooter}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>AUTH TOKEN</Text>
              <Text style={styles.metadataValuePrimary}>X7-VK-2024</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>INVENTORY LEVEL</Text>
              <Text style={styles.metadataValue}>94.2%</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>SYSTEM UPTIME</Text>
              <Text style={[styles.metadataValue, { color: COLORS.tertiary }]}>99.98%</Text>
            </View>
            <View style={[styles.metadataItem, { alignItems: 'flex-end' }]}>
              <Text style={styles.metadataLabel}>LAST SYNC</Text>
              <Text style={styles.metadataValue}>JUST NOW</Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('Home')}>
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
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  titleSection: {
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    color: COLORS.primary,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
    color: COLORS.onSurface,
    marginTop: 8,
  },
  formContainer: {
    gap: 24,
  },
  visualCard: {
    height: 300,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  visualImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  visualOverlay: {
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  visualStatus: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primaryFixedDim,
    letterSpacing: 3,
  },
  visualDescription: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
  },
  specsCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 24,
    borderRadius: 12,
    gap: 8,
  },
  specsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  specsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(86, 67, 52, 0.1)',
    paddingBottom: 8,
  },
  specLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  specValue: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.onSurface,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  formContent: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12,
    padding: 24,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: 16,
    borderRadius: 4,
    color: COLORS.onSurface,
    fontSize: 14,
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
  },
  currencyPrefix: {
    position: 'absolute',
    left: 16,
    color: COLORS.onSurfaceVariant,
    zIndex: 1,
  },
  inputError: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.error,
    marginTop: 4,
  },
  actionContainer: {
    flexDirection: 'column',
    gap: 16,
    paddingTop: 16,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.onPrimaryFixed,
    letterSpacing: 2,
  },
  cancelButton: {
    backgroundColor: 'rgba(53, 52, 54, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(164, 140, 122, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.onSurface,
    letterSpacing: 2,
  },
  metadataFooter: {
    marginTop: 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: 'rgba(86, 67, 52, 0.15)',
    paddingTop: 32,
    gap: 16,
  },
  metadataItem: {
    width: (width - 48 - 16) / 2,
    gap: 4,
  },
  metadataLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(221, 193, 174, 0.6)',
  },
  metadataValue: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.onSurface,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  metadataValuePrimary: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryFixedDim,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
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

export default AddPartScreen;
