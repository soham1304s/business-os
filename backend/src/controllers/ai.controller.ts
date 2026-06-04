import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

export const handleChat = async (req: AuthRequest, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      // Simulate an AI response if key is missing (for local testing without breaking the frontend)
      setTimeout(() => {
        res.json({
          message: "I am the BusinessOS AI Assistant. Your OpenAI API key is missing from the .env file, so I'm running in offline simulated mode. How can I help you manage your business today?",
        });
      }, 1000);
      return;
    }

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are the BusinessOS AI Assistant. You help users manage their HR, CRM, Marketing, Finance, and AI Automation through the platform. Be concise, professional, and helpful.' },
        ...messages
      ],
    });

    res.json({
      message: completion.choices[0]?.message?.content || '',
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to communicate with AI Assistant' });
  }
};

export const draftAssistant = async (req: AuthRequest, res: Response) => {
  try {
    const { messages, projectContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      setTimeout(() => {
        res.json({
          message: "Let's update the budget to $5,000 as you suggested.",
          updates: { budget: 5000, notes: 'Updated notes from mock AI.' }
        });
      }, 1000);
      return;
    }

    const systemPrompt = `You are an AI Project Copilot. Your job is to help a client refine a service request/project draft.
Current Draft Details:
Budget: $${projectContext?.budget || 0}
Timeline: ${projectContext?.timeline || 'Unknown'}
Notes/Description: ${projectContext?.notes || 'None'}
Service Type: ${projectContext?.serviceType || 'Unknown'}

Discuss the project with the user. Ask clarifying questions if necessary (like budget, timeline).
You MUST respond with a JSON object exactly matching this schema:
{
  "message": "Your text response to the user",
  "updates": {
    "budget": <number or null>,
    "timeline": "<string or null>",
    "notes": "<string or null>"
  }
}
Only output the JSON object, nothing else.`;

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
    });

    const aiResponse = JSON.parse(completion.choices[0]?.message?.content || '{}');

    res.json({
      message: aiResponse.message || 'I have updated the project.',
      updates: aiResponse.updates || {}
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to communicate with AI Assistant' });
  }
};
