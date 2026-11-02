
/* ==========================================
   pura lectura — datos iniciales

   los libros se almacenan localmente.
   esta aplicación no utiliza una api.
   ========================================== */

export const ESTADOS = [
  'Pendiente',
  'Leyendo',
  'Leído'
];

export const MIEMBROS = [
  'María',
  'Daniel',
  'Sofía',
  'Andrés'
];

export const LIBROS_INICIALES = [
  {
    id: 1,
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    miembro: 'María',
    estado: 'Leído'
  },
  {
    id: 2,
    titulo: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    miembro: 'Daniel',
    estado: 'Leyendo'
  },
  {
    id: 3,
    titulo: 'La casa de los espíritus',
    autor: 'Isabel Allende',
    miembro: 'Sofía',
    estado: 'Pendiente'
  },
  {
    id: 4,
    titulo: 'Don Quijote de la Mancha',
    autor: 'Miguel de Cervantes',
    miembro: 'Andrés',
    estado: 'Leyendo'
  },
  {
    id: 5,
    titulo: 'Como agua para chocolate',
    autor: 'Laura Esquivel',
    miembro: 'María',
    estado: 'Pendiente'
  },
  {
    id: 6,
    titulo: 'La tregua',
    autor: 'Mario Benedetti',
    miembro: 'Daniel',
    estado: 'Leído'
  }
];

