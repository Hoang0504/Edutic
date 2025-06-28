export interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  readTime: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  category: string;
  content: string;
  tags: string[];
  examples?: Example[];
  tips?: string[];
}

export interface Example {
  english: string;
  vietnamese: string;
  explanation?: string;
}

// Detailed knowledge content
export const TOEIC_KNOWLEDGE: Record<string, KnowledgeItem> = {
  'tenses': {
    id: 'tenses',
    title: 'Thì trong tiếng Anh',
    description: 'Nắm vững 12 thì cơ bản trong tiếng Anh thường xuất hiện trong TOEIC',
    readTime: '10 phút',
    difficulty: 'Cơ bản',
    category: 'Grammar',
    tags: ['Grammar', 'Tenses', 'Verb Forms'],
    content: `
      <h2>Tổng quan về thì trong tiếng Anh</h2>
      <p>Thì (Tenses) là một trong những chủ đề ngữ pháp quan trọng nhất trong TOEIC. Hiểu rõ và sử dụng đúng thì sẽ giúp bạn ghi điểm cao trong cả phần Reading và Listening.</p>
      
      <h3>12 thì cơ bản thường gặp trong TOEIC:</h3>
      
      <h4>1. Present Simple (Hiện tại đơn)</h4>
      <p><strong>Cấu trúc:</strong> S + V(s/es) + O</p>
      <p><strong>Cách dùng:</strong> Diễn tả sự thật, thói quen, lịch trình</p>
      
      <h4>2. Present Continuous (Hiện tại tiếp diễn)</h4>
      <p><strong>Cấu trúc:</strong> S + am/is/are + V-ing + O</p>
      <p><strong>Cách dùng:</strong> Hành động đang xảy ra tại thời điểm nói</p>
      
      <h4>3. Present Perfect (Hiện tại hoàn thành)</h4>
      <p><strong>Cấu trúc:</strong> S + have/has + V3 + O</p>
      <p><strong>Cách dùng:</strong> Hành động đã xảy ra nhưng không rõ thời gian, hoặc có ảnh hưởng đến hiện tại</p>
      
      <h4>4. Past Simple (Quá khứ đơn)</h4>
      <p><strong>Cấu trúc:</strong> S + V2 + O</p>
      <p><strong>Cách dùng:</strong> Hành động đã xảy ra và kết thúc trong quá khứ</p>
      
      <h4>5. Future Simple (Tương lai đơn)</h4>
      <p><strong>Cấu trúc:</strong> S + will + V + O</p>
      <p><strong>Cách dùng:</strong> Dự đoán, quyết định đột xuất, lời hứa</p>
      
      <h3>Mẹo làm bài TOEIC:</h3>
      <ul>
        <li>Chú ý đến các từ chỉ thời gian (yesterday, tomorrow, since, for, already...)</li>
        <li>Xác định ngữ cảnh của câu để chọn thì phù hợp</li>
        <li>Luyện tập nhận biết các signal words của từng thì</li>
      </ul>
    `,
    examples: [
      {
        english: "The company has expanded its operations since 2020.",
        vietnamese: "Công ty đã mở rộng hoạt động từ năm 2020.",
        explanation: "Present Perfect - hành động bắt đầu trong quá khứ và tiếp tục đến hiện tại"
      },
      {
        english: "We will discuss the budget in tomorrow's meeting.",
        vietnamese: "Chúng ta sẽ thảo luận về ngân sách trong cuộc họp ngày mai.",
        explanation: "Future Simple - diễn tả kế hoạch trong tương lai"
      }
    ],
    tips: [
      "Học thuộc các signal words của từng thì",
      "Làm nhiều bài tập để nhận biết ngữ cảnh",
      "Chú ý đến thời gian được đề cập trong câu"
    ]
  },
  
  'passive-voice': {
    id: 'passive-voice',
    title: 'Câu bị động',
    description: 'Cách sử dụng và nhận biết câu bị động trong các part của TOEIC',
    readTime: '8 phút',
    difficulty: 'Trung bình',
    category: 'Grammar',
    tags: ['Grammar', 'Passive Voice', 'Verb Forms'],
    content: `
      <h2>Câu bị động trong TOEIC</h2>
      <p>Câu bị động (Passive Voice) là cấu trúc ngữ pháp quan trọng, thường xuất hiện trong Part 5, 6, và 7 của TOEIC.</p>
      
      <h3>Cấu trúc cơ bản:</h3>
      <p><strong>Câu chủ động:</strong> S + V + O</p>
      <p><strong>Câu bị động:</strong> S + be + V3 + (by + Object)</p>
      
      <h3>Các thì của câu bị động:</h3>
      
      <h4>1. Present Simple Passive</h4>
      <p><strong>Cấu trúc:</strong> am/is/are + V3</p>
      <p><strong>Ví dụ:</strong> Reports are submitted every month.</p>
      
      <h4>2. Past Simple Passive</h4>
      <p><strong>Cấu trúc:</strong> was/were + V3</p>
      <p><strong>Ví dụ:</strong> The project was completed last week.</p>
      
      <h4>3. Present Perfect Passive</h4>
      <p><strong>Cấu trúc:</strong> have/has been + V3</p>
      <p><strong>Ví dụ:</strong> The documents have been reviewed.</p>
      
      <h4>4. Future Simple Passive</h4>
      <p><strong>Cấu trúc:</strong> will be + V3</p>
      <p><strong>Ví dụ:</strong> The meeting will be held tomorrow.</p>
      
      <h3>Khi nào sử dụng câu bị động:</h3>
      <ul>
        <li>Không biết hoặc không cần nhấn mạnh chủ thể thực hiện hành động</li>
        <li>Muốn nhấn mạnh hành động hơn là người thực hiện</li>
        <li>Văn phong trang trọng, lịch sự (thường dùng trong business)</li>
      </ul>
    `,
    examples: [
      {
        english: "The proposal will be reviewed by the board next week.",
        vietnamese: "Đề xuất sẽ được hội đồng quản trị xem xét vào tuần tới.",
        explanation: "Future Simple Passive - nhấn mạnh hành động review"
      },
      {
        english: "All employees must be informed about the new policy.",
        vietnamese: "Tất cả nhân viên phải được thông báo về chính sách mới.",
        explanation: "Modal + be + V3 - thể hiện sự bắt buộc"
      }
    ],
    tips: [
      "Chú ý động từ be được chia theo thì tương ứng",
      "Nhận biết qua các từ như 'by', 'with'",
      "Luyện chuyển đổi giữa câu chủ động và bị động"
    ]
  },

  'business-vocab': {
    id: 'business-vocab',
    title: 'Từ vựng kinh doanh',
    description: 'Các từ vựng về kinh doanh, công việc thường xuất hiện trong TOEIC',
    readTime: '20 phút',
    difficulty: 'Trung bình',
    category: 'Vocabulary',
    tags: ['Vocabulary', 'Business', 'Work'],
    content: `
      <h2>Từ vựng kinh doanh cơ bản trong TOEIC</h2>
      <p>TOEIC tập trung vào ngữ cảnh công việc và kinh doanh. Việc nắm vững từ vựng chuyên ngành sẽ giúp bạn hiểu được nội dung bài thi một cách dễ dàng.</p>
      
      <h3>1. Quản lý và tổ chức</h3>
      <ul>
        <li><strong>Management:</strong> quản lý</li>
        <li><strong>Supervisor:</strong> người giám sát</li>
        <li><strong>Department:</strong> phòng ban</li>
        <li><strong>Executive:</strong> giám đốc điều hành</li>
        <li><strong>Administrator:</strong> quản trị viên</li>
        <li><strong>Coordinator:</strong> điều phối viên</li>
      </ul>
      
      <h3>2. Tài chính và kế toán</h3>
      <ul>
        <li><strong>Budget:</strong> ngân sách</li>
        <li><strong>Revenue:</strong> doanh thu</li>
        <li><strong>Profit:</strong> lợi nhuận</li>
        <li><strong>Expense:</strong> chi phí</li>
        <li><strong>Invoice:</strong> hóa đơn</li>
        <li><strong>Accounting:</strong> kế toán</li>
        <li><strong>Investment:</strong> đầu tư</li>
      </ul>
      
      <h3>3. Marketing và bán hàng</h3>
      <ul>
        <li><strong>Customer:</strong> khách hàng</li>
        <li><strong>Client:</strong> khách hàng (trong dịch vụ)</li>
        <li><strong>Campaign:</strong> chiến dịch</li>
        <li><strong>Promotion:</strong> khuyến mại</li>
        <li><strong>Advertisement:</strong> quảng cáo</li>
        <li><strong>Target audience:</strong> đối tượng mục tiêu</li>
      </ul>
      
      <h3>4. Họp hành và giao tiếp</h3>
      <ul>
        <li><strong>Meeting:</strong> cuộc họp</li>
        <li><strong>Conference:</strong> hội nghị</li>
        <li><strong>Presentation:</strong> thuyết trình</li>
        <li><strong>Agenda:</strong> chương trình nghị sự</li>
        <li><strong>Minutes:</strong> biên bản họp</li>
        <li><strong>Deadline:</strong> hạn chót</li>
      </ul>
      
      <h3>5. Sản xuất và chất lượng</h3>
      <ul>
        <li><strong>Production:</strong> sản xuất</li>
        <li><strong>Quality:</strong> chất lượng</li>
        <li><strong>Manufacturing:</strong> sản xuất công nghiệp</li>
        <li><strong>Supply:</strong> cung cấp</li>
        <li><strong>Delivery:</strong> giao hàng</li>
        <li><strong>Inventory:</strong> hàng tồn kho</li>
      </ul>
    `,
    examples: [
      {
        english: "The marketing department is planning a new advertising campaign.",
        vietnamese: "Phòng marketing đang lên kế hoạch cho một chiến dịch quảng cáo mới.",
        explanation: "Sử dụng từ vựng business trong ngữ cảnh công việc"
      },
      {
        english: "We need to review the budget before the quarterly meeting.",
        vietnamese: "Chúng ta cần xem xét ngân sách trước cuộc họp quý.",
        explanation: "Kết hợp từ vựng tài chính và họp hành"
      }
    ],
    tips: [
      "Học từ vựng theo chủ đề để dễ nhớ",
      "Luyện tập với các tình huống thực tế",
      "Chú ý cách phát âm của từ vựng chuyên ngành"
    ]
  },

  'skimming-scanning': {
    id: 'skimming-scanning',
    title: 'Skimming & Scanning',
    description: 'Kỹ thuật đọc lướt và đọc tìm thông tin trong TOEIC Reading',
    readTime: '15 phút',
    difficulty: 'Cơ bản',
    category: 'Reading Tips',
    tags: ['Reading', 'Strategy', 'Speed Reading'],
    content: `
      <h2>Kỹ thuật Skimming và Scanning</h2>
      <p>Hai kỹ thuật đọc quan trọng nhất giúp bạn tiết kiệm thời gian và tìm thông tin hiệu quả trong TOEIC Reading.</p>
      
      <h3>1. Skimming (Đọc lướt)</h3>
      <h4>Định nghĩa:</h4>
      <p>Skimming là kỹ thuật đọc nhanh để nắm ý chính của đoạn văn, không cần hiểu chi tiết từng câu.</p>
      
      <h4>Khi nào sử dụng:</h4>
      <ul>
        <li>Đọc đoạn văn lần đầu để hiểu chủ đề chính</li>
        <li>Xác định cấu trúc và bố cục của bài đọc</li>
        <li>Tìm hiểu nội dung tổng quan trước khi làm câu hỏi</li>
      </ul>
      
      <h4>Cách thực hiện:</h4>
      <ul>
        <li>Đọc tiêu đề và đoạn đầu tiên cẩn thận</li>
        <li>Đọc câu đầu tiên của mỗi đoạn văn</li>
        <li>Chú ý đến từ khóa và cụm từ nổi bật</li>
        <li>Đọc đoạn kết luận</li>
        <li>Bỏ qua các chi tiết cụ thể</li>
      </ul>
      
      <h3>2. Scanning (Đọc tìm)</h3>
      <h4>Định nghĩa:</h4>
      <p>Scanning là kỹ thuật đọc tìm thông tin cụ thể trong văn bản một cách nhanh chóng.</p>
      
      <h4>Khi nào sử dụng:</h4>
      <ul>
        <li>Tìm số liệu, ngày tháng, tên riêng</li>
        <li>Trả lời câu hỏi chi tiết</li>
        <li>Xác định vị trí thông tin cần thiết</li>
      </ul>
      
      <h4>Cách thực hiện:</h4>
      <ul>
        <li>Xác định từ khóa trong câu hỏi</li>
        <li>Di chuyển mắt nhanh qua văn bản</li>
        <li>Dừng lại khi tìm thấy từ khóa</li>
        <li>Đọc kỹ câu chứa thông tin cần tìm</li>
        <li>Xác nhận đáp án</li>
      </ul>
      
      <h3>Áp dụng trong TOEIC Reading:</h3>
      
      <h4>Part 6 - Text Completion:</h4>
      <ul>
        <li>Skimming: Đọc lướt toàn bộ email/thư để hiểu chủ đề</li>
        <li>Scanning: Tìm từ khóa xung quanh chỗ trống</li>
      </ul>
      
      <h4>Part 7 - Reading Comprehension:</h4>
      <ul>
        <li>Skimming: Đọc lướt để hiểu loại văn bản và mục đích</li>
        <li>Scanning: Tìm thông tin cụ thể để trả lời câu hỏi</li>
      </ul>
    `,
    examples: [
      {
        english: "Question: When is the deadline for submitting applications?",
        vietnamese: "Câu hỏi: Khi nào là hạn nộp đơn đăng ký?",
        explanation: "Scanning - tìm từ khóa 'deadline', 'submitting', 'applications'"
      },
      {
        english: "Skimming: Read the first sentence of each paragraph to understand the main structure.",
        vietnamese: "Skimming: Đọc câu đầu tiên của mỗi đoạn để hiểu cấu trúc chính.",
        explanation: "Kỹ thuật đọc lướt để nắm ý chính"
      }
    ],
    tips: [
      "Luyện tập đọc nhanh hàng ngày với báo, tạp chí",
      "Không cần hiểu 100% từ vựng khi skimming",
      "Sử dụng kết hợp cả hai kỹ thuật trong một bài đọc",
      "Chú ý đến các từ nối để hiểu mối quan hệ giữa các ý"
    ]
  },

  'part1-strategies': {
    id: 'part1-strategies',
    title: 'Chiến lược Part 1 - Photos',
    description: 'Kỹ thuật làm bài hiệu quả cho phần mô tả hình ảnh',
    readTime: '10 phút',
    difficulty: 'Cơ bản',
    category: 'Listening Tips',
    tags: ['Listening', 'Part 1', 'Photos', 'Strategy'],
    content: `
      <h2>Chiến lược làm bài Part 1 - Photographs</h2>
      <p>Part 1 là phần dễ nhất trong TOEIC Listening với 6 câu hỏi mô tả hình ảnh. Việc áp dụng đúng chiến lược sẽ giúp bạn đạt điểm tối đa ở phần này.</p>
      
      <h3>Cấu trúc Part 1:</h3>
      <ul>
        <li>6 hình ảnh với 4 lựa chọn mỗi hình</li>
        <li>Chọn câu mô tả chính xác nhất cho hình ảnh</li>
        <li>Mỗi lựa chọn chỉ được nghe 1 lần</li>
        <li>Không có câu hỏi dạng văn bản</li>
      </ul>
      
      <h3>Chiến lược làm bài:</h3>
      
      <h4>1. Quan sát hình ảnh kỹ càng (30 giây)</h4>
      <ul>
        <li><strong>Người:</strong> Số lượng, giới tính, tuổi tác, trang phục, hành động</li>
        <li><strong>Vật:</strong> Loại vật, vị trí, màu sắc, kích thước</li>
        <li><strong>Địa điểm:</strong> Trong nhà/ngoài trời, văn phòng/nhà hàng/công viên</li>
        <li><strong>Hành động:</strong> Đang làm gì, đã làm gì, sắp làm gì</li>
      </ul>
      
      <h4>2. Dự đoán từ vựng có thể xuất hiện</h4>
      <ul>
        <li>Động từ miêu tả hành động</li>
        <li>Danh từ chỉ người, vật, địa điểm</li>
        <li>Tính từ mô tả trạng thái</li>
        <li>Giới từ chỉ vị trí</li>
      </ul>
      
      <h4>3. Lắng nghe và loại trừ đáp án</h4>
      <ul>
        <li>Loại bỏ ngay các đáp án sai về người/vật/địa điểm</li>
        <li>Chú ý các từ âm tương tự (sound-alike words)</li>
        <li>Tập trung vào hành động chính trong hình</li>
      </ul>
      
      <h3>Các dạng câu thường gặp:</h3>
      
      <h4>1. Miêu tả hành động đang diễn ra</h4>
      <p>Cấu trúc: S + be + V-ing</p>
      <p>Ví dụ: "A man is reading a newspaper."</p>
      
      <h4>2. Miêu tả vị trí</h4>
      <p>Cấu trúc: S + be + giới từ + địa điểm</p>
      <p>Ví dụ: "The books are on the shelf."</p>
      
      <h4>3. Miêu tả trạng thái</h4>
      <p>Cấu trúc: S + be + tính từ/quá khứ phân từ</p>
      <p>Ví dụ: "The door is closed."</p>
      
      <h3>Những lỗi thường gặp:</h3>
      <ul>
        <li>Chọn đáp án có từ âm tương tự với từ trong hình</li>
        <li>Tập trung vào chi tiết nhỏ thay vì hành động chính</li>
        <li>Không chú ý đến thì của động từ</li>
        <li>Bị nhiễu bởi các yếu tố không quan trọng</li>
      </ul>
      
      <h3>Từ vựng quan trọng:</h3>
      
      <h4>Hành động phổ biến:</h4>
      <ul>
        <li>walking, sitting, standing, talking</li>
        <li>working, reading, writing, typing</li>
        <li>eating, drinking, cooking</li>
        <li>shopping, buying, paying</li>
      </ul>
      
      <h4>Địa điểm thường gặp:</h4>
      <ul>
        <li>office, restaurant, park, street</li>
        <li>classroom, library, hospital</li>
        <li>kitchen, living room, bedroom</li>
      </ul>
    `,
    examples: [
      {
        english: "A woman is watering the plants in the garden.",
        vietnamese: "Một người phụ nữ đang tưới cây trong vườn.",
        explanation: "Miêu tả hành động đang diễn ra với present continuous"
      },
      {
        english: "Some documents are scattered on the desk.",
        vietnamese: "Một số tài liệu được rải rác trên bàn làm việc.",
        explanation: "Miêu tả trạng thái với passive voice"
      }
    ],
    tips: [
      "Quan sát hình ảnh trong thời gian nghe hướng dẫn",
      "Tập trung vào hành động chính, không phải chi tiết",
      "Chú ý phân biệt các từ có âm tương tự",
      "Luyện tập với nhiều loại hình ảnh khác nhau"
    ]
  }
};

// Export the topics for the main blog page
export const TOEIC_TOPICS = [
  {
    id: 'grammar',
    category: 'Grammar',
    icon: 'BookOpenIcon',
    color: 'blue',
    items: [
      TOEIC_KNOWLEDGE['tenses'],
      TOEIC_KNOWLEDGE['passive-voice']
    ]
  },
  {
    id: 'vocabulary',
    category: 'Vocabulary', 
    icon: 'AcademicCapIcon',
    color: 'green',
    items: [
      TOEIC_KNOWLEDGE['business-vocab']
    ]
  },
  {
    id: 'reading',
    category: 'Reading Tips',
    icon: 'ChatBubbleLeftRightIcon', 
    color: 'orange',
    items: [
      TOEIC_KNOWLEDGE['skimming-scanning']
    ]
  },
  {
    id: 'listening',
    category: 'Listening Tips',
    icon: 'EyeIcon',
    color: 'purple', 
    items: [
      TOEIC_KNOWLEDGE['part1-strategies']
    ]
  }
]; 