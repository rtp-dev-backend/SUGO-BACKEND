# A1

Para que funcione correctamente la carga de calendarios de los operadores desde los Roles en XLSX se debe considerar: 

- Se respeten las interfaces al enviar por la peticion
- Enviar la info necesaria y con cierto esquema
  ``` TS
  data: DataRol[], 
  modulo: number
  ```
- Contenga datos minimos la data
  - Las jornadas deben tener minimo: 
    - Numero de turno 
    - Lugar de Inicio
    - Hr de Inicio y Termino
  - Cada credencial debe tener almenos 1 jornada (Sab, Dom o L-V)
- Para los cubre descansos:
  - Deben existir los servicios que cubren
  - Deben existir las jornadas en los servicios para los dias que vana  cubrir 
- Para la jornada excepcional la credencial indicada de estar presente como servicio "ordinario" o como cubre descanso

Esto para que cada operador que aparezce en el archivo tenga 1 y solo 1 jornada el dia que Labore o este en Descanso


## Validaciones

Usar Joi para comprobar que venga la data bien ( Siguiendo las interfaces )
<!-- 

1. Del Header venga periodo_id, ruta_id, periodo_date_ini y periodo_date_fin
2. De Notas venga "sacanDiasParesT1" 
3. Del Rol sea RolWithTurnos[ ] ( Para convertHrs y para obtener rolConJornadasIDsPromises )
4. Del Rol si existe lun_vie que sea Jornada[ ] ( Para FindOrCreate_jornadas )
5. Del Rol si existe sab que sea Jornada[ ] ( Para FindOrCreate_jornadas )
6. Del Rol si existe dom que sea Jornada[ ] ( Para FindOrCreate_jornadas )
7. joe sea JoE[ ]  ( Para convertHrs y joinCalendarsAndApplyJoE )
8. cd sea CD[ ] ( Para obtener cdMod; Enfasis en cd.descansos: Descansos,  ) -->


## Consideraciones 

Falta el uso de `diasFes` que viene en notas ya que es algo que un no se ha empleado, y no se ha codificado para su consideracion pero seria algo similar a JoE


---

1. asasa
2. bbfbfb
3. ccfcfc

- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] this is an incomplete item

==marked==
==HTML==

*[HTML]: Hyper Text Markup Language

!!! note ""
    :point_up: This is the admonition body. Know more about emojis [here](https://tutorialmarkdown.com/emojis)

[See more markdown](https://shd101wyy.github.io/markdown-preview-enhanced/#/markdown-basics?id=syntax-guide) 


