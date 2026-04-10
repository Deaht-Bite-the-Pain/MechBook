import React, { memo } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

/**
 * Campo de formulario reutilizable. Permite icono opcional, prefijo y mensaje de error.
 */
const FormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
  iconName,
  prefix,
  maxLength = 100,
  autoCapitalize = 'sentences',
}) => {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.wrapper}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          style={[
            styles.input,
            prefix && { paddingLeft: 30 },
            error && styles.inputError,
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.onSurfaceVariantOverlayPlaceholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={20}
            color={COLORS.primary}
            style={styles.icon}
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    gap: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  wrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    color: COLORS.onSurface,
    fontSize: FONT_SIZES.md,
  },
  inputError: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  icon: {
    position: 'absolute',
    right: SPACING.md,
  },
  prefix: {
    position: 'absolute',
    left: SPACING.md,
    color: COLORS.onSurfaceVariant,
    zIndex: 1,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default memo(FormField);
