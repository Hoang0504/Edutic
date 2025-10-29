import ExamResults from "@/views/exam/ExamResult";

function Page({ params }: { params: { id: string } }) {
  const examAttemptId = params.id;
  return <ExamResults examAttemptId={examAttemptId} />;
}

export default Page;
