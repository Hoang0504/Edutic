export default function Footer() {
    return (
      <footer className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Logo và Menu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Logo */}
            <div className="flex justify-center md:justify-start">
              <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-blue-800 font-bold text-lg">LOGO</span>
              </div>
            </div>
  
            {/* Tài nguyên */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tài nguyên</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Flashcards</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Đề thi thử</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Bài học</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Từ vựng</a></li>
              </ul>
            </div>
  
            {/* Chính sách chung */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chính sách chung</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex laboriosam, dolore quisquam, inventore provident impedit veniam culpa saepe labore architecto maiores dignissimos nostrum et tempora explicabo porro sequi nobis fuga?
              </p>
            </div>
          </div>
  
          {/* Thông tin cty và bản đồ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Thông tin doanh nghiệp */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Thông tin doanh nghiệp</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Công ty:</strong> Edutic Technologies</p>
                <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</p>
                <p><strong>Email:</strong> info@edutic.com</p>
                <p><strong>Điện thoại:</strong> (028) 1234 5678</p>
                <p><strong>MST:</strong> 0123456789</p>
              </div>
            </div>
  
            {/* Map */}
            <div className="flex justify-center lg:justify-end">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9245339145837!2d105.81642897593198!3d21.035705380615457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0d6e603741%3A0x208a848932ac2109!2sAptech%20Computer%20Education!5e0!3m2!1svi!2s!4v1749815368523!5m2!1svi!2s" 
                width="400" 
                height="300" 
                style={{border: 0}} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
  
          {/* Footer */}
          <div className="pt-8 border-t border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm">
                © 2024 Edutic. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Điều khoản sử dụng</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Chính sách bảo mật</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Liên hệ</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  