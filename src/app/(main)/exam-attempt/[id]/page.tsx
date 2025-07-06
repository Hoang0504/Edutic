import ExamLayout from "@/components/exam/ExamLayout";

function Page(params: { params: { id: string } }) {
  const { id } = params.params;
  return <ExamLayout examAttemptId={id} />;
}

export default Page;
