import { coursesTable } from '@/config/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import ai from '@/lib/ai';
import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import axios from 'axios';
import { eq } from 'drizzle-orm';


const PROMPT = `Genrate Learning Course depends on following details. In which Make sure to add Course Name, Description, Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name,, Topic under each chapters, Duration for each chapters etc, in JSON format only

Schema:
{
    "course": {
        "name": "string",
        "description": "string",
        "category": "string",
        "level": "string",
        "includeVideo": "boolean",
        "noOfChapters": "number",
        "bannerImagePrompt": "string",
        "chapters": [
            {
                "chapterName": "string",
                "duration": "string",
                "topics": [
                    "string"
                ]
            }
        ]
    }
}

User Input:`;
// AI client provided by lib/ai

export async function POST(req) {
    const { courseId, ...formData } = await req.json();
    const user = await currentUser();
    const { has } = await auth();
    const hasPreniumAccess = has({ plan: 'started' })

    // To run this code you need to install the following dependencies:
    // npm install @google/genai mime
    // npm install -D @types/node




    const tools = [
        {
            googleSearch: {
            }
        },
    ];
    const config = {
        responseMimetypes: 'text/plain',
    }
    const model = 'gemini-2.0-flash';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: PROMPT + JSON.stringify(formData),
                },
            ],
        },
    ];

    //If user already created any course?
    if (!hasPreniumAccess) {
        const result = await db.select().from(coursesTable)
            .where(eq(coursesTable.userEmail, user?.primaryEmailAddress?.emailAddress));

        if (result?.length >= 1) {
            return NextResponse.json({ 'resp': "limit exceed" });
        }
    }


    const response = await ai.models.generateContent({
        model,
        config,
        contents,
    });

    // Log toàn bộ response để gỡ lỗi
    console.log(JSON.stringify(response, null, 2));

    // Kiểm tra an toàn trước khi truy cập
    if (!response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error("Gemini API did not return content. Check safety ratings or prompt.");
        // Trả về một lỗi rõ ràng cho client
        return NextResponse.json(
            { error: "Failed to generate course content from AI. The request may have been blocked." },
            { status: 500 }
        );
    }

    console.log(response.candidates[0].content.parts[0].text);
    const RawResp = response?.candidates[0]?.content?.parts[0]?.text;
    const RawJson = RawResp.replace('```json', '').replace('```', '').trim();
    const JSONResp = JSON.parse(RawJson);
    const ImagePrompt = JSONResp.course?.bannerImagePrompt;
    //generate Image
    const bannerImageUrl = await GenerateImage(ImagePrompt);
    // Save to Database
    const result = await db.insert(coursesTable).values({
        ...formData,
        courseJson: JSONResp,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        cid: courseId,
        bannerImageUrl: bannerImageUrl,
    });



    return NextResponse.json({ courseId: courseId });

}

const GenerateImage = async (imagePrompt) => {
    const BASE_URL = 'https://aigurulab.tech';
    try {
        const result = await axios.post(BASE_URL + '/api/generate-image',
            {
                width: 1024,
                height: 1024,
                input: imagePrompt,
                model: 'flux',
                aspectRatio: "16:9"
            },
            {
                headers: {
                    'x-api-key': process?.env?.AI_GURU_LAB_API,
                    'Content-Type': 'application/json',
                },
            });
        console.log("Image generation result:", result.data.image);
        return result.data.image;
    } catch (error) {
        console.error("Error generating image:", error.response?.data || error.message);
        return null; // Trả về null nếu có lỗi
    }
}


