import Router from 'express'
import { deleteArchivo, getArchivofiles, getArchivosfileOne, getDescargaArchivofile, postSaveArchivoFile } from '../controllers/rol_archivos.controllers';
import { ValidarReqFiles, ValidarbodyFile, validararchivo } from '../middlewares/Archivo/Rol_archivo.middleware';
const router = Router();

router.get('/api/rol/saved_file/descargar/:id',     validararchivo,     getDescargaArchivofile)
router.get('/api/rol/saved_file/:id',               validararchivo,     getArchivosfileOne)
router.get('/api/rol/saved_file',                   getArchivofiles)
router.post('/api/rol/saved_file',                  ValidarbodyFile, postSaveArchivoFile);
router.delete('/api/rol/delete_file/:id',           validararchivo,      deleteArchivo)


export default router;
