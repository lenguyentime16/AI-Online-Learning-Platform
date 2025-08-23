import React, { useContext } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
function ChapterListSidebar({ courseInfo }) {
    const course = courseInfo?.course;
    const enrollCourse = courseInfo?.enrollCourse;
    const courseContent = courseInfo?.courses?.courseContent;
    const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
    return (
        <div className='w-80 bg-secondary h-screen p-5'>
            <h2 className='my-3 font-bold text-xl'>Chapters ({courseContent?.length})</h2>
            <Accordion type="single" collapsible>
                {courseContent?.map((chapter, index) => (

                    <AccordionItem value={chapter?.courseData?.chapterName} key={index}
                        onClick={() => {
                            setSelectedChapterIndex(index);
                        }}>
                        <AccordionTrigger className={'text-lg font-medium'}>{index + 1}. {chapter?.courseData?.chapterName}</AccordionTrigger>
                        <AccordionContent asChild>
                            <div className=''>
                                {chapter?.courseData?.topics?.map((topic, idx) => (
                                    <h2 key={idx} className='p-3 bg-white my-1 rounded-lg'>{topic?.topic}</h2>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default ChapterListSidebar