# SUGO - Esquema de Base de Datos y Auditoría

## Entidad-Relación (ER) Resumida

- **cargas_archivos_rol**
  - id (PK)
  - Relación: roles.archivo → cargas_archivos_rol.id

- **roles**
  - id (PK)
  - archivo (FK) → cargas_archivos_rol.id
  - periodo (FK) → periodos_rol.id
  - ruta_modalidad (FK) → ruta_modalidades.id
  - Relación: servicios.rol_id, cubredescansos.rol_id, jornadas_excepcionales.rol_id

- **servicios**
  - id (PK)
  - rol_id (FK) → roles.id
  - Relación: operadores_servicio.servicio_id, horarios.servicio_id

- **operadores_servicio**
  - id (PK)
  - servicio_id (FK) → servicios.id
  - Relación: horarios.servicio_operador_id

- **horarios**
  - id (PK)
  - servicio_id (FK) → servicios.id
  - servicio_operador_id (FK) → operadores_servicio.id

- **cubredescansos**
  - id (PK)
  - rol_id (FK) → roles.id
  - Relación: cubredescansos_turnos.cubredescanso_id

- **cubredescansos_turnos**
  - id (PK)
  - cubredescanso_id (FK) → cubredescansos.id

- **jornadas_excepcionales**
  - id (PK)
  - rol_id (FK) → roles.id

- **bitacora**
  - id (PK)
  - Registra cambios en todas las tablas anteriores (no tiene FK directa)

## Relaciones Principales

- Un archivo puede tener muchos roles.
- Un rol puede tener muchos servicios, cubredescansos y jornadas excepcionales.
- Un servicio puede tener muchos operadores y horarios.
- Un cubredescanso puede tener muchos turnos.

## Auditoría

- Cada tabla tiene un trigger que registra en la tabla `bitacora` cualquier inserción, actualización o borrado.
- La columna `usuario` se obtiene desde la aplicación usando `set_config('app.user', ...)` antes de modificar datos.
- La columna `updated_at` en bitacora indica cuándo ocurrió el cambio.
- Los campos `datos_old` y `datos_new` permiten comparar el estado anterior y el nuevo de cada registro.

## Borrado lógico

- Todas las tablas principales tienen la columna `estado` (boolean, default: true).
- Para "eliminar" un registro, se cambia `estado` a `false`.
- El historial de cambios se consulta en la tabla `bitacora`.

## Consultas útiles

- Registros insertados:
  ```sql
  SELECT * FROM bitacora WHERE accion = 'INSERT' AND tabla = 'roles';
  ```
- Registros modificados:
  ```sql
  SELECT * FROM bitacora WHERE accion = 'UPDATE' AND tabla = 'roles';
  ```
- Borrado lógico:
  ```sql
  SELECT * FROM bitacora WHERE accion = 'UPDATE' AND tabla = 'roles' AND datos_old->>'estado' = 'true' AND datos_new->>'estado' = 'false';
  ```

## Recomendaciones

- Mantén la columna `estado` para control de activos/inactivos.
- Usa la bitacora para auditoría y reconstrucción de historial.
- Asegúrate de que la app envíe el usuario con `set_config('app.user', ...)` antes de modificar datos.

---

## SQL TABLAS

Incluye aquí los scripts de creación de tablas y triggers. Si tienes dudas sobre la estructura, revisa los comentarios y asegúrate que cada tabla tenga la columna `estado` y los triggers de auditoría.

-- CARGAS_ARCHIVOS_ROL TABLE
CREATE TABLE public.cargas_archivos_rol (
	id bigserial NOT NULL,
	nombre_archivo text NULL,
	subido_por int4 NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	estado boolean NOT NULL DEFAULT true,
	CONSTRAINT cargas_archivos_rol_pkey PRIMARY KEY (id)
);

-- Table Triggers
create trigger trg_update_cargas_archivos_rol before
update
    on
    public.cargas_archivos_rol for each row execute function set_updated_at();

CREATE TRIGGER trg_audit_cargas_archivos_rol
AFTER INSERT OR UPDATE OR DELETE ON public.cargas_archivos_rol
FOR EACH ROW EXECUTE FUNCTION public.fn_bitacora();


