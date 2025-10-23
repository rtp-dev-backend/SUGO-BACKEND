// src/rol/validators/rolExcel.validator.ts
import { Catalogo_modulos } from '../../General/models/Catalogo_modulos.model';
import { Rutas } from '../../General/models/rutas.model';

// Validador para las hojas del Excel de roles
export async function validarHojasExcel({ hojas, periodo, modulo }) {
  const rutasIds: number[] = [];
  const errores: any[] = [];
  for (let i = 0; i < hojas.length; i++) {
    const hoja = hojas[i];
    const encabezado = hoja.encabezado || {};
    // Validar periodo
    if (!periodoCoincide(periodo, encabezado.periodo)) {
      errores.push({
        message: `El periodo elegido no coincide con el periodo insertado en el excel.`,
        hoja: i + 1,
        periodoSelector: periodo,
        periodoExcel: encabezado.periodo,
      });
    }
    // Validar módulo
    const moduloExcel = encabezado.modulo?.[0] || null;
    const moduloValido = await Catalogo_modulos.findOne({ where: { mod_clave: moduloExcel } });
    if (modulo !== moduloExcel || !moduloValido) {
      errores.push({
        message: `El módulo seleccionado no coincide con el modulo ingresado en la plantilla.`,
        hoja: i + 1,
        moduloSelector: modulo,
        moduloExcel: moduloExcel
      });
    }
    // Validar ruta y obtener id
    const rutaExcel = encabezado.ruta?.[0] || null;
    const rutaValida = await Rutas.findOne({ where: { ruta: rutaExcel } });
    if (!rutaValida) {
      errores.push({
        message: `La ruta ${rutaExcel} no coincide con las rutas autorizadas.`,
        hoja: i + 1,
        rutaExcel: rutaExcel
      });
    }
    rutasIds.push(rutaValida ? (rutaValida as any).id : null);

    // Validar servicios de la hoja
    const economicosSet = new Set();
    for (const servicio of hoja.servicios || []) {
      if (!servicio.economico) {
        errores.push({
          message: `En el servicio ${servicio.no || ''} tienes el campo 'económico' vacío en la hoja ${i + 1}.`,
          hoja: i + 1,
          servicio: servicio
        });
      }
      if (servicio.economico && economicosSet.has(servicio.economico)) {
        errores.push({
          message: `El económico '${servicio.economico}' está repetido en los servicios de la hoja ${i + 1}.`,
          hoja: i + 1,
          servicio: servicio
        });
      }
      economicosSet.add(servicio.economico);
    }
  }
  if (errores.length > 0) {
    return { ok: false, errores };
  }
  return { ok: true, rutasIds };
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
    const regex = new RegExp(
        `Del\\s*${inicioDia}\\s*al\\s*${finDia}\\s*de\\s*${mesNombre}\\s*de\\s*${anio}`,
        "i"
    );

    return regex.test(periodoExcel);
}