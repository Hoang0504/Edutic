import ExamResults from "@/views/exam/ExamResult";

function Page({ params }: { params: { id: string } }) {
  const examId = params.id;
  return <ExamResults examId={examId} />;
}

export default Page;
