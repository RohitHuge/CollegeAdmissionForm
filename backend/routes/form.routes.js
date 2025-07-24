import express from 'express';
import { identityForm } from '../controller/form.controller.js';

const router = express.Router();

router.post('/identityform', identityForm);

export default router;