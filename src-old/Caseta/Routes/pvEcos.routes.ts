import Router from 'express'
import { getPvEcos, updateEco } from '../Controllers/pvEcos.controllers';

const router = Router();


router.get('/pv-ecos/hi',   (req, res)=> { res.send({ msg: 'updated 5/4/23 11:12' }) });

router.get('/pv-ecos',      getPvEcos)
router.patch('/pv-ecos',    updateEco)


export default router;