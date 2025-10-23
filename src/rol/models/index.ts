import { Servicios } from './servicios.model';
import { OperadoresServicio } from './operadoresServicio.model';
import { Roles } from './roles.model';
import { Cubredescansos } from './cubredescansos.model';
import { JornadasExcepcionales } from './jornadasExcepcionales.model';

// Relaciones
Servicios.hasMany(OperadoresServicio, { foreignKey: 'servicio_id', sourceKey: 'id' });
OperadoresServicio.belongsTo(Servicios, { foreignKey: 'servicio_id', targetKey: 'id' });

Roles.hasMany(Servicios, { foreignKey: 'rol_id', sourceKey: 'id' });
Servicios.belongsTo(Roles, { foreignKey: 'rol_id', targetKey: 'id' });

Roles.hasMany(Cubredescansos, { foreignKey: 'rol_id', sourceKey: 'id' });
Cubredescansos.belongsTo(Roles, { foreignKey: 'rol_id', targetKey: 'id' });

Roles.hasMany(JornadasExcepcionales, { foreignKey: 'rol_id', sourceKey: 'id' });
JornadasExcepcionales.belongsTo(Roles, { foreignKey: 'rol_id', targetKey: 'id' });

export {
  Servicios,
  OperadoresServicio,
  Roles,
  Cubredescansos,
  JornadasExcepcionales
};
