"use client"
import AppHeader from '@/app/workspace/_components/AppHeader'
import React from 'react'
import ChapterListSidebar from './_components/ChapterListSidebar'
import ChapterContent from './_components/ChapterContent'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'

function Course() {
    const { courseId } = useParams();
    const [courseInfo, setCourseInfo] = useState();
    useEffect(() => {
        GetEnrollCourseById();
    }, [])
    const GetEnrollCourseById = async () => {
        const result = await axios.get('/api/enroll-course?courseId=' + courseId);
        console.log(result.data)
        setCourseInfo(result.data);

    }
    return (
        <div>
            <AppHeader hideSideBar={true} />
            <div className='flex gap-10'>
                <ChapterListSidebar courseInfo={courseInfo} />
                <ChapterContent courseInfo={courseInfo} refreshData={() => GetEnrollCourseById()} />
            </div>
        </div>
    )
}

export default Course