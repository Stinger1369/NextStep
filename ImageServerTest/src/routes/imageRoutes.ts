import { Router } from 'express';
import { addImage } from '../controllers/ImageController';

const router = Router();

router.post('/user/:id/image', addImage);

export default router;
