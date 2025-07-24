import User from '../db/user.model.js';
import { ocrController } from './ocr.controller.js';


export const identityForm = async (req, res) => {
    const { enNo, dob } = req.body;
    console.log(enNo, dob);
    if (!enNo || !dob) {
        return res.status(400).json({ message: 'EN No. and Date of Birth are required' });
    }
    try {
        const checkAlreadyApplied = await User.findOne({ en_no: enNo });
        if (checkAlreadyApplied) {
            return res.status(422).json({ message: 'Form Submission from this EN No. is already exists' });
        }
        await User.create({ en_no: enNo, dob , transaction_id: enNo });

        const user = await User.findOne({ en_no: enNo });
        if (!user) 
            return res.status(404).json({ message: 'Form Submission failed' });
        
        res.status(201).json({ message: 'Identity details saved!', status: 'success' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

export const paymentForm = async (req, res) => {
    const { enNo, transactionId } = req.body;
    const paymentScreenshot = req.file;
    console.log(enNo, transactionId);
    if (!enNo || !transactionId || !paymentScreenshot) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const user = await User.findOne({ en_no: enNo });
        if (!user) {
            return res.status(404).json({ message: 'Form Submission failed' });
        }

        const checkAlreadyPaid = await User.findOne({ transaction_id: transactionId });
        if (checkAlreadyPaid) {
            return res.status(422).json({ message: 'Transaction ID already exists' });
        }

        //send the image for ocr
        const { text, raw } = await ocrController(paymentScreenshot);

        if (!text) {
            return res.status(400).json({ message: 'Invalid payment screenshot' });
        }
        return res.status(200).json({ text, raw });

        //send ocr result to ingest

        
        //if ocr result is not valid, return error
        //if ocr result is valid,
        //send the screenshot to cloudinary
        //get the url from cloudinary
        //update the user with the url

        // await User.updateOne({ transaction_id: transactionId }, { $set: { payment_screenshot_url: paymentScreenshot } });
        // res.status(200).json({ message: 'Payment details saved!', status: 'success' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

