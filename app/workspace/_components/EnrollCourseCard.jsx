import React from 'react'
import Image from 'next/image'
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

function EnrollCourseCard({ course, enrollCourse }) {
    const courseJson = course?.courseJson?.course;

    const CalculatorProgress = () => {
        // SỬA LỖI LOGIC: Sửa lại công thức tính để đảm bảo tính đúng
        const totalChapters = course?.courseContent?.length || 1; // Tránh chia cho 0
        const completedChapters = enrollCourse?.completedChapters?.length ?? 0;
        return (completedChapters / totalChapters) * 100;
    }

    return (
        // SỬA LỖI 1: Biến card thành một container flexbox theo chiều dọc
        <div className='shadow rounded-xl flex flex-col'>
            <Image src={course?.bannerImageUrl} alt={course?.name}
                width={400}
                height={300}
                className='w-full aspect-video rounded-t-xl object-cover' />

            {/* SỬA LỖI 2: Thêm flex-grow để phần nội dung này co giãn lấp đầy không gian */}
            <div className='p-3 flex flex-col gap-3 flex-grow'>
                <h2 className='font-bold text-lg'>{courseJson?.name}</h2>
                <p className='line-clamp-3 text-gray-400 text-sm'>{courseJson?.description}</p>
            </div>

            {/* SỬA LỖI 3: Giữ lại phần tiến trình và button của bạn, đặt nó ở dưới cùng */}
            <div className='p-3 pt-0'>
                <h2 className='flex justify-between text-sm text-primary'>Progress <span>{Math.round(CalculatorProgress())}%</span></h2>
                <Progress value={CalculatorProgress()} />

                <Link href={'/workspace/view-course/' + course?.cid}>
                    <Button className={'w-full mt-3'}><PlayCircle /> Continue Learning</Button>
                </Link>
            </div>
        </div>
    )
}

export default EnrollCourseCard