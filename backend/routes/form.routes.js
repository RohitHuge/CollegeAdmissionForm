import express from 'express';
import { identityForm, paymentForm, personalForm, educationForm } from '../controller/form.controller.js';
import multer from 'multer';

const router = express.Router();

const upload = multer();

router.post('/identityform', identityForm);
router.post('/paymentform', upload.single('paymentScreenshot'), paymentForm);
router.post('/personalform', personalForm);
router.post('/educationform', educationForm);

export default router;