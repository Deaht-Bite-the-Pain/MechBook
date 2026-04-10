/**
 * Convierte una fecha ISO "YYYY-MM-DD" a formato de display "DD/MM/YYYY"
 */
export const formatDateDisplay = (isoString) => {
  if (!isoString) return '';
  const parts = isoString.split('-');
  if (parts.length !== 3) return isoString;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

/**
 * Ordena un array de piezas por fechaCambio descendente (más reciente primero)
 */
export const sortPartsByDate = (parts) => {
  return [...parts].sort((a, b) => {
    if (a.fechaCambio > b.fechaCambio) return -1;
    if (a.fechaCambio < b.fechaCambio) return 1;
    return 0;
  });
};
