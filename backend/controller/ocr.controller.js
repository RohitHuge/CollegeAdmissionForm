import { ImageAnnotatorClient } from '@google-cloud/vision';

// export const ocrTestController = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No image file provided.' });
//   }

//   try {
//     const client = new ImageAnnotatorClient();
//     const imageBuffer = req.file.buffer;
//     const [result] = await client.textDetection(imageBuffer);
//     const extractedText = result.fullTextAnnotation?.text || '';
//     // Return both the raw result and the extracted text for testing
//     res.status(200).json({
//       text: extractedText,
//       raw: result
//     });
//   } catch (error) {
//     console.error('Error processing image:', error);
//     res.status(500).json({ error: 'Failed to process image.' });
//   }
// }; 

export const ocrController = async (file) => {
  
  if (!file) {
    return { error: 'No image file provided.' };
  }


  try {
    const client = new ImageAnnotatorClient();
    const imageBuffer = file.buffer;
    const [result] = await client.textDetection(imageBuffer);
    const extractedText = result.fullTextAnnotation?.text || '';
    // Return both the raw result and the extracted text for testing
    return {
      text: extractedText,
      // raw: result
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return { error: 'Failed to process image.' };
  }
}; 