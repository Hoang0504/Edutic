import ExamDetailView from "@/views/exam/ExamDetail";

function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <ExamDetailView examId={id} />;
}

export default Page;
