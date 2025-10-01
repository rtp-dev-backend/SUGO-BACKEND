import Router from 'express'
import {
    postrutaxmod,
    deleterutaxmod,
    getrutasxmods,
    getrutaxmod,
    putrutaxmod
} from '../../General/controllers/Catalogo_RutasxMod.controller';

const router = Router();

router.get('/api/rutaxmod',         getrutasxmods )
router.get('/api/rutaxmod/:id',     getrutaxmod   )
router.post('/api/rutaxmod',        postrutaxmod )
router.put('/api/rutaxmod/:id',         putrutaxmod  )
router.delete('/api/rutaxmod/:id',  deleterutaxmod)



export default router;