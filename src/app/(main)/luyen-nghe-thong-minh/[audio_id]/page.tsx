import SmartListening from "@/views/SmartListening";

function Page({ params }: { params: { audio_id: string } }) {
  const { audio_id } = params;
  return <SmartListening audio_id={audio_id} />;
}

export default Page;
