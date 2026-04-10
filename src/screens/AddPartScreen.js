import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';

import FormField from '../components/FormField';
import partStorage from '../storage/partStorage';
import { validatePartForm } from '../utils/validation';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const INITIAL_FORM = {
  pieza: '',
  marca: '',
  noSerie: '',
  precio: '',
  fechaCambio: '',
  foto: null,
};

const AddPartScreen = ({ navigation }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const pickImage = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a tus fotos para seleccionar una imagen.'
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        updateField('foto', result.assets[0].uri);
      }
    } catch (e) {
      console.error('Error al seleccionar imagen:', e);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  }, [updateField]);

  const removeImage = useCallback(() => {
    updateField('foto', null);
  }, [updateField]);

  const validate = useCallback(() => {
    const currentErrors = validatePartForm(formData);
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  }, [formData]);

  const hasChanges = Object.values(formData).some((val) => val !== '' && val !== null);

  const handleBack = useCallback(() => {
    if (hasChanges && !saving) {
      Alert.alert(
        'Descartar cambios',
        '¿Seguro que deseas salir? Se perderán los datos que no hayas guardado.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Salir sin guardar', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
      return true;
    }
    navigation.goBack();
    return true;
  }, [hasChanges, saving, navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBack();
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [handleBack])
  );

  const handleSave = useCallback(async () => {
    if (saving) return;
    if (!validate()) {
      Alert.alert('Campos incompletos', 'Por favor corrige los errores antes de guardar.');
      return;
    }
    setSaving(true);
    try {
      const newPart = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        pieza:       formData.pieza.trim(),
        marca:       formData.marca.trim(),
        noSerie:     formData.noSerie.trim(),
        precio:      parseFloat(formData.precio),
        fechaCambio: formData.fechaCambio.trim(),
        foto:        formData.foto,
      };
      const ok = await partStorage.savePart(newPart);
      if (ok) {
        navigation.goBack();
      } else {
        Alert.alert('Error', 'No se pudo guardar la pieza.');
      }
    } finally {
      setSaving(false);
    }
  }, [formData, saving, validate, navigation]);

  const handleCancel = useCallback(() => {
    handleBack();
  }, [handleBack]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surfaceContainerLow} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <MaterialIcons name="settings-input-component" size={20} color={COLORS.primary} />
          <Text style={styles.headerTitle}>NUEVA PIEZA</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleSection}>
            <Text style={styles.subtitle}>MÓDULO DE REGISTRO</Text>
            <Text style={styles.title}>Registro de piezas</Text>
          </View>

          {/* Selector de imagen (opcional) */}
          <View style={styles.photoCard}>
            <Text style={styles.photoLabel}>FOTO (OPCIONAL)</Text>
            {formData.foto ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: formData.foto }} style={styles.photoPreview} />
                <View style={styles.photoActions}>
                  <TouchableOpacity style={styles.photoActionBtn} onPress={pickImage}>
                    <MaterialIcons name="edit" size={18} color={COLORS.onPrimaryFixed} />
                    <Text style={styles.photoActionText}>CAMBIAR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.photoActionBtn, styles.photoRemoveBtn]}
                    onPress={removeImage}
                  >
                    <MaterialIcons name="delete" size={18} color={COLORS.error} />
                    <Text style={[styles.photoActionText, { color: COLORS.error }]}>QUITAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.photoPlaceholder} onPress={pickImage}>
                <MaterialIcons name="add-a-photo" size={40} color={COLORS.primary} />
                <Text style={styles.photoPlaceholderText}>Seleccionar imagen</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Formulario */}
          <View style={styles.formContent}>
            <FormField
              label="PIEZA"
              placeholder="ej. Bujía de Iridio"
              value={formData.pieza}
              onChangeText={(t) => updateField('pieza', t)}
              error={errors.pieza}
              iconName="precision-manufacturing"
              maxLength={80}
            />
            <FormField
              label="MARCA"
              placeholder="ej. Bosch"
              value={formData.marca}
              onChangeText={(t) => updateField('marca', t)}
              error={errors.marca}
              maxLength={60}
            />
            <FormField
              label="NO. SERIE"
              placeholder="Número de serie alfanumérico"
              value={formData.noSerie}
              onChangeText={(t) => updateField('noSerie', t)}
              error={errors.noSerie}
              maxLength={60}
              autoCapitalize="characters"
            />
            <FormField
              label="PRECIO (USD)"
              placeholder="0.00"
              value={formData.precio}
              onChangeText={(t) => updateField('precio', t)}
              error={errors.precio}
              keyboardType="numeric"
              prefix="$"
              maxLength={12}
            />
            <FormField
              label="FECHA DE CAMBIO"
              placeholder="YYYY-MM-DD"
              value={formData.fechaCambio}
              onChangeText={(t) => updateField('fechaCambio', t)}
              error={errors.fechaCambio}
              iconName="calendar-today"
              maxLength={10}
              autoCapitalize="none"
            />

            {/* Botones */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[styles.saveButton, saving && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'GUARDANDO...' : 'GUARDAR'}
                </Text>
                <MaterialIcons name="check-circle" size={16} color={COLORS.onPrimaryFixed} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>CANCELAR</Text>
                <MaterialIcons name="close" size={16} color={COLORS.onSurface} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: SPACING.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  backButton: {
    padding: SPACING.xs,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  titleSection: {
    marginBottom: SPACING.xl,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    letterSpacing: 3,
    color: COLORS.primary,
  },
  title: {
    fontSize: FONT_SIZES.display,
    fontWeight: '700',
    letterSpacing: -1,
    color: COLORS.onSurface,
    marginTop: SPACING.sm,
  },
  photoCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  photoLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 2,
    marginBottom: SPACING.md,
  },
  photoPlaceholder: {
    height: 180,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.primaryOverlay,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  photoPlaceholderText: {
    color: COLORS.onSurfaceVariant,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  photoPreviewContainer: {
    gap: SPACING.md,
  },
  photoPreview: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.md,
  },
  photoActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  photoActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
    gap: SPACING.xs,
  },
  photoActionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.onPrimaryFixed,
    letterSpacing: 1,
  },
  photoRemoveBtn: {
    backgroundColor: COLORS.errorOverlay,
  },
  formContent: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  actionContainer: {
    gap: SPACING.md,
    paddingTop: SPACING.md,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '900',
    color: COLORS.onPrimaryFixed,
    letterSpacing: 2,
  },
  cancelButton: {
    backgroundColor: COLORS.surfaceCancelButton,
    borderWidth: 1,
    borderColor: COLORS.surfaceCancelBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '900',
    color: COLORS.onSurface,
    letterSpacing: 2,
  },
});

export default AddPartScreen;
