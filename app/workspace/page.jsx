import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner' // <-- 1. Import component
import CourseList from './_components/CourseList'

function Workspace() {
    return (
        <div>
            <WelcomeBanner />
            <CourseList />
        </div>
    )
}

export default Workspace