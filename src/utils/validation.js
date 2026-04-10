/**
 * Validaciones centralizadas para los campos de la pieza.
 * Cada validador retorna un string con el error o `null` si todo está bien.
 */

export const LIMITS = {
  pieza:   { min: 2,  max: 80 },
  marca:   { min: 2,  max: 60 },
  noSerie: { min: 3,  max: 60 },
  precio:  { min: 0,  max: 9999999.99 },
};

const REQUIRED = (label) => `${label} es requerido`;

export const validatePieza = (value) => {
  const v = (value || '').trim();
  if (!v) return REQUIRED('El tipo de pieza');
  if (v.length < LIMITS.pieza.min) return `Mínimo ${LIMITS.pieza.min} caracteres`;
  if (v.length > LIMITS.pieza.max) return `Máximo ${LIMITS.pieza.max} caracteres`;
  if (!/^[\p{L}\p{N}\s().\-/]+$/u.test(v)) return 'Contiene caracteres no permitidos';
  return null;
};

export const validateMarca = (value) => {
  const v = (value || '').trim();
  if (!v) return REQUIRED('La marca');
  if (v.length < LIMITS.marca.min) return `Mínimo ${LIMITS.marca.min} caracteres`;
  if (v.length > LIMITS.marca.max) return `Máximo ${LIMITS.marca.max} caracteres`;
  if (!/^[\p{L}\p{N}\s().\-&]+$/u.test(v)) return 'Contiene caracteres no permitidos';
  return null;
};

export const validateNoSerie = (value) => {
  const v = (value || '').trim();
  if (!v) return REQUIRED('El número de serie');
  if (v.length < LIMITS.noSerie.min) return `Mínimo ${LIMITS.noSerie.min} caracteres`;
  if (v.length > LIMITS.noSerie.max) return `Máximo ${LIMITS.noSerie.max} caracteres`;
  if (!/^[A-Za-z0-9\-_/]+$/.test(v)) return 'Solo se permiten letras, números, "-", "_" o "/"';
  return null;
};

export const validatePrecio = (value) => {
  const v = (value || '').trim();
  if (!v) return REQUIRED('El precio');
  if (!/^\d+(\.\d{1,2})?$/.test(v)) return 'Formato inválido. Ej: 25.50';
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return 'No es un número válido';
  if (n < LIMITS.precio.min) return 'No puede ser negativo';
  if (n > LIMITS.precio.max) return `Máximo $${LIMITS.precio.max}`;
  return null;
};

export const validateFechaCambio = (value) => {
  const v = (value || '').trim();
  if (!v) return REQUIRED('La fecha');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Formato inválido. Use YYYY-MM-DD';

  const [yStr, mStr, dStr] = v.split('-');
  const year  = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);
  const day   = parseInt(dStr, 10);

  if (year < 1900 || year > 2100) return 'Año fuera de rango (1900-2100)';
  if (month < 1 || month > 12)    return 'Mes inválido (01-12)';
  if (day < 1   || day > 31)      return 'Día inválido (01-31)';

  const d = new Date(year, month - 1, day);
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return 'Fecha inexistente';
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (d.getTime() > today.getTime()) return 'No puede ser una fecha futura';

  return null;
};

/**
 * Valida todo el formulario y retorna un objeto de errores.
 * Si está vacío, el formulario es válido.
 */
export const validatePartForm = (formData) => {
  const errors = {};
  const piezaErr   = validatePieza(formData.pieza);
  const marcaErr   = validateMarca(formData.marca);
  const noSerieErr = validateNoSerie(formData.noSerie);
  const precioErr  = validatePrecio(formData.precio);
  const fechaErr   = validateFechaCambio(formData.fechaCambio);

  if (piezaErr)   errors.pieza       = piezaErr;
  if (marcaErr)   errors.marca       = marcaErr;
  if (noSerieErr) errors.noSerie     = noSerieErr;
  if (precioErr)  errors.precio      = precioErr;
  if (fechaErr)   errors.fechaCambio = fechaErr;

  return errors;
};
