// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-2">404</h1>
      <p className="text-xl font-medium mb-4">Trang không tồn tại</p>
      <p className="text-gray-500">
        Trang bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.
      </p>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Quay về trang chủ
      </a>
    </div>
  );
}
