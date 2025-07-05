import ExamLayout from "@/components/exam/ExamLayout";

function Page(params: { params: { exam_attempt_id: string } }) {
  const { exam_attempt_id } = params.params;
  return <ExamLayout examAttemptId={exam_attempt_id} />;
}

export default Page;
