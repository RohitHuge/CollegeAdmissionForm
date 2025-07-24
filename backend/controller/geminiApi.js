import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({key: process.env.GEMINI_API_KEY});

export async function extractPaymentInfo(text, ReceiversBankingName) {
  console.log("Model is running");
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a payment screenshot parser for UPI-based payments. Your task is to extract **relevant payment information** from raw OCR text extracted from a screenshot.

--- REQUIRED OUTPUT FIELDS ---
You must return only a valid JSON object in this format:

{
  "transaction_id": "<UPI transaction ID or reference number>",
  "amount": "<Numeric amount (₹)>",
  "payment_status": "<Status like 'Success', 'Completed', etc.>",
  "payer_name": "<Name of the person who paid>",
  "date_time": "<Date and time of the transaction>",
  "payment_method": "<One of: PhonePe, Paytm, Google Pay, BHIM, Amazon Pay, Mobikwik, Other>",
  "received_by_verified": <true or false> // Based on whether expected receiver name or UPI ID was found
}

--- LOGIC FLOW ---
1. **Match Receiver Info (important)**  
   A variable called ReceiversBankingName will be provided to you.  
   You must search the text to check whether this receiver name or UPI ID appears in the OCR text.  
   If found → received_by_verified: true, else false.

2. **Detect payment method**  
   Look for names like "PhonePe", "Paytm", "Google Pay", "BHIM", "Amazon Pay", etc.  
   Match based on text snippets, watermarks, or app references.

3. **Extract fields accurately**  
   - Transaction ID (e.g., UPI12345678, Reference No: 12345)
   - Amount in ₹ format
   - Status like "Payment Successful", "Transaction Completed"
   - Payer name (from “Paid by” or similar line)
   - Date & time (if available)

--- INPUT TEXT ---
Receiver to match:
**${ReceiversBankingName}**

OCR Text:
"""
${text}
"""

ONLY return the pure JSON object, nothing else — no explanation, no headings, no formatting. If a field is missing or unclear, write "unknown" or false as appropriate.
`,  // your structured prompt
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          transaction_id: { type: Type.STRING },
          amount: { type: Type.STRING },
          payment_status: { type: Type.STRING },
          payer_name: { type: Type.STRING },
          date_time: { type: Type.STRING },
          payment_method: { type: Type.STRING },
          received_by_verified: { type: Type.BOOLEAN },
        },
        propertyOrdering: [
          "transaction_id",
          "amount",
          "payment_status",
          "payer_name",
          "date_time",
          "payment_method",
          "received_by_verified"
        ]
      }
    },
  });
  // console.log(response.json());
  return response
}
