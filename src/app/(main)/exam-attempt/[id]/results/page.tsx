import ExamResults from "@/views/exam/ExamResult";

function Page({ params }: { params: { exam_id: string } }) {
  const examId = params.exam_id;
  return <ExamResults examId={examId} />;
}

export default Page;
