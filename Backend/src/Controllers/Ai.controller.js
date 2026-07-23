const { Ollama } = require('ollama')
const { exec } = require('child_process')
const { systemPrompt } = require('../Prompts/systemPrompt')

const ollama = new Ollama({
    host: process.env.ollama_Host
})

const generateresponse = async (req, res) => {

    try {

        const { prompt } = req.body

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' })
        }

        // Asking ollama
        const response = await ollama.generate({
            model: 'llama3.2',
            prompt: prompt,
            system: systemPrompt,
            stream: false,
            format: 'json'
        })

        //parsing json format
        const data = JSON.parse(response.response)
        console.log("dexa Ai decision", data)

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

const executeCommand = (req, res) => {
    // This endpoint should ONLY be called when the user clicks "Approve" on the frontend
    const { command } = req.body;

    if (!command) {
        return res.status(400).json({ message: "No command provided to execute." });
    }

    console.log(`User approved execution of: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("🔥 Execution Error:", error);
            return res.status(500).json({
                message: "Command failed to execute",
                error: stderr
            });
        }

        return res.status(200).json({
            message: "Command executed successfully",
            output: stdout
        });
    });
};

module.exports = { generateresponse, executeCommand }
