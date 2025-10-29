import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 sm:py-12">
      <div className="max-w-6xl w-full mx-auto">
        {/* Top Section - Logo and Menu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:gap-8 sm:mb-2">
          {/* Logo */}
          <div className="flex justify-center order-1">
            <div className="relative md:w-52 md:h-52 sm:w-24 sm:h-24 rounded-full flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Edutic logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Tài nguyên */}
          <div className="order-3 sm:order-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center sm:text-left">
              Tài nguyên
            </h3>
            <ul className="space-y-2 text-center sm:text-left">
              <li>
                <a
                  href="#"
                  className="text-sm sm:text-base text-gray-600 hover:text-gray-900"
                >
                  Flashcards
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm sm:text-base text-gray-600 hover:text-gray-900"
                >
                  Đề thi thử
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm sm:text-base text-gray-600 hover:text-gray-900"
                >
                  Bài học
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm sm:text-base text-gray-600 hover:text-gray-900"
                >
                  Từ vựng
                </a>
              </li>
            </ul>
          </div>

          {/* Chính sách chung */}
          <div className="order-2 sm:order-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center sm:text-left">
              Chính sách chung
            </h3>
          </div>
        </div>

        {/* Bottom Section - Business Info and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Thông tin doanh nghiệp */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center lg:text-left">
              Thông tin doanh nghiệp
            </h3>
            <div className="space-y-2 text-gray-600 text-center lg:text-left">
              <p className="text-sm sm:text-base">
                <strong>Công ty:</strong> Edutic Technologies
              </p>
              <p className="text-sm sm:text-base">
                <strong>Địa chỉ:</strong> TP.HÀ NỘI
              </p>
              <p className="text-sm sm:text-base">
                <strong>Email:</strong> ngochoanghuy0504@gmail.com
              </p>
              <p className="text-sm sm:text-base">
                <strong>Điện thoại:</strong> (+84) 397 273 850
              </p>
              {/* <p className="text-sm sm:text-base">
                <strong>MST:</strong> 0123456789
              </p> */}
            </div>
          </div>

          {/* Map */}
          <div className="flex justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29793.980453123586!2d105.81636411023666!3d21.022778419226146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2zSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1750747936404!5m2!1svi!2s"
              width="300"
              height="200"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 sm:pt-8 border-t border-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
              © 2025 - Bản quyền thuộc về Công ty Edutic Technologies.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm text-center"
              >
                Điều khoản sử dụng
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm text-center"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm text-center"
              >
                Liên hệ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
