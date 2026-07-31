const Groq = require('groq-sdk')
const { exec } = require('child_process')
const { systemPrompt } = require('../Prompts/systemPrompt')


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})


const generateresponse = async (req, res) => {

    try {

        const { prompt } = req.body

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' })
        }

        // Asking groq
       const response = await groq.chat.completions.create({
     model: 'llama-3.3-70b-versatile',
    messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
})
const data = JSON.parse(response.choices[0].message.content)

        if (data.action === "run_command") {
            console.log(`AI proposed command: ${data.command} (Awaiting user approval)`)

            // SECURITY LAYER: Do NOT execute it yet. Send it back to the frontend for approval.
            return res.status(200).json({
                message: "Command proposed. Waiting for user approval.",
                requires_approval: true,
                action: data.action,
                proposed_command: data.command,
                ai_thought: data.thought
            })
        } else if (data.action === "search_files") {
            console.log(`AI proposed file search: ${data.search_query} in ${data.search_drive} (Awaiting user approval)`)

            return res.status(200).json({
                message: "File search proposed. Waiting for user approval.",
                requires_approval: true,
                action: data.action,
                search_query: data.search_query,
                search_drive: data.search_drive,
                ai_thought: data.thought
            })
        } else {
            return res.status(200).json({
                message: "success",
                requires_approval: false,
                action: data.action,
                aidecision: data
            })
        }

    } catch (error) {
        console.error("🔥 Backend Crash Error:", error);
        return res.status(500).json({
            message: 'Error in generating response',
            details: error.message
        });
    }
}

const BLOCKED_COMMANDS = ['del ', 'rmdir ', 'rd ', 'format ', 'shutdown', 'taskkill', 'reg delete', 'diskpart', 'cipher /w'];

const executeCommand = (req, res) => {
    // This endpoint should ONLY be called when the user clicks "Approve" on the frontend
    const { command } = req.body;

    if (!command) {
        return res.status(400).json({ message: "No command provided to execute." });
    }

    // Security: Block destructive commands
    const lowerCmd = command.toLowerCase().trim();
    const isBlocked = BLOCKED_COMMANDS.some(blocked => lowerCmd.startsWith(blocked));
    if (isBlocked) {
        console.warn(`⚠️ BLOCKED dangerous command: ${command}`);
        return res.status(403).json({ message: "This command has been blocked for safety." });
    }

    console.log(`User approved execution of: ${command}`);

    exec(command, { timeout: 15000 }, (error, stdout, stderr) => {
        if (error) {
            console.error("🔥 Execution Error:", error);
            return res.status(500).json({
                message: "Command failed to execute",
                error: stderr || error.message
            });
        }

        return res.status(200).json({
            message: "Command executed successfully",
            output: stdout
        });
    });
};

const textToSpeech = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "No text provided for speech." });
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "playai-tts",
                input: text,
                voice: "Arista-PlayAI",
                response_format: "wav",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Groq TTS Error:", errorText);
            return res.status(500).json({ message: "TTS failed", error: errorText });
        }

        const audioBuffer = await response.arrayBuffer();

        res.set({
            "Content-Type": "audio/wav",
            "Content-Length": audioBuffer.byteLength,
        });

        res.send(Buffer.from(audioBuffer));
    } catch (error) {
        console.error("TTS Error:", error);
        res.status(500).json({ message: "Text to speech failed" });
    }
};

module.exports = { generateresponse, executeCommand, textToSpeech }
