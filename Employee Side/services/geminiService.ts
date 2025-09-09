
import { GoogleGenAI, Type, Chat, Part } from "@google/genai";
import { Report, AIAssessment, ChatMessage } from '../types';

// IMPORTANT: This key is managed by the execution environment.
// Do not hardcode or manage API keys in the code.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This check is for development; in a real deployment, the key must be present.
  console.warn("OpenAI API key not found in environment variables. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// A tiny, 1x1 black pixel PNG as a placeholder for actual image data.
// This avoids CORS issues with fetching external images in a client-side demo.
const FAKE_IMAGE_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export const generateRepairBrief = async (report: Report): Promise<AIAssessment> => {
  if (!API_KEY) {
    throw new Error("AI service is unavailable. API key is not configured.");
  }

  const { dangerScore, dangerLevel, roadType, description, upvotes } = report;

  const textPart = {
    text: `
Analyze the provided image and the following data to generate a repair and safety brief for a pothole report.

Report Data:
- Danger Score: ${dangerScore.toFixed(1)}/100
- Danger Level: ${dangerLevel}
- Road Type: ${roadType}
- User Description: "${description}"
- Community Upvotes: ${upvotes}

Based on all available data (image and text), provide a structured JSON response.
`,
  };

  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: FAKE_IMAGE_BASE64, // In a real app, you would convert the report.photoUrl to base64
    },
  };

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [textPart, imagePart] },
        config: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    visualAnalysis: {
                        type: Type.STRING,
                        description: 'A brief analysis of the pothole image, noting its apparent size, shape, and any visible hazards like water or debris.'
                    },
                    priorityAssessment: {
                        type: Type.STRING,
                        description: 'A one-sentence summary of urgency, combining visual information with the report data.'
                    },
                    suggestedAction: {
                        type: Type.STRING,
                        description: 'A brief, actionable repair recommendation (e.g., "Standard cold patch," "Requires full-depth repair").'
                    },
                    safetyProtocol: {
                        type: Type.STRING,
                        description: 'Key safety measures for the crew, considering the road type and visual context.'
                    }
                },
                required: ['visualAnalysis', 'priorityAssessment', 'suggestedAction', 'safetyProtocol']
            },
        }
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the AI model.");
    }

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Open AI API:", error);
    let errorMessage = "Error: Could not generate AI brief. The model may be unavailable or the request timed out.";
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            errorMessage = "Error: The provided API key is not valid. Please check your configuration.";
        } else if (error.message.includes('json')) {
             errorMessage = "Error: Failed to parse AI response. The model returned an invalid format.";
        }
    }
    throw new Error(errorMessage);
  }
};


export class AIChatService {
    private chat: Chat | null = null;
    
    constructor(reports: Report[], history: ChatMessage[] = []) {
        if (!API_KEY) {
            console.warn("AI Chat disabled: API Key not configured.");
            return;
        }

        // Reduce the data sent to the model to only the most relevant fields to conserve tokens.
        const reportsContext = JSON.stringify(reports.map(r => ({
            id: r.id.substring(0,8), // Use shortened ID
            status: r.status,
            dangerLevel: r.dangerLevel,
            worker: r.worker || 'Unassigned',
            address: r.location.address,
            roadType: r.roadType
        })), null, 2);

        const systemInstruction = `You are a helpful assistant for the "FixFirst" pothole management dashboard. 
Your role is to answer questions about the pothole reports data. 
You have been provided with the current list of reports in JSON format below. 
Use this data to answer user queries. Be concise and helpful. If a user asks a general question, you can gently guide them to ask about the reports.
When referencing a report, use its shortened 8-character ID.
Do not invent or hallucinate information not present in the provided data.
\n--- CURRENT REPORTS DATA ---\n${reportsContext}`;

        this.chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
            history: history,
        });
    }

    async sendMessageStream(message: string) {
        if (!this.chat) {
            throw new Error("Chat is not initialized. Is the API key configured?");
        }
        
        try {
            return await this.chat.sendMessageStream({ message });
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            throw new Error("Failed to communicate with the AI assistant.");
        }
    }
}
