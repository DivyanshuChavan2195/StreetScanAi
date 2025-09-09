
import { GoogleGenAI, Type } from "@google/genai";
import { Pothole, AnalyzedPotholeData } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const analyzePotholeImage = async (imageFile: File): Promise<AnalyzedPotholeData> => {
    const base64ImageData = await fileToBase64(imageFile);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: "Analyze the image of this road condition. Is it a pothole? Respond ONLY with a JSON object. Classify its severity as 'Low', 'Medium', or 'High'. Note if it contains significant water. Provide a brief one-sentence description." },
                { inlineData: { mimeType: imageFile.type, data: base64ImageData } }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    is_pothole: { type: Type.BOOLEAN, description: "Whether the image contains a pothole." },
                    severity: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "The severity of the pothole." },
                    contains_water: { type: Type.BOOLEAN, description: "Whether the pothole contains a significant amount of water." },
                    description: { type: Type.STRING, description: "A brief, one-sentence description of the road condition." }
                },
                required: ["is_pothole", "severity", "contains_water", "description"]
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed as AnalyzedPotholeData;
    } catch (e) {
        console.error("Failed to parse Gemini JSON response:", e);
        console.error("Raw response text:", response.text);
        throw new Error("AI analysis returned an invalid format.");
    }
};

export const generateRepairPlan = async (pothole: Pothole): Promise<string> => {
    const prompt = `You are a civil engineer for the Pimpri-Chinchwad Municipal Corporation. Provide a brief, actionable repair plan for a pothole with these details:
- Severity: ${pothole.severity}
- Description: ${pothole.description}
- Contains Water: ${pothole.contains_water ? 'Yes' : 'No'}

Your plan should be concise and easy to understand for a work crew. Include:
1.  A priority level (1-5, where 5 is highest emergency).
2.  Suggested materials (e.g., cold mix asphalt, hot mix).
3.  Basic steps for repair.

Format the response as simple HTML paragraphs. For example:
<p><strong>Priority:</strong> 4/5</p><p><strong>Materials:</strong> ...</p><p><strong>Action Plan:</strong> ...</p>`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
};