-- ROLES TABLE
CREATE TABLE public.roles (
	id bigserial NOT NULL,
	archivo int8 NOT NULL,
	periodo int4 NOT NULL,
	ruta_modalidad int4 NOT NULL,
	modulo int4 NOT NULL,
	notas text NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	dias_impar text NULL,
	dias_par text NULL,
	estado boolean NOT NULL DEFAULT true,
	CONSTRAINT roles_pkey PRIMARY KEY (id),
	CONSTRAINT fk_roles_modulo FOREIGN KEY (modulo) REFERENCES public.modulos(id),
	CONSTRAINT fk_roles_periodo FOREIGN KEY (periodo) REFERENCES public.periodos_rol(id),
	CONSTRAINT fk_ruta_modalidad FOREIGN KEY (ruta_modalidad) REFERENCES public.ruta_modalidades(id),
	CONSTRAINT roles_archivo_id_fkey FOREIGN KEY (archivo) REFERENCES public.cargas_archivos_rol(id) ON DELETE SET NULL
);

-- Table Triggers
create trigger trg_update_roles before
update
    on
    public.roles for each row execute function set_updated_at();

CREATE TRIGGER trg_audit_roles
AFTER INSERT OR UPDATE OR DELETE ON public.roles
FOR EACH ROW EXECUTE FUNCTION public.fn_bitacora();


-- SERVICIOS TABLE
CREATE TABLE public.servicios (
	id bigserial NOT NULL,
	rol_id int8 NOT NULL,
	economico int4 NOT NULL,
	sistema text NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	estado boolean NOT NULL DEFAULT true,
	CONSTRAINT servicios_pkey PRIMARY KEY (id),
	CONSTRAINT servicios_rol_id_economico_key UNIQUE (rol_id, economico),
	CONSTRAINT servicios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id) ON DELETE CASCADE
);
CREATE INDEX idx_servicios_economico ON public.servicios USING btree (economico);
CREATE INDEX idx_servicios_rol_economico ON public.servicios USING btree (rol_id, economico);

-- Table Triggers
create trigger trg_update_servicios before
update
    on
    public.servicios for each row execute function set_updated_at();

CREATE TRIGGER trg_audit_servicios
AFTER INSERT OR UPDATE OR DELETE ON public.servicios
FOR EACH ROW EXECUTE FUNCTION public.fn_bitacora();


-- HORARIOS TABLE
CREATE TABLE public.horarios (
	id bigserial NOT NULL,
	servicio_id int8 NOT NULL,
	servicio_operador_id int4 NOT NULL,
	dias_servicios text NOT NULL,
	turno int2 NOT NULL,
	hora_inicio_turno time NULL,
	hora_inicio_cc time NULL,
	lugar_inicio text NULL,
	hora_termino_turno time NULL,
	hora_termino_cc time NULL,
	lugar_termino_cc text NULL,
	termino_modulo time NULL,
	termino_turno time NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	estado boolean NOT NULL DEFAULT true,
	CONSTRAINT horarios_pkey PRIMARY KEY (id),
	CONSTRAINT horarios_servicio_id_dias_servicios_turno_key UNIQUE (servicio_id, dias_servicios, turno),
	CONSTRAINT fk_horarios_servicio FOREIGN KEY (servicio_id) REFERENCES public.servicios(id),
	CONSTRAINT fk_horarios_servicio_operador FOREIGN KEY (servicio_operador_id) REFERENCES public.operadores_servicio(id),
	CONSTRAINT horarios_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicios(id) ON DELETE CASCADE
);

-- Table Triggers
create trigger trg_update_horarios before
update
    on
    public.horarios for each row execute function set_updated_at();

CREATE TRIGGER trg_audit_horarios
AFTER INSERT OR UPDATE OR DELETE ON public.horarios
FOR EACH ROW EXECUTE FUNCTION public.fn_bitacora();


-- OPERADORES_SERVICIO TABLE
CREATE TABLE public.operadores_servicio (
	id bigserial NOT NULL,
	servicio_id int8 NOT NULL,
	turno int2 NOT NULL,
	operador int4 NOT NULL,
	descansos _text NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	estado boolean NOT NULL DEFAULT true,
	CONSTRAINT operadores_servicio_pkey PRIMARY KEY (id),
	CONSTRAINT operadores_servicio_servicio_id_turno_key UNIQUE (servicio_id, turno),
	CONSTRAINT operadores_servicio_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicios(id) ON DELETE CASCADE
);

-- Table Triggers
create trigger trg_update_operadores_servicio before
update
    on
    public.operadores_servicio for each row execute function set_updated_at();

CREATE TRIGGER trg_audit_operadores_servicio
AFTER INSERT OR UPDATE OR DELETE ON public.operadores_servicio
FOR EACH ROW EXECUTE FUNCTION public.fn_bitacora();


