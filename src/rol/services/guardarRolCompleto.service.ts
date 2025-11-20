import { Roles } from '../models/roles.model';
import { cargasArchivosRol } from '../models/cargasArchivosRol.model';
import { servicios } from '../models/servicios.model';
import { operadoresServicio } from '../models/operadoresServicio.model';
import { horarios } from '../models/horarios.model';
import { cubredescansos } from '../models/cubredescansos.model';
import { cubredescansosTurnos } from '../models/cubredescansosTurnos.model';
import { jornadasExcepcionales } from '../models/jornadasExcepcionales.model';
import { validarHojasExcel } from '../validators/rolExcel.validator';

// Función para limpiar campos de hora (evita string vacío o espacios)
function limpiarHora(valor: any): string | null {
    if (typeof valor !== 'string') return null;
    const v = valor.trim();
    return v === '' ? null : v;
}

// Función para limpiar campos de texto
function limpiarTexto(valor: any): string | null {
    if (typeof valor !== 'string') return null;
    const v = valor.trim();
    return v === '' ? null : v;
}

// Función para limpiar campos numéricos (convierte string vacío o espacios a null)
function limpiarNumero(valor: any): number | null {
    if (typeof valor === 'number') return valor;
    if (typeof valor === 'string') {
        const v = valor.trim();
        if (v === '') return null;
        const n = Number(v);
        return isNaN(n) ? null : n;
    }
    return null;
}



