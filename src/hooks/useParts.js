import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import partStorage from '../storage/partStorage';
import { sortPartsByDate } from '../utils/dateUtils';

/**
 * Hook que encapsula toda la lógica de gestión de piezas:
 * carga, filtrado, ordenamiento, eliminación.
 */
export const useParts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(false);

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

  // Recarga al recuperar el foco (al volver de AddPart)
  useFocusEffect(
    useCallback(() => {
      loadParts();
    }, [loadParts])
  );

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

  const deletePart = useCallback(
    async (id) => {
      const ok = await partStorage.deletePart(id);
      if (ok) loadParts();
      return ok;
    },
    [loadParts]
  );

  const toggleSort = useCallback(() => setSortAsc((v) => !v), []);

  const clearSearch = useCallback(() => setSearchQuery(''), []);

  return {
    parts,
    visibleParts,
    loading,
    searchQuery,
    setSearchQuery,
    clearSearch,
    sortAsc,
    toggleSort,
    deletePart,
    reload: loadParts,
  };
};
