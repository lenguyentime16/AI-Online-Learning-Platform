"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EnrollCourseCard from './EnrollCourseCard'

function EnrollCourseList() {

    const [enrollCourseList, setEnrollCourseList] = useState([]);

    useEffect(() => {
        GetEnrollCourse();
    }, [])
    const GetEnrollCourse = async () => {
        const result = await axios.get('/api/enroll-course');
        console.log(result.data)
        setEnrollCourseList(result.data);
    }
    return enrollCourseList?.length > 0 && (
        <div className='mt-3'>
            <h2 className='font-bold text-xl'>Continue Learning your Course</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
                {enrollCourseList?.map((course, index) => (
                    <EnrollCourseCard course={course?.courses} key={index}
                        enrollCourse={course?.enrollCourse} />

                ))}
            </div>
        </div>
    )
}

export default EnrollCourseList