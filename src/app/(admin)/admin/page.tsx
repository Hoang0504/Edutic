import AdminLayout from "@/app/admin/layout/AdminLayout";
import { AdminProvider } from "@/context/AdminContext";

const Home = () => {
  return (
    <AdminProvider>
      <AdminLayout />
    </AdminProvider>
  );
};
export default Home;
