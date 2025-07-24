import User from '../db/user.model.js';


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
    const { enNo, dob, transactionId, paymentScreenshotUrl } = req.body;
    console.log(enNo, dob, transactionId, paymentScreenshotUrl);
    if (!enNo || !dob || !transactionId || !paymentScreenshotUrl) {
        return res.status(400).json({ message: 'All fields are required' });
    }
}