export async function guardarRolCompletoService({ nombre_archivo, subido_por, hojas, periodo, modulo, modulo_usuario }, transaction) {
    // Validar antes de insertar y obtener ids de rutas
    const validacion = await validarHojasExcel({ hojas, periodo, modulo, modulo_usuario });
    if (!validacion.ok) {
        throw validacion.errores;
    }
    const rutasIds = validacion.rutasIds;
    const rutaModalidadesIds = validacion.rutaModalidadesIds;

    // 1. Inserta los datos en CargasArchivosRol
    const archivo = await cargasArchivosRol.create({ nombre_archivo, subido_por }, { transaction });
    const archivoId = archivo.getDataValue('id');

    for (let i = 0; i < hojas.length; i++) { // Por cada hoja
        const hoja = hojas[i]; 
        const encabezado = hoja.encabezado || {}; // Obtener encabezado de la hoja
        const rutaModalidadId = rutaModalidadesIds[i] || null; // Obtener id de ruta_modalidades validada

        // Data para crear el rol
        const rolData = {
            archivo: archivoId,
            periodo: periodo.id || null,
            ruta_modalidad: rutaModalidadId,
            modulo: modulo || null,
            notas: encabezado.notas?.['NOTAS:'] ?? "",
            dias_impar: encabezado.impar?.[0] || null,
            dias_par: encabezado.par?.[0] || null,
        };

        // 2. Insertar el registro en Roles
        const rol = await Roles.create(rolData, { transaction });
        const rolId = rol.getDataValue('id');

        // 3. Insertar los servicios asociados (solo si tienen datos relevantes)
        const serviciosFiltrados = (hoja.servicios || []).filter(s => s.economico || s.sistema);
        for (const servicio of serviciosFiltrados) {
            const servicioData = {
                rol_id: rolId,
                economico: servicio.economico || null,
                sistema: servicio.sistema || null
            }
            const servicioCreado = await servicios.create(
                servicioData,
                { transaction }
            );
            const servicioId = servicioCreado.getDataValue('id');

            // 4. Insertar operadores del servicio si existen
            const operadoresServicioIds: Record<number, number> = {};
            if (servicio.turno_operadores) {
                for (const [turnoKey, operadorDataRaw] of Object.entries(servicio.turno_operadores as Record<string, { credencial: number, descansos: string[] }>)) {
                    const operadorData = operadorDataRaw as { credencial: number, descansos: string[] };
                    const turnoNum = parseInt(turnoKey.replace(/[^0-9]/g, ''), 10);
                    const operadorCreado = await operadoresServicio.create({
                        servicio_id: servicioId,
                        turno: turnoNum,
                        operador: operadorData.credencial,
                        descansos: operadorData.descansos
                    }, { transaction });
                    operadoresServicioIds[turnoNum] = operadorCreado.getDataValue('id');
                }
            }

            // 5. Insertar horarios asociados
            const dias = ['Lunes a Viernes', 'Sabado', 'Domingo'];
            for (const dia of dias) {
                const horariosDia = servicio[dia];
                if (!horariosDia) continue;

                // Para cada operador del servicio, guarda solo el horario de su turno
                for (const [turnoKey, operadorDataRaw] of Object.entries(servicio.turno_operadores as Record<string, { credencial: number, descansos: string[] }>)) {
                    const turnoNum = parseInt(turnoKey.replace(/[^0-9]/g, ''), 10);
                    const servicio_operador_id = operadoresServicioIds[turnoNum];
                    if (!servicio_operador_id) continue;

                    // Mapea el turnoNum al label de horario
                    let horarioLabel = '';
                    if (turnoNum === 1) horarioLabel = '1er Turno';
                    else if (turnoNum === 2) horarioLabel = '2do Turno';
                    else if (turnoNum === 3) horarioLabel = '3er Turno';

                    const horarioTurno = horariosDia[horarioLabel];
                    if (!horarioTurno) continue;

                    // Verifica si hay al menos un campo relevante con datos
                    const campos = [
                        horarioTurno['Hora inicio Turno 1'], horarioTurno['Hora inicio Turno'], horarioTurno['Hora Inicio Turno'], horarioTurno['Hora Inicio Turno 3'], horarioTurno['Hora inicio 2'], horarioTurno['Hora inicio'],
                        horarioTurno['Hora inicio en CC'], horarioTurno['Hora inicio CC'],
                        horarioTurno['Lugar Inicio 1'], horarioTurno['Lugar Inicio'], horarioTurno['Lugar Inicio 2'], horarioTurno['Lugar Inicio 3'],
                        horarioTurno['Hora termino Turno 1'], horarioTurno['Hora termino Turno'], horarioTurno['Hora término Turno'], horarioTurno['Hora termino Turno 2'], horarioTurno['Hora Termino Turno 3'],
                        horariosDia.Termino?.['Hora Termino en CC'], horarioTurno['Hora Termino en CC'], horarioTurno['Hora término en CC'],
                        horariosDia.Termino?.['Lugar de termino CC'], horarioTurno['Lugar de término CC'], horarioTurno['Lugar de termino CC'],
                        horariosDia.Termino?.['Termino en Modulo'], horarioTurno['Termino en Modulo'],
                        horariosDia.Termino?.['Termino del Turno'], horarioTurno['Termino del Turno']
                    ];
                    const todosVacios = campos.every(v => v === null || v === undefined || (typeof v === 'string' && v.trim() === ''));
                    if (todosVacios) continue;

                    // Construye insertData con solo los campos que corresponden al turno
                    const insertData: any = {
                        servicio_id: servicioId,
                        servicio_operador_id,
                        dias_servicios: dia,
                        turno: turnoNum
                    };

                    if (turnoNum === 1) {
                        // 1er turno: Hora inicio Turno, Hora inicio en CC, Lugar inicio, Hora termino Turno
                        insertData.hora_inicio_turno = limpiarHora(
                            horarioTurno['Hora inicio Turno 1'] ||
                            horarioTurno['Hora inicio Turno'] ||
                            horarioTurno['Hora Inicio Turno'] ||
                            horarioTurno['Hora inicio'] ||
                            horarioTurno['Hora inicio 2']
                        );
                        insertData.hora_inicio_cc = limpiarHora(
                            horarioTurno['Hora inicio en CC'] || horarioTurno['Hora inicio CC']
                        );
                        insertData.lugar_inicio = limpiarTexto(
                            horarioTurno['Lugar Inicio 1'] || horarioTurno['Lugar Inicio'] || horarioTurno['Lugar Inicio 2']
                        );
                        insertData.hora_termino_turno = limpiarHora(
                            horarioTurno['Hora termino Turno 1'] || horarioTurno['Hora termino Turno'] || horarioTurno['Hora término Turno']
                        );
                    } else if (turnoNum === 2) {
                        // 2do turno: Lugar Inicio, Hora inicio, Hora termino Turno
                        insertData.lugar_inicio = limpiarTexto(
                            horarioTurno['Lugar Inicio'] || horarioTurno['Lugar Inicio 2']
                        );
                        insertData.hora_inicio_turno = limpiarHora(
                            horarioTurno['Hora inicio'] || horarioTurno['Hora inicio 2']
                        );
                        insertData.hora_termino_turno = limpiarHora(
                            horarioTurno['Hora termino Turno'] || horarioTurno['Hora termino Turno 2'] || horarioTurno['Hora término Turno']
                        );
                    } else if (turnoNum === 3) {
                        // 3er turno: Lugar Inicio, Hora Inicio Turno, Hora Termino en CC, Lugar de termino CC, Termino en Modulo, Termino del Turno
                        insertData.lugar_inicio = limpiarTexto(
                            horarioTurno['Lugar Inicio 3'] || horarioTurno['Lugar Inicio']
                        );
                        insertData.hora_inicio_turno = limpiarHora(
                            horarioTurno['Hora Inicio Turno 3'] || horarioTurno['Hora Inicio Turno'] || horarioTurno['Hora inicio']
                        );
                        insertData.hora_termino_cc = limpiarHora(
                            horariosDia.Termino?.['Hora Termino en CC'] || horarioTurno['Hora Termino en CC'] || horarioTurno['Hora término en CC']
                        );
                        insertData.lugar_termino_cc = limpiarTexto(
                            horariosDia.Termino?.['Lugar de termino CC'] || horarioTurno['Lugar de término CC'] || horarioTurno['Lugar de termino CC']
                        );
                        insertData.termino_modulo = limpiarHora(
                            horariosDia.Termino?.['Termino en Modulo']
                        );
                        insertData.termino_turno = limpiarHora(
                            horariosDia.Termino?.['Termino del Turno']
                        );
                    }

                    await horarios.create(insertData, { transaction });
                }
            }
        }
        // console.log('cubredescansos hoja:', hoja.cubredescansos);
        // Filtrar cubredescansos para evitar registros vacíos
        if (hoja.cubredescansos) {
            const cubredescansosFiltrados = Object.entries(hoja.cubredescansos).filter(([_, cubre]) => {
                // Considera string vacío, null y undefined como vacío
                const campos = [
                    cubre['Económico'], cubre['Sistema'], cubre['1er Turno'], cubre['2do Turno'], cubre['3er Turno'],
                    cubre['L'], cubre['M'], cubre['Mi'], cubre['J'], cubre['V'], cubre['S'], cubre['D']
                ];
                return campos.some(v => v !== null && v !== undefined && !(typeof v === 'string' && v.trim() === ''));
            });
            for (const [key, cubre] of cubredescansosFiltrados) {
                // 6. Insertar el cubredescanso
                const cubredescansoCreado = await cubredescansos.create({
                    rol_id: rolId,
                    economico: limpiarNumero(cubre['Económico']),
                    sistema: cubre['Sistema'] || null
                }, { transaction });
                const cubredescansoId = cubredescansoCreado.getDataValue('id');

                // Preparar objeto de días para servicios_a_cubrir (solo días con valor)
                const servicios_a_cubrir = {};
                ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'].forEach(dia => {
                    if (cubre[dia] !== null && cubre[dia] !== undefined) {
                        servicios_a_cubrir[dia] = cubre[dia];
                    }
                });

                // 7. Insertar los turnos del cubredescanso
                for (let t = 1; t <= 3; t++) {
                    const operador = cubre[`${t === 1 ? '1er Turno' : t === 2 ? '2do Turno' : '3er Turno'}`];
                    if (!operador) continue;
                    await cubredescansosTurnos.create({
                        cubredescanso_id: cubredescansoId,
                        turno: t,
                        operador,
                        servicios_a_cubrir
                    }, { transaction });
                }
            }

            // 8. Insertar jornadas excepcionales (por hoja, después de servicios)
            if (hoja.jornadasExcepcionales) {
                const jornadasFiltradas = hoja.jornadasExcepcionales.filter(jornada => {
                    const campos = [
                        jornada.Credencial, jornada.Lugar, jornada['Hora de Inicio'], jornada['Hora de Termino'],
                        jornada.L, jornada.M, jornada.Mi, jornada.J, jornada.V, jornada.S, jornada.D
                    ];
                    return campos.some(v => v !== null && v !== undefined && !(typeof v === 'string' && v.trim() === ''));
                });
                for (const jornada of jornadasFiltradas) {
                    // Preparar objeto de días para dias_servicio (solo días con valor)
                    const dias_servicio = {};
                    ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'].forEach(dia => {
                        if (jornada[dia] !== null && jornada[dia] !== undefined) {
                            dias_servicio[dia] = jornada[dia];
                        }
                    });

                    await jornadasExcepcionales.create({
                        rol_id: rolId,
                        operador: jornada.Credencial,
                        lugar: jornada.Lugar || null,
                        hora_inicio: limpiarHora(jornada['Hora de Inicio']),
                        hora_termino: limpiarHora(jornada['Hora de Termino']),
                        dias_servicio
                    }, { transaction });
                }
            }
        }
    }
}