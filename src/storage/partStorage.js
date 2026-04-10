import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'mecatrack_parts';

const loadParts = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error al cargar piezas:', e);
    return [];
  }
};

const savePart = async (part) => {
  try {
    const parts = await loadParts();
    parts.push(part);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parts));
  } catch (e) {
    console.error('Error al guardar pieza:', e);
  }
};

const deletePart = async (id) => {
  try {
    const parts = await loadParts();
    const filtered = parts.filter((p) => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error al eliminar pieza:', e);
  }
};

export default { loadParts, savePart, deletePart };
