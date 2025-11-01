type Language = 'es' | 'en';

// Define an interface for the structure of the language-specific instructions.
interface LangInstructionSet {
    persona: string;
    task: string;
    langConstraint: string;
    format: string;
}

const getPrompt = (errorLog: string, language: Language): string => {
    const langInstructions: Record<Language, LangInstructionSet> = {
        es: {
            persona: "Eres un desarrollador experto en Spring Boot de clase mundial y un útil asistente de depuración. Eres un experto en Maven, Gradle, Java y todo el ecosistema de Spring.",
            task: "Analiza el siguiente registro de error de compilación de Spring Boot proporcionado por el usuario. Proporciona un diagnóstico y una solución claros, concisos y accionables.",
            langConstraint: "Proporciona TODA la respuesta en español.",
            format: `
        Formatea la respuesta usando Markdown estricto con las siguientes secciones:
            
        ### Diagnóstico del Error
        *   **Error Principal:** [Un resumen de una oración del error principal]
        *   **Archivo y Línea:** [Identifica el archivo y el número de línea si es posible, si no, indica "No especificado"]
            
        ### Causa Probable
        [Explica la causa raíz del error en términos sencillos. ¿Por qué está sucediendo esto?]
            
        ### Solución Paso a Paso
    1.  **[Título del Paso 1]**
            [Explicación del primer paso. Sé muy claro y directo.]
            \`\`\`java
             // Ejemplo de código para el paso 1 (si aplica)
            \`\`\`
      2.  **[Título del Paso 2]**
            [Explicación del segundo paso.]
            \`\`\`xml
            <!-- Ejemplo de cambio en pom.xml para el paso 2 (si aplica) -->
            \`\`\`

        Si se necesitan más pasos, continúalos en el mismo formato.
`,
        },
        en: {
            persona: "You are a world-class senior Spring Boot developer and a helpful debugging assistant. You are an expert in Maven, Gradle, Java, and the entire Spring ecosystem.",
            task: "Analyze the following Spring Boot compilation error log provided by the user. Provide a clear, concise, and actionable diagnosis and solution.",
            langConstraint: "Provide the ENTIRE response in English.",
            format: `
        Format the response using strict Markdown with the following sections:

        ### Error Diagnosis
      *   **Main Error:** [A one-sentence summary of the main error]
      *   **File & Line:** [Identify the file and line number if possible, otherwise state "Not specified"]

        ### Probable Cause
        [Explain the root cause of the error in simple terms. Why is this happening?]

        ### Step-by-Step Solution
      1.  **[Step 1 Title]**
            [Explanation of the first step. Be very clear and direct.]
            \`\`\`java
          // Example code for step 1 (if applicable)
            \`\`\`
      2.  **[Step 2 Title]**
            [Explanation of the second step.]
            \`\`\`xml
            <!-- Example pom.xml change for step 2 (if applicable) -->
            \`\`\`

        If more steps are needed, continue them in the same format.
        `,
        },
    };

    const selectedLang = langInstructions[language];

    return `
    ${selectedLang.persona}
    ${selectedLang.task}
    ${selectedLang.langConstraint}
    ${selectedLang.format}
    
    Aquí está el registro de error del usuario:
    ---
    ${errorLog}
    ---
    `;
};

interface GeminiApiResponse {
    text: string;
}

// Use environment variable for API URL, with fallback to localhost
const API_URL = process.env.GEMINI_API_URL || 'http://localhost:3001/api/proxy-gemini';

export const diagnoseSpringBootError = async (errorLog: string, language: Language): Promise<string> => {
    const prompt = getPrompt(errorLog, language);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
            throw new Error(`Server responded with ${response.status}: ${errorData.error || response.statusText}`);
        }

        const data: GeminiApiResponse = await response.json();
        return data.text;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("API proxy error:", error);
        throw new Error(`Failed to get diagnosis from the backend service. Original error: ${errorMessage}`);
    }
};