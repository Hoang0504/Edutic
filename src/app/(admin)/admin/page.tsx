import AdminLayout from "@/components/layout/AdminLayout";
import { AdminProvider } from "@/context/AdminContext";

const Home = () => {
  return (
    <AdminProvider>
      <AdminLayout />
    </AdminProvider>
  );
};
export default Home;
