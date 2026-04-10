/**
 * Mapeo de tipos de pieza a iconos de MaterialIcons.
 * Si no se encuentra una coincidencia, se usa el icono por defecto.
 */
const ICON_MAP = {
  'bujías':                'bolt',
  'bujia':                 'bolt',
  'bujías de iridio':      'bolt',
  'filtro de aceite':      'opacity',
  'filtro de aire':        'air',
  'frenos':                'do-not-disturb-on',
  'pastillas de freno':    'do-not-disturb-on',
  'líquido de frenos':     'water-drop',
  'batería':               'battery-full',
  'bateria':               'battery-full',
  'correa de distribución':'settings',
  'amortiguadores':        'vertical-align-center',
  'aceite de motor':       'opacity',
  'neumáticos':            'trip-origin',
  'neumaticos':            'trip-origin',
  'embrague':              'settings-input-component',
  'radiador':              'ac-unit',
  'alternador':            'flash-on',
  'bomba de agua':         'water-drop',
};

const DEFAULT_ICON = 'build';

/**
 * Devuelve el nombre del icono MaterialIcons asociado al tipo de pieza.
 * La búsqueda es case-insensitive.
 */
export const getIconForPart = (pieza) => {
  if (!pieza || typeof pieza !== 'string') return DEFAULT_ICON;
  const key = pieza.trim().toLowerCase();
  return ICON_MAP[key] || DEFAULT_ICON;
};
