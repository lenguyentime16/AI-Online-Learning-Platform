"use client"
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
import React, { useContext, useState } from 'react'
import { Check, CheckCircle, Clapperboard, Cross, Loader2Icon, X } from 'lucide-react';
import Youtube from 'react-youtube';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';


function ChapterContent({ courseInfo, refreshData }) {
    const { courseId } = useParams();
    const { courses, enrollCourse } = courseInfo ?? '';
    const courseContent = courseInfo?.courses?.courseContent;
    const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
    const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo;
    const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics;
    let completedChapter = enrollCourse?.completedChapters ?? [];
    const [loading, setLoading] = useState(false);

    const markChapterCompleted = async () => {

        setLoading(true);
        completedChapter.push(selectedChapterIndex);
        const result = await axios.put('/api/enroll-course', {
            courseId: courseId,
            completedChapter: completedChapter
        });

        console.log(result);
        refreshData();
        toast.success('Chapter marked as completed');
        setLoading(false);

    }

    const markInCompletedChapter = async () => {
        setLoading(true);
        const completedChap = completedChapter.filter(item => item != selectedChapterIndex);
        const result = await axios.put('/api/enroll-course', {
            courseId: courseId,
            completedChapter: completedChap
        });

        console.log(result);
        refreshData();
        toast.success('Chapter Marked Incompleted');
        setLoading(false);
    }
    return (
        <div className='p-10 ml-80 mt-20 '>
            <div className='flex justify-between items-center '>
                <h2 className='font-bold text-2xl'>{selectedChapterIndex + 1}. {courseContent?.[selectedChapterIndex]?.courseData?.chapterName}</h2>
                {!completedChapter?.includes(selectedChapterIndex)
                    ? <Button onClick={() => markChapterCompleted()}
                        disabled={loading}
                    >{loading ? <Loader2Icon className='animate-spin' /> : <CheckCircle />}

                        Mark as Completed</Button> :
                    <Button variant="outline" onClick={markInCompletedChapter}
                        disabled={loading}
                    >
                        {loading ? <Loader2Icon className='animate-spin' /> : <X />}Mark incompleted</Button>}
            </div>

            <h2 className='flex my-2 font-bold text-lg gap-2'>Related Videos <Clapperboard /></h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {videoData?.map((video, index) => index < 2 && (
                    <div key={index}>
                        <Youtube
                            videoId={video?.videoId}
                            opts={
                                {
                                    height: '250',
                                    width: '400',
                                }
                            } />
                    </div>
                ))}
            </div>

            <div className='mt-7'>
                {topics?.map((topic, index) => (
                    <div key={index} className='mt-10 p-5 bg-secondary rounded-2xl'>
                        <h2 className='font-bold text-2xl text-primary'>{index + 1}. {topic?.topic}</h2>
                        {/* <p>{topic?.content}</p> */}
                        <div dangerouslySetInnerHTML={{ __html: topic?.content }}
                            style={{
                                lineHeight: '2.5'
                            }}></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChapterContent