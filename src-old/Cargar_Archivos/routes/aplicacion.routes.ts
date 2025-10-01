import Router from 'express'
import {  deleteSave, getDescargaArchivo, getSavedFile, getSavedFiles, postSave } from '../../Cargar_Archivos/controllers/save.control';
const router = Router();

router.get('/api/saved_file/descargar/:id', getDescargaArchivo)
router.get('/api/saved_file/:id', getSavedFile)
router.get('/api/saved_file', getSavedFiles)
router.post('/api/saved_file', postSave);
router.delete('/api/delete_file/:id', deleteSave)


export default router;
