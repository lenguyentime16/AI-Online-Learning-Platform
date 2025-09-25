import { NextResponse } from "next/server";
import ai from "@/lib/ai";
import axios from "axios";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";

const PROMPT = `Based on the provided Chapter name and its Topics, generate detailed content for each topic in HTML format.
The final output must be a single, valid JSON object only, without any surrounding text or markdown like \`\`\`json.
Follow this exact JSON schema:
{
    "chapterName": "<The name of the chapter>",
    "topics": [
        {
            "topic": "<The name of the topic>",
            "content": "<The generated HTML content for this topic, including h3 tags>"
        }
    ]
}

IMPORTANT: Inside the "content" HTML, you MUST use single quotes for all attributes (e.g., <div class='my-class'>) to avoid breaking the JSON structure. Do NOT use double quotes inside the HTML.

User Input:
`;
export async function POST(req) {
    const { courseId, courseJson, courseTitle } = await req.json();

    // Thêm try...catch để xử lý lỗi một cách an toàn
    try {
        const promises = courseJson?.chapters?.map(async (chapter) => {
            const model = 'gemini-2.0-flash';
            const contents = [
                {
                    role: 'user',
                    parts: [{ text: PROMPT + JSON.stringify(chapter) }],
                },
            ];

            const response = await ai.models.generateContent({
                model,
                contents,
            });

            // console.log(response.candidates[0].content.parts[0].text);
            const RawResp = response?.candidates[0]?.content?.parts[0]?.text;
            const RawJson = RawResp.replace('```json', '').replace('```', '').trim();
            const JSONResp = JSON.parse(RawJson);

            //GET Youtube Videos

            const youtubeData = await GetYoutubeVideo(chapter?.chapterName);
            console.log({
                youtubeVideo: youtubeData,
                courseData: JSONResp,
            })
            return {
                youtubeVideo: youtubeData,
                courseData: JSONResp,
            };
        });

        const CourseContent = await Promise.all(promises);

        //Save to DB
        const dbResp = await db.update(coursesTable).set({
            courseContent: CourseContent,
        }).where(eq(coursesTable.cid, courseId));

        return NextResponse.json({
            courseName: courseTitle,
            CourseContent: CourseContent,
        });

    } catch (error) {
        // Log lỗi chi tiết ở phía server để dễ dàng gỡ lỗi
        console.error("Error in generate-course-content API:", error);
        // Trả về một lỗi rõ ràng cho phía client
        return new NextResponse("Failed to generate course content due to an internal error.", { status: 500 });
    }
}

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search"

const GetYoutubeVideo = async (topic) => {
    const params = {
        part: 'snippet',
        q: topic,
        maxResults: 4,
        type: 'video',
        key: process.env.YOUTUBE_API_KEY //Your YouTube API key    
    }
    const resp = await axios.get(YOUTUBE_BASE_URL, { params });
    const youtubeVideoListResp = resp.data.items;
    const youtubeVideoList = [];
    youtubeVideoListResp.forEach((item) => {
        const data = {
            videoId: item.id?.videoId,
            title: item?.snippet?.title
        }
        youtubeVideoList.push(data);
    });
    console.log("Youtube Video List:", youtubeVideoList);
    return youtubeVideoList;
}