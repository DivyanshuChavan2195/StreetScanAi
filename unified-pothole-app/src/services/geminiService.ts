import { GoogleGenAI, Type } from "@google/genai";
import { Report, AnalyzedPotholeData, DangerLevel } from '../types';

// Check for API key in environment variables  
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY environment variable not set. Gemini API calls will use mock responses.");
}

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

// Mock analysis response for when API key is not available
const getMockAnalysis = (_imageFile: File): AnalyzedPotholeData => {
    // Simple mock based on file name or random selection
    const severities: DangerLevel[] = [DangerLevel.Low, DangerLevel.Medium, DangerLevel.High];
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    const hasWater = Math.random() > 0.7; // 30% chance of water
    
    return {
        is_pothole: true,
        severity: randomSeverity,
        contains_water: hasWater,
        description: `Detected pothole with ${randomSeverity.toLowerCase()} severity${hasWater ? ', containing standing water' : ''}.`
    };
};

export const analyzePotholeImage = async (imageFile: File): Promise<AnalyzedPotholeData> => {
    // Return mock data if no API key is available
    if (!ai || !API_KEY) {
        console.warn("Using mock AI analysis - no API key configured");
        // Add a small delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        return getMockAnalysis(imageFile);
    }

    try {
        const base64ImageData = await fileToBase64(imageFile);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: "Analyze the image of this road condition. Is it a pothole? Respond ONLY with a JSON object. Classify its severity as 'Low', 'Medium', 'High', or 'Critical'. Note if it contains significant water. Provide a brief one-sentence description." },
                    { inlineData: { mimeType: imageFile.type, data: base64ImageData } }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        is_pothole: { type: Type.BOOLEAN, description: "Whether the image contains a pothole." },
                        severity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"], description: "The severity of the pothole." },
                        contains_water: { type: Type.BOOLEAN, description: "Whether the pothole contains a significant amount of water." },
                        description: { type: Type.STRING, description: "A brief, one-sentence description of the road condition." }
                    },
                    required: ["is_pothole", "severity", "contains_water", "description"]
                }
            }
        });

        const jsonText = response.text?.trim() || '';
        const parsed = JSON.parse(jsonText);
        
        // Ensure severity matches our enum
        if (!Object.values(DangerLevel).includes(parsed.severity)) {
            parsed.severity = DangerLevel.Medium; // Default fallback
        }
        
        return parsed as AnalyzedPotholeData;
    } catch (e) {
        console.error("Failed to analyze image with Gemini API:", e);
        console.warn("Falling back to mock analysis");
        return getMockAnalysis(imageFile);
    }
};

export const generateRepairPlan = async (report: Report): Promise<string> => {
    // Return mock data if no API key is available
    if (!ai || !API_KEY) {
        console.warn("Using mock repair plan - no API key configured");
        return `
            <p><strong>Priority:</strong> ${report.dangerLevel === DangerLevel.Critical ? '5/5' : report.dangerLevel === DangerLevel.High ? '4/5' : '3/5'}</p>
            <p><strong>Materials:</strong> Cold mix asphalt, road marking paint, traffic cones</p>
            <p><strong>Action Plan:</strong> Clean debris, apply cold mix asphalt, compact surface, restore road markings. Estimated time: 2-4 hours.</p>
            <p><strong>Safety Notes:</strong> Use proper traffic control measures during repair.</p>
        `;
    }

    try {
        const prompt = `You are a civil engineer for the municipal corporation. Provide a brief, actionable repair plan for a pothole with these details:
- Severity: ${report.dangerLevel}
- Description: ${report.description}
- Contains Water: ${report.contains_water ? 'Yes' : 'No'}
- Location: ${report.location.address}

Your plan should be concise and easy to understand for a work crew. Include:
1. A priority level (1-5, where 5 is highest emergency).
2. Suggested materials (e.g., cold mix asphalt, hot mix).
3. Basic steps for repair.
4. Safety considerations.

Format the response as simple HTML paragraphs. For example:
<p><strong>Priority:</strong> 4/5</p><p><strong>Materials:</strong> ...</p><p><strong>Action Plan:</strong> ...</p>`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        return response.text || '';
    } catch (error) {
        console.error("Failed to generate repair plan with Gemini API:", error);
        // Fallback to mock plan
        return `
            <p><strong>Priority:</strong> ${report.dangerLevel === DangerLevel.Critical ? '5/5' : report.dangerLevel === DangerLevel.High ? '4/5' : '3/5'}</p>
            <p><strong>Materials:</strong> Cold mix asphalt, road marking paint, traffic cones</p>
            <p><strong>Action Plan:</strong> Clean debris, apply cold mix asphalt, compact surface, restore road markings. Estimated time: 2-4 hours.</p>
            <p><strong>Safety Notes:</strong> Use proper traffic control measures during repair.</p>
        `;
    }
};
