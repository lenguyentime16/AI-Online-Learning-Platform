import React from 'react'
import Image from 'next/image'
import { Book, LoaderCircle, PlayCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
function CourseCard({ course }) {
    const courseJson = course?.courseJson?.course;
    const [loading, setLoading] = useState(false);
    const onEnrollCourse = async () => {
        try {
            setLoading(true);
            const result = await axios.post('/api/enroll-course', {
                courseId: course?.cid
            })
            console.log(result.data);
            if (result.data.resp) {
                toast.warning('Already Enrolled');
                setLoading(false);
                return;
            }
            toast.success("Course Enrolled Successfully");
            setLoading(false);
        } catch (error) {
            toast.error("Sever side error, please try again later");
            setLoading(false);
        }

    }
    return (
        // SỬA LỖI 1: Biến card thành một container flexbox theo chiều dọc
        <div className='shadow rounded-xl mt-10 flex flex-col'>
            <Image src={course?.bannerImageUrl} alt={course?.name}
                width={400}
                height={300}
                className='w-full aspect-video rounded-t-xl object-cover' />

            {/* SỬA LỖI 2: Thêm flex-grow để phần nội dung này co giãn lấp đầy không gian */}
            <div className='p-3 flex flex-col gap-3 flex-grow'>
                <h2 className='font-bold text-lg'>{courseJson?.name}</h2>
                <p className='line-clamp-3 text-gray-400 text-sm'>{courseJson?.description}</p>
            </div>

            {/* SỬA LỖI 3: Tách phần footer ra để nó luôn được đẩy xuống dưới cùng */}
            <div className='p-3 pt-0'>
                <div className='flex justify-between items-center'>
                    <h2 className='flex items-center text-sm gap-2'><Book className='text-primary h-5 w-5' />{courseJson?.noOfChapters} Chapters</h2>
                    {course?.courseContent?.length ? <Button size={'sm'}
                        onClick={onEnrollCourse}
                        disabled={loading}
                    >{loading ? <LoaderCircle className='animate-spin' /> : <PlayCircle />}Enroll Course</Button>
                        : <Link href={'/workspace/edit-course/' + course?.cid}> <Button size={'sm'} variant={'outline'}><Settings />Generate Course</Button> </Link>}
                </div>
            </div>
        </div>
    )
}

export default CourseCard