-- CUBREDESCANSOS TABLE
CREATE TABLE public.cubredescansos (
	id bigserial NOT NULL,
	rol_id int8 NOT NULL,
	economico int4 NULL,
	sistema text NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	estado boolean NOT NULL DEFAULT true,
	CONSTRAINT cubredescansos_pkey PRIMARY KEY (id),
	CONSTRAINT cubredescansos_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id) ON DELETE CASCADE
);
CREATE INDEX idx_cubredescansos_rol ON public.cubredescansos USING btree (rol_id);

-- Table Triggers
create trigger trg_update_cubredescansos before
update
    on
    public.cubredescansos for each row execute function set_updated_at();

CREATE TRIGGER trg_audit_cubredescansos
AFTER INSERT OR UPDATE OR DELETE ON public.cubredescansos
FOR EACH ROW EXECUTE FUNCTION public.fn_bitacora();


-- CUBREDESCANSOS_TURNOS TABLE
CREATE TABLE public.cubredescansos_turnos (
	id bigserial NOT NULL,
	cubredescanso_id int8 NOT NULL,
	turno int2 NOT NULL,
	operador int4 NULL,
	servicios_a_cubrir json NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	estado boolean NOT NULL DEFAULT true,
	CONSTRAINT cubredescansos_turnos_cubredescanso_id_turno_key UNIQUE (cubredescanso_id, turno),
	CONSTRAINT cubredescansos_turnos_pkey PRIMARY KEY (id),
	CONSTRAINT cubredescansos_turnos_cubredescanso_id_fkey FOREIGN KEY (cubredescanso_id) REFERENCES public.cubredescansos(id) ON DELETE CASCADE
);
CREATE INDEX idx_cubredescansos_turnos_operador ON public.cubredescansos_turnos USING btree (operador);

-- Table Triggers
create trigger trg_update_cubredescansos_turnos before
update
    on
    public.cubredescansos_turnos for each row execute function set_updated_at();

CREATE TRIGGER trg_audit_cubredescansos_turnos
AFTER INSERT OR UPDATE OR DELETE ON public.cubredescansos_turnos
FOR EACH ROW EXECUTE FUNCTION public.fn_bitacora();


-- JORNADAS_EXCEPCIONALES TABLE
CREATE TABLE public.jornadas_excepcionales (
	id bigserial NOT NULL,
	rol_id int8 NOT NULL,
	operador int4 NOT NULL,
	lugar text NULL,
	hora_inicio time NULL,
	hora_termino time NULL,
	dias_servicio json NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	estado boolean NOT NULL DEFAULT true,
	CONSTRAINT jornadas_excepcionales_pkey PRIMARY KEY (id),
	CONSTRAINT jornadas_excepcionales_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id) ON DELETE CASCADE
);
CREATE INDEX idx_jornadas_excepcionales_operador ON public.jornadas_excepcionales USING btree (operador);

-- Table Triggers
create trigger trg_update_jornadas_excepcionales before
update
    on
    public.jornadas_excepcionales for each row execute function set_updated_at();

CREATE TRIGGER trg_audit_jornadas_excepcionales
AFTER INSERT OR UPDATE OR DELETE ON public.jornadas_excepcionales
FOR EACH ROW EXECUTE FUNCTION public.fn_bitacora();


/* 1) Tabla central de auditoría */
CREATE TABLE IF NOT EXISTS public.bitacora (
	id bigserial PRIMARY KEY,
	tabla text NOT NULL,
	accion text NOT NULL,            -- 'INSERT', 'UPDATE', 'DELETE'
	usuario text NULL,               -- enviado por la app via set_config('app.user', ...)
	updated_at timestamptz NOT NULL DEFAULT now(),
	datos_old jsonb NULL,
	datos_new jsonb NULL,
	metadata jsonb NULL
);
CREATE INDEX IF NOT EXISTS idx_bitacora_tabla_fecha ON public.bitacora (tabla, updated_at);

/* 2) Función trigger genérica que inserta en bitacora */
CREATE OR REPLACE FUNCTION public.fn_bitacora() RETURNS trigger AS $$
DECLARE
  actor text;
  old_j jsonb;
  new_j jsonb;
BEGIN
  actor := current_setting('app.user', true);
  IF actor IS NULL OR actor = '' THEN
    actor := current_user;
  END IF;

  IF TG_OP = 'INSERT' THEN
    old_j := NULL;
    new_j := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    old_j := to_jsonb(OLD);
    new_j := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN
    old_j := to_jsonb(OLD);
    new_j := NULL;
  END IF;

  INSERT INTO public.bitacora (tabla, accion, usuario, updated_at, datos_old, datos_new, metadata)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    actor,
    now(),
    old_j,
    new_j,
    jsonb_build_object('txid', txid_current())
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

