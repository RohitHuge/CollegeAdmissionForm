import User from '../db/user.model.js';
import { ocrController } from './ocr.controller.js';
import { extractPaymentInfo } from './geminiApi.js';
import { uploadOnCloudinary } from '../cloudinary.js';

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
        const { text } = await ocrController(paymentScreenshot);
        
        // const text = `11:54 AM | 10.0KB/s
        //     Transaction Successful
        //     12:26 pm on 07 Oct 2020
        //     Transaction ID
        //     P2010071226434492347527
        //     Paid to
        //     4G
        //     55
        //     COPY
        //     SC
        //     State Bank Collect
        //     1,050
        //     Debited from
        //     ******6976
        //     UTR:028155489086
        //     Money sitting idle in your bank account?       
        //     SHARE
        //     ₹1,050
        //     Move it to Liquid Funds and give it a chance to
        //     grow
        //     >
        //     (?)
        //     Contact PhonePe Support
        //     Powered by
        //     BHIM UPI YES BANK ICICI Bank `;

        if (!text) {
            return res.status(400).json({ message: 'Error in Verifying Payment. Please try again.' });
        }
        //send ocr result to ingest
        const paymentInfo = await extractPaymentInfo(text, 'State Bank Collect');
        if (!paymentInfo) {
            return res.status(400).json({ message: 'Error in Verifying Payment. Please try again.' });
        }
        const paymentInfoJson = JSON.parse(paymentInfo.candidates[0].content.parts[0].text);
        console.log(paymentInfoJson);
        //if ocr result is not valid, return error
        if (!paymentInfoJson) {
            return res.status(400).json({ message: 'Error in Verifying Payment. Please try again.' });
        }
       
        if(!paymentInfoJson.received_by_verified) {
            return res.status(400).json({ message: 'Payment not verified. Please try again.Please double check the payment screenshot.' });
            console.log("Error :: received_by_verified");
        }

        if(paymentInfoJson.payment_status !== 'Successful') {
            console.log("Error :: payment_status");
            return res.status(400).json({ message: 'Payment not verified. Please try again.Please double check the payment screenshot.' });
        }

        if(paymentInfoJson.amount < 1000) {
            console.log("Error :: amount");
            return res.status(400).json({ message: 'Payment amount is not correct. Please try again.Please double check the payment screenshot.' });
        }

        if(paymentInfoJson.transaction_id !== transactionId) {
            console.log("Error :: transaction_id");
            return res.status(400).json({ message: 'Transaction ID is not correct. Please try again.Please double check the payment screenshot.' });
        }
        const paymentScreenshotUrl = await uploadOnCloudinary(paymentScreenshot.buffer);
        if(!paymentScreenshotUrl) {
            console.log("Error :: uploadOnCloudinary");
            return res.status(400).json({ message: 'Error in uploading payment screenshot. Please try again.' });
        }
        user.payment_screenshot_url = paymentScreenshotUrl.url;
        user.transaction_id = transactionId;
        await user.save();

        res.status(200).json({ message: 'Payment details saved!', status: 'success' });
        



        
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

export const personalForm = async (req, res) => {
    const {fields, enNo} = req.body;
    const {address , candidateType, category, firstName, gender, lastName, middleName, motherName, religion, studentMobile , parentMobile} = fields;
    try {
        const user = await User.findOne({ en_no: enNo });
        if (!user) {
            return res.status(404).json({ message: 'Form Submission failed' });
        }
        console.log(address, candidateType, category, firstName, gender, lastName, middleName, motherName, religion, studentMobile, parentMobile);
        user.personal_details.address = address;
        user.personal_details.candidate_type = candidateType;
        user.personal_details.category = category;
        user.personal_details.first_name = firstName;
        user.personal_details.gender = gender;
        user.personal_details.last_name = lastName;
        user.personal_details.middle_name = middleName;
        user.personal_details.mother_name = motherName;
        user.personal_details.religion = religion;
        user.personal_details.student_mobile = studentMobile;
        user.personal_details.parent_mobile = parentMobile;
        await user.save();
        res.status(201).json({ message: 'Personal details saved!', status: 'success' });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
}

}