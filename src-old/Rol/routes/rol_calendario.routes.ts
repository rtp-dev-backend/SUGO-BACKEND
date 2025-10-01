import {Router} from 'express'
import { getCalendario, getCalendario_ecosYcreds, getCalendarios, getCalendariosByCred, postCalendario, postCalendarioByExcel } from '../../Rol/controllers/rol_calendarios.controller';
import { validateDataRol, validateHeaders } from '../middlewares/calendario/Rol_calendario.middleware';
import validatorHandler from '../../middleware/validatorHandleJoi.middleware';
import { schema_API_getCalendariosByCred, schema_API_getEcosYcreds } from '../middlewares/calendario/Rol_calendario.schema.joi';



const routes = Router();

routes.post('/api/rol/try',             validateDataRol, validateHeaders, (req, res) => { const { data, modulo } = req.body; res.json({msg: 'All correct!', modulo, data}) } )
routes.get('/api/rol/calendarios',      getCalendarios)
routes.get('/api/rol/calendarios/:id',  getCalendario)
routes.post('/api/rol/calendarios',     postCalendario)

routes.post('/api/rol/calendarios_excel',     
    validateDataRol, 
    validateHeaders, 
    postCalendarioByExcel
)


//consulta api calendario
routes.get('/api/rol/cal/ecos',             validatorHandler(schema_API_getEcosYcreds, 'query'), getCalendario_ecosYcreds)
routes.get('/api/rol/cal/cred/:op_cred',    validatorHandler(schema_API_getCalendariosByCred, 'query'), getCalendariosByCred)




export default routes;