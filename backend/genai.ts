// import Anthropic from "@anthropic-ai/sdk";
// import dotenv from 'dotenv';

// dotenv.config();

// const anthropic = new Anthropic({
//     apiKey: process.env.ANTHROPIC_API_KEY,
// });

// export async function getShortPoemResponse(prompt: string): Promise<void> {
//     try {
//         const msg = await anthropic.messages.create({
//             model: "claude-3-5-sonnet-20241022",
//             max_tokens: 1000,
//             temperature: 0,
//             system: "Respond based on the data given above",
//             messages: [
//                 {
//                     role: "user",
//                     content: [
//                         {
//                             type: "text",
//                             text: prompt,
//                         },
//                     ],
//                 },
//             ],
//         });

//         console.log(msg);
//     } catch (error) {
//         console.error("Error creating message:", error);
//     }
// }
import Anthropic from "@anthropic-ai/sdk";
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function getShortPoemResponse(prompt: string): Promise<string> {
    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1000,
            temperature: 0,
            system: "Respond based on the data given above",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt,
                        },
                    ],
                },
            ],
        });

        // Extract only text content blocks
        const textResponse = msg.content
            .filter((block: any) => block.type === 'text') // Check if block is of type 'text'
            .map((block: any) => block.text)               // Extract text from the block
            .join("\n");                                   // Join text responses with a newline, if multiple

        console.log(textResponse)
        
        return textResponse || "No response received.";
    } catch (error) {
        console.error("Error creating message:", error);
        return "Error fetching response.";
    }
}
