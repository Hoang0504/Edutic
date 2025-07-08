import { SelectedAnswersProvider } from "@/contexts/SelectedAnswersContext";

function Layout({ children }: { children: React.ReactNode }) {
  return <SelectedAnswersProvider>{children}</SelectedAnswersProvider>;
}

export default Layout;
