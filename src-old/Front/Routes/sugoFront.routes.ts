import path from 'path';
import { Router } from "express";

const router = Router();

router.get('/:rol',       (req, res) => { 
    res.sendFile(path.join(__dirname, '../../web', 'index.html'));
 });

router.get('/rol/*',       (req, res) => { 
    res.sendFile(path.join(__dirname, '../../web', 'index.html'));
 });



export default router