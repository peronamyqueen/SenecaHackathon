import express from "express";
import axios from "axios";
import cors from "cors";

/*
 * HACKATHON JUDGES:
 * This Express server acts as the backend for the Transparency Checker.
 * It connects to a local Ollama instance (Llama 3.2) to analyze job postings.
 * The /analyze endpoint constructs a prompt based on the transparency criteria
 * and returns a structured JSON assessment.
 */

const app = express();
app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get("/", (req, res) => {
    res.json({
        message: "✅ Server is running!",
        endpoints: {
            analyze: "POST /analyze - Analyze a job posting",
            test: "GET /test - Test Ollama connection",
        },
    });
});

// Test if Ollama is working
app.get("/test", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "llama3.2",
            prompt: 'Say "Hello, Ollama is working!" in one sentence.',
            stream: false,
        });

        res.json({
            success: true,
            message: response.data.response,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: "Ollama is not running. Run: ollama serve",
        });
    }
});

// Main endpoint: Analyze job posting for transparency
app.post("/analyze", async (req, res) => {
    try {
        const { title, description, salary, ai_used, requirements } = req.body;

        if (!description) {
            return res.status(400).json({ error: "Missing description field" });
        }

        console.log(`📋 Analyzing: ${title || "Untitled Job"}`);

        // Create the prompt for AI
        const prompt = `You are a Transparency Compliance Officer. Analyze this job posting against the following strict rules:

1. **Salary Transparency**: 
   - **Missing Salary**: If the provided 'Salary' field is "Not specified", empty, missing, or "Competitive", this is a VIOLATION. Report as "Salary not specified".
   - **Range Spread**:
     - You must calculate the annual salary spread.
     - If given as an annual range (e.g. "$100k-$180k"), the difference (Max - Min) must NOT exceed $50,000.
     - **Hourly Rates**: If given as an hourly rate (e.g. "$20-$60/hr"), CONVERT to annual (multiply by 2080 hours).
       - Example: $20/hr = $41,600. $60/hr = $124,800. Spread = $83,200 -> VIOLATION (> $50k).
     - If the calculated spread exceeds $50,000, it is a VIOLATION.

2. **Canadian Experience**: 
   - **STRICTLY FORBIDDEN**: Check both 'Description' and 'Requirements' text thoroughly.
   - If the text mentions "Canadian experience", "experience in Canada", or "local experience in Canada" as a necessity, it is a VIOLATION.
   - Fail immediately if any variation of "Canadian experience" is required.

3. **AI Usage**: 
   - **Declared Usage**: The employer's metadata says AI used: "${ai_used}".
   - If declared as "Yes", the text MUST explicitly disclose using AI for hiring/screening. If not disclosed -> VIOLATION ("Undisclosed AI usage in hiring").
   - **Inferred Usage**: If AI usage is NOT declared (or "Unknown"), analyze the text yourself:
     - Does the text mention using AI/ML tools for candidate screening? If yes -> VIOLATION (if not declared in metadata).
     - Does the *writing style* strongly suggest the job posting itself was written by AI (e.g., excessive buzzwords, "delve", "landscape", generic structure)? If yes -> VIOLATION ("Suspected AI-generated posting without disclosure").

4. **Vacancy Disclosure**: 
   - The posting MUST state if it is for an "existing vacancy" or a "new position".

Job Details:
- Title: ${title}
- Salary: ${salary}
- AI Used in Hiring: ${ai_used}
- Description: ${description}
- Requirements: ${requirements}

Respond ONLY with valid JSON:
{
  "is_transparent": true or false,
  "issues": ["list of specific violations found. Be concise."]
}`;

        // Send to Ollama
        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "llama3.2",
                prompt: prompt,
                stream: false,
                format: "json",
            },
            {
                timeout: 30000, // 30 second timeout
            },
        );

        // Parse AI response
        let analysis;
        try {
            analysis = JSON.parse(response.data.response);
        } catch (e) {
            console.error("Failed to parse AI response", response.data.response);
            analysis = { is_transparent: false, issues: ["AI analysis failed"] };
        }

        console.log(
            `✅ Result: ${analysis.is_transparent ? "✨ Transparent" : "⚠️ Issues Found"}`,
        );

        res.json({
            success: true,
            job: { title, description: description.substring(0, 100) + "..." },
            analysis: analysis,
        });
    } catch (error: any) {
        console.error("❌ Error:", error.message);

        if (error.code === "ECONNREFUSED") {
            return res.status(503).json({
                success: false,
                error: "Ollama is not running",
                fix: 'Run "ollama serve" in another terminal',
            });
        }

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
    console.log("");
    console.log("=".repeat(50));
    console.log("🚀 AI Job Detector API");
    console.log("=".repeat(50));
    console.log(`✅ Server running: http://localhost:${PORT}`);
    console.log(`🔍 Test it: http://localhost:${PORT}/test`);
    console.log("");
    console.log("Quick test with curl:");
    console.log(`curl -X POST http://localhost:${PORT}/analyze \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(
        `  -d '{"title":"Test Job","salary":"$60,000-$120,000","ai_used":"Yes","description":"We use AI to screen candidates...","requirements":"Must have Canadian experience"}'`,
    );
    console.log("=".repeat(50));
    console.log("");
});
