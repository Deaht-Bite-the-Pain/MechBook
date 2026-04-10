import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'mecatrack_parts';

/**
 * Sanitiza una pieza antes de guardarla:
 *  - convierte tipos
 *  - recorta strings
 *  - aplica longitudes máximas
 *  - rellena defaults
 */
const sanitizePart = (part) => {
  if (!part || typeof part !== 'object') return null;
  return {
    id:          String(part.id || `${Date.now()}${Math.random().toString(36).slice(2)}`),
    pieza:       String(part.pieza || '').trim().slice(0, 80),
    marca:       String(part.marca || '').trim().slice(0, 60),
    noSerie:     String(part.noSerie || '').trim().slice(0, 60),
    precio:      Number.isFinite(parseFloat(part.precio)) ? parseFloat(part.precio) : 0,
    fechaCambio: String(part.fechaCambio || '').trim().slice(0, 10),
    foto:        part.foto ? String(part.foto) : null,
  };
};

const INITIAL_DUMMY_DATA = [
  {
    id: 'AUTO-091',
    pieza: 'Bujía de Iridio',
    marca: 'Bosch',
    noSerie: 'AUTO-091',
    precio: 24.99,
    fechaCambio: '2023-09-29',
    foto: null,
  },
  {
    id: 'AUTO-044',
    pieza: 'Filtro de Aceite',
    marca: 'Fram',
    noSerie: 'AUTO-044',
    precio: 15.50,
    fechaCambio: '2023-08-15',
    foto: null,
  },
  {
    id: 'AUTO-212',
    pieza: 'Pastillas de Freno',
    marca: 'Brembo',
    noSerie: 'AUTO-212',
    precio: 89.99,
    fechaCambio: '2023-05-02',
    foto: null,
  }
];

/**
 * Lectura segura. Si los datos están corruptos retorna [] y limpia el storage.
 */
const _readAll = async () => {
  try {
    let json = await AsyncStorage.getItem(STORAGE_KEY);
    // Verificar si es null o '[]' sin uso en caso de que quieran los de respaldo
    if (!json) {
      await _writeAll(INITIAL_DUMMY_DATA);
      return INITIAL_DUMMY_DATA.map(sanitizePart);
    }
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) {
      console.warn('Datos corruptos en storage, reseteando.');
      await _writeAll(INITIAL_DUMMY_DATA);
      return INITIAL_DUMMY_DATA.map(sanitizePart);
    }
    return parsed.map(sanitizePart).filter(Boolean);
  } catch (e) {
    console.error('Error leyendo storage:', e);
    return [];
  }
};

const _writeAll = async (parts) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parts));
    return true;
  } catch (e) {
    console.error('Error escribiendo storage:', e);
    return false;
  }
};

const loadParts = async () => {
  return await _readAll();
};

const savePart = async (part) => {
  const sanitized = sanitizePart(part);
  if (!sanitized || !sanitized.pieza) return false;
  const parts = await _readAll();
  // Evitar IDs duplicados
  if (parts.some((p) => p.id === sanitized.id)) {
    sanitized.id = `${Date.now()}${Math.random().toString(36).slice(2)}`;
  }
  parts.push(sanitized);
  return await _writeAll(parts);
};

const deletePart = async (id) => {
  if (!id) return false;
  const parts = await _readAll();
  const filtered = parts.filter((p) => p.id !== id);
  if (filtered.length === parts.length) return false;
  return await _writeAll(filtered);
};

const clearAll = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Error limpiando storage:', e);
    return false;
  }
};

export default { loadParts, savePart, deletePart, clearAll };
