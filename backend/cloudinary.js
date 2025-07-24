import {v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({ 
    cloud_name: 'dbqwdfo0a', 
    api_key: '578759478751391', 
    api_secret: 'wTfXBgLdxpG4HdisI8u9zVaqJkA'
})

const uploadOnCloudinary = async (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log("file is uploaded on cloudinary ", result.url);
                    resolve(result);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export {uploadOnCloudinary}
