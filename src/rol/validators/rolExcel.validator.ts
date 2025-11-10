// src/rol/validators/rolExcel.validator.ts
import { Catalogo_modulos } from '../../General/models/Catalogo_modulos.model';
import { Rutas } from '../../General/models/rutas.model';
import { RutaModalidades } from '../../General/models/ruta_modalidades.model';
import { Modalidades } from '../../General/models/modalidades.model';
import { Roles } from '../models/roles.model';

// Validador para las hojas del Excel de roles
export async function validarHojasExcel({ hojas, periodo, modulo, modulo_usuario }: { hojas: any[], periodo: any, modulo: number, modulo_usuario: number }) {
  
  // Validar si ya existe un rol con el mismo periodo y módulo
  const rolExistente = await Roles.findOne({
    where: {
      periodo: periodo.id || periodo, // soporta objeto o valor directo
      modulo: modulo
    }
  });
  // if (modulo_usuario !== modulo || modulo_usuario === 0) { // módulo no coincide con el módulo del usuario
  //   return {
  //     ok: false,
  //     errores: [{
  //       message: `No puedes registrar un ROL si no pertences al modulo seleccionado en el formulario.`,
  //       hoja: "No perteneces al modulo elegido",
  //       moduloSelector: modulo_usuario,
  //       moduloExcel: modulo
  //     }]
  //   }
  // } else
     if (rolExistente) { // ya existe un rol para ese periodo y módulo
    return {
      ok: false,
      errores: [{
        message: `Ya existe un rol cargado para este periodo. Verifica que no estés subiendo el mismo archivo o datos duplicados.`,
        periodo: periodo.id || periodo,
        hoja: "Rol existente",
        modulo
      }]
    };
  }

  const rutasIds: number[] = [];
  const rutaModalidadesIds: (number | null)[] = [];
  const errores: any[] = [];
  
  // Sets globales para validar duplicados entre todas las hojas
  const economicosGlobales = new Map<string, Array<{hoja: string, servicio: string}>>(); // economico -> [{hoja, servicio}]
  const operadoresGlobales = new Map<string, Array<{hoja: string, servicio: string}>>(); // operador -> [{hoja, servicio}]
  
  for (let i = 0; i < hojas.length; i++) {
    const hoja = hojas[i];
    const nombreHoja = hoja.nombre || `Hoja ${i + 1}`;
    const encabezado = hoja.encabezado || {};
    // Validar periodo
    if (!periodoCoincide(periodo, encabezado.periodo)) {
      // console.log('Periodo no coincide:', periodo, encabezado.periodo);
      errores.push({
        message: `El periodo elegido no coincide con el periodo insertado en el excel.`,
        hoja: nombreHoja,
        periodoSelector: periodo,
        periodoExcel: encabezado.periodo,
      });
    }
    // Validar módulo
    const moduloExcel = encabezado.modulo?.[0] || null;
    const moduloValido = await Catalogo_modulos.findOne({ where: { mod_clave: moduloExcel } });

    if (!moduloValido) { // módulo no válido
      errores.push({
        message: `El módulo '${moduloExcel}' no es válido. Por favor ingresa tu modulo correctamente con valores enteros 1-7.`,
        hoja: nombreHoja,
        moduloExcel
      });
    } else if (modulo !== moduloExcel) { // módulo no coincide con el seleccionado al modulo del excel
      errores.push({
        message: `El módulo seleccionado no coincide con el modulo ingresado en la plantilla.`,
        hoja: nombreHoja,
        moduloSelector: modulo,
        moduloExcel: moduloExcel
      });
    }
    

    // Validar ruta y obtener id (con lógica especial para la 200)
    const rutaExcel = encabezado.ruta?.[0] || null;
    const origenExcel = (encabezado.origen?.[0] || "").trim();
    const destinoExcel = (encabezado.destino?.[0] || "").trim();
    let rutaValida;
    if (rutaExcel === "200") {
      // Solo valida destino para la ruta 200
      rutaValida = await Rutas.findOne({ where: { ruta: rutaExcel, destino: destinoExcel } });
      if (!rutaValida) {
        errores.push({
          message: `La ruta ${rutaExcel} no cuenta con destino: '${destinoExcel}'.`,
          hoja: nombreHoja,
          rutaExcel,
          destinoExcel
        });
      }
    } else {
      // Valida origen y destino para las demás rutas
      rutaValida = await Rutas.findOne({ where: { ruta: rutaExcel, origen: origenExcel, destino: destinoExcel } });
      if (!rutaValida) {
        errores.push({
          message: `No se encontró una ruta autorizada con ruta: '${rutaExcel}', origen: '${origenExcel}' y destino: '${destinoExcel}'.`,
          hoja: nombreHoja,
          rutaExcel,
          origenExcel,
          destinoExcel
        });
      }
    }
    rutasIds.push(rutaValida ? (rutaValida as any).id : null);

    // Validar modalidad
    const modalidadExcel = encabezado.modalidad?.[0] || null;
    let modalidadValida = null;
    if (modalidadExcel) {

      modalidadValida = await Modalidades.findOne({ where: { name: modalidadExcel } });
      if (!modalidadValida) {
        errores.push({
          message: `La modalidad '${modalidadExcel}' no existe en el catálogo de modalidades autorizadas.`,
          hoja: nombreHoja,
          modalidadExcel
        });
      }
    } else {
      errores.push({
        message: `No se encontró modalidad en el encabezado de la hoja.`,
        hoja: nombreHoja
      });
    }

    // Validar combinación ruta-modalidad en ruta_modalidades
    let rutaModalidadId: number | null = null;
    if (rutaValida && modalidadValida) {
      const rutaId = (rutaValida as any).id;
      const modalidadId = (modalidadValida as any).id;
      const existeRutaModalidad = await RutaModalidades.findOne({ where: { ruta_id: rutaId, modalidad_id: modalidadId } });
      if (!existeRutaModalidad) {
        errores.push({
          message: `La ruta '${rutaExcel}' no cuenta con la modalidad '${modalidadExcel}' no se encuentra en el catalogo de rutas autorizadas.`,
          hoja: nombreHoja,
          ruta_id: rutaId,
          modalidad_id: modalidadId
        });
      } else {
        rutaModalidadId = (existeRutaModalidad as any).id;
      }
    }
    rutaModalidadesIds.push(rutaModalidadId);

    // Recopilar económicos y operadores de la hoja para validación global
    for (const servicio of hoja.servicios || []) {
      if (servicio.sistema && !servicio.economico) {
        errores.push({
          message: `En el servicio ${servicio.no || ''} tienes el campo 'económico' vacío en la hoja ${nombreHoja}.`,
          hoja: nombreHoja,
          servicio: servicio
        });
      }
      
      // Recopilar económicos para validación global
      if (servicio.economico) {
        if (!economicosGlobales.has(servicio.economico)) {
          economicosGlobales.set(servicio.economico, []);
        }
        economicosGlobales.get(servicio.economico)!.push({
          hoja: nombreHoja, 
          servicio: servicio.no || 'Sin número'
        });
      }
      
      // Recopilar operadores para validación global
      if (servicio.turno_operadores) {
        // Iterar sobre cada turno para extraer las credenciales
        Object.keys(servicio.turno_operadores).forEach(turno => {
          const credencial = servicio.turno_operadores[turno]?.credencial;
          if (credencial) {
            if (!operadoresGlobales.has(credencial)) {
              operadoresGlobales.set(credencial, []);
            }
            operadoresGlobales.get(credencial)!.push({
              hoja: rutaExcel || nombreHoja,
              servicio: servicio.no || 'Sin número'
            });
          }
        });
      }
    }
  }
  
  
  // Validar duplicados globales de económicos
  for (const [economico, ubicaciones] of economicosGlobales.entries()) {
    if (ubicaciones.length > 1) {
      // Crear mensaje con formato: "El económico 'X' está repetido en el servicio Y y en la ruta Z del servicio W."
      const primera = ubicaciones[0];
      const resto = ubicaciones.slice(1);
      
      let mensaje = `El económico '${economico}' está repetido en el servicio ${primera.servicio}`;
      resto.forEach(u => {
        mensaje += ` y en la ruta ${u.hoja} del servicio ${u.servicio}`;
      });
      mensaje += '.';
      
      errores.push({
        message: mensaje,
        hoja: primera.hoja,
        economico,
        ubicaciones
      });
    }
  }
  
  // Validar duplicados globales de operadores (credenciales)
  for (const [credencial, ubicaciones] of operadoresGlobales.entries()) {
    if (ubicaciones.length > 1) {
      // Crear mensaje con formato: "La credencial 'X' está repetida en el servicio Y y en la ruta Z del servicio W."
      const primera = ubicaciones[0];
      const resto = ubicaciones.slice(1);
      
      let mensaje = `La credencial '${credencial}' está repetida en el servicio ${primera.servicio}`;
      resto.forEach(u => {
        mensaje += ` y en la ruta ${u.hoja} del servicio ${u.servicio}`;
      });
      mensaje += '.';
      
      errores.push({
        message: mensaje,
        hoja: primera.hoja,
        credencial,
        ubicaciones
      });
    }
  }
  if (errores.length > 0) {
    return { ok: false, errores };
  }
  return { ok: true, rutasIds, rutaModalidadesIds };
}



// Valida el periodo del excel sea igual al seleccionado en el selector
function periodoCoincide(periodoSelector, periodoExcel) {
  // Extrae las fechas del selector
  const { fecha_inicio, fecha_fin } = periodoSelector; // formato 'YYYY-MM-DD'

  // Convierte las fechas al formato esperado en el texto del Excel
  const [anioIni, mesIni, diaIni] = fecha_inicio.split("-");
  const [anioFin, mesFin, diaFin] = fecha_fin.split("-");
  const inicioDia = diaIni.padStart(2, "0");
  const finDia = diaFin.padStart(2, "0");

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const mesNombre = meses[parseInt(mesIni, 10) - 1];
  const anio = anioIni;
  // Regex tolerante: 'Del', 'al', 'de' opcionales, mayúsculas/minúsculas, espacios flexibles
  const regex = new RegExp(
    `(Del\\s*)?${inicioDia}\\s*(al)?\\s*${finDia}\\s*(de)?\\s*${mesNombre}\\s*(de)?\\s*${anio}`,
    "i"
  );
  // console.log('Validando periodo con regex:', regex, 'en texto:', periodoExcel);
  return regex.test(periodoExcel);
}