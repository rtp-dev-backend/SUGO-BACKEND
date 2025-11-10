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

                // Mapea los turnos a número y operador
                const turnosMap = {
                    '1er Turno': 1,
                    '2do Turno': 2,
                    '3er Turno': 3
                };

                for (const turnoLabel in turnosMap) {
                    const turnoNum = turnosMap[turnoLabel];
                    const horarioTurno = horariosDia[turnoLabel];
                    if (!horarioTurno) continue;

                    // Busca el id del registro de operador_servicio para este turno
                    const servicio_operador_id = operadoresServicioIds[turnoNum];
                    if (!servicio_operador_id) continue;

                    // Solo registrar horarios si no están todos los campos vacíos en sábado y domingo
                    if ((dia === 'Sabado' || dia === 'Domingo')) {
                        const campos = [
                            horarioTurno['Hora inicio Turno 1'], horarioTurno['Hora inicio Turno'], horarioTurno['Hora inicio'], horarioTurno['Hora Inicio Turno'], horarioTurno['Hora inicio 2'], horarioTurno['Hora Inicio Turno 3'],
                            horarioTurno['Hora inicio en CC'], horarioTurno['Hora inicio CC'],
                            horarioTurno['Lugar Inicio 1'], horarioTurno['Lugar Inicio'], horarioTurno['Lugar Inicio 2'], horarioTurno['Lugar Inicio 3'],
                            horarioTurno['Hora termino Turno 1'], horarioTurno['Hora termino Turno'], horarioTurno['Hora termino Turno 2'], horarioTurno['Hora Termino Turno 3'],
                            horariosDia.Termino?.['Hora Termino en CC'],
                            horariosDia.Termino?.['Termino en Modulo'],
                            horariosDia.Termino?.['Lugar de termino CC']
                        ];
                        const todosVacios = campos.every(v => !v || (typeof v === 'string' && v.trim() === ''));
                        if (todosVacios) continue;
                    }

                    await horarios.create({
                        servicio_id: servicioId,
                        servicio_operador_id,
                        dias_servicios: dia,
                        turno: turnoNum,
                        hora_inicio: limpiarHora(horarioTurno['Hora inicio Turno 1'] || horarioTurno['Hora inicio Turno'] || horarioTurno['Hora inicio'] || horarioTurno['Hora Inicio Turno'] || horarioTurno['Hora inicio 2'] || horarioTurno['Hora Inicio Turno 3']),
                        hora_inicio_cc: limpiarHora(horarioTurno['Hora inicio en CC'] || horarioTurno['Hora inicio CC']),
                        lugar_inicio: limpiarTexto(horarioTurno['Lugar Inicio 1'] || horarioTurno['Lugar Inicio'] || horarioTurno['Lugar Inicio 2'] || horarioTurno['Lugar Inicio 3']),
                        hora_termino: limpiarHora(horarioTurno['Hora termino Turno 1'] || horarioTurno['Hora termino Turno'] || horarioTurno['Hora termino Turno 2'] || horarioTurno['Hora Termino Turno 3']),
                        hora_termino_cc: limpiarHora(horariosDia.Termino?.['Hora Termino en CC']),
                        termino_modulo: limpiarHora(horariosDia.Termino?.['Termino en Modulo']),
                        lugar_termino_cc: limpiarTexto(horariosDia.Termino?.['Lugar de termino CC'])
                    }, { transaction });
                }
            }
        }
        console.log('cubredescansos hoja:', hoja.cubredescansos);
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