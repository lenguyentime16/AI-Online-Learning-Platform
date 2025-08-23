import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner' // <-- 1. Import component
import CourseList from './_components/CourseList'
import EnrollCourseList from './_components/EnrollCourseList'

function Workspace() {
    return (
        <div>
            <WelcomeBanner />
            <EnrollCourseList />
            <CourseList />
            
        </div>
    )
}

export default Workspace