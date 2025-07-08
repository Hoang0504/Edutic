import PartSelector from "@/views/PartSelector";

function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <PartSelector examId={id} />;
}

export default Page;
