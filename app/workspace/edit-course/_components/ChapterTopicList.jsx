import { Gift } from 'lucide-react';
import React from 'react';

function ChapterTopicList({ course }) {
    const courseLayout = course?.courseJson?.course;
    return (
        <div>
            <h2 className='font-bold text-3xl mt-10'>Chapters & Topics</h2>
            <div className='flex flex-col items-center justify-center mt-10'>
                {courseLayout?.chapters.map((chapter, index) => (
                    <div key={index} className='flex flex-col items-center w-full'>
                        <div className='p-4 border shadow rounded-xl bg-primary text-white w-full md:w-3/4 lg:w-1/2'>
                            <h2 className='text-center '>Chapter {index + 1}</h2>
                            <h2 className='font-bold text-lg text-center'>{chapter.chapterName}</h2>
                            <h2 className='text-xs flex justify-between gap-16'>
                                <span>Duration: {chapter?.duration}</span>
                                <span>No. Of Topics: {chapter?.topics?.length}</span>
                            </h2>
                        </div>

                        <div>
                            {/* SỬA LỖI: Đổi tên 'index' thành 'topicIndex' để tránh lỗi che khuất biến */}
                            {chapter?.topics.map((topic, topicIndex) => (
                                <div className='flex flex-col items-center' key={topicIndex}>
                                    <div className='h-10 bg-gray-300 w-1'></div>
                                    <div className='flex items-center gap-5'>
                                        <span className={`max-w-xs ${topicIndex % 2 !== 0 ? 'text-transparent' : ''}`}>{topic}</span>
                                        <h2 className='text-center rounded-full bg-gray-300 px-6 text-gray-500 p-4'>{topicIndex + 1}</h2>
                                        <span className={`max-w-xs ${topicIndex % 2 === 0 ? 'text-transparent' : ''}`}>{topic}</span>
                                    </div>

                                    {/* Gộp các điều kiện giống nhau cho sạch sẽ */}
                                    {topicIndex === chapter?.topics?.length - 1 && (
                                        <>
                                            <div className='h-10 bg-gray-300 w-1'></div>
                                            <div className='flex items-center gap-5'>
                                                <Gift className='text-center rounded-full bg-gray-300 h-14 w-14 text-gray-500 p-4' />
                                            </div>
                                            <div className='h-10 bg-gray-300 w-1'></div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div className='p-4 border shadow rounded-xl bg-green-600 text-white'>
                    <h2>Finish</h2>
                </div>
            </div>
        </div>
    );
}

export default ChapterTopicList;