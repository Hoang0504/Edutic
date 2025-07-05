import ExamDetailView from "@/views/exam/ExamDetailView";

function Page({ params }: { params: { exam_id: string } }) {
  const { exam_id } = params;
  return <ExamDetailView examId={exam_id} />;
}

export default Page;
