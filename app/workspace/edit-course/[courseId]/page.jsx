"use client"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import axios from "axios"
import CourseInfo from "../_components/CourseInfo"
import ChapterTopicList from "../_components/ChapterTopicList"

export default function EditCoursePage() {
    const { courseId } = useParams()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [course, setCourse] = useState()

    const viewCourse = searchParams.get("viewCourse") === "true"

    useEffect(() => {
        GetCourseInfo()
    }, [])

    const GetCourseInfo = async () => {
        setLoading(true)
        const result = await axios.get("/api/courses?courseId=" + courseId)
        console.log(result.data)
        setLoading(false)
        setCourse(result.data)
    }

    return (
        <div>
            <CourseInfo course={course} viewCourse={viewCourse} />
            <ChapterTopicList course={course} />
        </div>
    )
}
