import React, { useState } from 'react';

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [rawOcrData, setRawOcrData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setExtractedText('');
    setRawOcrData(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/api/ocr-test', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to extract text.');
      }
      const data = await response.json();
      setExtractedText(data.text);
      setRawOcrData(data.raw);
    } catch (err) {
      setError('Failed to extract text. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Screenshot OCR Uploader</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={isLoading || !selectedFile}>
          {isLoading ? 'Processing...' : 'Extract Text'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {extractedText && (
        <div>
          <h3>Extracted Text:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '10px' }}>
            {extractedText}
          </pre>
        </div>
      )}

      {rawOcrData && (
        <div>
          <h3>Sample Raw OCR Data:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', border: '1px solid #eee', padding: '10px', maxHeight: 300, overflow: 'auto', background: '#fafafa' }}>
            {JSON.stringify(rawOcrData, null, 2).slice(0, 2000)}{rawOcrData && JSON.stringify(rawOcrData).length > 2000 ? '... (truncated)' : ''}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;