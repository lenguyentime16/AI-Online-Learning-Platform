import { db } from "@/config/db";
import { NextResponse } from "next/server";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const courseID = searchParams.get('courseId');

    const result = await db.select().from(coursesTable)
        .where(eq(coursesTable.cid, courseID));

    console.log("Course data fetched:", result);
    return NextResponse.json(result[0]);
}