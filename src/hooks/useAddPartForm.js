import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import partStorage from '../storage/partStorage';
import {
  validatePartForm,
  validatePieza,
  validateMarca,
  validateNoSerie,
  validatePrecio,
  validateFechaCambio,
} from '../utils/validation';

const INITIAL_FORM = {
  pieza: '',
  marca: '',
  noSerie: '',
  precio: '',
  fechaCambio: '',
  foto: null,
};

const FIELD_VALIDATORS = {
  pieza:       validatePieza,
  marca:       validateMarca,
  noSerie:     validateNoSerie,
  precio:      validatePrecio,
  fechaCambio: validateFechaCambio,
};

/**
 * Hook que encapsula toda la lógica del formulario de registro de pieza:
 * estado, validación por campo, validación global, image picker y guardado.
 */
export const useAddPartForm = ({ onSaved } = {}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);

  const isDirty = useMemo(
    () =>
      formData.pieza !== '' ||
      formData.marca !== '' ||
      formData.noSerie !== '' ||
      formData.precio !== '' ||
      formData.fechaCambio !== '' ||
      formData.foto !== null,
    [formData]
  );

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Validación en vivo solo si el campo ya fue tocado
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validator = FIELD_VALIDATORS[field];
    if (validator) {
      const err = validator(value);
      setErrors((prev) => ({ ...prev, [field]: err || undefined }));
    }
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
        setFormData((prev) => ({ ...prev, foto: result.assets[0].uri }));
      }
    } catch (e) {
      console.error('Error al seleccionar imagen:', e);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  }, []);

  const removeImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, foto: null }));
  }, []);

  const validateAll = useCallback(() => {
    const newErrors = validatePartForm(formData);
    setErrors(newErrors);
    setTouched({
      pieza: true,
      marca: true,
      noSerie: true,
      precio: true,
      fechaCambio: true,
    });
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = useCallback(async () => {
    if (saving) return;
    if (!validateAll()) {
      Alert.alert(
        'Campos incompletos',
        'Por favor corrige los errores antes de guardar.'
      );
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
        if (onSaved) onSaved();
      } else {
        Alert.alert('Error', 'No se pudo guardar la pieza.');
      }
    } finally {
      setSaving(false);
    }
  }, [formData, saving, validateAll, onSaved]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setTouched({});
  }, []);

  return {
    formData,
    errors,
    touched,
    saving,
    isDirty,
    updateField,
    pickImage,
    removeImage,
    handleSave,
    resetForm,
  };
};
