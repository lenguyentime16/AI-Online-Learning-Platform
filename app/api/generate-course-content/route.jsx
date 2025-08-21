import { NextResponse } from "next/server";
import { ai } from "../generate-course-layout/route"

const PROMPT = `Depends on Chapter name and Topic Generate content for each topic in HTML and give response in JSON format.
Schema: {
chapterName: <>,
{
topic:<>,
content:<>
}
}
: User Input: 
`;
export async function POST(req) {
    const { courseJson, courseTitle } = await req.json();

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

            const rawText = response.candidates[0].content.parts[0].text;

            // AI đôi khi vẫn trả về markdown, ta cần dọn dẹp nó
            const cleanJsonText = rawText.replace(/```json|```/g, '').trim();

            // Parse JSON để đảm bảo nó hợp lệ trước khi trả về
            return JSON.parse(cleanJsonText);
        });

        const CourseContent = await Promise.all(promises);

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