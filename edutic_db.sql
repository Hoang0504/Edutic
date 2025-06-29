-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th6 29, 2025 lúc 11:42 PM
-- Phiên bản máy phục vụ: 8.4.3
-- Phiên bản PHP: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `edutic_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ai_feedbacks`
--

CREATE TABLE `ai_feedbacks` (
  `id` int NOT NULL,
  `content_type` enum('voice_recording','writing_submission','exam_attempt') DEFAULT NULL,
  `content_id` int DEFAULT NULL,
  `feedback_text` text,
  `suggestions` text,
  `strengths` text,
  `weaknesses` text,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `ai_feedbacks`
--

INSERT INTO `ai_feedbacks` (`id`, `content_type`, `content_id`, `feedback_text`, `suggestions`, `strengths`, `weaknesses`, `created_at`) VALUES
(1, 'writing_submission', 1, 'Bài viết của bạn thể hiện một nỗ lực tốt trong việc mô tả cuộc sống mới tại Huế và công việc của bạn. Tuy nhiên, có một số lỗi ngữ pháp và từ vựng cần được cải thiện để bài viết trở nên mạch lạc và chuyên nghiệp hơn.', '1. Kiểm tra lại các lỗi ngữ pháp, đặc biệt là cách sử dụng thì động từ và cấu trúc câu. 2. Mở rộng vốn từ vựng để diễn đạt ý tưởng một cách chính xác hơn. 3. Sắp xếp các ý tưởng một cách logic hơn để tăng tính mạch lạc cho bài viết. 4. Chú ý đến các lỗi chính tả và dấu câu.', 'Bạn đã thành công trong việc truyền tải thông điệp chính về cuộc sống mới và công việc của mình. Bài viết có tính cá nhân cao và thể hiện được cảm xúc của bạn.', '1. Lỗi ngữ pháp như \'I getting lost\', \'the people here is friendly\', \'I still learning\'. 2. Từ vựng còn hạn chế, chưa thể hiện được sự đa dạng. 3. Bài viết thiếu sự liên kết giữa các ý, làm giảm tính mạch lạc. 4. Một số lỗi chính tả và dấu câu.', '2025-06-28 21:48:59');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ai_generated_contents`
--

CREATE TABLE `ai_generated_contents` (
  `id` int NOT NULL,
  `type` enum('question','part','exam','vocabulary','dictionary') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `content_id` varchar(255) DEFAULT NULL,
  `generated_text` text,
  `prompt_used` text,
  `created_at` datetime NOT NULL,
  `slug` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `answers`
--

CREATE TABLE `answers` (
  `id` int NOT NULL,
  `question_id` int NOT NULL,
  `content` text,
  `is_correct` tinyint(1) DEFAULT NULL,
  `explanation` text,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `answers`
--

INSERT INTO `answers` (`id`, `question_id`, `content`, `is_correct`, `explanation`, `created_at`) VALUES
(775, 212, 'A. She\'s eating in a picnic area.', 1, '', '2025-06-29 17:52:21'),
(776, 212, 'B. She\'s waiting in line at a food truck.', 0, '', '2025-06-29 17:52:21'),
(777, 212, 'C. She\'s wiping off a bench.', 0, '', '2025-06-29 17:52:21'),
(778, 212, 'D. She\'s throwing away a plate.', 0, '', '2025-06-29 17:52:21'),
(779, 213, 'A. The man is brushing snow off the roof of a car.', 1, '', '2025-06-29 17:52:21'),
(780, 213, 'B. The man is standing in the snow beside a car.', 0, '', '2025-06-29 17:52:21'),
(781, 213, 'C. The man is shoveling snow from a walkway.', 0, '', '2025-06-29 17:52:21'),
(782, 213, 'D. The man is running through the snow.', 0, '', '2025-06-29 17:52:21'),
(783, 214, 'A. Some workers are hanging art in a gallery.', 0, '', '2025-06-29 17:52:21'),
(784, 214, 'B. Two of the people are having a conversation.', 1, '', '2025-06-29 17:52:21'),
(785, 214, 'C. One of the men is rearranging cushions on a sofa.', 0, '', '2025-06-29 17:52:21'),
(786, 214, 'D. One of the men is painting a picture.', 0, '', '2025-06-29 17:52:21'),
(787, 215, 'A. Vehicles are entering a parking garage.', 0, '', '2025-06-29 17:52:21'),
(788, 215, 'B. Clothes hangers are scattered on the ground.', 0, '', '2025-06-29 17:52:21'),
(789, 215, 'C. Empty racks are lined up next to a building.', 0, '', '2025-06-29 17:52:21'),
(790, 215, 'D. Clothing is being displayed under a tent.', 1, '', '2025-06-29 17:52:21'),
(791, 216, 'A. Potted plants have been suspended from a ceiling.', 0, '', '2025-06-29 17:52:21'),
(792, 216, 'B. Chairs have been stacked in front of an entryway.', 0, '', '2025-06-29 17:52:21'),
(793, 216, 'C. A computer station has been set up on a desk.', 1, '', '2025-06-29 17:52:21'),
(794, 216, 'D. A rug has been rolled up against a wall.', 0, '', '2025-06-29 17:52:21'),
(795, 217, 'A. One of the men is sweeping a patio.', 0, '', '2025-06-29 17:52:21'),
(796, 217, 'B. One of the men is replacing some flooring.', 0, '', '2025-06-29 17:52:21'),
(797, 217, 'C. A door has been taken off its frame.', 1, '', '2025-06-29 17:52:21'),
(798, 217, 'D. A light fixture has been left on the ground.', 0, '', '2025-06-29 17:52:21'),
(799, 218, 'A. To ship some materials', 0, '', '2025-06-29 17:52:21'),
(800, 218, 'B. About ten years old', 1, '', '2025-06-29 17:52:21'),
(801, 218, 'C. Company offices, I think.', 0, '', '2025-06-29 17:52:21'),
(802, 219, 'A. I’m sorry I was late for the meeting.', 0, '', '2025-06-29 17:52:21'),
(803, 219, 'B. Mostly just local musicians.', 0, '', '2025-06-29 17:52:21'),
(804, 219, 'C. Sure, I’ll be there!', 1, '', '2025-06-29 17:52:21'),
(805, 220, 'A. That’s what you do for a living.', 0, '', '2025-06-29 17:52:21'),
(806, 220, 'B. Submit your assignment here.', 0, '', '2025-06-29 17:52:21'),
(807, 220, 'C. It came from the tenants in B23.', 1, '', '2025-06-29 17:52:21'),
(808, 221, 'A. Of course, I’ll take care of it.', 1, '', '2025-06-29 17:52:21'),
(809, 221, 'B. An e-mail receipt.', 0, '', '2025-06-29 17:52:21'),
(810, 221, 'C. Could I get change for a dollar?', 0, '', '2025-06-29 17:52:21'),
(811, 222, 'A. No, he didn’t.', 0, '', '2025-06-29 17:52:21'),
(812, 222, 'B. From three o’clock until four.', 0, '', '2025-06-29 17:52:21'),
(813, 222, 'C. Because a light needed to be fixed.', 1, '', '2025-06-29 17:52:21'),
(814, 223, 'A. Put it on the highest shelf.', 0, '', '2025-06-29 17:52:21'),
(815, 223, 'B. The personnel department.', 0, '', '2025-06-29 17:52:21'),
(816, 223, 'C. Yes, they chose Jacob Borgman.', 1, '', '2025-06-29 17:52:21'),
(817, 224, 'A. He went there yesterday.', 0, '', '2025-06-29 17:52:21'),
(818, 224, 'B. Well, maybe a sandwich.', 0, '', '2025-06-29 17:52:21'),
(819, 224, 'C. Let’s eat here.', 1, '', '2025-06-29 17:52:21'),
(820, 225, 'A. Yes, I would agree.', 0, '', '2025-06-29 17:52:21'),
(821, 225, 'B. No, I’ll send it now.', 1, '', '2025-06-29 17:52:21'),
(822, 225, 'C. Check the employee manual.', 0, '', '2025-06-29 17:52:21'),
(823, 226, 'A. There’s a lot of rain in the forecast.', 1, '', '2025-06-29 17:52:21'),
(824, 226, 'B. Sure, I like salad.', 0, '', '2025-06-29 17:52:21'),
(825, 226, 'C. At the end of this corridor.', 0, '', '2025-06-29 17:52:21'),
(826, 227, 'A. Just water, please.', 1, '', '2025-06-29 17:52:21'),
(827, 227, 'B. For a few dollars more.', 0, '', '2025-06-29 17:52:21'),
(828, 227, 'C. A fifteen-minute break.', 0, '', '2025-06-29 17:52:21'),
(829, 228, 'A. That’s excellent news!', 1, '', '2025-06-29 17:52:21'),
(830, 228, 'B. A few times a day.', 0, '', '2025-06-29 17:52:21'),
(831, 228, 'C. To the end of April.', 0, '', '2025-06-29 17:52:21'),
(832, 229, 'A. It turned out well.', 0, '', '2025-06-29 17:52:21'),
(833, 229, 'B. Yes, I did find one.', 0, '', '2025-06-29 17:52:21'),
(834, 229, 'C. About once a month.', 1, '', '2025-06-29 17:52:21'),
(835, 230, 'A. This seat is available.', 0, '', '2025-06-29 17:52:21'),
(836, 230, 'B. I didn’t bring boots.', 1, '', '2025-06-29 17:52:21'),
(837, 230, 'C. At the visitors’ center.', 0, '', '2025-06-29 17:52:21'),
(838, 231, 'A. Very enjoyable, thanks.', 0, '', '2025-06-29 17:52:21'),
(839, 231, 'B. He usually takes the train.', 0, '', '2025-06-29 17:52:21'),
(840, 231, 'C. Yes, I made a reservation last week.', 1, '', '2025-06-29 17:52:21'),
(841, 232, 'A. It’s sold out.', 1, '', '2025-06-29 17:52:21'),
(842, 232, 'B. He’s a concert violinist.', 0, '', '2025-06-29 17:52:21'),
(843, 232, 'C. They already left.', 0, '', '2025-06-29 17:52:21'),
(844, 233, 'A. Can I take your order?', 0, '', '2025-06-29 17:52:21'),
(845, 233, 'B. I haven’t had the chance.', 1, '', '2025-06-29 17:52:21'),
(846, 233, 'C. About 40 dollars.', 0, '', '2025-06-29 17:52:21'),
(847, 234, 'A. Only with fruits and vegetables.', 0, '', '2025-06-29 17:52:21'),
(848, 234, 'B. In the kitchen cabinet.', 0, '', '2025-06-29 17:52:21'),
(849, 234, 'C. The prototype is still being tested.', 1, '', '2025-06-29 17:52:21'),
(850, 235, 'A. They decided to drive.', 1, '', '2025-06-29 17:52:21'),
(851, 235, 'B. At terminal 2.', 0, '', '2025-06-29 17:52:21'),
(852, 235, 'C. It’s a marketing position.', 0, '', '2025-06-29 17:52:21'),
(853, 236, 'A. About three liters of water.', 0, '', '2025-06-29 17:52:21'),
(854, 236, 'B. No, I didn’t check out the sale.', 0, '', '2025-06-29 17:52:21'),
(855, 236, 'C. I needed some for a large bouquet.', 1, '', '2025-06-29 17:52:21'),
(856, 237, 'A. Why don’t we go see it?', 1, '', '2025-06-29 17:52:21'),
(857, 237, 'B. After the announcement.', 0, '', '2025-06-29 17:52:21'),
(858, 237, 'C. He made a great speech.', 0, '', '2025-06-29 17:52:21'),
(859, 238, 'A. Thanks, but I can’t swim.', 0, '', '2025-06-29 17:52:21'),
(860, 238, 'B. Clara’s already organizing one.', 1, '', '2025-06-29 17:52:21'),
(861, 238, 'C. It’s a very interesting article.', 0, '', '2025-06-29 17:52:21'),
(862, 239, 'A. We just sent an e-mail to all instructors.', 1, '', '2025-06-29 17:52:21'),
(863, 239, 'B. Five to seven months.', 0, '', '2025-06-29 17:52:21'),
(864, 239, 'C. Yes, it’s a beautiful building.', 0, '', '2025-06-29 17:52:21'),
(865, 240, 'A. The new shopping mall.', 0, '', '2025-06-29 17:52:21'),
(866, 240, 'B. Yes, they come in other colors.', 0, '', '2025-06-29 17:52:21'),
(867, 240, 'C. Our spring merchandise is arriving soon.', 1, '', '2025-06-29 17:52:21'),
(868, 241, 'A. Thank you for meeting me.', 0, '', '2025-06-29 17:52:21'),
(869, 241, 'B. A contact lens prescription.', 0, '', '2025-06-29 17:52:21'),
(870, 241, 'C. I have very limited time.', 1, '', '2025-06-29 17:52:21'),
(871, 242, 'A. No, at ten a.m.', 0, '', '2025-06-29 17:52:21'),
(872, 242, 'B. I really like working with computers.', 1, '', '2025-06-29 17:52:21'),
(873, 242, 'C. Just a résumé is needed.', 0, '', '2025-06-29 17:52:21'),
(874, 243, 'A. A job fair', 0, '', '2025-06-29 17:52:21'),
(875, 243, 'B. A cooking class', 0, '', '2025-06-29 17:52:21'),
(876, 243, 'C. A fund-raiser', 0, '', '2025-06-29 17:52:21'),
(877, 243, 'D. A company picnic', 1, '', '2025-06-29 17:52:21'),
(878, 244, 'A. A guest list', 0, '', '2025-06-29 17:52:21'),
(879, 244, 'B. A dessert recipe', 1, '', '2025-06-29 17:52:21'),
(880, 244, 'C. A business card', 0, '', '2025-06-29 17:52:21'),
(881, 244, 'D. A promotional code', 0, '', '2025-06-29 17:52:21'),
(882, 245, 'A. Returning some merchandise', 0, '', '2025-06-29 17:52:21'),
(883, 245, 'B. Watching a video', 1, '', '2025-06-29 17:52:21'),
(884, 245, 'C. Creating an account', 0, '', '2025-06-29 17:52:21'),
(885, 245, 'D. Reading a review', 0, '', '2025-06-29 17:52:21'),
(886, 246, 'A. Accounting', 1, '', '2025-06-29 17:52:21'),
(887, 246, 'B. Research and development', 0, '', '2025-06-29 17:52:21'),
(888, 246, 'C. Maintenance', 0, '', '2025-06-29 17:52:21'),
(889, 246, 'D. Marketing', 0, '', '2025-06-29 17:52:21'),
(890, 247, 'A. A report has not been submitted.', 0, '', '2025-06-29 17:52:21'),
(891, 247, 'B. An invoice is not accurate.', 0, '', '2025-06-29 17:52:21'),
(892, 247, 'C. A policy has not been followed.', 1, '', '2025-06-29 17:52:21'),
(893, 247, 'D. An order has not been delivered.', 0, '', '2025-06-29 17:52:21'),
(894, 248, 'A. Delete an electronic file', 0, '', '2025-06-29 17:52:21'),
(895, 248, 'B. Authorize a reimbursement', 1, '', '2025-06-29 17:52:21'),
(896, 248, 'C. Set up a sales meeting', 0, '', '2025-06-29 17:52:21'),
(897, 248, 'D. Review a spreadsheet', 0, '', '2025-06-29 17:52:21'),
(898, 249, 'A. Shipping', 1, '', '2025-06-29 17:52:21'),
(899, 249, 'B. Manufacturing', 0, '', '2025-06-29 17:52:21'),
(900, 249, 'C. Hospitality', 0, '', '2025-06-29 17:52:21'),
(901, 249, 'D. Meteorology', 0, '', '2025-06-29 17:52:21'),
(902, 250, 'A. A schedule was written incorrectly.', 0, '', '2025-06-29 17:52:21'),
(903, 250, 'B. Some equipment is not properly set up.', 0, '', '2025-06-29 17:52:21'),
(904, 250, 'C. Weather conditions are poor.', 1, '', '2025-06-29 17:52:21'),
(905, 250, 'D. Several staff members are absent.', 0, '', '2025-06-29 17:52:21'),
(906, 251, 'A. Update a shift schedule', 0, '', '2025-06-29 17:52:21'),
(907, 251, 'B. Clear a work space', 0, '', '2025-06-29 17:52:21'),
(908, 251, 'C. Complete a checklist', 0, '', '2025-06-29 17:52:21'),
(909, 251, 'D. Place a call', 1, '', '2025-06-29 17:52:21'),
(910, 252, 'A. To celebrate a retirement', 0, '', '2025-06-29 17:52:21'),
(911, 252, 'B. To perform an inspection', 0, '', '2025-06-29 17:52:21'),
(912, 252, 'C. To meet with some clients', 1, '', '2025-06-29 17:52:21'),
(913, 252, 'D. To write an article', 0, '', '2025-06-29 17:52:21'),
(914, 253, 'A. She is unable to accept an invitation.', 0, '', '2025-06-29 17:52:21'),
(915, 253, 'B. A cooling system is not working.', 0, '', '2025-06-29 17:52:21'),
(916, 253, 'C. A meeting will end soon.', 0, '', '2025-06-29 17:52:21'),
(917, 253, 'D. She wants to change a seating request.', 1, '', '2025-06-29 17:52:21'),
(918, 254, 'A. It is free for customers.', 1, '', '2025-06-29 17:52:21'),
(919, 254, 'B. It is under construction.', 0, '', '2025-06-29 17:52:21'),
(920, 254, 'C. It closes soon.', 0, '', '2025-06-29 17:52:21'),
(921, 254, 'D. It offers monthly contracts.', 0, '', '2025-06-29 17:52:21'),
(922, 255, 'A. At a university', 0, '', '2025-06-29 17:52:21'),
(923, 255, 'B. At a publishing company', 0, '', '2025-06-29 17:52:21'),
(924, 255, 'C. At an electronics store', 1, '', '2025-06-29 17:52:21'),
(925, 255, 'D. At a grocery store', 0, '', '2025-06-29 17:52:21'),
(926, 256, 'A. How much an item costs', 0, '', '2025-06-29 17:52:21'),
(927, 256, 'B. When an event will begin', 0, '', '2025-06-29 17:52:21'),
(928, 256, 'C. How many people will participate', 0, '', '2025-06-29 17:52:21'),
(929, 256, 'D. Where to set up some equipment', 1, '', '2025-06-29 17:52:21'),
(930, 257, 'A. Offering a discount', 0, '', '2025-06-29 17:52:21'),
(931, 257, 'B. Displaying informational materials', 1, '', '2025-06-29 17:52:21'),
(932, 257, 'C. Holding a contest', 0, '', '2025-06-29 17:52:21'),
(933, 257, 'D. Visiting a registration table', 0, '', '2025-06-29 17:52:21'),
(934, 258, 'A. Textile manufacturing', 0, '', '2025-06-29 17:52:21'),
(935, 258, 'B. Food production', 1, '', '2025-06-29 17:52:21'),
(936, 258, 'C. Health care', 0, '', '2025-06-29 17:52:21'),
(937, 258, 'D. Hospitality', 0, '', '2025-06-29 17:52:21'),
(938, 259, 'A. Lack of qualified personnel', 0, '', '2025-06-29 17:52:21'),
(939, 259, 'B. Rising production costs', 0, '', '2025-06-29 17:52:21'),
(940, 259, 'C. Changes in consumer preferences', 1, '', '2025-06-29 17:52:21'),
(941, 259, 'D. Increased competition', 0, '', '2025-06-29 17:52:21'),
(942, 260, 'A. Research more information', 1, '', '2025-06-29 17:52:21'),
(943, 260, 'B. Negotiate a discount', 0, '', '2025-06-29 17:52:21'),
(944, 260, 'C. Upgrade some machinery', 0, '', '2025-06-29 17:52:21'),
(945, 260, 'D. Train a new employee', 0, '', '2025-06-29 17:52:21'),
(946, 261, 'A. To explain a business merger', 0, '', '2025-06-29 17:52:21'),
(947, 261, 'B. To describe a new company policy', 0, '', '2025-06-29 17:52:21'),
(948, 261, 'C. To offer the woman a work assignment', 1, '', '2025-06-29 17:52:21'),
(949, 261, 'D. To invite the woman to speak at a conference', 0, '', '2025-06-29 17:52:21'),
(950, 262, 'A. Purchasing another business', 0, '', '2025-06-29 17:52:21'),
(951, 262, 'B. Finding a new office space', 0, '', '2025-06-29 17:52:21'),
(952, 262, 'C. Revising a budget proposal', 0, '', '2025-06-29 17:52:21'),
(953, 262, 'D. Creating a marketing campaign', 1, '', '2025-06-29 17:52:21'),
(954, 263, 'A. A project description', 1, '', '2025-06-29 17:52:21'),
(955, 263, 'B. An event invitation', 0, '', '2025-06-29 17:52:21'),
(956, 263, 'C. Some social media links', 0, '', '2025-06-29 17:52:21'),
(957, 263, 'D. Some contact information', 0, '', '2025-06-29 17:52:21'),
(958, 264, 'A. A vehicle is out of service', 1, '', '2025-06-29 17:52:21'),
(959, 264, 'B. An employee is late', 0, '', '2025-06-29 17:52:21'),
(960, 264, 'C. A shipment was damaged', 0, '', '2025-06-29 17:52:21'),
(961, 264, 'D. Traffic is heavy', 0, '', '2025-06-29 17:52:21'),
(962, 265, 'A. At a recording studio', 0, '', '2025-06-29 17:52:21'),
(963, 265, 'B. At a catering company', 1, '', '2025-06-29 17:52:21'),
(964, 265, 'C. At a radio station', 0, '', '2025-06-29 17:52:21'),
(965, 265, 'D. At a car dealership', 0, '', '2025-06-29 17:52:21'),
(966, 266, 'A. Arrange for a car repair', 0, '', '2025-06-29 17:52:21'),
(967, 266, 'B. Order some kitchen supplies', 0, '', '2025-06-29 17:52:21'),
(968, 266, 'C. Carry some items', 1, '', '2025-06-29 17:52:21'),
(969, 266, 'D. Offer a refund', 0, '', '2025-06-29 17:52:21'),
(970, 267, 'A. To plan a company event', 0, '', '2025-06-29 17:52:21'),
(971, 267, 'B. To confirm a work deadline', 0, '', '2025-06-29 17:52:21'),
(972, 267, 'C. To discuss a career path', 1, '', '2025-06-29 17:52:21'),
(973, 267, 'D. To accept a job offer', 0, '', '2025-06-29 17:52:21'),
(974, 268, 'A. A newspaper editor', 1, '', '2025-06-29 17:52:21'),
(975, 268, 'B. A university professor', 0, '', '2025-06-29 17:52:21'),
(976, 268, 'C. A delivery person', 0, '', '2025-06-29 17:52:21'),
(977, 268, 'D. A professional actor', 0, '', '2025-06-29 17:52:21'),
(978, 269, 'A. Negotiate a contract', 0, '', '2025-06-29 17:52:21'),
(979, 269, 'B. Explain an office policy', 0, '', '2025-06-29 17:52:21'),
(980, 269, 'C. Review a résumé', 0, '', '2025-06-29 17:52:21'),
(981, 269, 'D. Describe a work schedule', 1, '', '2025-06-29 17:52:21'),
(982, 270, 'A. A new transportation route', 0, '', '2025-06-29 17:52:21'),
(983, 270, 'B. A company merger', 1, '', '2025-06-29 17:52:21'),
(984, 270, 'C. A public relations initiative', 0, '', '2025-06-29 17:52:21'),
(985, 270, 'D. A medical facility design', 0, '', '2025-06-29 17:52:21'),
(986, 271, 'A. To express doubt', 1, '', '2025-06-29 17:52:21'),
(987, 271, 'B. To explain a process', 0, '', '2025-06-29 17:52:21'),
(988, 271, 'C. To make a recommendation', 0, '', '2025-06-29 17:52:21'),
(989, 271, 'D. To update some information', 0, '', '2025-06-29 17:52:21'),
(990, 272, 'A. Paying a certification fee', 0, '', '2025-06-29 17:52:21'),
(991, 272, 'B. Training additional staff', 0, '', '2025-06-29 17:52:21'),
(992, 272, 'C. Upgrading some technology', 0, '', '2025-06-29 17:52:21'),
(993, 272, 'D. Relocating to another city', 1, '', '2025-06-29 17:52:21'),
(994, 273, 'A. Donors', 0, '', '2025-06-29 17:52:21'),
(995, 273, 'B. Volunteers', 0, '', '2025-06-29 17:52:21'),
(996, 273, 'C. Employees', 1, '', '2025-06-29 17:52:21'),
(997, 273, 'D. Clients', 0, '', '2025-06-29 17:52:21'),
(998, 274, 'A. $21', 0, '', '2025-06-29 17:52:21'),
(999, 274, 'B. $18', 0, '', '2025-06-29 17:52:21'),
(1000, 274, 'C. $24', 1, '', '2025-06-29 17:52:21'),
(1001, 274, 'D. $15', 0, '', '2025-06-29 17:52:21'),
(1002, 275, 'A. A graphic file', 1, '', '2025-06-29 17:52:21'),
(1003, 275, 'B. A list of names', 0, '', '2025-06-29 17:52:21'),
(1004, 275, 'C. A delivery address', 0, '', '2025-06-29 17:52:21'),
(1005, 275, 'D. An account number', 0, '', '2025-06-29 17:52:21'),
(1006, 276, 'A. Clay sculptures', 0, '', '2025-06-29 17:52:21'),
(1007, 276, 'B. Oil paintings', 0, '', '2025-06-29 17:52:21'),
(1008, 276, 'C. Black-and-white photographs', 0, '', '2025-06-29 17:52:21'),
(1009, 276, 'D. Pencil drawings', 1, '', '2025-06-29 17:52:21'),
(1010, 277, 'A. A Careful Glance', 0, '', '2025-06-29 17:52:21'),
(1011, 277, 'B. Promises', 0, '', '2025-06-29 17:52:21'),
(1012, 277, 'C. Stormy Sea', 1, '', '2025-06-29 17:52:21'),
(1013, 277, 'D. The Moment', 0, '', '2025-06-29 17:52:21'),
(1014, 278, 'A. Speak with an artist', 0, '', '2025-06-29 17:52:21'),
(1015, 278, 'B. Edit a recording', 1, '', '2025-06-29 17:52:21'),
(1016, 278, 'C. Clean a gallery space', 0, '', '2025-06-29 17:52:21'),
(1017, 278, 'D. Greet some visitors', 0, '', '2025-06-29 17:52:21'),
(1018, 279, 'A. Urban planners', 0, '', '2025-06-29 17:52:21'),
(1019, 279, 'B. Journalists', 1, '', '2025-06-29 17:52:21'),
(1020, 279, 'C. Engineers', 0, '', '2025-06-29 17:52:21'),
(1021, 279, 'D. Environmental scientists', 0, '', '2025-06-29 17:52:21'),
(1022, 280, 'A. Site A', 0, '', '2025-06-29 17:52:21'),
(1023, 280, 'B. Site B', 0, '', '2025-06-29 17:52:21'),
(1024, 280, 'C. Site C', 0, '', '2025-06-29 17:52:21'),
(1025, 280, 'D. Site D', 1, '', '2025-06-29 17:52:21'),
(1026, 281, 'A. Work opportunities', 1, '', '2025-06-29 17:52:21'),
(1027, 281, 'B. Wind turbine costs', 0, '', '2025-06-29 17:52:21'),
(1028, 281, 'C. Supply chain issues', 0, '', '2025-06-29 17:52:21'),
(1029, 281, 'D. Power capacity', 0, '', '2025-06-29 17:52:21'),
(1030, 282, 'A. A city mayor’s office', 0, '', '2025-06-29 17:52:21'),
(1031, 282, 'B. A maintenance department', 0, '', '2025-06-29 17:52:21'),
(1032, 282, 'C. An automobile dealership', 0, '', '2025-06-29 17:52:21'),
(1033, 282, 'D. A building management office', 1, '', '2025-06-29 17:52:21'),
(1034, 283, 'A. Move their vehicles', 1, '', '2025-06-29 17:52:21'),
(1035, 283, 'B. Pay their parking fines', 0, '', '2025-06-29 17:52:21'),
(1036, 283, 'C. Use an alternate entrance', 0, '', '2025-06-29 17:52:21'),
(1037, 283, 'D. Participate in a meeting', 0, '', '2025-06-29 17:52:21'),
(1038, 284, 'A. An election ballot', 0, '', '2025-06-29 17:52:21'),
(1039, 284, 'B. A maintenance plan', 0, '', '2025-06-29 17:52:21'),
(1040, 284, 'C. A map', 1, '', '2025-06-29 17:52:21'),
(1041, 284, 'D. A coupon', 0, '', '2025-06-29 17:52:21'),
(1042, 285, 'A. Garden landscaping', 0, '', '2025-06-29 17:52:21'),
(1043, 285, 'B. Window installation', 0, '', '2025-06-29 17:52:21'),
(1044, 285, 'C. Roof maintenance', 1, '', '2025-06-29 17:52:21'),
(1045, 285, 'D. Kitchen renovations', 0, '', '2025-06-29 17:52:21'),
(1046, 286, 'A. They should be cleaned regularly', 0, '', '2025-06-29 17:52:21'),
(1047, 286, 'B. They should be of high quality', 1, '', '2025-06-29 17:52:21'),
(1048, 286, 'C. They were recently invented', 0, '', '2025-06-29 17:52:21'),
(1049, 286, 'D. They can be easily stored', 0, '', '2025-06-29 17:52:21'),
(1050, 287, 'A. Treating some wood', 0, '', '2025-06-29 17:52:21'),
(1051, 287, 'B. Consulting an electrician', 0, '', '2025-06-29 17:52:21'),
(1052, 287, 'C. Taking some photos', 1, '', '2025-06-29 17:52:21'),
(1053, 287, 'D. Draining some water', 0, '', '2025-06-29 17:52:21'),
(1054, 288, 'A. A radio show host', 0, '', '2025-06-29 17:52:21'),
(1055, 288, 'B. A tour guide', 1, '', '2025-06-29 17:52:21'),
(1056, 288, 'C. A sales associate', 0, '', '2025-06-29 17:52:21'),
(1057, 288, 'D. A professor', 0, '', '2025-06-29 17:52:21'),
(1058, 289, 'A. A lecture will begin', 1, '', '2025-06-29 17:52:21'),
(1059, 289, 'B. A demonstration will be given', 0, '', '2025-06-29 17:52:21'),
(1060, 289, 'C. An interview will be conducted', 0, '', '2025-06-29 17:52:21'),
(1061, 289, 'D. A park will close', 0, '', '2025-06-29 17:52:21'),
(1062, 290, 'A. A book', 0, '', '2025-06-29 17:52:21'),
(1063, 290, 'B. An album', 0, '', '2025-06-29 17:52:21'),
(1064, 290, 'C. A film', 1, '', '2025-06-29 17:52:21'),
(1065, 290, 'D. A magazine', 0, '', '2025-06-29 17:52:21'),
(1066, 291, 'A. A fund-raising concert', 1, '', '2025-06-29 17:52:21'),
(1067, 291, 'B. A sports competition', 0, '', '2025-06-29 17:52:21'),
(1068, 291, 'C. A play rehearsal', 0, '', '2025-06-29 17:52:21'),
(1069, 291, 'D. An awards ceremony', 0, '', '2025-06-29 17:52:21'),
(1070, 292, 'A. Change a policy', 0, '', '2025-06-29 17:52:21'),
(1071, 292, 'B. Repair a building', 1, '', '2025-06-29 17:52:21'),
(1072, 292, 'C. Select a winner', 0, '', '2025-06-29 17:52:21'),
(1073, 292, 'D. Sponsor a team', 0, '', '2025-06-29 17:52:21'),
(1074, 293, 'A. Order tickets early', 0, '', '2025-06-29 17:52:21'),
(1075, 293, 'B. Visit a community center', 0, '', '2025-06-29 17:52:21'),
(1076, 293, 'C. Purchase refreshments', 1, '', '2025-06-29 17:52:21'),
(1077, 293, 'D. Donate clothing', 0, '', '2025-06-29 17:52:21'),
(1078, 294, 'A. Time management', 1, '', '2025-06-29 17:52:21'),
(1079, 294, 'B. Public speaking', 0, '', '2025-06-29 17:52:21'),
(1080, 294, 'C. Leadership skills', 0, '', '2025-06-29 17:52:21'),
(1081, 294, 'D. Professional networking', 0, '', '2025-06-29 17:52:21'),
(1082, 295, 'A. A guest speaker has just arrived', 0, '', '2025-06-29 17:52:21'),
(1083, 295, 'B. Assistance is available', 1, '', '2025-06-29 17:52:21'),
(1084, 295, 'C. Attendees should speak clearly and loudly', 0, '', '2025-06-29 17:52:21'),
(1085, 295, 'D. An extra chair should be provided', 0, '', '2025-06-29 17:52:21'),
(1086, 296, 'A. Sign their names on a list', 0, '', '2025-06-29 17:52:21'),
(1087, 296, 'B. Take a break', 0, '', '2025-06-29 17:52:21'),
(1088, 296, 'C. Participate in an introductory activity', 1, '', '2025-06-29 17:52:21'),
(1089, 296, 'D. Fill out a questionnaire', 0, '', '2025-06-29 17:52:21'),
(1090, 297, 'A. Its defensive walls', 0, '', '2025-06-29 17:52:21'),
(1091, 297, 'B. Its royal inhabitants', 0, '', '2025-06-29 17:52:21'),
(1092, 297, 'C. An event that happened there', 0, '', '2025-06-29 17:52:21'),
(1093, 297, 'D. Some artwork', 1, '', '2025-06-29 17:52:21'),
(1094, 298, 'A. The listeners cannot take pictures', 1, '', '2025-06-29 17:52:21'),
(1095, 298, 'B. An area is closed to the listeners', 0, '', '2025-06-29 17:52:21'),
(1096, 298, 'C. There is no gift shop', 0, '', '2025-06-29 17:52:21'),
(1097, 298, 'D. A tour started late', 0, '', '2025-06-29 17:52:21'),
(1098, 299, 'A. Show their tickets', 0, '', '2025-06-29 17:52:21'),
(1099, 299, 'B. Put on protective clothing', 0, '', '2025-06-29 17:52:21'),
(1100, 299, 'C. Use some handrails', 1, '', '2025-06-29 17:52:21'),
(1101, 299, 'D. Speak quietly', 0, '', '2025-06-29 17:52:21'),
(1102, 300, 'A. An advertising campaign', 1, '', '2025-06-29 17:52:21'),
(1103, 300, 'B. A market expansion', 0, '', '2025-06-29 17:52:21'),
(1104, 300, 'C. Some contract negotiations', 0, '', '2025-06-29 17:52:21'),
(1105, 300, 'D. Some audit procedures', 0, '', '2025-06-29 17:52:21'),
(1106, 301, 'A. Overtime pay has been approved.', 0, '', '2025-06-29 17:52:21'),
(1107, 301, 'B. A deadline must be met.', 1, '', '2025-06-29 17:52:21'),
(1108, 301, 'C. A client expressed concern.', 0, '', '2025-06-29 17:52:21'),
(1109, 301, 'D. A supervisor will be observing closely.', 0, '', '2025-06-29 17:52:21'),
(1110, 302, 'A. View a presentation', 0, '', '2025-06-29 17:52:21'),
(1111, 302, 'B. Review a budget', 0, '', '2025-06-29 17:52:21'),
(1112, 302, 'C. Revise some work', 1, '', '2025-06-29 17:52:21'),
(1113, 302, 'D. Do some research', 0, '', '2025-06-29 17:52:21'),
(1114, 303, 'A. At a hospital', 1, '', '2025-06-29 17:52:21'),
(1115, 303, 'B. At a restaurant', 0, '', '2025-06-29 17:52:21'),
(1116, 303, 'C. At a grocery store', 0, '', '2025-06-29 17:52:21'),
(1117, 303, 'D. At an electronics store', 0, '', '2025-06-29 17:52:21'),
(1118, 304, 'A. To make a request', 0, '', '2025-06-29 17:52:21'),
(1119, 304, 'B. To address staff complaints', 1, '', '2025-06-29 17:52:21'),
(1120, 304, 'C. To present a new schedule', 0, '', '2025-06-29 17:52:21'),
(1121, 304, 'D. To explain a technical process', 0, '', '2025-06-29 17:52:21'),
(1122, 305, 'A. A process has not been followed', 0, '', '2025-06-29 17:52:21'),
(1123, 305, 'B. The listeners may be asked to work extra shifts', 0, '', '2025-06-29 17:52:21'),
(1124, 305, 'C. The listeners should contact a manager', 0, '', '2025-06-29 17:52:21'),
(1125, 305, 'D. A change will not be immediate', 1, '', '2025-06-29 17:52:21'),
(1126, 306, 'A. A company reorganization', 0, '', '2025-06-29 17:52:21'),
(1127, 306, 'B. A park renovation', 1, '', '2025-06-29 17:52:21'),
(1128, 306, 'C. A volunteer training', 0, '', '2025-06-29 17:52:21'),
(1129, 306, 'D. A conservation project', 0, '', '2025-06-29 17:52:21'),
(1130, 307, 'A. Location 1', 1, '', '2025-06-29 17:52:21'),
(1131, 307, 'B. Location 2', 0, '', '2025-06-29 17:52:21'),
(1132, 307, 'C. Location 3', 0, '', '2025-06-29 17:52:21'),
(1133, 307, 'D. Location 4', 0, '', '2025-06-29 17:52:21'),
(1134, 308, 'A. Complete a survey', 0, '', '2025-06-29 17:52:21'),
(1135, 308, 'B. Donate some money', 0, '', '2025-06-29 17:52:21'),
(1136, 308, 'C. Join an organization', 0, '', '2025-06-29 17:52:21'),
(1137, 308, 'D. Post some photographs', 1, '', '2025-06-29 17:52:21'),
(1138, 309, 'A. When to harvest crops', 0, '', '2025-06-29 17:52:21'),
(1139, 309, 'B. Where to plant trees', 0, '', '2025-06-29 17:52:21'),
(1140, 309, 'C. How to grow vegetables', 1, '', '2025-06-29 17:52:21'),
(1141, 309, 'D. Which flowers need more sun', 0, '', '2025-06-29 17:52:21'),
(1142, 310, 'A. 12 inches', 1, '', '2025-06-29 17:52:21'),
(1143, 310, 'B. 4 inches', 0, '', '2025-06-29 17:52:21'),
(1144, 310, 'C. 6 inches', 0, '', '2025-06-29 17:52:21'),
(1145, 310, 'D. 8 inches', 0, '', '2025-06-29 17:52:21'),
(1146, 311, 'A. Turn off mobile phones', 0, '', '2025-06-29 17:52:21'),
(1147, 311, 'B. Have some refreshments', 0, '', '2025-06-29 17:52:21'),
(1148, 311, 'C. Purchase some seeds', 0, '', '2025-06-29 17:52:21'),
(1149, 311, 'D. Sign up for a mailing list', 1, '', '2025-06-29 17:52:21'),
(1150, 312, 'A. he', 0, '', '2025-06-29 17:52:21'),
(1151, 312, 'B. his', 1, '', '2025-06-29 17:52:21'),
(1152, 312, 'C. him', 0, '', '2025-06-29 17:52:21'),
(1153, 312, 'D. himself', 0, '', '2025-06-29 17:52:21'),
(1154, 313, 'A. connectivity', 0, '', '2025-06-29 17:52:21'),
(1155, 313, 'B. connects', 0, '', '2025-06-29 17:52:21'),
(1156, 313, 'C. connect', 0, '', '2025-06-29 17:52:21'),
(1157, 313, 'D. connecting', 1, '', '2025-06-29 17:52:21'),
(1158, 314, 'A. eaten', 0, '', '2025-06-29 17:52:21'),
(1159, 314, 'B. open', 0, '', '2025-06-29 17:52:21'),
(1160, 314, 'C. tasty', 1, '', '2025-06-29 17:52:21'),
(1161, 314, 'D. free', 0, '', '2025-06-29 17:52:21'),
(1162, 315, 'A. paints', 0, '', '2025-06-29 17:52:21'),
(1163, 315, 'B. tiles', 1, '', '2025-06-29 17:52:21'),
(1164, 315, 'C. furniture', 0, '', '2025-06-29 17:52:22'),
(1165, 315, 'D. curtains', 0, '', '2025-06-29 17:52:22'),
(1166, 316, 'A. update', 0, '', '2025-06-29 17:52:22'),
(1167, 316, 'B. updating', 1, '', '2025-06-29 17:52:22'),
(1168, 316, 'C. updates', 0, '', '2025-06-29 17:52:22'),
(1169, 316, 'D. updated', 0, '', '2025-06-29 17:52:22'),
(1170, 317, 'A. so', 0, '', '2025-06-29 17:52:22'),
(1171, 317, 'B. how', 0, '', '2025-06-29 17:52:22'),
(1172, 317, 'C. like', 0, '', '2025-06-29 17:52:22'),
(1173, 317, 'D. before', 1, '', '2025-06-29 17:52:22'),
(1174, 318, 'A. enthusiastically', 1, '', '2025-06-29 17:52:22'),
(1175, 318, 'B. enthusiasm', 0, '', '2025-06-29 17:52:22'),
(1176, 318, 'C. enthusiastic', 0, '', '2025-06-29 17:52:22'),
(1177, 318, 'D. enthused', 0, '', '2025-06-29 17:52:22'),
(1178, 319, 'A. inspects', 0, '', '2025-06-29 17:52:22'),
(1179, 319, 'B. inspector', 0, '', '2025-06-29 17:52:22'),
(1180, 319, 'C. inspected', 0, '', '2025-06-29 17:52:22'),
(1181, 319, 'D. inspections', 1, '', '2025-06-29 17:52:22'),
(1182, 320, 'A. until', 1, '', '2025-06-29 17:52:22'),
(1183, 320, 'B. into', 0, '', '2025-06-29 17:52:22'),
(1184, 320, 'C. yet', 0, '', '2025-06-29 17:52:22'),
(1185, 320, 'D. while', 0, '', '2025-06-29 17:52:22'),
(1186, 321, 'A. separate', 0, '', '2025-06-29 17:52:22'),
(1187, 321, 'B. limited', 0, '', '2025-06-29 17:52:22'),
(1188, 321, 'C. willing', 0, '', '2025-06-29 17:52:22'),
(1189, 321, 'D. assorted', 1, '', '2025-06-29 17:52:22'),
(1190, 322, 'A. deliveries', 1, '', '2025-06-29 17:52:22'),
(1191, 322, 'B. delivered', 0, '', '2025-06-29 17:52:22'),
(1192, 322, 'C. deliver', 0, '', '2025-06-29 17:52:22'),
(1193, 322, 'D. deliverable', 0, '', '2025-06-29 17:52:22'),
(1194, 323, 'A. drive', 0, '', '2025-06-29 17:52:22'),
(1195, 323, 'B. prohibit', 1, '', '2025-06-29 17:52:22'),
(1196, 323, 'C. bother', 0, '', '2025-06-29 17:52:22'),
(1197, 323, 'D. travel', 0, '', '2025-06-29 17:52:22'),
(1198, 324, 'A. looking', 1, '', '2025-06-29 17:52:22'),
(1199, 324, 'B. seeing', 0, '', '2025-06-29 17:52:22'),
(1200, 324, 'C. driving', 0, '', '2025-06-29 17:52:22'),
(1201, 324, 'D. leaning', 0, '', '2025-06-29 17:52:22'),
(1202, 325, 'A. perfect', 1, '', '2025-06-29 17:52:22'),
(1203, 325, 'B. perfects', 0, '', '2025-06-29 17:52:22'),
(1204, 325, 'C. perfectly', 0, '', '2025-06-29 17:52:22'),
(1205, 325, 'D. perfection', 0, '', '2025-06-29 17:52:22'),
(1206, 326, 'D. helpful', 1, '', '2025-06-29 17:52:22'),
(1207, 326, 'A. helpfulness', 0, '', '2025-06-29 17:52:22'),
(1208, 326, 'B. help', 0, '', '2025-06-29 17:52:22'),
(1209, 326, 'C. helpfully', 0, '', '2025-06-29 17:52:22'),
(1210, 327, 'C. during', 1, '', '2025-06-29 17:52:22'),
(1211, 327, 'A. onto', 0, '', '2025-06-29 17:52:22'),
(1212, 327, 'B. above', 0, '', '2025-06-29 17:52:22'),
(1213, 327, 'D. between', 0, '', '2025-06-29 17:52:22'),
(1214, 328, 'D. soon', 1, '', '2025-06-29 17:52:22'),
(1215, 328, 'A. far', 0, '', '2025-06-29 17:52:22'),
(1216, 328, 'B. very', 0, '', '2025-06-29 17:52:22'),
(1217, 328, 'C. almost', 0, '', '2025-06-29 17:52:22'),
(1218, 329, 'A. organized', 0, '', '2025-06-29 17:52:22'),
(1219, 329, 'C. organizes', 0, '', '2025-06-29 17:52:22'),
(1220, 329, 'D. organizational', 0, '', '2025-06-29 17:52:22'),
(1221, 330, 'A. temporarily', 1, '', '2025-06-29 17:52:22'),
(1222, 330, 'B. competitively', 0, '', '2025-06-29 17:52:22'),
(1223, 330, 'C. recently', 0, '', '2025-06-29 17:52:22'),
(1224, 330, 'D. collectively', 0, '', '2025-06-29 17:52:22'),
(1225, 331, 'C. on', 1, '', '2025-06-29 17:52:22'),
(1226, 331, 'A. from', 0, '', '2025-06-29 17:52:22'),
(1227, 331, 'B. under', 0, '', '2025-06-29 17:52:22'),
(1228, 331, 'D. against', 0, '', '2025-06-29 17:52:22'),
(1229, 332, 'D. accidentally', 1, '', '2025-06-29 17:52:22'),
(1230, 332, 'A. accident', 0, '', '2025-06-29 17:52:22'),
(1231, 332, 'B. accidental', 0, '', '2025-06-29 17:52:22'),
(1232, 332, 'C. accidents', 0, '', '2025-06-29 17:52:22'),
(1233, 333, 'A. next', 1, '', '2025-06-29 17:52:22'),
(1234, 333, 'B. with', 0, '', '2025-06-29 17:52:22'),
(1235, 333, 'C. which', 0, '', '2025-06-29 17:52:22'),
(1236, 333, 'D. now', 0, '', '2025-06-29 17:52:22'),
(1237, 334, 'B. needs', 1, '', '2025-06-29 17:52:22'),
(1238, 334, 'A. needing', 0, '', '2025-06-29 17:52:22'),
(1239, 334, 'C. has needed', 0, '', '2025-06-29 17:52:22'),
(1240, 334, 'D. were needing', 0, '', '2025-06-29 17:52:22'),
(1241, 335, 'A. already', 1, '', '2025-06-29 17:52:22'),
(1242, 335, 'B. exactly', 0, '', '2025-06-29 17:52:22'),
(1243, 335, 'C. hardly', 0, '', '2025-06-29 17:52:22'),
(1244, 335, 'D. closely', 0, '', '2025-06-29 17:52:22'),
(1245, 336, 'D. standards', 1, '', '2025-06-29 17:52:22'),
(1246, 336, 'A. experts', 0, '', '2025-06-29 17:52:22'),
(1247, 336, 'B. accounts', 0, '', '2025-06-29 17:52:22'),
(1248, 336, 'C. recommendations', 0, '', '2025-06-29 17:52:22'),
(1249, 337, 'D. some', 1, '', '2025-06-29 17:52:22'),
(1250, 337, 'A. any', 0, '', '2025-06-29 17:52:22'),
(1251, 337, 'B. everybody', 0, '', '2025-06-29 17:52:22'),
(1252, 337, 'C. those', 0, '', '2025-06-29 17:52:22'),
(1253, 338, 'C. required', 1, '', '2025-06-29 17:52:22'),
(1254, 338, 'A. passed', 0, '', '2025-06-29 17:52:22'),
(1255, 338, 'B. decided', 0, '', '2025-06-29 17:52:22'),
(1256, 338, 'D. performed', 0, '', '2025-06-29 17:52:22'),
(1257, 339, 'C. has been approved', 1, '', '2025-06-29 17:52:22'),
(1258, 339, 'A. is approving', 0, '', '2025-06-29 17:52:22'),
(1259, 339, 'B. approves', 0, '', '2025-06-29 17:52:22'),
(1260, 339, 'D. will be approved', 0, '', '2025-06-29 17:52:22'),
(1261, 340, 'C. In light of', 1, '', '2025-06-29 17:52:22'),
(1262, 340, 'A. In spite of', 0, '', '2025-06-29 17:52:22'),
(1263, 340, 'B. Just as', 0, '', '2025-06-29 17:52:22'),
(1264, 340, 'D. According to', 0, '', '2025-06-29 17:52:22'),
(1265, 341, 'B. supplemental', 1, '', '2025-06-29 17:52:22'),
(1266, 341, 'A. arbitrary', 0, '', '2025-06-29 17:52:22'),
(1267, 341, 'C. superfluous', 0, '', '2025-06-29 17:52:22'),
(1268, 341, 'D. potential', 0, '', '2025-06-29 17:52:22'),
(1269, 342, 'A. Children of all ages will enjoy the new exhibits.', 1, '', '2025-06-29 17:52:22'),
(1270, 342, 'B. Learn about rainfall patterns across the region.', 0, '', '2025-06-29 17:52:22'),
(1271, 342, 'C. Build a set of simple patio furniture with easy-to-acquire materials.', 0, '', '2025-06-29 17:52:22'),
(1272, 342, 'D. Next Saturday at 4 P.M., we are hosting a free workshop for the public.', 0, '', '2025-06-29 17:52:22'),
(1273, 343, 'A. to use', 1, '', '2025-06-29 17:52:22'),
(1274, 343, 'B. used to', 0, '', '2025-06-29 17:52:22'),
(1275, 343, 'C. by using', 0, '', '2025-06-29 17:52:22'),
(1276, 343, 'D. that uses', 0, '', '2025-06-29 17:52:22'),
(1277, 344, 'B. For example', 1, '', '2025-06-29 17:52:22'),
(1278, 344, 'A. Best of all', 0, '', '2025-06-29 17:52:22'),
(1279, 344, 'C. In any event', 0, '', '2025-06-29 17:52:22'),
(1280, 344, 'D. As a matter of fact', 0, '', '2025-06-29 17:52:22'),
(1281, 345, 'A. we', 1, '', '2025-06-29 17:52:22'),
(1282, 345, 'B. they', 0, '', '2025-06-29 17:52:22'),
(1283, 345, 'C. both', 0, '', '2025-06-29 17:52:22'),
(1284, 345, 'D. yours', 0, '', '2025-06-29 17:52:22'),
(1285, 346, 'C. Amazing', 1, '', '2025-06-29 17:52:22'),
(1286, 346, 'A. Amazed', 0, '', '2025-06-29 17:52:22'),
(1287, 346, 'B. Amazement', 0, '', '2025-06-29 17:52:22'),
(1288, 346, 'D. Amazingly', 0, '', '2025-06-29 17:52:22'),
(1289, 347, 'B. Proposals', 1, '', '2025-06-29 17:52:22'),
(1290, 347, 'A. Attention', 0, '', '2025-06-29 17:52:22'),
(1291, 347, 'C. Innovation', 0, '', '2025-06-29 17:52:22'),
(1292, 347, 'D. Criticism', 0, '', '2025-06-29 17:52:22'),
(1293, 348, 'A. Several other events have gone surprisingly well.', 1, '', '2025-06-29 17:52:22'),
(1294, 348, 'B. Thank you also for your flexibility in planning the event.', 0, '', '2025-06-29 17:52:22'),
(1295, 348, 'C. Please stop by our office the next time you are in the city.', 0, '', '2025-06-29 17:52:22'),
(1296, 348, 'D. Tokyo is a top tourism destination for many reasons.', 0, '', '2025-06-29 17:52:22'),
(1297, 349, 'A. Will benefit', 1, '', '2025-06-29 17:52:22'),
(1298, 349, 'B. To benefit', 0, '', '2025-06-29 17:52:22'),
(1299, 349, 'C. Has benefited', 0, '', '2025-06-29 17:52:22'),
(1300, 349, 'D. Benefits', 0, '', '2025-06-29 17:52:22'),
(1301, 350, 'C. Our', 1, '', '2025-06-29 17:52:22'),
(1302, 350, 'A. It', 0, '', '2025-06-29 17:52:22'),
(1303, 350, 'B. You', 0, '', '2025-06-29 17:52:22'),
(1304, 350, 'D. Each', 0, '', '2025-06-29 17:52:22'),
(1305, 351, 'A. To sign up for a card, visit your local library branch.', 1, '', '2025-06-29 17:52:22'),
(1306, 351, 'B. For questions about library membership, please visit our Web site.', 0, '', '2025-06-29 17:52:22'),
(1307, 351, 'C. Renewal must be completed at least one week before your card expires.', 0, '', '2025-06-29 17:52:22'),
(1308, 351, 'D. You may opt out of this program at any time.', 0, '', '2025-06-29 17:52:22'),
(1309, 352, 'C. Because', 1, '', '2025-06-29 17:52:22'),
(1310, 352, 'A. Also', 0, '', '2025-06-29 17:52:22'),
(1311, 352, 'B. Should', 0, '', '2025-06-29 17:52:22'),
(1312, 352, 'D. Although', 0, '', '2025-06-29 17:52:22'),
(1313, 353, 'A. Specifically', 1, '', '2025-06-29 17:52:22'),
(1314, 353, 'B. Specifics', 0, '', '2025-06-29 17:52:22'),
(1315, 353, 'C. Specified', 0, '', '2025-06-29 17:52:22'),
(1316, 353, 'D. Specificity', 0, '', '2025-06-29 17:52:22'),
(1317, 354, 'A. I would like to introduce you to our business.', 1, '', '2025-06-29 17:52:22'),
(1318, 354, 'B. Great photographs can make your property stand out.', 0, '', '2025-06-29 17:52:22'),
(1319, 354, 'C. We are looking forward to your visit.', 0, '', '2025-06-29 17:52:22'),
(1320, 354, 'D. It was the first studio of its kind to open in this area.', 0, '', '2025-06-29 17:52:22'),
(1321, 355, 'B. Creating', 1, '', '2025-06-29 17:52:22'),
(1322, 355, 'A. Researching', 0, '', '2025-06-29 17:52:22'),
(1323, 355, 'C. Purchasing', 0, '', '2025-06-29 17:52:22'),
(1324, 355, 'D. Displaying', 0, '', '2025-06-29 17:52:22'),
(1325, 356, 'C. Otherwise', 1, '', '2025-06-29 17:52:22'),
(1326, 356, 'A. If not', 0, '', '2025-06-29 17:52:22'),
(1327, 356, 'B. By comparison', 0, '', '2025-06-29 17:52:22'),
(1328, 356, 'D. Indeed', 0, '', '2025-06-29 17:52:22'),
(1329, 357, 'D. Had to receive', 1, '', '2025-06-29 17:52:22'),
(1330, 357, 'A. Receives', 0, '', '2025-06-29 17:52:22'),
(1331, 357, 'B. Is receiving', 0, '', '2025-06-29 17:52:22'),
(1332, 357, 'C. Had received', 0, '', '2025-06-29 17:52:22'),
(1333, 358, 'D. On a Web site', 1, '', '2025-06-29 17:52:22'),
(1334, 358, 'A. On a door', 0, '', '2025-06-29 17:52:22'),
(1335, 358, 'B. On a receipt', 0, '', '2025-06-29 17:52:22'),
(1336, 358, 'C. In a box', 0, '', '2025-06-29 17:52:22'),
(1337, 359, 'B. A piece of furniture', 1, '', '2025-06-29 17:52:22'),
(1338, 359, 'A. A desktop computer', 0, '', '2025-06-29 17:52:22'),
(1339, 359, 'C. A household appliance', 0, '', '2025-06-29 17:52:22'),
(1340, 359, 'D. A power tool', 0, '', '2025-06-29 17:52:22'),
(1341, 360, 'D. Some meeting times have been changed', 1, '', '2025-06-29 17:52:22'),
(1342, 360, 'A. A conference has been scheduled', 0, '', '2025-06-29 17:52:22'),
(1343, 360, 'B. A firm has offices in two time zones', 0, '', '2025-06-29 17:52:22'),
(1344, 360, 'C. Administrative assistants make travel plans', 0, '', '2025-06-29 17:52:22'),
(1345, 361, 'A. It is when the Winnipeg office closes for lunch', 1, '', '2025-06-29 17:52:22'),
(1346, 361, 'B. It is when staff in Toulouse begin their workday', 0, '', '2025-06-29 17:52:22'),
(1347, 361, 'C. It is not a preferred time to schedule a meeting', 0, '', '2025-06-29 17:52:22'),
(1348, 361, 'D. It has just been added to the schedule', 0, '', '2025-06-29 17:52:22'),
(1349, 362, 'B. It has recently been renovated', 1, '', '2025-06-29 17:52:22'),
(1350, 362, 'A. It is located on the shores of a lake', 0, '', '2025-06-29 17:52:22'),
(1351, 362, 'C. It will build a botanical garden for guests', 0, '', '2025-06-29 17:52:22'),
(1352, 362, 'D. It is reserved solely for corporate events', 0, '', '2025-06-29 17:52:22'),
(1353, 363, 'D. It is very popular with local residents', 1, '', '2025-06-29 17:52:22'),
(1354, 363, 'A. It was started by an international chef', 0, '', '2025-06-29 17:52:22'),
(1355, 363, 'B. It offers limited menu options', 0, '', '2025-06-29 17:52:22'),
(1356, 363, 'C. It is now funded by a charitable organization', 0, '', '2025-06-29 17:52:22'),
(1357, 364, 'A. She will bring lunch for Ms. Evers', 1, '', '2025-06-29 17:52:22'),
(1358, 364, 'B. She can provide a tool that Ms. Evers needs', 0, '', '2025-06-29 17:52:22'),
(1359, 364, 'C. Some site coordinates are correct', 0, '', '2025-06-29 17:52:22'),
(1360, 364, 'D. Some measurements must be double-checked', 0, '', '2025-06-29 17:52:22'),
(1361, 365, 'A. Ms. Chi will get new site coordinates', 1, '', '2025-06-29 17:52:22'),
(1362, 365, 'B. Ms. Chi and Ms. Lim will be out for a while', 0, '', '2025-06-29 17:52:22'),
(1363, 365, 'C. Ms. Evers will share a recipe', 0, '', '2025-06-29 17:52:22'),
(1364, 365, 'D. Ms. Lim will begin taking measurements', 0, '', '2025-06-29 17:52:22'),
(1365, 366, 'A. Farmers', 1, '', '2025-06-29 17:52:22'),
(1366, 366, 'B. Professional chefs', 0, '', '2025-06-29 17:52:22'),
(1367, 366, 'C. Truck drivers', 0, '', '2025-06-29 17:52:22'),
(1368, 366, 'D. Supermarket managers', 0, '', '2025-06-29 17:52:22'),
(1369, 367, 'B. It included heavier rain than usual', 1, '', '2025-06-29 17:52:22'),
(1370, 367, 'A. It caused transportation delays', 0, '', '2025-06-29 17:52:22'),
(1371, 367, 'C. It was frequently a topic in the local news', 0, '', '2025-06-29 17:52:22'),
(1372, 367, 'D. It was beneficial for crops', 0, '', '2025-06-29 17:52:22'),
(1373, 368, 'C. Farm machinery repair', 1, '', '2025-06-29 17:52:22'),
(1374, 368, 'A. Staffing for local businesses', 0, '', '2025-06-29 17:52:22'),
(1375, 368, 'B. Food collection and distribution', 0, '', '2025-06-29 17:52:22'),
(1376, 368, 'D. Gardening workshops', 0, '', '2025-06-29 17:52:22'),
(1377, 369, 'B. In a concert hall', 1, '', '2025-06-29 17:52:22'),
(1378, 369, 'A. In an airplane', 0, '', '2025-06-29 17:52:22'),
(1379, 369, 'C. At a restaurant', 0, '', '2025-06-29 17:52:22'),
(1380, 369, 'D. At a post office', 0, '', '2025-06-29 17:52:22'),
(1381, 370, 'B. They must be left outside the building', 1, '', '2025-06-29 17:52:22'),
(1382, 370, 'A. They can be put in a locked box for a fee', 0, '', '2025-06-29 17:52:22'),
(1383, 370, 'C. They will be inspected by an attendant', 0, '', '2025-06-29 17:52:22'),
(1384, 370, 'D. They must be stored under a seat', 0, '', '2025-06-29 17:52:22'),
(1385, 371, 'A. [1]', 1, '', '2025-06-29 17:52:22'),
(1386, 371, 'B. [2]', 0, '', '2025-06-29 17:52:22'),
(1387, 371, 'C. [3]', 0, '', '2025-06-29 17:52:22'),
(1388, 371, 'D. [4]', 0, '', '2025-06-29 17:52:22'),
(1389, 372, 'D. To promote new dessert products', 1, '', '2025-06-29 17:52:22'),
(1390, 372, 'A. To request confirmation of an order', 0, '', '2025-06-29 17:52:22'),
(1391, 372, 'B. To adjust some delivery dates', 0, '', '2025-06-29 17:52:22'),
(1392, 372, 'C. To announce the expansion of a business', 0, '', '2025-06-29 17:52:22'),
(1393, 373, 'C. She has been a Sweeter Specialties client in the past', 1, '', '2025-06-29 17:52:22'),
(1394, 373, 'A. She is receiving a professional award', 0, '', '2025-06-29 17:52:22'),
(1395, 373, 'B. She has worked as a pastry chef', 0, '', '2025-06-29 17:52:22'),
(1396, 373, 'D. She received a positive recommendation about a chef', 0, '', '2025-06-29 17:52:22'),
(1397, 374, 'A. It has been a best-selling product with clients', 1, '', '2025-06-29 17:52:22'),
(1398, 374, 'B. It is the most expensive cake at Sweeter Specialties', 0, '', '2025-06-29 17:52:22'),
(1399, 374, 'C. It is baked for Esplin Electronics annually', 0, '', '2025-06-29 17:52:22'),
(1400, 374, 'D. It is a new flavor combination for Sweeter Specialties', 0, '', '2025-06-29 17:52:22'),
(1401, 375, 'C. Determined', 1, '', '2025-06-29 17:52:22'),
(1402, 375, 'A. Criticized', 0, '', '2025-06-29 17:52:22'),
(1403, 375, 'B. Settled', 0, '', '2025-06-29 17:52:22'),
(1404, 375, 'D. Described', 0, '', '2025-06-29 17:52:22'),
(1405, 376, 'C. It was rated very highly', 1, '', '2025-06-29 17:52:22'),
(1406, 376, 'A. It was less expensive than most models', 0, '', '2025-06-29 17:52:22'),
(1407, 376, 'B. It was the largest model available', 0, '', '2025-06-29 17:52:22'),
(1408, 376, 'D. It was the same brand as her other appliances', 0, '', '2025-06-29 17:52:22'),
(1409, 377, 'D. Operating', 1, '', '2025-06-29 17:52:22'),
(1410, 377, 'A. Adjusting', 0, '', '2025-06-29 17:52:22'),
(1411, 377, 'B. Controlling', 0, '', '2025-06-29 17:52:22'),
(1412, 377, 'C. Moving', 0, '', '2025-06-29 17:52:22'),
(1413, 378, 'A. She cares about saving water', 1, '', '2025-06-29 17:52:22'),
(1414, 378, 'B. She recently moved to a new home', 0, '', '2025-06-29 17:52:22'),
(1415, 378, 'C. She bought the dishwasher a year ago', 0, '', '2025-06-29 17:52:22'),
(1416, 378, 'D. She remodels kitchens professionally', 0, '', '2025-06-29 17:52:22'),
(1417, 379, 'A. Skyler Airlines employees', 1, '', '2025-06-29 17:52:22'),
(1418, 379, 'B. Skyler Airlines customers', 0, '', '2025-06-29 17:52:22'),
(1419, 379, 'C. Potential journal subscribers', 0, '', '2025-06-29 17:52:22'),
(1420, 379, 'D. Current job seekers', 0, '', '2025-06-29 17:52:22'),
(1421, 380, 'A. Payment for educational expenses', 1, '', '2025-06-29 17:52:22'),
(1422, 380, 'B. Free airline tickets', 0, '', '2025-06-29 17:52:22'),
(1423, 380, 'C. Opportunities for mentoring', 0, '', '2025-06-29 17:52:22'),
(1424, 380, 'D. Paid days off', 0, '', '2025-06-29 17:52:22'),
(1425, 381, 'A. It flies to the most destinations around the world', 1, '', '2025-06-29 17:52:22'),
(1426, 381, 'B. It is planning to merge with another airline', 0, '', '2025-06-29 17:52:22'),
(1427, 381, 'C. It has been praised by a trade publication', 0, '', '2025-06-29 17:52:22'),
(1428, 381, 'D. It has replaced its seats with more comfortable ones', 0, '', '2025-06-29 17:52:22'),
(1429, 382, 'A. [1]', 1, '', '2025-06-29 17:52:22'),
(1430, 382, 'B. [2]', 0, '', '2025-06-29 17:52:22'),
(1431, 382, 'C. [3]', 0, '', '2025-06-29 17:52:22'),
(1432, 382, 'D. [4]', 0, '', '2025-06-29 17:52:22'),
(1433, 383, 'B. It will highlight some best-selling products', 1, '', '2025-06-29 17:52:22'),
(1434, 383, 'A. It will be expensive to produce', 0, '', '2025-06-29 17:52:22'),
(1435, 383, 'C. It will be Ms. Gowan’s first project', 0, '', '2025-06-29 17:52:22'),
(1436, 383, 'D. It will be sent to multiple locations', 0, '', '2025-06-29 17:52:22'),
(1437, 384, 'B. Information from the user studies is important', 1, '', '2025-06-29 17:52:22'),
(1438, 384, 'A. More staff should attend a meeting', 0, '', '2025-06-29 17:52:22'),
(1439, 384, 'C. The presentation must run smoothly', 0, '', '2025-06-29 17:52:22'),
(1440, 384, 'D. Partner stores must be notified about an upcoming report', 0, '', '2025-06-29 17:52:22'),
(1441, 385, 'C. A product researcher', 1, '', '2025-06-29 17:52:22'),
(1442, 385, 'A. A store manager', 0, '', '2025-06-29 17:52:22'),
(1443, 385, 'B. An amateur athlete', 0, '', '2025-06-29 17:52:22'),
(1444, 385, 'D. An advertising executive', 0, '', '2025-06-29 17:52:22'),
(1445, 386, 'D. On Friday', 1, '', '2025-06-29 17:52:22'),
(1446, 386, 'A. On Monday', 0, '', '2025-06-29 17:52:22'),
(1447, 386, 'B. On Wednesday', 0, '', '2025-06-29 17:52:22'),
(1448, 386, 'C. On Thursday', 0, '', '2025-06-29 17:52:22'),
(1449, 387, 'D. To congratulate an award recipient', 1, '', '2025-06-29 17:52:22'),
(1450, 387, 'A. To promote the opening of a restaurant', 0, '', '2025-06-29 17:52:22'),
(1451, 387, 'B. To announce a business partnership', 0, '', '2025-06-29 17:52:22'),
(1452, 387, 'C. To introduce a travel program', 0, '', '2025-06-29 17:52:22'),
(1453, 388, 'C. shows', 1, '', '2025-06-29 17:52:22'),
(1454, 388, 'A. results in', 0, '', '2025-06-29 17:52:22'),
(1455, 388, 'B. changes', 0, '', '2025-06-29 17:52:22'),
(1456, 388, 'D. thinks about', 0, '', '2025-06-29 17:52:22'),
(1457, 389, 'C. It offers several meal options', 1, '', '2025-06-29 17:52:22'),
(1458, 389, 'A. It raised its prices for all customers', 0, '', '2025-06-29 17:52:22'),
(1459, 389, 'B. It revised its delivery schedule', 0, '', '2025-06-29 17:52:22'),
(1460, 389, 'D. It has a new vice president', 0, '', '2025-06-29 17:52:22'),
(1461, 390, 'D. She regularly orders from Kitchen Swifts', 1, '', '2025-06-29 17:52:22'),
(1462, 390, 'A. She went to Mr. Cordero’s restaurant', 0, '', '2025-06-29 17:52:22'),
(1463, 390, 'B. She recently went to Sydney for a vacation', 0, '', '2025-06-29 17:52:22'),
(1464, 390, 'C. She is a colleague of Ms. Chambers', 0, '', '2025-06-29 17:52:22'),
(1465, 391, 'A. It has a limited lunch menu', 1, '', '2025-06-29 17:52:22'),
(1466, 391, 'B. It takes dinner reservations', 0, '', '2025-06-29 17:52:22'),
(1467, 391, 'C. It serves bread from a local bakery', 0, '', '2025-06-29 17:52:22'),
(1468, 391, 'D. It has a location in Hong Kong', 0, '', '2025-06-29 17:52:22'),
(1469, 392, 'A. To finalize a plan', 1, '', '2025-06-29 17:52:22'),
(1470, 392, 'B. To accept an invitation', 0, '', '2025-06-29 17:52:22'),
(1471, 392, 'C. To promote a new service', 0, '', '2025-06-29 17:52:22'),
(1472, 392, 'D. To request feedback on a policy', 0, '', '2025-06-29 17:52:22'),
(1473, 393, 'C. To drop off a rental car', 1, '', '2025-06-29 17:52:22'),
(1474, 393, 'A. To make a delivery', 0, '', '2025-06-29 17:52:22'),
(1475, 393, 'B. To attend a meeting', 0, '', '2025-06-29 17:52:22'),
(1476, 393, 'D. To visit with family members', 0, '', '2025-06-29 17:52:22'),
(1477, 394, 'B. Mr. Boyle has been disappointed by air- and train-freight companies', 1, '', '2025-06-29 17:52:22'),
(1478, 394, 'A. Mr. Boyle’s sister is a cofounder of Ceelarie Classics', 0, '', '2025-06-29 17:52:22'),
(1479, 394, 'C. Ms. Savard has purchased items from Mr. Boyle in the past', 0, '', '2025-06-29 17:52:22'),
(1480, 394, 'D. Ms. Savard prefers a specific brand of luggage', 0, '', '2025-06-29 17:52:22'),
(1481, 395, 'A. She often travels for her job', 1, '', '2025-06-29 17:52:22'),
(1482, 395, 'B. She paid extra to have items hand delivered', 0, '', '2025-06-29 17:52:22'),
(1483, 395, 'C. She recently purchased musical instruments', 0, '', '2025-06-29 17:52:22'),
(1484, 395, 'D. She will meet Mr. Boyle at the rental car office', 0, '', '2025-06-29 17:52:22'),
(1485, 396, 'C. By boat', 1, '', '2025-06-29 17:52:22'),
(1486, 396, 'A. By car', 0, '', '2025-06-29 17:52:22'),
(1487, 396, 'B. By train', 0, '', '2025-06-29 17:52:22'),
(1488, 396, 'D. By plane', 0, '', '2025-06-29 17:52:22'),
(1489, 397, 'C. It offers classes led by industry professionals', 1, '', '2025-06-29 17:52:22'),
(1490, 397, 'A. It was founded by a graphic designer', 0, '', '2025-06-29 17:52:22'),
(1491, 397, 'B. It publishes its own online newsletter', 0, '', '2025-06-29 17:52:22'),
(1492, 397, 'D. It has classroom facilities in cities across West Africa', 0, '', '2025-06-29 17:52:22'),
(1493, 398, 'D. A certification document', 1, '', '2025-06-29 17:52:22'),
(1494, 398, 'A. A résumé-writing workshop', 0, '', '2025-06-29 17:52:22'),
(1495, 398, 'B. A discount on a follow-up class', 0, '', '2025-06-29 17:52:22'),
(1496, 398, 'C. A list of current job postings', 0, '', '2025-06-29 17:52:22'),
(1497, 399, 'B. He has previously taken a TTA class', 1, '', '2025-06-29 17:52:22');
INSERT INTO `answers` (`id`, `question_id`, `content`, `is_correct`, `explanation`, `created_at`) VALUES
(1498, 399, 'A. He helped design a discussion forum', 0, '', '2025-06-29 17:52:22'),
(1499, 399, 'C. He develops videoconferencing software', 0, '', '2025-06-29 17:52:22'),
(1500, 399, 'D. He recently sold a bakery food truck', 0, '', '2025-06-29 17:52:22'),
(1501, 400, 'B. Become a Successful Freelance Writer', 1, '', '2025-06-29 17:52:22'),
(1502, 400, 'A. Introduction to Social Media Marketing', 0, '', '2025-06-29 17:52:22'),
(1503, 400, 'C. Starting an Internet Radio Station', 0, '', '2025-06-29 17:52:22'),
(1504, 400, 'D. Basics of Graphic Design', 0, '', '2025-06-29 17:52:22'),
(1505, 401, 'A. Section 1', 1, '', '2025-06-29 17:52:22'),
(1506, 401, 'B. Section 2', 0, '', '2025-06-29 17:52:22'),
(1507, 401, 'C. Section 3', 0, '', '2025-06-29 17:52:22'),
(1508, 401, 'D. Section 4', 0, '', '2025-06-29 17:52:22'),
(1509, 402, 'A. It is currently hiring servers', 1, '', '2025-06-29 17:52:22'),
(1510, 402, 'B. It is located on a quiet street', 0, '', '2025-06-29 17:52:22'),
(1511, 402, 'C. It has another location in Jamaica', 0, '', '2025-06-29 17:52:22'),
(1512, 402, 'D. It opened six months ago', 0, '', '2025-06-29 17:52:22'),
(1513, 403, 'A. Red snapper', 1, '', '2025-06-29 17:52:22'),
(1514, 403, 'B. Oxtail soup', 0, '', '2025-06-29 17:52:22'),
(1515, 403, 'C. Jerk chicken', 0, '', '2025-06-29 17:52:22'),
(1516, 403, 'D. Curried goat', 0, '', '2025-06-29 17:52:22'),
(1517, 404, 'A. She was there on a Friday', 1, '', '2025-06-29 17:52:22'),
(1518, 404, 'B. She dined alone', 0, '', '2025-06-29 17:52:22'),
(1519, 404, 'C. She requested extra rice', 0, '', '2025-06-29 17:52:22'),
(1520, 404, 'D. She ordered dessert', 0, '', '2025-06-29 17:52:22'),
(1521, 405, 'A. To answer a question', 1, '', '2025-06-29 17:52:22'),
(1522, 405, 'B. To offer an apology', 0, '', '2025-06-29 17:52:22'),
(1523, 405, 'C. To ask for feedback', 0, '', '2025-06-29 17:52:22'),
(1524, 405, 'D. To confirm a reservation', 0, '', '2025-06-29 17:52:22'),
(1525, 406, 'A. Ms. Roats', 1, '', '2025-06-29 17:52:22'),
(1526, 406, 'B. Mr. Deslandes', 0, '', '2025-06-29 17:52:22'),
(1527, 406, 'C. Mr. Brown', 0, '', '2025-06-29 17:52:22'),
(1528, 406, 'D. Ms. Smith', 0, '', '2025-06-29 17:52:22'),
(1529, 407, 'A. It does landscaping projects', 1, '', '2025-06-29 17:52:22'),
(1530, 407, 'B. It designs highways', 0, '', '2025-06-29 17:52:22'),
(1531, 407, 'C. It repairs old houses', 0, '', '2025-06-29 17:52:22'),
(1532, 407, 'D. It operates a farm', 0, '', '2025-06-29 17:52:22'),
(1533, 408, 'A. It is a charitable organization', 1, '', '2025-06-29 17:52:22'),
(1534, 408, 'B. It belongs to the Frequent Buyer Club', 0, '', '2025-06-29 17:52:22'),
(1535, 408, 'C. It spent more than $4,000 on merchandise', 0, '', '2025-06-29 17:52:22'),
(1536, 408, 'D. It is located near an Orbys Distributors supply center', 0, '', '2025-06-29 17:52:22'),
(1537, 409, 'A. Its e-mail address', 1, '', '2025-06-29 17:52:22'),
(1538, 409, 'B. Its list of incentives', 0, '', '2025-06-29 17:52:22'),
(1539, 409, 'C. Its invoicing system', 0, '', '2025-06-29 17:52:22'),
(1540, 409, 'D. Its delivery schedule', 0, '', '2025-06-29 17:52:22'),
(1541, 410, 'A. He asked to meet with Mr. Singh', 1, '', '2025-06-29 17:52:22'),
(1542, 410, 'B. He is interested in employment at Orbys Distributors', 0, '', '2025-06-29 17:52:22'),
(1543, 410, 'C. He recently placed an order for some construction machinery', 0, '', '2025-06-29 17:52:22'),
(1544, 410, 'D. He has been a customer of Orbys Distributors for about twenty years', 0, '', '2025-06-29 17:52:22'),
(1545, 411, 'A. Make a bill payment', 1, '', '2025-06-29 17:52:22'),
(1546, 411, 'B. Solve a problem', 0, '', '2025-06-29 17:52:22'),
(1547, 411, 'C. Confirm an order', 0, '', '2025-06-29 17:52:22'),
(1548, 411, 'D. Update an account number', 0, '', '2025-06-29 17:52:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `api_usages`
--

CREATE TABLE `api_usages` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `request_count` int DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `audio_files`
--

CREATE TABLE `audio_files` (
  `id` int NOT NULL,
  `part_id` int NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `transcript` text,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `audio_files`
--

INSERT INTO `audio_files` (`id`, `part_id`, `file_path`, `duration`, `transcript`, `created_at`) VALUES
(1, 1, 'PART_1-TEST_1.mp3', NULL, '1. (A) She’s eating in a picnic area. (B) She’s waiting in line at a food truck. (C) She’s wiping off a bench. (D) She’s throwing away a plate.  2. (A) The man is brushing snow off the roof of a car. (B) The man is standing in the snow beside a car. (C) The man is shoveling snow from a walkway. (D) The man is running through the snow.  3. (A) Some workers are hanging art in a gallery. (B) Two of the people are having a conversation. (C) One of the men is rearranging cushions on a sofa. (D) One of the men is painting a picture.  4. (A) Vehicles are entering a parking garage. (B) Clothes hangers are scattered on the ground. (C) Empty racks are lined up next to a building. (D) Clothing is being displayed under a tent.  5. (A) Potted plants have been suspended from a ceiling. (B) Chairs have been stacked in front of an entryway. (C) A computer station has been set up on a desk. (D) A rug has been rolled up against a wall.  6. (A) One of the men is sweeping a patio. (B) One of the men is replacing some flooring. (C) A door has been taken off its frame. (D) A light fixture has been left on the ground.', '2025-06-18 14:38:18'),
(14, 26, '/toeic_full_test_-_ets_standard_2025/part1/audio_part_1.mp3', 0, '', '2025-06-29 17:52:21'),
(15, 27, '/toeic_full_test_-_ets_standard_2025/part2/audio_part_2.mp3', 0, '', '2025-06-29 17:52:21'),
(16, 28, '/toeic_full_test_-_ets_standard_2025/part3/audio_part_3.mp3', 0, '', '2025-06-29 17:52:21'),
(17, 29, '/toeic_full_test_-_ets_standard_2025/part4/audio_part_4.mp3', 0, '', '2025-06-29 17:52:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `exams`
--

CREATE TABLE `exams` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `year_of_release` int NOT NULL,
  `type` enum('random','full_test','speaking','writing') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'full_test',
  `description` text,
  `estimated_time` int DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `exams`
--

INSERT INTO `exams` (`id`, `title`, `year_of_release`, `type`, `description`, `estimated_time`, `is_published`, `created_at`, `updated_at`) VALUES
(5, 'TOEIC Full Test 1 - ETS 2024', 2024, 'full_test', 'Đề thi TOEIC đầy đủ - 200 câu hỏi, 7 parts theo chuẩn ETS 2024', 120, 0, '2025-06-29 17:52:21', '2025-06-29 17:52:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `exam_parts`
--

CREATE TABLE `exam_parts` (
  `id` int NOT NULL,
  `exam_id` int NOT NULL,
  `part_id` int NOT NULL,
  `order_index` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `exam_parts`
--

INSERT INTO `exam_parts` (`id`, `exam_id`, `part_id`, `order_index`) VALUES
(25, 5, 26, 1),
(26, 5, 27, 2),
(27, 5, 28, 3),
(28, 5, 29, 4),
(29, 5, 30, 5),
(30, 5, 31, 6),
(31, 5, 32, 7);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` varchar(300) NOT NULL,
  `rating` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `flashcards`
--

CREATE TABLE `flashcards` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `vocabulary_id` int NOT NULL,
  `mastery_level` int DEFAULT NULL,
  `next_review_date` datetime DEFAULT NULL,
  `review_count` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `flashcards`
--

INSERT INTO `flashcards` (`id`, `user_id`, `vocabulary_id`, `mastery_level`, `next_review_date`, `review_count`, `created_at`, `updated_at`) VALUES
(5, 2, 6, NULL, '2025-06-21 13:52:52', NULL, '2025-06-21 20:05:10', '2025-06-21 20:05:10'),
(6, 2, 7, NULL, '2025-06-20 13:52:59', NULL, '2025-06-21 20:05:10', '2025-06-21 20:05:10'),
(7, 2, 8, NULL, NULL, NULL, '2025-06-21 20:05:10', '2025-06-21 20:05:10'),
(8, 2, 9, NULL, '2025-06-20 20:22:33', NULL, '2025-06-21 20:05:10', '2025-06-21 20:05:10'),
(9, 2, 10, NULL, NULL, NULL, '2025-06-21 20:05:10', '2025-06-21 20:05:10'),
(10, 2, 11, NULL, NULL, NULL, '2025-06-21 20:05:10', '2025-06-21 20:05:10'),
(11, 2, 12, NULL, NULL, NULL, '2025-06-21 20:05:10', '2025-06-21 20:05:10'),
(12, 2, 13, NULL, NULL, NULL, '2025-06-21 20:05:10', '2025-06-21 20:05:10'),
(13, 2, 14, NULL, NULL, NULL, '2025-06-21 20:05:10', '2025-06-21 20:05:10'),
(14, 2, 15, NULL, NULL, NULL, '2025-06-21 20:05:10', '2025-06-21 20:05:10'),
(15, 2, 16, NULL, NULL, NULL, '2025-06-21 20:05:10', '2025-06-21 20:05:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `leader_boards`
--

CREATE TABLE `leader_boards` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `score` int DEFAULT NULL,
  `period_type` enum('weekly','monthly','all_time') DEFAULT NULL,
  `period_start_date` datetime DEFAULT NULL,
  `rank` int DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `listening_transcripts`
--

CREATE TABLE `listening_transcripts` (
  `id` int NOT NULL,
  `audio_file_id` int NOT NULL,
  `level` enum('easy','medium','hard') DEFAULT 'easy',
  `blanks` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `listening_transcripts`
--

INSERT INTO `listening_transcripts` (`id`, `audio_file_id`, `level`, `blanks`, `created_at`) VALUES
(1, 1, 'easy', '[{\"index\": 0, \"length\": 6, \"position\": 11}, {\"index\": 1, \"length\": 8, \"position\": 116}]', '2025-06-18 14:47:28'),
(2, 1, 'medium', '[{\"index\": 0, \"length\": 6, \"position\": 11}, {\"index\": 1, \"length\": 8, \"position\": 116}, {\"index\": 2, \"length\": 9, \"position\": 237}]', '2025-06-18 14:49:52');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `parts`
--

CREATE TABLE `parts` (
  `id` int NOT NULL,
  `part_number` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `instruction` text,
  `difficulty_level` enum('easy','medium','hard') NOT NULL,
  `time_limit` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `parts`
--

INSERT INTO `parts` (`id`, `part_number`, `title`, `description`, `instruction`, `difficulty_level`, `time_limit`, `created_at`, `updated_at`) VALUES
(26, 1, 'Part 1 - Photographs', 'Photographs - 6 questions (1-6)', NULL, 'medium', 6, '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(27, 2, 'Part 2 - Question-Response', 'Question-Response - 25 questions (7-31)', NULL, 'medium', 25, '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(28, 3, 'Part 3 - Short Conversations', 'Short Conversations - 39 questions (32-70)', NULL, 'medium', 39, '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(29, 4, 'Part 4 - Short Talks', 'Short Talks - 30 questions (71-100)', NULL, 'medium', 30, '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(30, 5, 'Part 5 - Incomplete Sentences', 'Incomplete Sentences - 30 questions (101-130)', NULL, 'medium', 30, '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(31, 6, 'Part 6 - Text Completion', 'Text Completion - 16 questions (131-146)', NULL, 'medium', 16, '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(32, 7, 'Part 7 - Reading Comprehension', 'Reading Comprehension - 54 questions (147-200)', NULL, 'medium', 54, '2025-06-29 17:52:21', '2025-06-29 17:52:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `questions`
--

CREATE TABLE `questions` (
  `id` int NOT NULL,
  `part_id` int NOT NULL,
  `question_number` int DEFAULT NULL,
  `group_id` int DEFAULT NULL,
  `content` text,
  `question_type` enum('multiple_choice','fill_in_blank','matching','speaking','writing') DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `questions`
--

INSERT INTO `questions` (`id`, `part_id`, `question_number`, `group_id`, `content`, `question_type`, `image_url`, `created_at`, `updated_at`) VALUES
(212, 26, 1, 115, 'Listening question 1 for Part 1 - [Audio content description]', 'multiple_choice', 'toeic_full_test_-_ets_standard_2025/part1/1.png', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(213, 26, 2, 116, 'Listening question 2 for Part 1 - [Audio content description]', 'multiple_choice', 'toeic_full_test_-_ets_standard_2025/part1/2.png', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(214, 26, 3, 117, 'Listening question 3 for Part 1 - [Audio content description]', 'multiple_choice', 'toeic_full_test_-_ets_standard_2025/part1/3.png', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(215, 26, 4, 118, 'Listening question 4 for Part 1 - [Audio content description]', 'multiple_choice', 'toeic_full_test_-_ets_standard_2025/part1/4.png', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(216, 26, 5, 119, 'Listening question 5 for Part 1 - [Audio content description]', 'multiple_choice', 'toeic_full_test_-_ets_standard_2025/part1/5.png', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(217, 26, 6, 120, 'Listening question 6 for Part 1 - [Audio content description]', 'multiple_choice', 'toeic_full_test_-_ets_standard_2025/part1/6.png', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(218, 27, 7, 121, 'How old is this building?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(219, 27, 8, 122, 'Can you come to my jazz performance tonight?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(220, 27, 9, 123, 'Which apartment submitted a work order?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(221, 27, 10, 124, 'Will you contact the vendor about changing our delivery date?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(222, 27, 11, 125, 'Why was the maintenance worker here?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(223, 27, 12, 126, 'Did management make a hiring decision yet?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(224, 27, 13, 127, 'Do you want to eat here in our cafeteria or go out?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(225, 27, 14, 128, 'Didn’t you e-mail the employment contract to Mr. Patel yesterday?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(226, 27, 15, 129, 'Our division’s picnic is this Saturday, right?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(227, 27, 16, 130, 'Would you like coffee or tea?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(228, 27, 17, 131, 'We achieved our sales targets this month.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(229, 27, 18, 132, 'How often do you travel for your job?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(230, 27, 19, 133, 'We should hike the Wildflower Trail today.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(231, 27, 20, 134, 'You’ve booked a hotel in London, haven’t you?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(232, 27, 21, 135, 'Are there any tickets left for tonight’s concert?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(233, 27, 22, 136, 'Haven’t you used this software before?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(234, 27, 23, 137, 'When is the new blender going to be released?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(235, 27, 24, 138, 'Who’s picking up our clients at the airport?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(236, 27, 25, 139, 'Where are the red roses that came in this morning?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(237, 27, 26, 140, 'This film has been nominated for several awards.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(238, 27, 27, 141, 'Who’s interested in starting a car pool program?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(239, 27, 28, 142, 'Where will I teach my workshop this month?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(240, 27, 29, 143, 'Why are we moving these sweaters to the back of the store?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(241, 27, 30, 144, 'Would you be interested in working on some of these contracts?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(242, 27, 31, 145, 'What type of job are you looking for?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(243, 28, 32, 146, 'What event does the woman mention?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(244, 28, 33, 146, 'What does the woman ask for?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(245, 28, 34, 146, 'What does the man recommend doing?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(246, 28, 35, 147, 'What department do the speakers most likely work in?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(247, 28, 36, 147, 'What problem does the woman mention?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(248, 28, 37, 147, 'What does the man say he will do?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(249, 28, 38, 148, 'What industry do the speakers most likely work in?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(250, 28, 39, 148, 'What is the reason for a delay?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(251, 28, 40, 148, 'What does the man say he will do?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(252, 28, 41, 149, 'Why is the woman at the restaurant?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(253, 28, 42, 149, 'What does the woman mean when she says, “it’s very hot today”?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(254, 28, 43, 149, 'What does the man say about a parking garage?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(255, 28, 44, 150, 'Where does the woman most likely work?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(256, 28, 45, 150, 'What does Murat ask about?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(257, 28, 46, 150, 'What does the woman suggest doing?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(258, 28, 47, 151, 'What type of industry do the speakers most likely work in?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(259, 28, 48, 151, 'What business challenge are the speakers discussing?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(260, 28, 49, 151, 'What does the man say he will do?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(261, 28, 50, 152, 'Why is the man calling?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(262, 28, 51, 152, 'What does the man say a client is interested in doing?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(263, 28, 52, 152, 'What does the woman ask the man to send?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(264, 28, 53, 153, 'What problem does the woman mention?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(265, 28, 54, 153, 'Where do the speakers most likely work?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(266, 28, 55, 153, 'What does the man say he will do next?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(267, 28, 56, 154, 'Why is the man calling the woman?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(268, 28, 57, 154, 'Who most likely is the woman?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(269, 28, 58, 154, 'What will the woman most likely do next?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(270, 28, 59, 155, 'What are the speakers mainly discussing?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(271, 28, 60, 155, 'Why does the woman say, “they also talked about it last year”?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(272, 28, 61, 155, 'What does the woman want to avoid?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(273, 28, 62, 156, 'Who is a gift for?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(274, 28, 63, 156, 'Look at the graphic. What is the price of the item the man recommends?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(275, 28, 64, 156, 'What is the woman going to send to the man?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(276, 28, 65, 157, 'What type of art will be displayed in an exhibit?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(277, 28, 66, 157, 'Look at the graphic. Which piece of artwork will no longer be included?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(278, 28, 67, 157, 'What does the woman say she will do right away?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(279, 28, 68, 158, 'Who most likely are the speakers?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(280, 28, 69, 158, 'Look at the graphic. Which site has already been completed?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(281, 28, 70, 158, 'What does the man suggest focusing on?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(282, 29, 71, 159, 'Who has recorded the message?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(283, 29, 72, 159, 'What are the listeners asked to do?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(284, 29, 73, 159, 'What does the speaker say was mailed last week?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(285, 29, 74, 160, 'What is the topic of the episode?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(286, 29, 75, 160, 'What does the speaker emphasize about some tools?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(287, 29, 76, 160, 'What does the speaker recommend doing every year?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(288, 29, 77, 161, 'Who most likely is the speaker?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(289, 29, 78, 161, 'What will happen at two o’clock?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(290, 29, 79, 161, 'What is Orchid Caretakers?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(291, 29, 80, 162, 'What event is taking place?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(292, 29, 81, 162, 'What does the organization plan to do?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(293, 29, 82, 162, 'What does the speaker encourage the listeners to do?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(294, 29, 83, 163, 'What is the topic of the workshop?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(295, 29, 84, 163, 'What does the speaker imply when he says, “Erina’s at the back of the room”?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(296, 29, 85, 163, 'What will the listeners do next?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(297, 29, 86, 164, 'What is a historical site famous for?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(298, 29, 87, 164, 'Why does the speaker apologize?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(299, 29, 88, 164, 'What does the speaker ask the listeners to do?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(300, 29, 89, 165, 'What is the speaker mainly discussing?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(301, 29, 90, 165, 'What does the speaker imply when he says, “this is a priority”?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(302, 29, 91, 165, 'What will the listeners do next?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(303, 29, 92, 166, 'Where do the listeners most likely work?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(304, 29, 93, 166, 'What is the main purpose of the talk?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(305, 29, 94, 166, 'What does the speaker imply when she says, “That will require management approval”?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(306, 29, 95, 167, 'According to the speaker, what was recently completed?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(307, 29, 96, 167, 'Look at the graphic. Where does the speaker say refreshments will be served?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(308, 29, 97, 167, 'What are the listeners reminded to do?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(309, 29, 98, 168, 'What is the topic of today’s lecture?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(310, 29, 99, 168, 'Look at the graphic. At what depth should samples be collected this month?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(311, 29, 100, 168, 'What does the speaker encourage the listeners to do?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(312, 30, 101, 169, 'Former Sendai Company CEO Ken Nakata spoke about ------- career experiences.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(313, 30, 102, 170, 'Passengers who will be taking a ------- domestic flight should go to Terminal A.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(314, 30, 103, 171, 'Fresh and ------- apple-cider donuts are available at Oakcrest Orchard’s retail shop for £6 per dozen.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(315, 30, 104, 172, 'Zahn Flooring has the widest selection of ------- in the United Kingdom.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(316, 30, 105, 173, 'One responsibility of the IT department is to ensure that the company is using ------- software.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(317, 30, 106, 174, 'It is wise to check a company’s dress code ------- visiting its head office.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(318, 30, 107, 175, 'Wexler Store’s management team expects that employees will ------- support any new hires.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(319, 30, 108, 176, 'Wheel alignments and brake system ------- are part of our vehicle service plan.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(320, 30, 109, 177, 'Registration for the Marketing Coalition Conference is now open ------- September 30.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(321, 30, 110, 178, 'Growth in the home entertainment industry has been ------- this quarter.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(322, 30, 111, 179, 'Hawson Furniture will be making ------- on the east side of town on Thursday.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(323, 30, 112, 180, 'The Marlton City Council does not have the authority to ------- parking on city streets.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(324, 30, 113, 181, 'Project Earth Group is ------- for ways to reduce transport-related greenhouse gas emissions.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(325, 30, 114, 182, 'Our skilled tailors are happy to design a custom-made suit that fits your style and budget -------.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(326, 30, 115, 183, 'Project manager Hannah Chung has proved to be very ------- with completing company projects.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(327, 30, 116, 184, 'Lehua Vacation Club members will receive double points ------- the month of August at participating hotels.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(328, 30, 117, 185, 'The costumes were not received ------- enough to be used in the first dress rehearsal.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(329, 30, 118, 186, 'As a former publicist for several renowned orchestras, Mr. Wu would excel in the role of event -------.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(330, 30, 119, 187, 'The northbound lane on Davis Street will be ------- closed because of the city’s bridge reinforcement project.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(331, 30, 120, 188, 'Airline representatives must handle a wide range of passenger issues, ------- missed connections to lost luggage.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(332, 30, 121, 189, 'The meeting notes were ------- deleted, but Mr. Hahm was able to recreate them from memory.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(333, 30, 122, 190, 'The current issue of Farming Scene magazine predicts that the price of corn will rise 5 percent over the ------- year.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(334, 30, 123, 191, 'Anyone who still ------- to take the fire safety training should do so before the end of the month.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(335, 30, 124, 192, 'Emerging technologies have ------- begun to transform the shipping industry in ways that were once unimaginable.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(336, 30, 125, 193, 'The company handbook outlines the high ------- that employees are expected to meet every day.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(337, 30, 126, 194, 'Because ------- of the board members have scheduling conflicts, the board meeting will be moved to a date when all can attend.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(338, 30, 127, 195, 'The project ------- the collaboration of several teams across the company.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(339, 30, 128, 196, 'We cannot send the store’s coupon booklet to the printers until it ------- by Ms. Jeon.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(340, 30, 129, 197, '------- the closure of Verdigold Transport Services, we are looking for a new shipping company.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(341, 30, 130, 198, 'The ------- information provided by Uniss Bank\'s brochure helps applicants understand the terms of their loans.', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(342, 31, 131, 199, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(343, 31, 132, 199, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(344, 31, 133, 199, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(345, 31, 134, 199, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(346, 31, 135, 200, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(347, 31, 136, 200, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(348, 31, 137, 200, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(349, 31, 138, 200, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(350, 31, 139, 201, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(351, 31, 140, 201, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(352, 31, 141, 201, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(353, 31, 142, 201, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(354, 31, 143, 202, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(355, 31, 144, 202, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(356, 31, 145, 202, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(357, 31, 146, 202, '', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(358, 32, 147, 203, 'Where is the information most likely found?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(359, 32, 148, 203, 'What kind of item is most likely discussed?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(360, 32, 149, 204, 'What is suggested by the schedule?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(361, 32, 150, 204, 'What is indicated about 11:00 A.M. Winnipeg time?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(362, 32, 151, 205, 'What is indicated about the Bryant Foyer?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(363, 32, 152, 205, 'What is suggested about Andito’s?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(364, 32, 153, 206, 'At 1:00 p.m., what does Ms. Chi most likely mean when she writes, “Sure thing, Mina”?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(365, 32, 154, 206, 'What will happen next?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(366, 32, 155, 207, 'For whom is the notice most likely intended?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(367, 32, 156, 207, 'What does the notice indicate about the weather?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(368, 32, 157, 207, 'What service does the notice mention?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(369, 32, 158, 208, 'Where most likely is the notice posted?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(370, 32, 159, 208, 'What is stated about large bags?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(371, 32, 160, 208, 'In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? “Please refrain from making phone calls or texting at all times.”', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(372, 32, 161, 209, 'What is the main purpose of the e-mail?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(373, 32, 162, 209, 'What is suggested about Ms. Ayala?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(374, 32, 163, 209, 'What is indicated about the multilayer cake?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(375, 32, 164, 209, 'The word “judged” in paragraph 2, line 3, is closest in meaning to', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(376, 32, 165, 210, 'Why did Ms. Yakovleva choose the Dish Magic 300 dishwasher?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(377, 32, 166, 210, 'The word “running” in paragraph 1, line 7, is closest in meaning to', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(378, 32, 167, 210, 'What is indicated about Ms. Yakovleva?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(379, 32, 168, 211, 'For whom is the information intended?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(380, 32, 169, 211, 'In the information, what is NOT mentioned as being offered to employees?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(381, 32, 170, 211, 'What is mentioned about Skyler Airlines?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(382, 32, 171, 211, 'In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? “Our openings cover a broad range of skill sets.”', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(383, 32, 172, 212, 'What is indicated about a presentation?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(384, 32, 173, 212, 'At 9:22 A.M., what does Ms. Lorenz imply when she writes, “let’s not overlook that”?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(385, 32, 174, 212, 'Who most likely is Mr. Harven?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(386, 32, 175, 212, 'When do the writers plan to meet to review a slide presentation?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(387, 32, 176, 213, 'What is the purpose of the press release?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(388, 32, 177, 213, 'In the press release, the word “reflects” in paragraph 1, line 4, is closest in meaning to', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(389, 32, 178, 213, 'What is indicated about Kitchen Swifts?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(390, 32, 179, 213, 'What is most likely true about Ms. Guan?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(391, 32, 180, 213, 'What did Ms. Guan suggest about Enriqua’s in the review?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(392, 32, 181, 214, 'What is the purpose of the e-mail?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(393, 32, 182, 214, 'Why will Mr. Boyle travel from Stranraer to Kirkcolm?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(394, 32, 183, 214, 'What is indicated in the e-mail?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(395, 32, 184, 214, 'What is most likely true about Ms. Savard?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(396, 32, 185, 214, 'How is Mr. Boyle traveling to Cairnryan on June 5?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(397, 32, 186, 215, 'What is indicated about TTA?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(398, 32, 187, 215, 'According to the advertisement, what does TTA provide to students who finish a class?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(399, 32, 188, 215, 'What is most likely true about Mr. Egbe?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(400, 32, 189, 215, 'What TTA class is Mr. Egbe enrolled in?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(401, 32, 190, 215, 'What section did Mr. Egbe most likely add to the outline after speaking with Mr. Akpan?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(402, 32, 191, 216, 'What does the article mention about Orange Bay Kitchen?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(403, 32, 192, 216, 'According to the article, what is the most popular menu item at Orange Bay Kitchen?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(404, 32, 193, 216, 'What is suggested about Ms. Peterkin’s visit to Orange Bay Kitchen?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(405, 32, 194, 216, 'What is a purpose of the e-mail?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(406, 32, 195, 216, 'Whom did Ms. Peterkin meet at Orange Bay Kitchen?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(407, 32, 196, 217, 'What does the invoice suggest about Green Canyon?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(408, 32, 197, 217, 'Why most likely did Green Canyon receive a discount on its order dated June 10?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(409, 32, 198, 217, 'According to the notice, what is changing at Orbys Distributors?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(410, 32, 199, 217, 'What is suggested about Mr. Tesoriero?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(411, 32, 200, 217, 'What does Mr. Singh ask Ms. Peterson to do?', 'multiple_choice', '', '2025-06-29 17:52:21', '2025-06-29 17:52:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `question_groups`
--

CREATE TABLE `question_groups` (
  `id` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `question_groups`
--

INSERT INTO `question_groups` (`id`, `image_url`, `content`, `created_at`) VALUES
(115, NULL, 'Question group for part 1, question 1', '2025-06-29 10:52:21'),
(116, NULL, 'Question group for part 1, question 2', '2025-06-29 10:52:21'),
(117, NULL, 'Question group for part 1, question 3', '2025-06-29 10:52:21'),
(118, NULL, 'Question group for part 1, question 4', '2025-06-29 10:52:21'),
(119, NULL, 'Question group for part 1, question 5', '2025-06-29 10:52:21'),
(120, NULL, 'Question group for part 1, question 6', '2025-06-29 10:52:21'),
(121, NULL, 'Question group for part 2, question 7', '2025-06-29 10:52:21'),
(122, NULL, 'Question group for part 2, question 8', '2025-06-29 10:52:21'),
(123, NULL, 'Question group for part 2, question 9', '2025-06-29 10:52:21'),
(124, NULL, 'Question group for part 2, question 10', '2025-06-29 10:52:21'),
(125, NULL, 'Question group for part 2, question 11', '2025-06-29 10:52:21'),
(126, NULL, 'Question group for part 2, question 12', '2025-06-29 10:52:21'),
(127, NULL, 'Question group for part 2, question 13', '2025-06-29 10:52:21'),
(128, NULL, 'Question group for part 2, question 14', '2025-06-29 10:52:21'),
(129, NULL, 'Question group for part 2, question 15', '2025-06-29 10:52:21'),
(130, NULL, 'Question group for part 2, question 16', '2025-06-29 10:52:21'),
(131, NULL, 'Question group for part 2, question 17', '2025-06-29 10:52:21'),
(132, NULL, 'Question group for part 2, question 18', '2025-06-29 10:52:21'),
(133, NULL, 'Question group for part 2, question 19', '2025-06-29 10:52:21'),
(134, NULL, 'Question group for part 2, question 20', '2025-06-29 10:52:21'),
(135, NULL, 'Question group for part 2, question 21', '2025-06-29 10:52:21'),
(136, NULL, 'Question group for part 2, question 22', '2025-06-29 10:52:21'),
(137, NULL, 'Question group for part 2, question 23', '2025-06-29 10:52:21'),
(138, NULL, 'Question group for part 2, question 24', '2025-06-29 10:52:21'),
(139, NULL, 'Question group for part 2, question 25', '2025-06-29 10:52:21'),
(140, NULL, 'Question group for part 2, question 26', '2025-06-29 10:52:21'),
(141, NULL, 'Question group for part 2, question 27', '2025-06-29 10:52:21'),
(142, NULL, 'Question group for part 2, question 28', '2025-06-29 10:52:21'),
(143, NULL, 'Question group for part 2, question 29', '2025-06-29 10:52:21'),
(144, NULL, 'Question group for part 2, question 30', '2025-06-29 10:52:21'),
(145, NULL, 'Question group for part 2, question 31', '2025-06-29 10:52:21'),
(146, NULL, 'Reading passage for questions in group 1', '2025-06-29 10:52:21'),
(147, NULL, 'Reading passage for questions in group 2', '2025-06-29 10:52:21'),
(148, NULL, 'Reading passage for questions in group 3', '2025-06-29 10:52:21'),
(149, NULL, 'Reading passage for questions in group 4', '2025-06-29 10:52:21'),
(150, NULL, 'Reading passage for questions in group 5', '2025-06-29 10:52:21'),
(151, NULL, 'Reading passage for questions in group 6', '2025-06-29 10:52:21'),
(152, NULL, 'Reading passage for questions in group 7', '2025-06-29 10:52:21'),
(153, NULL, 'Reading passage for questions in group 8', '2025-06-29 10:52:21'),
(154, NULL, 'Reading passage for questions in group 9', '2025-06-29 10:52:21'),
(155, NULL, 'Reading passage for questions in group 10', '2025-06-29 10:52:21'),
(156, 'toeic_full_test_-_ets_standard_2025/part3/62-64.png', 'Reading passage for questions in group 11', '2025-06-29 10:52:21'),
(157, 'toeic_full_test_-_ets_standard_2025/part3/65-67.png', 'Reading passage for questions in group 12', '2025-06-29 10:52:21'),
(158, 'toeic_full_test_-_ets_standard_2025/part3/68-70.png', 'Reading passage for questions in group 13', '2025-06-29 10:52:21'),
(159, NULL, 'Reading passage for questions in group 14', '2025-06-29 10:52:21'),
(160, NULL, 'Reading passage for questions in group 15', '2025-06-29 10:52:21'),
(161, NULL, 'Reading passage for questions in group 16', '2025-06-29 10:52:21'),
(162, NULL, 'Reading passage for questions in group 17', '2025-06-29 10:52:21'),
(163, NULL, 'Reading passage for questions in group 18', '2025-06-29 10:52:21'),
(164, NULL, 'Reading passage for questions in group 19', '2025-06-29 10:52:21'),
(165, NULL, 'Reading passage for questions in group 20', '2025-06-29 10:52:21'),
(166, NULL, 'Reading passage for questions in group 21', '2025-06-29 10:52:21'),
(167, 'toeic_full_test_-_ets_standard_2025/part4/95-97.png', 'Reading passage for questions in group 22', '2025-06-29 10:52:21'),
(168, 'toeic_full_test_-_ets_standard_2025/part4/98-100.png', 'Reading passage for questions in group 23', '2025-06-29 10:52:21'),
(169, NULL, 'Question group for part 5, question 101', '2025-06-29 10:52:21'),
(170, NULL, 'Question group for part 5, question 102', '2025-06-29 10:52:21'),
(171, NULL, 'Question group for part 5, question 103', '2025-06-29 10:52:21'),
(172, NULL, 'Question group for part 5, question 104', '2025-06-29 10:52:21'),
(173, NULL, 'Question group for part 5, question 105', '2025-06-29 10:52:21'),
(174, NULL, 'Question group for part 5, question 106', '2025-06-29 10:52:21'),
(175, NULL, 'Question group for part 5, question 107', '2025-06-29 10:52:21'),
(176, NULL, 'Question group for part 5, question 108', '2025-06-29 10:52:21'),
(177, NULL, 'Question group for part 5, question 109', '2025-06-29 10:52:21'),
(178, NULL, 'Question group for part 5, question 110', '2025-06-29 10:52:21'),
(179, NULL, 'Question group for part 5, question 111', '2025-06-29 10:52:21'),
(180, NULL, 'Question group for part 5, question 112', '2025-06-29 10:52:21'),
(181, NULL, 'Question group for part 5, question 113', '2025-06-29 10:52:21'),
(182, NULL, 'Question group for part 5, question 114', '2025-06-29 10:52:21'),
(183, NULL, 'Question group for part 5, question 115', '2025-06-29 10:52:21'),
(184, NULL, 'Question group for part 5, question 116', '2025-06-29 10:52:21'),
(185, NULL, 'Question group for part 5, question 117', '2025-06-29 10:52:21'),
(186, NULL, 'Question group for part 5, question 118', '2025-06-29 10:52:21'),
(187, NULL, 'Question group for part 5, question 119', '2025-06-29 10:52:21'),
(188, NULL, 'Question group for part 5, question 120', '2025-06-29 10:52:21'),
(189, NULL, 'Question group for part 5, question 121', '2025-06-29 10:52:21'),
(190, NULL, 'Question group for part 5, question 122', '2025-06-29 10:52:21'),
(191, NULL, 'Question group for part 5, question 123', '2025-06-29 10:52:21'),
(192, NULL, 'Question group for part 5, question 124', '2025-06-29 10:52:21'),
(193, NULL, 'Question group for part 5, question 125', '2025-06-29 10:52:21'),
(194, NULL, 'Question group for part 5, question 126', '2025-06-29 10:52:21'),
(195, NULL, 'Question group for part 5, question 127', '2025-06-29 10:52:21'),
(196, NULL, 'Question group for part 5, question 128', '2025-06-29 10:52:21'),
(197, NULL, 'Question group for part 5, question 129', '2025-06-29 10:52:21'),
(198, NULL, 'Question group for part 5, question 130', '2025-06-29 10:52:21'),
(199, 'toeic_full_test_-_ets_standard_2025/part6/131-134.png', 'Reading passage for questions in group 24', '2025-06-29 10:52:21'),
(200, 'toeic_full_test_-_ets_standard_2025/part6/135-138.png', 'Reading passage for questions in group 25', '2025-06-29 10:52:21'),
(201, 'toeic_full_test_-_ets_standard_2025/part6/139-142.png', 'Reading passage for questions in group 26', '2025-06-29 10:52:21'),
(202, 'toeic_full_test_-_ets_standard_2025/part6/143-146.png', 'Reading passage for questions in group 27', '2025-06-29 10:52:21'),
(203, 'toeic_full_test_-_ets_standard_2025/part7/147-148.png', 'Reading passage for questions in group 28', '2025-06-29 10:52:21'),
(204, 'toeic_full_test_-_ets_standard_2025/part7/149-150.png', 'Reading passage for questions in group 29', '2025-06-29 10:52:21'),
(205, 'toeic_full_test_-_ets_standard_2025/part7/151-152.png', 'Reading passage for questions in group 30', '2025-06-29 10:52:21'),
(206, 'toeic_full_test_-_ets_standard_2025/part7/153-154.png', 'Reading passage for questions in group 31', '2025-06-29 10:52:21'),
(207, 'toeic_full_test_-_ets_standard_2025/part7/155-157.png', 'Reading passage for questions in group 32', '2025-06-29 10:52:21'),
(208, 'toeic_full_test_-_ets_standard_2025/part7/158-160.png', 'Reading passage for questions in group 33', '2025-06-29 10:52:21'),
(209, 'toeic_full_test_-_ets_standard_2025/part7/161-164.png', 'Reading passage for questions in group 34', '2025-06-29 10:52:21'),
(210, 'toeic_full_test_-_ets_standard_2025/part7/165-167.png', 'Reading passage for questions in group 35', '2025-06-29 10:52:21'),
(211, 'toeic_full_test_-_ets_standard_2025/part7/168-171.png', 'Reading passage for questions in group 36', '2025-06-29 10:52:21'),
(212, 'toeic_full_test_-_ets_standard_2025/part7/172-175.png', 'Reading passage for questions in group 37', '2025-06-29 10:52:21'),
(213, 'toeic_full_test_-_ets_standard_2025/part7/176-180.png toeic_full_test_-_ets_standard_2025/part7/176-180_2.png', 'Reading passage for questions in group 38', '2025-06-29 10:52:21'),
(214, 'toeic_full_test_-_ets_standard_2025/part7/181-185.png toeic_full_test_-_ets_standard_2025/part7/181-185_2.png', 'Reading passage for questions in group 39', '2025-06-29 10:52:21'),
(215, 'toeic_full_test_-_ets_standard_2025/part7/186-190.png toeic_full_test_-_ets_standard_2025/part7/186-190_2.png toeic_full_test_-_ets_standard_2025/part7/186-190_3.png', 'Reading passage for questions in group 40', '2025-06-29 10:52:21'),
(216, 'toeic_full_test_-_ets_standard_2025/part7/191-195.png toeic_full_test_-_ets_standard_2025/part7/191-195_2.png toeic_full_test_-_ets_standard_2025/part7/191-195_3.png', 'Reading passage for questions in group 41', '2025-06-29 10:52:21'),
(217, 'toeic_full_test_-_ets_standard_2025/part7/196-200.png toeic_full_test_-_ets_standard_2025/part7/196-200_2.png toeic_full_test_-_ets_standard_2025/part7/196-200_3.png', 'Reading passage for questions in group 42', '2025-06-29 10:52:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `skills`
--

CREATE TABLE `skills` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `speaking_writing_prompts`
--

CREATE TABLE `speaking_writing_prompts` (
  `id` int NOT NULL,
  `topic` varchar(255) DEFAULT NULL,
  `skill_id` int NOT NULL,
  `question` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `difficulty_level` enum('easy','medium','hard') DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `speaking_writing_submissions`
--

CREATE TABLE `speaking_writing_submissions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `prompt_id` int NOT NULL,
  `content` text,
  `file_path` varchar(255) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `ai_feedback_id` int DEFAULT NULL,
  `score` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `study_musics`
--

CREATE TABLE `study_musics` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `study_sessions`
--

CREATE TABLE `study_sessions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `activity_type` enum('exam','flashcard','listening','reading','speaking','writing') DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `translations`
--

CREATE TABLE `translations` (
  `id` int NOT NULL,
  `content_type` enum('question','answer','instruction','transcript','audio_transcript') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `content_id` int DEFAULT NULL,
  `vietnamese_text` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `translations`
--

INSERT INTO `translations` (`id`, `content_type`, `content_id`, `vietnamese_text`, `created_at`, `updated_at`) VALUES
(1, 'audio_transcript', 1, '1. (A) Cô ấy đang ăn trong khu vực dã ngoại.\n(B) Cô ấy đang xếp hàng tại một xe bán đồ ăn.\n(C) Cô ấy đang lau ghế dài.\n(D) Cô ấy đang vứt đĩa đi.\n\n2. (A) Người đàn ông đang phủi tuyết khỏi mái xe.\n(B) Người đàn ông đang đứng trong tuyết bên cạnh một chiếc xe.\n(C) Người đàn ông đang xúc tuyết khỏi lối đi.\n(D) Người đàn ông đang chạy qua tuyết.\n\n3. (A) Một số công nhân đang treo tranh trong một phòng trưng bày.\n(B) Hai người trong số họ đang trò chuyện.\n(C) Một trong những người đàn ông đang sắp xếp lại gối trên ghế sofa.\n(D) Một trong những người đàn ông đang vẽ tranh.\n\n4. (A) Các phương tiện đang vào một bãi đỗ xe.\n(B) Móc treo quần áo bị vứt rải rác trên mặt đất.\n(C) Các giá treo quần áo trống được xếp hàng cạnh một tòa nhà.\n(D) Quần áo được trưng bày dưới một chiếc lều.\n\n5. (A) Cây cảnh đã được treo từ trần nhà.\n(B) Ghế đã được xếp chồng lên nhau trước lối vào.\n(C) Một trạm máy tính đã được thiết lập trên bàn.\n(D) Một tấm thảm đã được cuộn lại dựa vào tường.\n\n6. (A) Một trong những người đàn ông đang quét sân.\n(B) Một trong những người đàn ông đang thay thế sàn nhà.\n(C) Cửa đã được tháo khỏi khung.\n(D) Một thiết bị chiếu sáng đã được để lại trên mặt đất.', '2025-06-18 15:02:03', '2025-06-18 15:02:03'),
(2, 'question', 1, 'Hãy giới thiệu về bản thân. Tên bạn là gì và bạn đến từ đâu?', '2025-06-24 08:27:59', '2025-06-24 08:27:59'),
(3, 'question', 2, 'Bạn làm công việc gì hoặc học tập như thế nào? Bạn có thể mô tả thói quen hàng ngày của mình không?', '2025-06-24 08:27:59', '2025-06-24 08:27:59'),
(4, 'question', 3, 'Sở thích và mối quan tâm của bạn là gì? Tại sao bạn thích những điều đó?', '2025-06-24 08:27:59', '2025-06-24 08:27:59'),
(5, 'question', 4, 'Mô tả chi tiết bức tranh này. Bạn nhìn thấy gì và chuyện gì đang xảy ra?', '2025-06-24 08:27:59', '2025-06-24 08:27:59'),
(6, 'question', 5, 'Bức tranh này khiến bạn cảm thấy như thế nào? Nó gợi lên những kỷ niệm hay suy nghĩ gì?', '2025-06-24 08:27:59', '2025-06-24 08:27:59'),
(7, 'question', 6, 'Nếu bạn ở trong tình huống này, bạn sẽ làm gì? Giải thích lựa chọn của bạn.', '2025-06-24 08:27:59', '2025-06-24 08:27:59'),
(8, 'question', 7, 'Bạn có nghĩ rằng công nghệ có tác động tích cực hay tiêu cực hơn đến giao tiếp? Giải thích quan điểm của bạn.', '2025-06-24 08:27:59', '2025-06-24 08:27:59'),
(9, 'question', 8, 'Đặc điểm quan trọng nhất của một người bạn tốt là gì? Đưa ra lý do và ví dụ.', '2025-06-24 08:27:59', '2025-06-24 08:27:59'),
(10, 'question', 9, 'Có nên bắt buộc học sinh học ngoại ngữ không? Tại sao có hoặc tại sao không?', '2025-06-24 08:27:59', '2025-06-24 08:27:59'),
(11, 'question', 10, 'Bạn nghĩ các thành phố sẽ thay đổi như thế nào trong 20 năm tới? Bạn muốn thấy những cải tiến nào?', '2025-06-24 08:27:59', '2025-06-24 08:27:59'),
(12, 'question', 11, 'Bạn sẽ khuyên gì cho ai đó muốn cải thiện kỹ năng nói tiếng Anh của mình?', '2025-06-24 08:27:59', '2025-06-24 08:27:59'),
(13, 'question', 12, 'Câu hỏi nghe 1 cho Part 1 - [Mô tả nội dung audio]', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(14, 'question', 13, 'Câu hỏi nghe 2 cho Part 1 - [Mô tả nội dung audio]', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(15, 'question', 14, 'Câu hỏi nghe 3 cho Part 1 - [Mô tả nội dung audio]', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(16, 'question', 15, 'Câu hỏi nghe 4 cho Part 1 - [Mô tả nội dung audio]', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(17, 'question', 16, 'Câu hỏi nghe 5 cho Part 1 - [Mô tả nội dung audio]', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(18, 'question', 17, 'Câu hỏi nghe 6 cho Part 1 - [Mô tả nội dung audio]', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(19, 'question', 18, 'Tòa nhà này bao nhiêu tuổi?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(20, 'question', 19, 'Bạn có thể đến buổi trình diễn nhạc jazz tối nay?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(21, 'question', 20, 'Căn hộ nào đã gửi yêu cầu sửa chữa?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(22, 'question', 21, 'Bạn sẽ liên hệ nhà cung cấp để đổi ngày giao hàng?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(23, 'question', 22, 'Tại sao nhân viên bảo trì có mặt?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(24, 'question', 23, 'Ban quản lý đã đưa ra quyết định tuyển dụng chưa?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(25, 'question', 24, 'Bạn muốn ăn ở nhà ăn của chúng tôi hay ra ngoài?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(26, 'question', 25, 'Hôm qua bạn không gửi hợp đồng lao động cho ông Patel sao?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(27, 'question', 26, 'Buổi dã ngoại của phòng chúng ta vào thứ Bảy này đúng không?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(28, 'question', 27, 'Bạn muốn cà phê hay trà?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(29, 'question', 28, 'Chúng tôi đã đạt chỉ tiêu doanh số tháng này.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(30, 'question', 29, 'Bạn thường đi công tác cho công việc bao lâu một lần?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(31, 'question', 30, 'Hôm nay chúng ta nên leo đường mòn hoa dại.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(32, 'question', 31, 'Bạn đã đặt phòng khách sạn ở London rồi phải không?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(33, 'question', 32, 'Còn vé cho buổi hòa nhạc tối nay không?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(34, 'question', 33, 'Bạn chưa từng sử dụng phần mềm này trước đây sao?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(35, 'question', 34, 'Khi nào máy xay sinh tố mới sẽ được phát hành?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(36, 'question', 35, 'Ai sẽ đón khách hàng của chúng ta ở sân bay?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(37, 'question', 36, 'Những bông hồng đỏ đến sáng nay đang ở đâu?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(38, 'question', 37, 'Bộ phim này đã được đề cử cho nhiều giải thưởng.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(39, 'question', 38, 'Ai quan tâm đến việc khởi động chương trình đi chung xe?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(40, 'question', 39, 'Tôi sẽ giảng dạy hội thảo của mình ở đâu trong tháng này?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(41, 'question', 40, 'Tại sao chúng ta chuyển những áo len này ra phía sau cửa hàng?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(42, 'question', 41, 'Bạn có hứng thú làm việc với một số hợp đồng này không?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(43, 'question', 42, 'Bạn đang tìm kiếm loại công việc nào?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(44, 'question', 43, 'Người phụ nữ nhắc đến sự kiện gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(45, 'question', 44, 'Người phụ nữ yêu cầu điều gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(46, 'question', 45, 'Người đàn ông khuyên nên làm gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(47, 'question', 46, 'Những người nói chuyện có khả năng làm ở bộ phận nào nhất?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(48, 'question', 47, 'Người phụ nữ đề cập đến vấn đề gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(49, 'question', 48, 'Người đàn ông nói anh ấy sẽ làm gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(50, 'question', 49, 'Những người nói chuyện có khả năng làm trong ngành nào nhất?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(51, 'question', 50, 'Nguyên nhân gây ra sự chậm trễ là gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(52, 'question', 51, 'Người đàn ông nói anh ấy sẽ làm gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(53, 'question', 52, 'Tại sao người phụ nữ lại có mặt tại nhà hàng?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(54, 'question', 53, 'Người phụ nữ có ý gì khi nói \"hôm nay rất nóng\"?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(55, 'question', 54, 'Người đàn ông nói gì về bãi đậu xe?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(56, 'question', 55, 'Người phụ nữ có khả năng làm việc ở đâu?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(57, 'question', 56, 'Murat hỏi về điều gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(58, 'question', 57, 'Người phụ nữ đề xuất làm gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(59, 'question', 58, 'Người nói có khả năng đang làm việc trong ngành gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(60, 'question', 59, 'Họ đang thảo luận về thách thức kinh doanh nào?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(61, 'question', 60, 'Người đàn ông nói rằng anh ấy sẽ làm gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(62, 'question', 61, 'Tại sao người đàn ông gọi điện?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(63, 'question', 62, 'Người đàn ông nói khách hàng quan tâm đến điều gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(64, 'question', 63, 'Người phụ nữ yêu cầu người đàn ông gửi gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(65, 'question', 64, 'Người phụ nữ đề cập đến vấn đề gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(66, 'question', 65, 'Người nói có khả năng làm việc ở đâu?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(67, 'question', 66, 'Người đàn ông nói anh ấy sẽ làm gì tiếp theo?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(68, 'question', 67, 'Tại sao người đàn ông gọi cho người phụ nữ?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(69, 'question', 68, 'Người phụ nữ có khả năng là ai?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(70, 'question', 69, 'Người phụ nữ có khả năng sẽ làm gì tiếp theo?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(71, 'question', 70, 'Người nói chủ yếu đang thảo luận về điều gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(72, 'question', 71, 'Tại sao người phụ nữ lại nói \"họ đã nói về điều đó vào năm ngoái\"?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(73, 'question', 72, 'Người phụ nữ muốn tránh điều gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(74, 'question', 73, 'Món quà dành cho ai?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(75, 'question', 74, 'Nhìn vào hình. Giá của món mà người đàn ông gợi ý là bao nhiêu?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(76, 'question', 75, 'Người phụ nữ sẽ gửi gì cho người đàn ông?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(77, 'question', 76, 'Loại hình nghệ thuật nào sẽ được trưng bày trong triển lãm?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(78, 'question', 77, 'Tác phẩm nào sẽ không còn được trưng bày?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(79, 'question', 78, 'Người phụ nữ nói rằng cô ấy sẽ làm gì ngay lập tức?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(80, 'question', 79, 'Những người nói có khả năng là ai nhất?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(81, 'question', 80, 'Nhìn vào sơ đồ. Địa điểm nào đã hoàn tất?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(82, 'question', 81, 'Người đàn ông đề nghị tập trung vào điều gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(83, 'question', 82, 'Ai là người đã ghi âm tin nhắn này?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(84, 'question', 83, 'Người nghe được yêu cầu làm gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(85, 'question', 84, 'Người nói cho biết điều gì đã được gửi qua đường bưu điện vào tuần trước?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(86, 'question', 85, 'Chủ đề của tập hôm nay là gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(87, 'question', 86, 'Người nói nhấn mạnh điều gì về một số dụng cụ?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(88, 'question', 87, 'Người nói khuyên nên làm gì mỗi năm?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(89, 'question', 88, 'Người nói có khả năng là ai nhất?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(90, 'question', 89, 'Điều gì sẽ xảy ra lúc 2 giờ?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(91, 'question', 90, 'Orchid Caretakers là gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(92, 'question', 91, 'Sự kiện nào đang diễn ra?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(93, 'question', 92, 'Tổ chức này dự định làm gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(94, 'question', 93, 'Người nói khuyến khích người nghe làm gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(95, 'question', 94, 'Chủ đề của buổi hội thảo là gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(96, 'question', 95, 'Người nói ngụ ý gì khi nói \"Erina đang ở cuối phòng\"?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(97, 'question', 96, 'Những người tham dự sẽ làm gì tiếp theo?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(98, 'question', 97, 'Di tích lịch sử này nổi tiếng vì điều gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(99, 'question', 98, 'Tại sao người nói xin lỗi?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(100, 'question', 99, 'Người nói yêu cầu người nghe làm gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(101, 'question', 100, 'Người nói đang thảo luận chủ yếu về điều gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(102, 'question', 101, 'Người nói ngụ ý gì khi nói “đây là ưu tiên”?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(103, 'question', 102, 'Người nghe sẽ làm gì tiếp theo?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(104, 'question', 103, 'Những người nghe có khả năng làm việc ở đâu?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(105, 'question', 104, 'Mục đích chính của bài nói là gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(106, 'question', 105, 'Người nói ngụ ý gì khi nói “Điều đó sẽ cần sự phê duyệt của ban quản lý”?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(107, 'question', 106, 'Theo người nói, điều gì vừa được hoàn thành gần đây?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(108, 'question', 107, 'Nhìn vào sơ đồ. Người nói cho biết đồ ăn nhẹ sẽ được phục vụ ở đâu?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(109, 'question', 108, 'Người nghe được nhắc nhở làm gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(110, 'question', 109, 'Chủ đề của buổi thuyết trình hôm nay là gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(111, 'question', 110, 'Nhìn vào biểu đồ. Mẫu đất nên được lấy ở độ sâu nào tháng này?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(112, 'question', 111, 'Người nói khuyến khích người nghe làm gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(113, 'question', 112, 'Cựu CEO Công ty Sendai, ông Ken Nakata, đã nói về kinh nghiệm nghề nghiệp ------- của mình.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(114, 'question', 113, 'Hành khách bay chuyến nội địa ------- nên đến nhà ga A.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(115, 'question', 114, 'Những chiếc bánh donut táo tươi và ------- được bán tại cửa hàng bán lẻ Oakcrest Orchard với giá £6 mỗi tá.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(116, 'question', 115, 'Zahn Flooring có nhiều lựa chọn ------- nhất ở Vương quốc Anh.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(117, 'question', 116, 'Một trách nhiệm của bộ phận CNTT là đảm bảo rằng công ty đang sử dụng phần mềm -------.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(118, 'question', 117, 'Nên kiểm tra quy định về trang phục của công ty ------- đến trụ sở chính.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(119, 'question', 118, 'Ban quản lý của cửa hàng Wexler kỳ vọng rằng nhân viên sẽ ------- hỗ trợ những người mới được tuyển dụng.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(120, 'question', 119, 'Căn chỉnh bánh xe và ------- hệ thống phanh là một phần trong gói dịch vụ xe của chúng tôi.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(121, 'question', 120, 'Đăng ký Hội nghị Liên minh Tiếp thị hiện đã mở ------- ngày 30 tháng 9.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(122, 'question', 121, 'Tăng trưởng trong ngành giải trí gia đình đã ------- trong quý này.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(123, 'question', 122, 'Hawson Furniture sẽ thực hiện ------- ở phía đông thị trấn vào thứ Năm.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(124, 'question', 123, 'Hội đồng thành phố Marlton không có thẩm quyền để ------- việc đỗ xe trên các con phố trong thành phố.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(125, 'question', 124, 'Tổ chức Project Earth đang ------- những cách để giảm khí nhà kính liên quan đến giao thông vận tải.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(126, 'question', 125, 'Thợ may lành nghề của chúng tôi sẵn sàng thiết kế một bộ vest may đo phù hợp với phong cách và ngân sách của bạn một cách -------.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(127, 'question', 126, 'Quản lý dự án Hannah Chung đã chứng tỏ mình rất ------- trong việc hoàn thành các dự án của công ty.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(128, 'question', 127, 'Thành viên Câu lạc bộ Kỳ nghỉ Lehua sẽ nhận được điểm gấp đôi ------- tháng 8 tại các khách sạn tham gia.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(129, 'question', 128, 'Trang phục không được nhận ------- để sử dụng trong buổi tổng duyệt đầu tiên.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(130, 'question', 129, 'Là một cựu chuyên gia truyền thông cho nhiều dàn nhạc nổi tiếng, ông Wu sẽ xuất sắc trong vai trò ------- sự kiện.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(131, 'question', 130, 'Làn đường hướng bắc trên đường Davis sẽ bị ------- đóng do dự án gia cố cầu của thành phố.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(132, 'question', 131, 'Đại diện hãng hàng không phải xử lý nhiều vấn đề của hành khách, ------- từ các chuyến bay bị lỡ đến hành lý bị thất lạc.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(133, 'question', 132, 'Các ghi chú cuộc họp đã bị xóa -------, nhưng ông Hahm đã có thể tái tạo chúng từ trí nhớ.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(134, 'question', 133, 'Số báo hiện tại của tạp chí Farming Scene dự đoán giá ngô sẽ tăng 5% trong ------- năm.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(135, 'question', 134, 'Bất kỳ ai vẫn còn ------- tham gia khóa đào tạo an toàn phòng cháy nên làm điều đó trước cuối tháng.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(136, 'question', 135, 'Các công nghệ mới nổi đã ------- bắt đầu chuyển đổi ngành vận tải theo những cách từng không thể tưởng tượng được.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(137, 'question', 136, 'Sổ tay công ty phác thảo các ------- cao mà nhân viên được kỳ vọng phải đáp ứng mỗi ngày.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(138, 'question', 137, 'Bởi vì ------- các thành viên hội đồng có xung đột lịch trình, cuộc họp sẽ được dời sang một ngày mà tất cả có thể tham dự.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(139, 'question', 138, 'Dự án này ------- sự hợp tác của nhiều nhóm trong toàn công ty.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(140, 'question', 139, 'Chúng tôi không thể gửi sổ phiếu giảm giá của cửa hàng đến nhà in cho đến khi nó được ------- bởi cô Jeon.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(141, 'question', 140, '------- việc đóng cửa của Verdigold Transport Services, chúng tôi đang tìm kiếm một công ty vận chuyển mới.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(142, 'question', 141, 'Thông tin ------- được cung cấp bởi tài liệu quảng cáo của Ngân hàng Uniss giúp người nộp đơn hiểu các điều khoản vay của họ.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(143, 'question', 158, 'Thông tin này có khả năng được tìm thấy ở đâu nhất?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(144, 'question', 159, 'Mặt hàng nào đang được nói đến nhiều khả năng nhất?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(145, 'question', 160, 'Lịch trình gợi ý điều gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(146, 'question', 161, 'Điều gì được chỉ ra về thời gian 11:00 sáng theo giờ Winnipeg?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(147, 'question', 162, 'Điều gì được chỉ ra về sảnh Bryant?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(148, 'question', 163, 'Điều gì được gợi ý về nhà hàng Andito’s?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(149, 'question', 164, 'Lúc 1:00 chiều, cô Chi có khả năng nhất muốn nói gì khi viết: “Chắc chắn rồi, Mina”?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(150, 'question', 165, 'Điều gì sẽ xảy ra tiếp theo?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(151, 'question', 166, 'Thông báo này có khả năng dành cho ai nhất?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(152, 'question', 167, 'Thông báo nói gì về thời tiết?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(153, 'question', 168, 'Thông báo đề cập đến dịch vụ nào?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(154, 'question', 169, 'Thông báo này có khả năng được dán ở đâu nhất?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(155, 'question', 170, 'Thông báo nói gì về túi xách lớn?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(156, 'question', 171, 'Câu sau phù hợp với vị trí nào trong các vị trí [1], [2], [3], [4]? “Vui lòng không gọi điện hoặc nhắn tin trong mọi thời điểm.”', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(157, 'question', 172, 'Mục đích chính của email là gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(158, 'question', 173, 'Điều gì được gợi ý về cô Ayala?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(159, 'question', 174, 'Điều gì được nói về chiếc bánh nhiều lớp?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(160, 'question', 175, 'Từ “judged” trong đoạn 2, dòng 3 gần nghĩa nhất với từ nào sau đây?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(161, 'question', 176, 'Tại sao cô Yakovleva chọn máy rửa chén Dish Magic 300?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(162, 'question', 177, 'Từ “running” trong đoạn 1, dòng 7 gần nghĩa nhất với từ nào?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(163, 'question', 178, 'Điều gì được nói về cô Yakovleva?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(164, 'question', 179, 'Thông tin này dành cho ai?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(165, 'question', 180, 'Thông tin không đề cập đến lợi ích nào dành cho nhân viên?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(166, 'question', 181, 'Có thông tin gì về Skyler Airlines?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(167, 'question', 182, 'Câu sau phù hợp với vị trí nào: “Cơ hội việc làm của chúng tôi bao gồm nhiều nhóm kỹ năng.”', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(168, 'question', 183, 'Điều gì được chỉ ra về bài thuyết trình?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(169, 'question', 184, 'Vào 9:22 sáng, bà Lorenz ngụ ý điều gì khi viết: “chúng ta đừng bỏ qua điều đó”?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(170, 'question', 185, 'Ông Harven có khả năng là ai?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(171, 'question', 186, 'Khi nào các tác giả dự định họp để xem xét bài thuyết trình?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(172, 'question', 187, 'Mục đích của thông cáo báo chí là gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(173, 'question', 188, 'Trong thông cáo báo chí, từ \"reflects\" trong đoạn 1, dòng 4 gần nghĩa nhất với?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(174, 'question', 189, 'Điều gì được chỉ ra về Kitchen Swifts?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(175, 'question', 190, 'Điều gì có khả năng đúng về cô Guan?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(176, 'question', 191, 'Cô Guan gợi ý điều gì về Enriqua’s trong bài đánh giá?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(177, 'question', 192, 'Mục đích của email là gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(178, 'question', 193, 'Tại sao ông Boyle sẽ đi từ Stranraer đến Kirkcolm?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(179, 'question', 194, 'Điều gì được thể hiện trong email?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(180, 'question', 195, 'Điều gì có khả năng đúng về cô Savard?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(181, 'question', 196, 'Ông Boyle sẽ đi đến Cairnryan vào ngày 5 tháng 6 bằng phương tiện gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(182, 'question', 197, 'Điều gì được thể hiện về TTA?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(183, 'question', 198, 'Theo quảng cáo, TTA cung cấp gì cho học viên sau khi hoàn thành lớp học?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(184, 'question', 199, 'Điều gì có khả năng đúng về ông Egbe?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(185, 'question', 200, 'Ông Egbe đã đăng ký lớp học TTA nào?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(186, 'question', 201, 'Ông Egbe có khả năng đã thêm phần nào vào đề cương sau khi nói chuyện với ông Akpan?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(187, 'question', 202, 'Bài báo đề cập điều gì về Orange Bay Kitchen?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(188, 'question', 203, 'Theo bài báo, món ăn phổ biến nhất tại Orange Bay Kitchen là gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(189, 'question', 204, 'Điều gì được gợi ý về chuyến thăm của cô Peterkin đến Orange Bay Kitchen?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(190, 'question', 205, 'Mục đích của e-mail là gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(191, 'question', 206, 'Cô Peterkin đã gặp ai tại Orange Bay Kitchen?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(192, 'question', 207, 'Hóa đơn cho thấy điều gì về Green Canyon?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(193, 'question', 208, 'Vì sao Green Canyon có thể được giảm giá cho đơn hàng ngày 10 tháng 6?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(194, 'question', 209, 'Theo thông báo, điều gì đang thay đổi tại Orbys Distributors?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(195, 'question', 210, 'Điều gì được gợi ý về ông Tesoriero?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(196, 'question', 211, 'Mr. Singh yêu cầu cô Peterson làm gì?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(197, 'answer', 1, 'A. Cô ấy đang ăn ở khu vực picnic.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(198, 'answer', 2, 'B. Cô ấy đang xếp hàng ở xe bán đồ ăn.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(199, 'answer', 3, 'C. Cô ấy đang lau ghế dài.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(200, 'answer', 4, 'D. Cô ấy đang vứt bỏ một cái đĩa.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(201, 'answer', 5, 'A. Người đàn ông đang phủi tuyết khỏi nóc xe.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(202, 'answer', 6, 'B. Người đàn ông đang đứng cạnh xe trên tuyết.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(203, 'answer', 7, 'C. Người đàn ông đang xúc tuyết trên lối đi.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(204, 'answer', 8, 'D. Người đàn ông đang chạy qua tuyết.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(205, 'answer', 9, 'A. Một số nhân viên đang treo tranh trong phòng trưng bày.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(206, 'answer', 10, 'B. Hai người đang trò chuyện với nhau.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(207, 'answer', 11, 'C. Một người đàn ông đang sắp xếp gối trên ghế sofa.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(208, 'answer', 12, 'D. Một người đàn ông đang vẽ tranh.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(209, 'answer', 13, 'A. Xe đang đi vào bãi đậu xe.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(210, 'answer', 14, 'B. Móc quần áo nằm rải rác trên mặt đất.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(211, 'answer', 15, 'C. Giá đỡ trống được xếp dọc theo tòa nhà.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(212, 'answer', 16, 'D. Quần áo đang được trưng bày dưới một chiếc lều.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(213, 'answer', 17, 'A. Cây chậu được treo từ trần nhà.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(214, 'answer', 18, 'B. Ghế được xếp chồng trước lối vào.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(215, 'answer', 19, 'C. Một trạm máy tính được lắp đặt trên bàn.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(216, 'answer', 20, 'D. Một tấm thảm được cuộn lại đặt cạnh tường.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(217, 'answer', 21, 'A. Một người đàn ông đang quét sân.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(218, 'answer', 22, 'B. Một người đàn ông đang thay sàn nhà.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(219, 'answer', 23, 'C. Một cánh cửa đã bị tháo khỏi khung.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(220, 'answer', 24, 'D. Đèn chiếu sáng đã được đặt trên sàn.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(221, 'answer', 25, 'A. Để vận chuyển vật liệu.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(222, 'answer', 26, 'B. Khoảng mười năm.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(223, 'answer', 27, 'C. Tôi nghĩ là văn phòng công ty.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(224, 'answer', 28, 'A. Tôi xin lỗi vì đến muộn cuộc họp.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(225, 'answer', 29, 'B. Chủ yếu là nhạc sĩ địa phương.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(226, 'answer', 30, 'C. Chắc chắn rồi, tôi sẽ đến!', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(227, 'answer', 31, 'A. Đó là việc bạn làm để kiếm sống.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(228, 'answer', 32, 'B. Nộp bài tập ở đây.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(229, 'answer', 33, 'C. Nó đến từ người thuê căn B23.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(230, 'answer', 34, 'A. Tất nhiên rồi, tôi sẽ lo liệu.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(231, 'answer', 35, 'B. Biên lai qua email.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(232, 'answer', 36, 'C. Tôi có thể đổi tiền lẻ không?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(233, 'answer', 37, 'A. Không, anh ấy không đến.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(234, 'answer', 38, 'B. Từ ba giờ đến bốn giờ.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(235, 'answer', 39, 'C. Vì một bóng đèn cần sửa.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(236, 'answer', 40, 'A. Đặt nó lên kệ cao nhất.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(237, 'answer', 41, 'B. Phòng nhân sự.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(238, 'answer', 42, 'C. Vâng, họ đã chọn Jacob Borgman.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(239, 'answer', 43, 'A. Anh ấy đã đến đó hôm qua.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(240, 'answer', 44, 'B. Ừm, có thể là một cái sandwich.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(241, 'answer', 45, 'C. Hãy ăn ở đây.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(242, 'answer', 46, 'A. Vâng, tôi đồng ý.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(243, 'answer', 47, 'B. Không, tôi sẽ gửi ngay bây giờ.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(244, 'answer', 48, 'C. Kiểm tra sổ tay nhân viên.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(245, 'answer', 49, 'A. Dự báo có nhiều mưa.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(246, 'answer', 50, 'B. Tất nhiên, tôi thích salad.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(247, 'answer', 51, 'C. Ở cuối hành lang này.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(248, 'answer', 52, 'A. Cho tôi nước lọc thôi.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(249, 'answer', 53, 'B. Thêm vài đô nữa.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(250, 'answer', 54, 'C. Nghỉ giải lao 15 phút.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(251, 'answer', 55, 'A. Đó là tin tuyệt vời!', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(252, 'answer', 56, 'B. Vài lần mỗi ngày.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(253, 'answer', 57, 'C. Đến cuối tháng Tư.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(254, 'answer', 58, 'A. Mọi việc ổn cả.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(255, 'answer', 59, 'B. Vâng, tôi đã tìm được một cái.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(256, 'answer', 60, 'C. Khoảng một lần mỗi tháng.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(257, 'answer', 61, 'A. Ghế này còn trống.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(258, 'answer', 62, 'B. Tôi không mang theo giày leo núi.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(259, 'answer', 63, 'C. Ở trung tâm khách tham quan.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(260, 'answer', 64, 'A. Rất thú vị, cảm ơn.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(261, 'answer', 65, 'B. Anh ấy thường đi tàu.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(262, 'answer', 66, 'C. Vâng, tôi đã đặt phòng từ tuần trước.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(263, 'answer', 67, 'A. Đã bán hết rồi.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(264, 'answer', 68, 'B. Anh ấy là nghệ sĩ vĩ cầm.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(265, 'answer', 69, 'C. Họ đã đi rồi.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(266, 'answer', 70, 'A. Tôi có thể ghi món của bạn không?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(267, 'answer', 71, 'B. Tôi chưa có cơ hội.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(268, 'answer', 72, 'C. Khoảng 40 đô.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(269, 'answer', 73, 'A. Chỉ dùng với rau củ quả thôi.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(270, 'answer', 74, 'B. Trong tủ bếp.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(271, 'answer', 75, 'C. Sản phẩm mẫu vẫn đang được thử nghiệm.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(272, 'answer', 76, 'A. Họ quyết định tự lái xe.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(273, 'answer', 77, 'B. Ở ga số 2.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(274, 'answer', 78, 'C. Đó là vị trí tiếp thị.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(275, 'answer', 79, 'A. Khoảng ba lít nước.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(276, 'answer', 80, 'B. Không, tôi chưa kiểm tra đợt giảm giá.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(277, 'answer', 81, 'C. Tôi cần một ít để làm bó hoa lớn.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(278, 'answer', 82, 'A. Sao chúng ta không đi xem?', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(279, 'answer', 83, 'B. Sau khi công bố.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(280, 'answer', 84, 'C. Anh ấy có bài phát biểu hay.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(281, 'answer', 85, 'A. Cảm ơn, nhưng tôi không biết bơi.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(282, 'answer', 86, 'B. Clara đã bắt đầu tổ chức rồi.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(283, 'answer', 87, 'C. Đó là một bài viết rất thú vị.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(284, 'answer', 88, 'A. Chúng tôi vừa gửi email cho tất cả giảng viên.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(285, 'answer', 89, 'B. 5 đến 7 tháng.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(286, 'answer', 90, 'C. Vâng, đó là một tòa nhà đẹp.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(287, 'answer', 91, 'A. Trung tâm mua sắm mới.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(288, 'answer', 92, 'B. Vâng, chúng có màu khác.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(289, 'answer', 93, 'C. Hàng hóa mùa xuân của chúng ta sắp đến rồi.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(290, 'answer', 94, 'A. Cảm ơn vì đã gặp tôi.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(291, 'answer', 95, 'B. Đơn thuốc kính áp tròng.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(292, 'answer', 96, 'C. Tôi có rất ít thời gian.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(293, 'answer', 97, 'A. Không, lúc 10 giờ sáng.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(294, 'answer', 98, 'B. Tôi thực sự thích làm việc với máy tính.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(295, 'answer', 99, 'C. Chỉ cần một sơ yếu lý lịch là đủ.', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(296, 'answer', 100, 'A. Hội chợ việc làm', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(297, 'answer', 101, 'B. Lớp học nấu ăn', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(298, 'answer', 102, 'C. Buổi gây quỹ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(299, 'answer', 103, 'D. Buổi dã ngoại công ty', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(300, 'answer', 104, 'A. Danh sách khách mời', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(301, 'answer', 105, 'B. Công thức món tráng miệng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(302, 'answer', 106, 'C. Danh thiếp', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(303, 'answer', 107, 'D. Mã khuyến mãi', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(304, 'answer', 108, 'A. Trả lại một số hàng hóa', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(305, 'answer', 109, 'B. Xem một video', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(306, 'answer', 110, 'C. Tạo tài khoản', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(307, 'answer', 111, 'D. Đọc một bài đánh giá', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(308, 'answer', 112, 'A. Kế toán', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(309, 'answer', 113, 'B. Nghiên cứu và phát triển', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(310, 'answer', 114, 'C. Bảo trì', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(311, 'answer', 115, 'D. Tiếp thị', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(312, 'answer', 116, 'A. Báo cáo chưa được nộp', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(313, 'answer', 117, 'B. Hóa đơn không chính xác', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(314, 'answer', 118, 'C. Chính sách không được tuân thủ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(315, 'answer', 119, 'D. Đơn hàng chưa được giao', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(316, 'answer', 120, 'A. Xóa một tệp điện tử', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(317, 'answer', 121, 'B. Phê duyệt hoàn tiền', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(318, 'answer', 122, 'C. Sắp xếp cuộc họp bán hàng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(319, 'answer', 123, 'D. Xem xét bảng tính', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(320, 'answer', 124, 'A. Vận chuyển', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(321, 'answer', 125, 'B. Sản xuất', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(322, 'answer', 126, 'C. Dịch vụ khách hàng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(323, 'answer', 127, 'D. Khí tượng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(324, 'answer', 128, 'A. Lịch trình viết sai', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(325, 'answer', 129, 'B. Thiết bị chưa được lắp đặt đúng cách', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(326, 'answer', 130, 'C. Thời tiết xấu', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(327, 'answer', 131, 'D. Một số nhân viên vắng mặt', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(328, 'answer', 132, 'A. Cập nhật lịch ca', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(329, 'answer', 133, 'B. Dọn dẹp không gian làm việc', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(330, 'answer', 134, 'C. Hoàn thành danh sách kiểm', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(331, 'answer', 135, 'D. Gọi điện thoại', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(332, 'answer', 136, 'A. Để mừng về hưu', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(333, 'answer', 137, 'B. Để kiểm tra', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(334, 'answer', 138, 'C. Gặp gỡ khách hàng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(335, 'answer', 139, 'D. Viết một bài báo', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(336, 'answer', 140, 'A. Cô ấy không thể chấp nhận lời mời', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(337, 'answer', 141, 'B. Hệ thống làm mát bị hỏng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(338, 'answer', 142, 'C. Một cuộc họp sẽ kết thúc sớm', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(339, 'answer', 143, 'D. Cô ấy muốn đổi chỗ ngồi', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(340, 'answer', 144, 'A. Miễn phí cho khách hàng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(341, 'answer', 145, 'B. Đang xây dựng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(342, 'answer', 146, 'C. Sắp đóng cửa', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(343, 'answer', 147, 'D. Có hợp đồng hàng tháng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(344, 'answer', 148, 'A. Tại một trường đại học', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(345, 'answer', 149, 'B. Tại một công ty xuất bản', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(346, 'answer', 150, 'C. Tại một cửa hàng điện tử', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(347, 'answer', 151, 'D. Tại một cửa hàng tạp hóa', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(348, 'answer', 152, 'A. Mức giá của một món hàng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(349, 'answer', 153, 'B. Khi nào sự kiện bắt đầu', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(350, 'answer', 154, 'C. Có bao nhiêu người tham gia', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(351, 'answer', 155, 'D. Lắp đặt thiết bị ở đâu', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(352, 'answer', 156, 'A. Cung cấp giảm giá', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(353, 'answer', 157, 'B. Trưng bày tài liệu thông tin', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(354, 'answer', 158, 'C. Tổ chức một cuộc thi', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(355, 'answer', 159, 'D. Đến bàn đăng ký', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(356, 'answer', 160, 'A. Sản xuất dệt may', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(357, 'answer', 161, 'B. Sản xuất thực phẩm', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(358, 'answer', 162, 'C. Y tế', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(359, 'answer', 163, 'D. Dịch vụ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(360, 'answer', 164, 'A. Thiếu nhân viên đủ tiêu chuẩn', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(361, 'answer', 165, 'B. Chi phí sản xuất tăng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(362, 'answer', 166, 'C. Thay đổi trong sở thích người tiêu dùng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(363, 'answer', 167, 'D. Sự cạnh tranh gia tăng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(364, 'answer', 168, 'A. Tìm hiểu thêm thông tin', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(365, 'answer', 169, 'B. Đàm phán giảm giá', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(366, 'answer', 170, 'C. Nâng cấp thiết bị', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(367, 'answer', 171, 'D. Đào tạo nhân viên mới', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(368, 'answer', 172, 'A. Giải thích về việc sáp nhập doanh nghiệp', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(369, 'answer', 173, 'B. Mô tả chính sách mới của công ty', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(370, 'answer', 174, 'C. Giao nhiệm vụ công việc cho người phụ nữ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(371, 'answer', 175, 'D. Mời người phụ nữ phát biểu tại hội thảo', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(372, 'answer', 176, 'A. Mua một doanh nghiệp khác', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(373, 'answer', 177, 'B. Tìm văn phòng mới', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(374, 'answer', 178, 'C. Sửa đổi đề xuất ngân sách', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(375, 'answer', 179, 'D. Tạo một chiến dịch marketing', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(376, 'answer', 180, 'A. Một bản mô tả dự án', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(377, 'answer', 181, 'B. Lời mời tham dự sự kiện', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(378, 'answer', 182, 'C. Một số liên kết mạng xã hội', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(379, 'answer', 183, 'D. Một số thông tin liên hệ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(380, 'answer', 184, 'A. Một chiếc xe không hoạt động', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(381, 'answer', 185, 'B. Một nhân viên đến muộn', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(382, 'answer', 186, 'C. Một lô hàng bị hỏng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(383, 'answer', 187, 'D. Giao thông đông đúc', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(384, 'answer', 188, 'A. Tại phòng thu âm', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(385, 'answer', 189, 'B. Tại công ty cung cấp dịch vụ ăn uống', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(386, 'answer', 190, 'C. Tại đài phát thanh', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(387, 'answer', 191, 'D. Tại đại lý xe hơi', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(388, 'answer', 192, 'A. Sắp xếp sửa xe', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(389, 'answer', 193, 'B. Đặt thêm dụng cụ bếp', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(390, 'answer', 194, 'C. Mang một số vật dụng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(391, 'answer', 195, 'D. Đề nghị hoàn tiền', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(392, 'answer', 196, 'A. Lên kế hoạch cho sự kiện công ty', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(393, 'answer', 197, 'B. Xác nhận hạn chót công việc', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(394, 'answer', 198, 'C. Thảo luận về con đường sự nghiệp', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(395, 'answer', 199, 'D. Nhận lời mời làm việc', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(396, 'answer', 200, 'A. Biên tập viên báo chí', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(397, 'answer', 201, 'B. Giáo sư đại học', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(398, 'answer', 202, 'C. Nhân viên giao hàng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(399, 'answer', 203, 'D. Diễn viên chuyên nghiệp', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(400, 'answer', 204, 'A. Đàm phán hợp đồng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(401, 'answer', 205, 'B. Giải thích chính sách văn phòng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(402, 'answer', 206, 'C. Xem xét sơ yếu lý lịch', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(403, 'answer', 207, 'D. Mô tả lịch trình làm việc', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(404, 'answer', 208, 'A. Một tuyến giao thông mới', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(405, 'answer', 209, 'B. Một vụ sáp nhập công ty', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(406, 'answer', 210, 'C. Một chiến dịch truyền thông', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(407, 'answer', 211, 'D. Thiết kế cơ sở y tế', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(408, 'answer', 212, 'A. Để bày tỏ nghi ngờ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(409, 'answer', 213, 'B. Để giải thích một quy trình', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(410, 'answer', 214, 'C. Để đưa ra đề xuất', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(411, 'answer', 215, 'D. Để cập nhật thông tin', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(412, 'answer', 216, 'A. Trả phí chứng nhận', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(413, 'answer', 217, 'B. Đào tạo thêm nhân viên', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(414, 'answer', 218, 'C. Nâng cấp công nghệ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(415, 'answer', 219, 'D. Chuyển đến thành phố khác', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(416, 'answer', 220, 'A. Người quyên góp', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(417, 'answer', 221, 'B. Tình nguyện viên', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(418, 'answer', 222, 'C. Nhân viên', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(419, 'answer', 223, 'D. Khách hàng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(420, 'answer', 224, 'A. 21 đô', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(421, 'answer', 225, 'B. 18 đô', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(422, 'answer', 226, 'C. 24 đô', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(423, 'answer', 227, 'D. 15 đô', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(424, 'answer', 228, 'A. Một tệp đồ họa', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(425, 'answer', 229, 'B. Danh sách tên', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(426, 'answer', 230, 'C. Địa chỉ giao hàng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(427, 'answer', 231, 'D. Số tài khoản', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(428, 'answer', 232, 'A. Tác phẩm điêu khắc đất sét', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(429, 'answer', 233, 'B. Tranh sơn dầu', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(430, 'answer', 234, 'C. Ảnh trắng đen', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(431, 'answer', 235, 'D. Tranh chì', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(432, 'answer', 236, 'A. Ánh nhìn cẩn trọng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(433, 'answer', 237, 'B. Lời hứa', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(434, 'answer', 238, 'C. Biển động', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(435, 'answer', 239, 'D. Khoảnh khắc', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(436, 'answer', 240, 'A. Nói chuyện với họa sĩ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(437, 'answer', 241, 'B. Chỉnh sửa bản thu âm', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(438, 'answer', 242, 'C. Dọn dẹp không gian triển lãm', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(439, 'answer', 243, 'D. Chào đón khách tham quan', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(440, 'answer', 244, 'A. Người quy hoạch đô thị', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(441, 'answer', 245, 'B. Nhà báo', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(442, 'answer', 246, 'C. Kỹ sư', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(443, 'answer', 247, 'D. Nhà khoa học môi trường', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(444, 'answer', 248, 'A. Địa điểm A', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(445, 'answer', 249, 'B. Địa điểm B', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(446, 'answer', 250, 'C. Địa điểm C', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(447, 'answer', 251, 'D. Địa điểm D', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(448, 'answer', 252, 'A. Cơ hội việc làm', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(449, 'answer', 253, 'B. Chi phí tua-bin gió', '2025-06-29 14:21:33', '2025-06-29 14:21:33');
INSERT INTO `translations` (`id`, `content_type`, `content_id`, `vietnamese_text`, `created_at`, `updated_at`) VALUES
(450, 'answer', 254, 'C. Vấn đề chuỗi cung ứng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(451, 'answer', 255, 'D. Công suất điện', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(452, 'answer', 256, 'A. Văn phòng thị trưởng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(453, 'answer', 257, 'B. Bộ phận bảo trì', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(454, 'answer', 258, 'C. Đại lý ô tô', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(455, 'answer', 259, 'D. Văn phòng quản lý tòa nhà', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(456, 'answer', 260, 'A. Di chuyển xe của họ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(457, 'answer', 261, 'B. Trả tiền phạt đỗ xe', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(458, 'answer', 262, 'C. Sử dụng lối vào khác', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(459, 'answer', 263, 'D. Tham gia một cuộc họp', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(460, 'answer', 264, 'A. Lá phiếu bầu cử', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(461, 'answer', 265, 'B. Kế hoạch bảo trì', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(462, 'answer', 266, 'C. Một bản đồ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(463, 'answer', 267, 'D. Phiếu giảm giá', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(464, 'answer', 268, 'A. Chăm sóc vườn', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(465, 'answer', 269, 'B. Lắp đặt cửa sổ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(466, 'answer', 270, 'C. Bảo trì mái nhà', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(467, 'answer', 271, 'D. Cải tạo bếp', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(468, 'answer', 272, 'A. Nên được làm sạch thường xuyên', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(469, 'answer', 273, 'B. Nên chọn loại chất lượng cao', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(470, 'answer', 274, 'C. Mới được phát minh gần đây', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(471, 'answer', 275, 'D. Dễ cất giữ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(472, 'answer', 276, 'A. Xử lý gỗ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(473, 'answer', 277, 'B. Tham khảo ý kiến thợ điện', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(474, 'answer', 278, 'C. Chụp ảnh', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(475, 'answer', 279, 'D. Thoát nước', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(476, 'answer', 280, 'A. Người dẫn chương trình radio', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(477, 'answer', 281, 'B. Hướng dẫn viên', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(478, 'answer', 282, 'C. Nhân viên bán hàng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(479, 'answer', 283, 'D. Giáo sư', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(480, 'answer', 284, 'A. Một buổi thuyết trình sẽ bắt đầu', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(481, 'answer', 285, 'B. Một buổi trình diễn sẽ diễn ra', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(482, 'answer', 286, 'C. Một cuộc phỏng vấn sẽ diễn ra', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(483, 'answer', 287, 'D. Một công viên sẽ đóng cửa', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(484, 'answer', 288, 'A. Một cuốn sách', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(485, 'answer', 289, 'B. Một album', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(486, 'answer', 290, 'C. Một bộ phim', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(487, 'answer', 291, 'D. Một tạp chí', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(488, 'answer', 292, 'A. Một buổi hòa nhạc gây quỹ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(489, 'answer', 293, 'B. Một cuộc thi thể thao', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(490, 'answer', 294, 'C. Một buổi tập kịch', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(491, 'answer', 295, 'D. Một buổi lễ trao giải', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(492, 'answer', 296, 'A. Thay đổi chính sách', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(493, 'answer', 297, 'B. Sửa chữa một toà nhà', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(494, 'answer', 298, 'C. Chọn ra người chiến thắng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(495, 'answer', 299, 'D. Tài trợ một đội', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(496, 'answer', 300, 'A. Đặt vé sớm', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(497, 'answer', 301, 'B. Tham quan trung tâm cộng đồng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(498, 'answer', 302, 'C. Mua đồ ăn thức uống', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(499, 'answer', 303, 'D. Quyên góp quần áo', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(500, 'answer', 304, 'A. Quản lý thời gian', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(501, 'answer', 305, 'B. Diễn thuyết trước công chúng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(502, 'answer', 306, 'C. Kỹ năng lãnh đạo', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(503, 'answer', 307, 'D. Mở rộng mạng lưới nghề nghiệp', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(504, 'answer', 308, 'A. Một diễn giả khách vừa đến', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(505, 'answer', 309, 'B. Có người hỗ trợ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(506, 'answer', 310, 'C. Người tham dự nên nói to rõ ràng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(507, 'answer', 311, 'D. Nên bố trí thêm ghế', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(508, 'answer', 312, 'A. Ký tên vào danh sách', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(509, 'answer', 313, 'B. Nghỉ giải lao', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(510, 'answer', 314, 'C. Tham gia hoạt động làm quen', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(511, 'answer', 315, 'D. Điền vào phiếu khảo sát', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(512, 'answer', 316, 'A. Những bức tường phòng thủ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(513, 'answer', 317, 'B. Cư dân hoàng gia', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(514, 'answer', 318, 'C. Một sự kiện đã xảy ra', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(515, 'answer', 319, 'D. Một vài tác phẩm nghệ thuật', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(516, 'answer', 320, 'A. Người nghe không được chụp ảnh', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(517, 'answer', 321, 'B. Một khu vực bị đóng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(518, 'answer', 322, 'C. Không có cửa hàng quà tặng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(519, 'answer', 323, 'D. Chuyến tham quan bắt đầu trễ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(520, 'answer', 324, 'A. Xuất trình vé', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(521, 'answer', 325, 'B. Mặc đồ bảo hộ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(522, 'answer', 326, 'C. Bám vào tay vịn', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(523, 'answer', 327, 'D. Nói chuyện nhỏ nhẹ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(524, 'answer', 328, 'A. Một chiến dịch quảng cáo', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(525, 'answer', 329, 'B. Mở rộng thị trường', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(526, 'answer', 330, 'C. Một số cuộc đàm phán hợp đồng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(527, 'answer', 331, 'D. Một số quy trình kiểm toán', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(528, 'answer', 332, 'A. Đã phê duyệt trả lương làm thêm', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(529, 'answer', 333, 'B. Phải đáp ứng thời hạn', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(530, 'answer', 334, 'C. Khách hàng bày tỏ lo ngại', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(531, 'answer', 335, 'D. Quản lý sẽ theo dõi sát sao', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(532, 'answer', 336, 'A. Xem một bài thuyết trình', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(533, 'answer', 337, 'B. Xem lại ngân sách', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(534, 'answer', 338, 'C. Chỉnh sửa một số công việc', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(535, 'answer', 339, 'D. Thực hiện nghiên cứu', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(536, 'answer', 340, 'A. Tại bệnh viện', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(537, 'answer', 341, 'B. Tại nhà hàng', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(538, 'answer', 342, 'C. Tại cửa hàng tạp hóa', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(539, 'answer', 343, 'D. Tại cửa hàng điện tử', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(540, 'answer', 344, 'A. Đưa ra yêu cầu', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(541, 'answer', 345, 'B. Giải quyết phàn nàn của nhân viên', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(542, 'answer', 346, 'C. Trình bày lịch làm việc mới', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(543, 'answer', 347, 'D. Giải thích quy trình kỹ thuật', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(544, 'answer', 348, 'A. Một quy trình chưa được thực hiện', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(545, 'answer', 349, 'B. Có thể yêu cầu làm thêm giờ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(546, 'answer', 350, 'C. Người nghe nên liên hệ quản lý', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(547, 'answer', 351, 'D. Sự thay đổi sẽ không diễn ra ngay lập tức', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(548, 'answer', 352, 'A. Tái cấu trúc công ty', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(549, 'answer', 353, 'B. Cải tạo công viên', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(550, 'answer', 354, 'C. Tập huấn tình nguyện viên', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(551, 'answer', 355, 'D. Dự án bảo tồn', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(552, 'answer', 356, 'A. Vị trí 1', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(553, 'answer', 357, 'B. Vị trí 2', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(554, 'answer', 358, 'C. Vị trí 3', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(555, 'answer', 359, 'D. Vị trí 4', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(556, 'answer', 360, 'A. Hoàn thành khảo sát', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(557, 'answer', 361, 'B. Quyên góp tiền', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(558, 'answer', 362, 'C. Tham gia một tổ chức', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(559, 'answer', 363, 'D. Đăng ảnh chụp', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(560, 'answer', 364, 'A. Khi nào thu hoạch mùa vụ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(561, 'answer', 365, 'B. Trồng cây ở đâu', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(562, 'answer', 366, 'C. Cách trồng rau', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(563, 'answer', 367, 'D. Loại hoa nào cần nhiều ánh sáng hơn', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(564, 'answer', 368, 'A. 12 inch', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(565, 'answer', 369, 'B. 4 inch', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(566, 'answer', 370, 'C. 6 inch', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(567, 'answer', 371, 'D. 8 inch', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(568, 'answer', 372, 'A. Tắt điện thoại', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(569, 'answer', 373, 'B. Ăn nhẹ', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(570, 'answer', 374, 'C. Mua hạt giống', '2025-06-29 14:21:33', '2025-06-29 14:21:33'),
(571, 'answer', 375, 'D. Đăng ký danh sách gửi thư', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(572, 'answer', 376, 'A. Anh ấy', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(573, 'answer', 377, 'B. Của anh ấy', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(574, 'answer', 378, 'C. Anh ấy (tân ngữ)', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(575, 'answer', 379, 'D. Chính anh ấy', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(576, 'answer', 380, 'A. Kết nối', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(577, 'answer', 381, 'B. Kết nối (động từ)', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(578, 'answer', 382, 'C. Kết nối', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(579, 'answer', 383, 'D. Chuyển tiếp', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(580, 'answer', 384, 'A. Đã ăn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(581, 'answer', 385, 'B. Mở', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(582, 'answer', 386, 'C. Ngon', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(583, 'answer', 387, 'D. Miễn phí', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(584, 'answer', 388, 'A. Sơn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(585, 'answer', 389, 'B. Gạch lát', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(586, 'answer', 390, 'C. Đồ nội thất', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(587, 'answer', 391, 'D. Rèm cửa', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(588, 'answer', 392, 'A. Cập nhật', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(589, 'answer', 393, 'B. Đang cập nhật', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(590, 'answer', 394, 'C. Các bản cập nhật', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(591, 'answer', 395, 'D. Đã cập nhật', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(592, 'answer', 396, 'A. Vì vậy', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(593, 'answer', 397, 'B. Như thế nào', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(594, 'answer', 398, 'C. Giống như', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(595, 'answer', 399, 'D. Trước khi', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(596, 'answer', 400, 'A. Nhiệt tình', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(597, 'answer', 401, 'B. Sự nhiệt huyết', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(598, 'answer', 402, 'C. Nhiệt huyết', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(599, 'answer', 403, 'D. Được truyền cảm hứng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(600, 'answer', 404, 'A. Kiểm tra', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(601, 'answer', 405, 'B. Người kiểm tra', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(602, 'answer', 406, 'C. Đã được kiểm tra', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(603, 'answer', 407, 'D. Các cuộc kiểm tra', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(604, 'answer', 408, 'A. cho đến', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(605, 'answer', 409, 'B. vào', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(606, 'answer', 410, 'C. tuy nhiên', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(607, 'answer', 411, 'D. trong khi', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(608, 'answer', 412, 'A. riêng biệt', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(609, 'answer', 413, 'B. bị giới hạn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(610, 'answer', 414, 'C. sẵn lòng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(611, 'answer', 415, 'D. đa dạng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(612, 'answer', 416, 'A. các đợt giao hàng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(613, 'answer', 417, 'B. đã giao', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(614, 'answer', 418, 'C. giao hàng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(615, 'answer', 419, 'D. có thể giao', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(616, 'answer', 420, 'A. lái xe', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(617, 'answer', 421, 'B. cấm', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(618, 'answer', 422, 'C. làm phiền', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(619, 'answer', 423, 'D. đi lại', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(620, 'answer', 424, 'A. tìm kiếm', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(621, 'answer', 425, 'B. nhìn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(622, 'answer', 426, 'C. lái xe', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(623, 'answer', 427, 'D. nghiêng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(624, 'answer', 428, 'A. hoàn hảo', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(625, 'answer', 429, 'B. làm hoàn hảo', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(626, 'answer', 430, 'C. một cách hoàn hảo', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(627, 'answer', 431, 'D. sự hoàn hảo', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(628, 'answer', 432, 'D. hữu ích', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(629, 'answer', 433, 'A. sự hữu ích', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(630, 'answer', 434, 'B. sự giúp đỡ', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(631, 'answer', 435, 'C. một cách có ích', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(632, 'answer', 436, 'C. trong suốt', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(633, 'answer', 437, 'A. lên trên', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(634, 'answer', 438, 'B. phía trên', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(635, 'answer', 439, 'D. giữa', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(636, 'answer', 440, 'D. sớm', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(637, 'answer', 441, 'A. xa', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(638, 'answer', 442, 'B. rất', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(639, 'answer', 443, 'C. gần như', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(640, 'answer', 444, 'A. có tổ chức', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(641, 'answer', 445, 'C. tổ chức (v)', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(642, 'answer', 446, 'D. thuộc về tổ chức', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(643, 'answer', 447, 'A. tạm thời', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(644, 'answer', 448, 'B. một cách cạnh tranh', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(645, 'answer', 449, 'C. gần đây', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(646, 'answer', 450, 'D. một cách tập thể', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(647, 'answer', 451, 'C. về', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(648, 'answer', 452, 'A. từ', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(649, 'answer', 453, 'B. dưới', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(650, 'answer', 454, 'D. chống lại', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(651, 'answer', 455, 'D. vô tình', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(652, 'answer', 456, 'A. tai nạn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(653, 'answer', 457, 'B. mang tính tình cờ', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(654, 'answer', 458, 'C. các tai nạn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(655, 'answer', 459, 'A. tới', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(656, 'answer', 460, 'B. với', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(657, 'answer', 461, 'C. cái nào', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(658, 'answer', 462, 'D. bây giờ', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(659, 'answer', 463, 'B. cần', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(660, 'answer', 464, 'A. đang cần', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(661, 'answer', 465, 'C. đã cần', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(662, 'answer', 466, 'D. đã đang cần', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(663, 'answer', 467, 'A. đã', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(664, 'answer', 468, 'B. chính xác', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(665, 'answer', 469, 'C. hầu như không', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(666, 'answer', 470, 'D. một cách kỹ lưỡng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(667, 'answer', 471, 'D. tiêu chuẩn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(668, 'answer', 472, 'A. chuyên gia', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(669, 'answer', 473, 'B. tài khoản', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(670, 'answer', 474, 'C. khuyến nghị', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(671, 'answer', 475, 'D. một vài', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(672, 'answer', 476, 'A. bất kỳ', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(673, 'answer', 477, 'B. mọi người', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(674, 'answer', 478, 'C. những người', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(675, 'answer', 479, 'C. yêu cầu', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(676, 'answer', 480, 'A. thông qua', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(677, 'answer', 481, 'B. quyết định', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(678, 'answer', 482, 'D. thực hiện', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(679, 'answer', 483, 'C. đã được phê duyệt', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(680, 'answer', 484, 'A. đang phê duyệt', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(681, 'answer', 485, 'B. phê duyệt', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(682, 'answer', 486, 'D. sẽ được phê duyệt', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(683, 'answer', 487, 'C. vì lý do của', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(684, 'answer', 488, 'A. mặc dù', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(685, 'answer', 489, 'B. giống như', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(686, 'answer', 490, 'D. theo như', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(687, 'answer', 491, 'B. bổ sung', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(688, 'answer', 492, 'A. tùy ý', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(689, 'answer', 493, 'C. dư thừa', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(690, 'answer', 494, 'D. tiềm năng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(691, 'answer', 495, 'D. Thứ Bảy tới lúc 4 giờ chiều, chúng tôi sẽ tổ chức một buổi hội thảo miễn phí cho công chúng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(692, 'answer', 496, 'A. Trẻ em ở mọi lứa tuổi sẽ thích các triển lãm mới.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(693, 'answer', 497, 'B. Tìm hiểu về các kiểu mưa trong khu vực.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(694, 'answer', 498, 'C. Lắp bộ bàn ghế sân đơn giản với vật liệu dễ kiếm.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(695, 'answer', 499, 'A. để sử dụng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(696, 'answer', 500, 'B. đã từng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(697, 'answer', 501, 'C. bằng cách sử dụng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(698, 'answer', 502, 'D. mà sử dụng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(699, 'answer', 503, 'B. Ví dụ', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(700, 'answer', 504, 'A. Tốt nhất là', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(701, 'answer', 505, 'C. Dù sao đi nữa', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(702, 'answer', 506, 'D. Thực tế là', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(703, 'answer', 507, 'A. chúng tôi', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(704, 'answer', 508, 'B. họ', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(705, 'answer', 509, 'C. cả hai', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(706, 'answer', 510, 'D. của bạn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(707, 'answer', 511, 'C. Đáng kinh ngạc', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(708, 'answer', 512, 'A. Bị kinh ngạc', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(709, 'answer', 513, 'B. Sự kinh ngạc', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(710, 'answer', 514, 'D. Một cách kinh ngạc', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(711, 'answer', 515, 'B. Những đề xuất', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(712, 'answer', 516, 'A. Sự chú ý', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(713, 'answer', 517, 'C. Sự đổi mới', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(714, 'answer', 518, 'D. Sự chỉ trích', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(715, 'answer', 519, 'B. Cảm ơn bạn vì sự linh hoạt trong việc lên kế hoạch cho sự kiện.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(716, 'answer', 520, 'A. Một vài sự kiện khác cũng đã diễn ra tốt đẹp.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(717, 'answer', 521, 'C. Hãy ghé qua văn phòng chúng tôi lần tới khi bạn đến thành phố.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(718, 'answer', 522, 'D. Tokyo là điểm đến du lịch hàng đầu vì nhiều lý do.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(719, 'answer', 523, 'A. Sẽ có lợi', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(720, 'answer', 524, 'B. Để có lợi', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(721, 'answer', 525, 'C. Đã có lợi', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(722, 'answer', 526, 'D. Có lợi (hiện tại)', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(723, 'answer', 527, 'C. Của chúng tôi', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(724, 'answer', 528, 'A. Nó', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(725, 'answer', 529, 'B. Bạn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(726, 'answer', 530, 'D. Mỗi', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(727, 'answer', 531, 'A. Để đăng ký thẻ, hãy đến chi nhánh thư viện địa phương của bạn.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(728, 'answer', 532, 'B. Nếu có câu hỏi về việc đăng ký thành viên thư viện, hãy truy cập website của chúng tôi.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(729, 'answer', 533, 'C. Việc gia hạn phải được thực hiện ít nhất một tuần trước khi thẻ hết hạn.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(730, 'answer', 534, 'D. Bạn có thể rút khỏi chương trình này bất cứ lúc nào.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(731, 'answer', 535, 'C. Bởi vì', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(732, 'answer', 536, 'A. Ngoài ra', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(733, 'answer', 537, 'B. Nên', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(734, 'answer', 538, 'D. Mặc dù', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(735, 'answer', 539, 'A. Một cách cụ thể', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(736, 'answer', 540, 'B. Những chi tiết', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(737, 'answer', 541, 'C. Được chỉ rõ', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(738, 'answer', 542, 'D. Sự cụ thể', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(739, 'answer', 543, 'A. Tôi muốn giới thiệu bạn với doanh nghiệp của chúng tôi.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(740, 'answer', 544, 'B. Những bức ảnh đẹp có thể giúp tài sản của bạn nổi bật.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(741, 'answer', 545, 'C. Chúng tôi mong chờ chuyến thăm của bạn.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(742, 'answer', 546, 'D. Đây là studio đầu tiên thuộc loại này mở ở khu vực này.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(743, 'answer', 547, 'B. Tạo ra', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(744, 'answer', 548, 'A. Nghiên cứu', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(745, 'answer', 549, 'C. Mua', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(746, 'answer', 550, 'D. Trưng bày', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(747, 'answer', 551, 'C. Nếu không thì', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(748, 'answer', 552, 'A. Nếu không', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(749, 'answer', 553, 'B. So sánh mà nói', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(750, 'answer', 554, 'D. Thật vậy', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(751, 'answer', 555, 'D. Đã phải nhận', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(752, 'answer', 556, 'A. Nhận', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(753, 'answer', 557, 'B. Đang nhận', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(754, 'answer', 558, 'C. Đã nhận', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(755, 'answer', 559, 'D. Trên một trang web', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(756, 'answer', 560, 'A. Trên cánh cửa', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(757, 'answer', 561, 'B. Trên hoá đơn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(758, 'answer', 562, 'C. Trong một cái hộp', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(759, 'answer', 563, 'B. Một món đồ nội thất', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(760, 'answer', 564, 'A. Một máy tính để bàn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(761, 'answer', 565, 'C. Một thiết bị gia dụng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(762, 'answer', 566, 'D. Một dụng cụ điện', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(763, 'answer', 567, 'D. Một số thời gian họp đã bị thay đổi', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(764, 'answer', 568, 'A. Một hội nghị đã được lên lịch', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(765, 'answer', 569, 'B. Một công ty có văn phòng ở hai múi giờ', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(766, 'answer', 570, 'C. Trợ lý hành chính lên kế hoạch đi lại', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(767, 'answer', 571, 'B. Đó là khi nhân viên ở Toulouse bắt đầu ngày làm việc của họ', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(768, 'answer', 572, 'A. Đó là khi văn phòng Winnipeg đóng cửa để ăn trưa', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(769, 'answer', 573, 'C. Đây không phải là thời gian lý tưởng để lên lịch họp', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(770, 'answer', 574, 'D. Nó vừa được thêm vào lịch trình', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(771, 'answer', 575, 'B. Nó mới được cải tạo gần đây', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(772, 'answer', 576, 'A. Nó nằm bên bờ hồ', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(773, 'answer', 577, 'C. Nó sẽ xây dựng một khu vườn thực vật cho khách', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(774, 'answer', 578, 'D. Nó được dành riêng cho các sự kiện doanh nghiệp', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(775, 'answer', 579, 'D. Nó rất được người dân địa phương ưa chuộng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(776, 'answer', 580, 'A. Nó được bắt đầu bởi một đầu bếp quốc tế', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(777, 'answer', 581, 'B. Nó cung cấp các lựa chọn thực đơn hạn chế', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(778, 'answer', 582, 'C. Hiện tại nó được tài trợ bởi một tổ chức từ thiện', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(779, 'answer', 583, 'B. Cô ấy có thể cung cấp dụng cụ mà cô Evers cần', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(780, 'answer', 584, 'A. Cô ấy sẽ mang bữa trưa cho cô Evers', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(781, 'answer', 585, 'C. Một số tọa độ hiện trường là đúng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(782, 'answer', 586, 'D. Một số số đo cần được kiểm tra lại', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(783, 'answer', 587, 'A. Cô Chi sẽ lấy tọa độ hiện trường mới', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(784, 'answer', 588, 'B. Cô Chi và cô Lim sẽ ra ngoài một lúc', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(785, 'answer', 589, 'C. Cô Evers sẽ chia sẻ một công thức', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(786, 'answer', 590, 'D. Cô Lim sẽ bắt đầu đo đạc', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(787, 'answer', 591, 'A. Nông dân', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(788, 'answer', 592, 'B. Đầu bếp chuyên nghiệp', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(789, 'answer', 593, 'C. Tài xế xe tải', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(790, 'answer', 594, 'D. Quản lý siêu thị', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(791, 'answer', 595, 'B. Có lượng mưa lớn hơn bình thường', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(792, 'answer', 596, 'A. Nó gây ra sự chậm trễ vận chuyển', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(793, 'answer', 597, 'C. Nó thường xuyên là chủ đề trên bản tin địa phương', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(794, 'answer', 598, 'D. Nó có lợi cho mùa màng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(795, 'answer', 599, 'C. Sửa chữa máy móc nông nghiệp', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(796, 'answer', 600, 'A. Tuyển dụng cho doanh nghiệp địa phương', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(797, 'answer', 601, 'B. Thu gom và phân phối thực phẩm', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(798, 'answer', 602, 'D. Hội thảo làm vườn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(799, 'answer', 603, 'B. Trong hội trường âm nhạc', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(800, 'answer', 604, 'A. Trên máy bay', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(801, 'answer', 605, 'C. Tại nhà hàng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(802, 'answer', 606, 'D. Tại bưu điện', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(803, 'answer', 607, 'B. Chúng phải để lại bên ngoài tòa nhà', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(804, 'answer', 608, 'A. Chúng có thể để trong hộp khóa với một khoản phí', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(805, 'answer', 609, 'C. Chúng sẽ được kiểm tra bởi nhân viên', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(806, 'answer', 610, 'D. Chúng phải để dưới ghế', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(807, 'answer', 611, 'C. [3]', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(808, 'answer', 612, 'A. [1]', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(809, 'answer', 613, 'B. [2]', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(810, 'answer', 614, 'D. [4]', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(811, 'answer', 615, 'D. Để quảng bá sản phẩm tráng miệng mới', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(812, 'answer', 616, 'A. Để yêu cầu xác nhận đơn hàng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(813, 'answer', 617, 'B. Để điều chỉnh một số ngày giao hàng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(814, 'answer', 618, 'C. Để thông báo mở rộng kinh doanh', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(815, 'answer', 619, 'C. Cô ấy đã từng là khách hàng của Sweeter Specialties', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(816, 'answer', 620, 'A. Cô ấy đang nhận một giải thưởng chuyên môn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(817, 'answer', 621, 'B. Cô ấy đã từng làm đầu bếp bánh', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(818, 'answer', 622, 'D. Cô ấy nhận được một đề xuất tích cực về đầu bếp', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(819, 'answer', 623, 'A. Đây là sản phẩm bán chạy nhất với khách hàng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(820, 'answer', 624, 'B. Đây là chiếc bánh đắt nhất tại Sweeter Specialties', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(821, 'answer', 625, 'C. Nó được làm cho Esplin Electronics hàng năm', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(822, 'answer', 626, 'D. Đây là sự kết hợp hương vị mới cho Sweeter Specialties', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(823, 'answer', 627, 'C. Quyết định', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(824, 'answer', 628, 'A. Chỉ trích', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(825, 'answer', 629, 'B. Giải quyết', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(826, 'answer', 630, 'D. Mô tả', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(827, 'answer', 631, 'C. Nó được đánh giá rất cao', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(828, 'answer', 632, 'A. Nó rẻ hơn hầu hết các mẫu khác', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(829, 'answer', 633, 'B. Nó là mẫu lớn nhất có sẵn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(830, 'answer', 634, 'D. Nó cùng thương hiệu với các thiết bị khác', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(831, 'answer', 635, 'D. Vận hành', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(832, 'answer', 636, 'A. Điều chỉnh', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(833, 'answer', 637, 'B. Kiểm soát', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(834, 'answer', 638, 'C. Di chuyển', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(835, 'answer', 639, 'A. Cô ấy quan tâm đến việc tiết kiệm nước', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(836, 'answer', 640, 'B. Cô ấy vừa chuyển đến nhà mới', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(837, 'answer', 641, 'C. Cô ấy đã mua máy rửa chén một năm trước', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(838, 'answer', 642, 'D. Cô ấy chuyên thiết kế lại nhà bếp', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(839, 'answer', 643, 'A. Nhân viên của Skyler Airlines', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(840, 'answer', 644, 'B. Khách hàng của Skyler Airlines', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(841, 'answer', 645, 'C. Người đăng ký tạp chí tiềm năng', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(842, 'answer', 646, 'D. Người đang tìm việc', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(843, 'answer', 647, 'A. Trả phí cho chi phí học tập', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(844, 'answer', 648, 'B. Vé máy bay miễn phí', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(845, 'answer', 649, 'C. Cơ hội được cố vấn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(846, 'answer', 650, 'D. Ngày nghỉ có lương', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(847, 'answer', 651, 'C. Hãng được khen ngợi bởi một tạp chí chuyên ngành', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(848, 'answer', 652, 'A. Bay đến nhiều nơi nhất trên thế giới', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(849, 'answer', 653, 'B. Đang lên kế hoạch sáp nhập', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(850, 'answer', 654, 'D. Đã thay ghế thoải mái hơn', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(851, 'answer', 655, 'B. [2]', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(852, 'answer', 656, 'A. [1]', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(853, 'answer', 657, 'C. [3]', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(854, 'answer', 658, 'D. [4]', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(855, 'answer', 659, 'B. Nó sẽ làm nổi bật một số sản phẩm bán chạy.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(856, 'answer', 660, 'A. Việc sản xuất sẽ tốn kém.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(857, 'answer', 661, 'C. Đây sẽ là dự án đầu tiên của cô Gowan.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(858, 'answer', 662, 'D. Nó sẽ được gửi đến nhiều địa điểm.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(859, 'answer', 663, 'B. Thông tin từ nghiên cứu người dùng là quan trọng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(860, 'answer', 664, 'A. Nhiều nhân viên nên tham dự cuộc họp.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(861, 'answer', 665, 'C. Bài thuyết trình phải trôi chảy.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(862, 'answer', 666, 'D. Cửa hàng đối tác cần được thông báo về báo cáo.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(863, 'answer', 667, 'C. Một nhà nghiên cứu sản phẩm.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(864, 'answer', 668, 'A. Quản lý cửa hàng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(865, 'answer', 669, 'B. Một vận động viên nghiệp dư.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(866, 'answer', 670, 'D. Giám đốc quảng cáo.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(867, 'answer', 671, 'D. Vào thứ Sáu.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(868, 'answer', 672, 'A. Vào thứ Hai.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(869, 'answer', 673, 'B. Vào thứ Tư.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(870, 'answer', 674, 'C. Vào thứ Năm.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(871, 'answer', 675, 'D. Chúc mừng người nhận giải thưởng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(872, 'answer', 676, 'A. Quảng bá khai trương nhà hàng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(873, 'answer', 677, 'B. Thông báo quan hệ đối tác kinh doanh.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(874, 'answer', 678, 'C. Giới thiệu chương trình du lịch.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(875, 'answer', 679, 'C. thể hiện', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(876, 'answer', 680, 'A. dẫn đến', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(877, 'answer', 681, 'B. thay đổi', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(878, 'answer', 682, 'D. nghĩ về', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(879, 'answer', 683, 'C. Nó cung cấp nhiều lựa chọn bữa ăn.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(880, 'answer', 684, 'A. Nó tăng giá cho mọi khách hàng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(881, 'answer', 685, 'B. Nó đã sửa đổi lịch giao hàng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(882, 'answer', 686, 'D. Nó có một phó chủ tịch mới.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(883, 'answer', 687, 'D. Cô ấy thường xuyên đặt hàng từ Kitchen Swifts.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(884, 'answer', 688, 'A. Cô ấy đã đến nhà hàng của ông Cordero.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(885, 'answer', 689, 'B. Cô ấy vừa đi nghỉ ở Sydney.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(886, 'answer', 690, 'C. Cô ấy là đồng nghiệp của cô Chambers.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(887, 'answer', 691, 'A. Nó có thực đơn bữa trưa giới hạn.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(888, 'answer', 692, 'B. Nó nhận đặt bàn ăn tối.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(889, 'answer', 693, 'C. Nó phục vụ bánh mì từ tiệm địa phương.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(890, 'answer', 694, 'D. Nó có chi nhánh ở Hồng Kông.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(891, 'answer', 695, 'A. Hoàn tất một kế hoạch.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(892, 'answer', 696, 'B. Chấp nhận lời mời.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(893, 'answer', 697, 'C. Quảng bá dịch vụ mới.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(894, 'answer', 698, 'D. Yêu cầu phản hồi về một chính sách.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(895, 'answer', 699, 'C. Trả xe thuê.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(896, 'answer', 700, 'A. Giao hàng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(897, 'answer', 701, 'B. Dự họp.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(898, 'answer', 702, 'D. Thăm người thân.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(899, 'answer', 703, 'B. Ông Boyle đã thất vọng với các công ty vận chuyển bằng tàu và máy bay.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(900, 'answer', 704, 'A. Chị gái ông Boyle là đồng sáng lập Ceelarie Classics.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(901, 'answer', 705, 'C. Cô Savard từng mua hàng từ ông Boyle.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(902, 'answer', 706, 'D. Cô Savard thích một thương hiệu hành lý cụ thể.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(903, 'answer', 707, 'A. Cô ấy thường đi công tác.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(904, 'answer', 708, 'B. Cô ấy trả thêm để giao tận tay.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(905, 'answer', 709, 'C. Cô ấy mua nhạc cụ gần đây.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(906, 'answer', 710, 'D. Cô sẽ gặp ông Boyle tại văn phòng thuê xe.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(907, 'answer', 711, 'C. Bằng thuyền.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(908, 'answer', 712, 'A. Bằng ô tô.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(909, 'answer', 713, 'B. Bằng tàu hỏa.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(910, 'answer', 714, 'D. Bằng máy bay.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(911, 'answer', 715, 'C. TTA cung cấp các lớp học do chuyên gia trong ngành giảng dạy.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(912, 'answer', 716, 'A. Được thành lập bởi một nhà thiết kế đồ họa.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(913, 'answer', 717, 'B. Có bản tin trực tuyến riêng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(914, 'answer', 718, 'D. Có cơ sở học tại các thành phố ở Tây Phi.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(915, 'answer', 719, 'D. Một chứng chỉ.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(916, 'answer', 720, 'A. Hội thảo viết sơ yếu lý lịch.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(917, 'answer', 721, 'B. Giảm giá lớp tiếp theo.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(918, 'answer', 722, 'C. Danh sách việc làm hiện tại.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(919, 'answer', 723, 'B. Ông ấy đã từng tham gia lớp học của TTA.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(920, 'answer', 724, 'A. Thiết kế diễn đàn thảo luận.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(921, 'answer', 725, 'C. Phát triển phần mềm hội nghị video.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(922, 'answer', 726, 'D. Vừa bán xe tải bán bánh.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(923, 'answer', 727, 'B. Trở thành một nhà văn tự do thành công.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(924, 'answer', 728, 'A. Giới thiệu về tiếp thị mạng xã hội.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(925, 'answer', 729, 'C. Khởi nghiệp đài phát thanh Internet.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(926, 'answer', 730, 'D. Cơ bản về thiết kế đồ họa.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(927, 'answer', 731, 'D. Phần 4.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(928, 'answer', 732, 'A. Phần 1.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(929, 'answer', 733, 'B. Phần 2.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(930, 'answer', 734, 'C. Phần 3.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(931, 'answer', 735, 'D. Nó khai trương cách đây sáu tháng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(932, 'answer', 736, 'A. Đang tuyển dụng nhân viên phục vụ.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(933, 'answer', 737, 'B. Nằm trên con phố yên tĩnh.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(934, 'answer', 738, 'C. Có chi nhánh khác ở Jamaica.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(935, 'answer', 739, 'C. Gà jerk.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(936, 'answer', 740, 'A. Cá hồng đỏ.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(937, 'answer', 741, 'B. Súp đuôi bò.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(938, 'answer', 742, 'D. Dê cà ri.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(939, 'answer', 743, 'C. Cô ấy đã yêu cầu thêm cơm.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(940, 'answer', 744, 'A. Cô ấy đến vào thứ Sáu.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(941, 'answer', 745, 'B. Cô ấy đi ăn một mình.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(942, 'answer', 746, 'D. Cô ấy gọi món tráng miệng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(943, 'answer', 747, 'B. Đưa ra lời xin lỗi.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(944, 'answer', 748, 'A. Trả lời câu hỏi.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(945, 'answer', 749, 'C. Yêu cầu phản hồi.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(946, 'answer', 750, 'D. Xác nhận đặt bàn.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(947, 'answer', 751, 'D. Cô Smith.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(948, 'answer', 752, 'A. Cô Roats.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(949, 'answer', 753, 'B. Ông Deslandes.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(950, 'answer', 754, 'C. Ông Brown.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(951, 'answer', 755, 'A. Thực hiện các dự án cảnh quan.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(952, 'answer', 756, 'B. Thiết kế đường cao tốc.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(953, 'answer', 757, 'C. Sửa chữa nhà cũ.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(954, 'answer', 758, 'D. Vận hành một trang trại.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(955, 'answer', 759, 'B. Là thành viên của Câu lạc bộ Mua hàng Thường xuyên.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(956, 'answer', 760, 'A. Là tổ chức từ thiện.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(957, 'answer', 761, 'C. Đã mua hàng trên 4000 đô.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(958, 'answer', 762, 'D. Nằm gần trung tâm cung ứng của Orbys.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(959, 'answer', 763, 'C. Hệ thống lập hóa đơn.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(960, 'answer', 764, 'A. Địa chỉ email của nó.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(961, 'answer', 765, 'B. Danh sách ưu đãi.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(962, 'answer', 766, 'D. Lịch giao hàng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(963, 'answer', 767, 'D. Là khách hàng khoảng 20 năm của Orbys.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(964, 'answer', 768, 'A. Yêu cầu gặp ông Singh.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(965, 'answer', 769, 'B. Quan tâm đến việc làm tại Orbys.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(966, 'answer', 770, 'C. Gần đây đặt hàng máy móc xây dựng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(967, 'answer', 771, 'D. Cập nhật số tài khoản.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(968, 'answer', 772, 'A. Thanh toán hóa đơn.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(969, 'answer', 773, 'B. Giải quyết vấn đề.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(970, 'answer', 774, 'C. Xác nhận đơn hàng.', '2025-06-29 14:21:34', '2025-06-29 14:21:34'),
(971, 'question', 212, 'Câu hỏi nghe 1 cho Part 1 - [Mô tả nội dung audio]', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(972, 'question', 213, 'Câu hỏi nghe 2 cho Part 1 - [Mô tả nội dung audio]', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(973, 'question', 214, 'Câu hỏi nghe 3 cho Part 1 - [Mô tả nội dung audio]', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(974, 'question', 215, 'Câu hỏi nghe 4 cho Part 1 - [Mô tả nội dung audio]', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(975, 'question', 216, 'Câu hỏi nghe 5 cho Part 1 - [Mô tả nội dung audio]', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(976, 'question', 217, 'Câu hỏi nghe 6 cho Part 1 - [Mô tả nội dung audio]', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(977, 'question', 218, 'Tòa nhà này bao nhiêu tuổi?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(978, 'question', 219, 'Bạn có thể đến buổi trình diễn nhạc jazz tối nay?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(979, 'question', 220, 'Căn hộ nào đã gửi yêu cầu sửa chữa?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(980, 'question', 221, 'Bạn sẽ liên hệ nhà cung cấp để đổi ngày giao hàng?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(981, 'question', 222, 'Tại sao nhân viên bảo trì có mặt?', '2025-06-29 17:52:21', '2025-06-29 17:52:21');
INSERT INTO `translations` (`id`, `content_type`, `content_id`, `vietnamese_text`, `created_at`, `updated_at`) VALUES
(982, 'question', 223, 'Ban quản lý đã đưa ra quyết định tuyển dụng chưa?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(983, 'question', 224, 'Bạn muốn ăn ở nhà ăn của chúng tôi hay ra ngoài?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(984, 'question', 225, 'Hôm qua bạn không gửi hợp đồng lao động cho ông Patel sao?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(985, 'question', 226, 'Buổi dã ngoại của phòng chúng ta vào thứ Bảy này đúng không?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(986, 'question', 227, 'Bạn muốn cà phê hay trà?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(987, 'question', 228, 'Chúng tôi đã đạt chỉ tiêu doanh số tháng này.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(988, 'question', 229, 'Bạn thường đi công tác cho công việc bao lâu một lần?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(989, 'question', 230, 'Hôm nay chúng ta nên leo đường mòn hoa dại.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(990, 'question', 231, 'Bạn đã đặt phòng khách sạn ở London rồi phải không?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(991, 'question', 232, 'Còn vé cho buổi hòa nhạc tối nay không?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(992, 'question', 233, 'Bạn chưa từng sử dụng phần mềm này trước đây sao?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(993, 'question', 234, 'Khi nào máy xay sinh tố mới sẽ được phát hành?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(994, 'question', 235, 'Ai sẽ đón khách hàng của chúng ta ở sân bay?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(995, 'question', 236, 'Những bông hồng đỏ đến sáng nay đang ở đâu?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(996, 'question', 237, 'Bộ phim này đã được đề cử cho nhiều giải thưởng.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(997, 'question', 238, 'Ai quan tâm đến việc khởi động chương trình đi chung xe?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(998, 'question', 239, 'Tôi sẽ giảng dạy hội thảo của mình ở đâu trong tháng này?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(999, 'question', 240, 'Tại sao chúng ta chuyển những áo len này ra phía sau cửa hàng?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1000, 'question', 241, 'Bạn có hứng thú làm việc với một số hợp đồng này không?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1001, 'question', 242, 'Bạn đang tìm kiếm loại công việc nào?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1002, 'question', 243, 'Người phụ nữ nhắc đến sự kiện gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1003, 'question', 244, 'Người phụ nữ yêu cầu điều gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1004, 'question', 245, 'Người đàn ông khuyên nên làm gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1005, 'question', 246, 'Những người nói chuyện có khả năng làm ở bộ phận nào nhất?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1006, 'question', 247, 'Người phụ nữ đề cập đến vấn đề gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1007, 'question', 248, 'Người đàn ông nói anh ấy sẽ làm gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1008, 'question', 249, 'Những người nói chuyện có khả năng làm trong ngành nào nhất?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1009, 'question', 250, 'Nguyên nhân gây ra sự chậm trễ là gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1010, 'question', 251, 'Người đàn ông nói anh ấy sẽ làm gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1011, 'question', 252, 'Tại sao người phụ nữ lại có mặt tại nhà hàng?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1012, 'question', 253, 'Người phụ nữ có ý gì khi nói \"hôm nay rất nóng\"?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1013, 'question', 254, 'Người đàn ông nói gì về bãi đậu xe?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1014, 'question', 255, 'Người phụ nữ có khả năng làm việc ở đâu?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1015, 'question', 256, 'Murat hỏi về điều gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1016, 'question', 257, 'Người phụ nữ đề xuất làm gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1017, 'question', 258, 'Người nói có khả năng đang làm việc trong ngành gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1018, 'question', 259, 'Họ đang thảo luận về thách thức kinh doanh nào?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1019, 'question', 260, 'Người đàn ông nói rằng anh ấy sẽ làm gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1020, 'question', 261, 'Tại sao người đàn ông gọi điện?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1021, 'question', 262, 'Người đàn ông nói khách hàng quan tâm đến điều gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1022, 'question', 263, 'Người phụ nữ yêu cầu người đàn ông gửi gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1023, 'question', 264, 'Người phụ nữ đề cập đến vấn đề gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1024, 'question', 265, 'Người nói có khả năng làm việc ở đâu?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1025, 'question', 266, 'Người đàn ông nói anh ấy sẽ làm gì tiếp theo?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1026, 'question', 267, 'Tại sao người đàn ông gọi cho người phụ nữ?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1027, 'question', 268, 'Người phụ nữ có khả năng là ai?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1028, 'question', 269, 'Người phụ nữ có khả năng sẽ làm gì tiếp theo?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1029, 'question', 270, 'Người nói chủ yếu đang thảo luận về điều gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1030, 'question', 271, 'Tại sao người phụ nữ lại nói \"họ đã nói về điều đó vào năm ngoái\"?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1031, 'question', 272, 'Người phụ nữ muốn tránh điều gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1032, 'question', 273, 'Món quà dành cho ai?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1033, 'question', 274, 'Nhìn vào hình. Giá của món mà người đàn ông gợi ý là bao nhiêu?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1034, 'question', 275, 'Người phụ nữ sẽ gửi gì cho người đàn ông?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1035, 'question', 276, 'Loại hình nghệ thuật nào sẽ được trưng bày trong triển lãm?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1036, 'question', 277, 'Tác phẩm nào sẽ không còn được trưng bày?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1037, 'question', 278, 'Người phụ nữ nói rằng cô ấy sẽ làm gì ngay lập tức?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1038, 'question', 279, 'Những người nói có khả năng là ai nhất?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1039, 'question', 280, 'Nhìn vào sơ đồ. Địa điểm nào đã hoàn tất?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1040, 'question', 281, 'Người đàn ông đề nghị tập trung vào điều gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1041, 'question', 282, 'Ai là người đã ghi âm tin nhắn này?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1042, 'question', 283, 'Người nghe được yêu cầu làm gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1043, 'question', 284, 'Người nói cho biết điều gì đã được gửi qua đường bưu điện vào tuần trước?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1044, 'question', 285, 'Chủ đề của tập hôm nay là gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1045, 'question', 286, 'Người nói nhấn mạnh điều gì về một số dụng cụ?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1046, 'question', 287, 'Người nói khuyên nên làm gì mỗi năm?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1047, 'question', 288, 'Người nói có khả năng là ai nhất?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1048, 'question', 289, 'Điều gì sẽ xảy ra lúc 2 giờ?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1049, 'question', 290, 'Orchid Caretakers là gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1050, 'question', 291, 'Sự kiện nào đang diễn ra?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1051, 'question', 292, 'Tổ chức này dự định làm gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1052, 'question', 293, 'Người nói khuyến khích người nghe làm gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1053, 'question', 294, 'Chủ đề của buổi hội thảo là gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1054, 'question', 295, 'Người nói ngụ ý gì khi nói \"Erina đang ở cuối phòng\"?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1055, 'question', 296, 'Những người tham dự sẽ làm gì tiếp theo?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1056, 'question', 297, 'Di tích lịch sử này nổi tiếng vì điều gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1057, 'question', 298, 'Tại sao người nói xin lỗi?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1058, 'question', 299, 'Người nói yêu cầu người nghe làm gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1059, 'question', 300, 'Người nói đang thảo luận chủ yếu về điều gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1060, 'question', 301, 'Người nói ngụ ý gì khi nói “đây là ưu tiên”?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1061, 'question', 302, 'Người nghe sẽ làm gì tiếp theo?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1062, 'question', 303, 'Những người nghe có khả năng làm việc ở đâu?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1063, 'question', 304, 'Mục đích chính của bài nói là gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1064, 'question', 305, 'Người nói ngụ ý gì khi nói “Điều đó sẽ cần sự phê duyệt của ban quản lý”?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1065, 'question', 306, 'Theo người nói, điều gì vừa được hoàn thành gần đây?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1066, 'question', 307, 'Nhìn vào sơ đồ. Người nói cho biết đồ ăn nhẹ sẽ được phục vụ ở đâu?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1067, 'question', 308, 'Người nghe được nhắc nhở làm gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1068, 'question', 309, 'Chủ đề của buổi thuyết trình hôm nay là gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1069, 'question', 310, 'Nhìn vào biểu đồ. Mẫu đất nên được lấy ở độ sâu nào tháng này?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1070, 'question', 311, 'Người nói khuyến khích người nghe làm gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1071, 'question', 312, 'Cựu CEO Công ty Sendai, ông Ken Nakata, đã nói về kinh nghiệm nghề nghiệp ------- của mình.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1072, 'question', 313, 'Hành khách bay chuyến nội địa ------- nên đến nhà ga A.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1073, 'question', 314, 'Những chiếc bánh donut táo tươi và ------- được bán tại cửa hàng bán lẻ Oakcrest Orchard với giá £6 mỗi tá.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1074, 'question', 315, 'Zahn Flooring có nhiều lựa chọn ------- nhất ở Vương quốc Anh.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1075, 'question', 316, 'Một trách nhiệm của bộ phận CNTT là đảm bảo rằng công ty đang sử dụng phần mềm -------.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1076, 'question', 317, 'Nên kiểm tra quy định về trang phục của công ty ------- đến trụ sở chính.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1077, 'question', 318, 'Ban quản lý của cửa hàng Wexler kỳ vọng rằng nhân viên sẽ ------- hỗ trợ những người mới được tuyển dụng.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1078, 'question', 319, 'Căn chỉnh bánh xe và ------- hệ thống phanh là một phần trong gói dịch vụ xe của chúng tôi.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1079, 'question', 320, 'Đăng ký Hội nghị Liên minh Tiếp thị hiện đã mở ------- ngày 30 tháng 9.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1080, 'question', 321, 'Tăng trưởng trong ngành giải trí gia đình đã ------- trong quý này.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1081, 'question', 322, 'Hawson Furniture sẽ thực hiện ------- ở phía đông thị trấn vào thứ Năm.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1082, 'question', 323, 'Hội đồng thành phố Marlton không có thẩm quyền để ------- việc đỗ xe trên các con phố trong thành phố.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1083, 'question', 324, 'Tổ chức Project Earth đang ------- những cách để giảm khí nhà kính liên quan đến giao thông vận tải.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1084, 'question', 325, 'Thợ may lành nghề của chúng tôi sẵn sàng thiết kế một bộ vest may đo phù hợp với phong cách và ngân sách của bạn một cách -------.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1085, 'question', 326, 'Quản lý dự án Hannah Chung đã chứng tỏ mình rất ------- trong việc hoàn thành các dự án của công ty.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1086, 'question', 327, 'Thành viên Câu lạc bộ Kỳ nghỉ Lehua sẽ nhận được điểm gấp đôi ------- tháng 8 tại các khách sạn tham gia.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1087, 'question', 328, 'Trang phục không được nhận ------- để sử dụng trong buổi tổng duyệt đầu tiên.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1088, 'question', 329, 'Là một cựu chuyên gia truyền thông cho nhiều dàn nhạc nổi tiếng, ông Wu sẽ xuất sắc trong vai trò ------- sự kiện.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1089, 'question', 330, 'Làn đường hướng bắc trên đường Davis sẽ bị ------- đóng do dự án gia cố cầu của thành phố.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1090, 'question', 331, 'Đại diện hãng hàng không phải xử lý nhiều vấn đề của hành khách, ------- từ các chuyến bay bị lỡ đến hành lý bị thất lạc.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1091, 'question', 332, 'Các ghi chú cuộc họp đã bị xóa -------, nhưng ông Hahm đã có thể tái tạo chúng từ trí nhớ.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1092, 'question', 333, 'Số báo hiện tại của tạp chí Farming Scene dự đoán giá ngô sẽ tăng 5% trong ------- năm.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1093, 'question', 334, 'Bất kỳ ai vẫn còn ------- tham gia khóa đào tạo an toàn phòng cháy nên làm điều đó trước cuối tháng.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1094, 'question', 335, 'Các công nghệ mới nổi đã ------- bắt đầu chuyển đổi ngành vận tải theo những cách từng không thể tưởng tượng được.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1095, 'question', 336, 'Sổ tay công ty phác thảo các ------- cao mà nhân viên được kỳ vọng phải đáp ứng mỗi ngày.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1096, 'question', 337, 'Bởi vì ------- các thành viên hội đồng có xung đột lịch trình, cuộc họp sẽ được dời sang một ngày mà tất cả có thể tham dự.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1097, 'question', 338, 'Dự án này ------- sự hợp tác của nhiều nhóm trong toàn công ty.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1098, 'question', 339, 'Chúng tôi không thể gửi sổ phiếu giảm giá của cửa hàng đến nhà in cho đến khi nó được ------- bởi cô Jeon.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1099, 'question', 340, '------- việc đóng cửa của Verdigold Transport Services, chúng tôi đang tìm kiếm một công ty vận chuyển mới.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1100, 'question', 341, 'Thông tin ------- được cung cấp bởi tài liệu quảng cáo của Ngân hàng Uniss giúp người nộp đơn hiểu các điều khoản vay của họ.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1101, 'question', 358, 'Thông tin này có khả năng được tìm thấy ở đâu nhất?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1102, 'question', 359, 'Mặt hàng nào đang được nói đến nhiều khả năng nhất?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1103, 'question', 360, 'Lịch trình gợi ý điều gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1104, 'question', 361, 'Điều gì được chỉ ra về thời gian 11:00 sáng theo giờ Winnipeg?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1105, 'question', 362, 'Điều gì được chỉ ra về sảnh Bryant?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1106, 'question', 363, 'Điều gì được gợi ý về nhà hàng Andito’s?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1107, 'question', 364, 'Lúc 1:00 chiều, cô Chi có khả năng nhất muốn nói gì khi viết: “Chắc chắn rồi, Mina”?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1108, 'question', 365, 'Điều gì sẽ xảy ra tiếp theo?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1109, 'question', 366, 'Thông báo này có khả năng dành cho ai nhất?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1110, 'question', 367, 'Thông báo nói gì về thời tiết?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1111, 'question', 368, 'Thông báo đề cập đến dịch vụ nào?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1112, 'question', 369, 'Thông báo này có khả năng được dán ở đâu nhất?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1113, 'question', 370, 'Thông báo nói gì về túi xách lớn?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1114, 'question', 371, 'Câu sau phù hợp với vị trí nào trong các vị trí [1], [2], [3], [4]? “Vui lòng không gọi điện hoặc nhắn tin trong mọi thời điểm.”', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1115, 'question', 372, 'Mục đích chính của email là gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1116, 'question', 373, 'Điều gì được gợi ý về cô Ayala?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1117, 'question', 374, 'Điều gì được nói về chiếc bánh nhiều lớp?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1118, 'question', 375, 'Từ “judged” trong đoạn 2, dòng 3 gần nghĩa nhất với từ nào sau đây?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1119, 'question', 376, 'Tại sao cô Yakovleva chọn máy rửa chén Dish Magic 300?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1120, 'question', 377, 'Từ “running” trong đoạn 1, dòng 7 gần nghĩa nhất với từ nào?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1121, 'question', 378, 'Điều gì được nói về cô Yakovleva?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1122, 'question', 379, 'Thông tin này dành cho ai?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1123, 'question', 380, 'Thông tin không đề cập đến lợi ích nào dành cho nhân viên?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1124, 'question', 381, 'Có thông tin gì về Skyler Airlines?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1125, 'question', 382, 'Câu sau phù hợp với vị trí nào: “Cơ hội việc làm của chúng tôi bao gồm nhiều nhóm kỹ năng.”', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1126, 'question', 383, 'Điều gì được chỉ ra về bài thuyết trình?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1127, 'question', 384, 'Vào 9:22 sáng, bà Lorenz ngụ ý điều gì khi viết: “chúng ta đừng bỏ qua điều đó”?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1128, 'question', 385, 'Ông Harven có khả năng là ai?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1129, 'question', 386, 'Khi nào các tác giả dự định họp để xem xét bài thuyết trình?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1130, 'question', 387, 'Mục đích của thông cáo báo chí là gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1131, 'question', 388, 'Trong thông cáo báo chí, từ \"reflects\" trong đoạn 1, dòng 4 gần nghĩa nhất với?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1132, 'question', 389, 'Điều gì được chỉ ra về Kitchen Swifts?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1133, 'question', 390, 'Điều gì có khả năng đúng về cô Guan?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1134, 'question', 391, 'Cô Guan gợi ý điều gì về Enriqua’s trong bài đánh giá?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1135, 'question', 392, 'Mục đích của email là gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1136, 'question', 393, 'Tại sao ông Boyle sẽ đi từ Stranraer đến Kirkcolm?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1137, 'question', 394, 'Điều gì được thể hiện trong email?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1138, 'question', 395, 'Điều gì có khả năng đúng về cô Savard?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1139, 'question', 396, 'Ông Boyle sẽ đi đến Cairnryan vào ngày 5 tháng 6 bằng phương tiện gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1140, 'question', 397, 'Điều gì được thể hiện về TTA?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1141, 'question', 398, 'Theo quảng cáo, TTA cung cấp gì cho học viên sau khi hoàn thành lớp học?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1142, 'question', 399, 'Điều gì có khả năng đúng về ông Egbe?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1143, 'question', 400, 'Ông Egbe đã đăng ký lớp học TTA nào?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1144, 'question', 401, 'Ông Egbe có khả năng đã thêm phần nào vào đề cương sau khi nói chuyện với ông Akpan?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1145, 'question', 402, 'Bài báo đề cập điều gì về Orange Bay Kitchen?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1146, 'question', 403, 'Theo bài báo, món ăn phổ biến nhất tại Orange Bay Kitchen là gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1147, 'question', 404, 'Điều gì được gợi ý về chuyến thăm của cô Peterkin đến Orange Bay Kitchen?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1148, 'question', 405, 'Mục đích của e-mail là gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1149, 'question', 406, 'Cô Peterkin đã gặp ai tại Orange Bay Kitchen?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1150, 'question', 407, 'Hóa đơn cho thấy điều gì về Green Canyon?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1151, 'question', 408, 'Vì sao Green Canyon có thể được giảm giá cho đơn hàng ngày 10 tháng 6?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1152, 'question', 409, 'Theo thông báo, điều gì đang thay đổi tại Orbys Distributors?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1153, 'question', 410, 'Điều gì được gợi ý về ông Tesoriero?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1154, 'question', 411, 'Mr. Singh yêu cầu cô Peterson làm gì?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1155, 'answer', 775, 'A. Cô ấy đang ăn ở khu vực picnic.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1156, 'answer', 776, 'B. Cô ấy đang xếp hàng ở xe bán đồ ăn.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1157, 'answer', 777, 'C. Cô ấy đang lau ghế dài.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1158, 'answer', 778, 'D. Cô ấy đang vứt bỏ một cái đĩa.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1159, 'answer', 779, 'A. Người đàn ông đang phủi tuyết khỏi nóc xe.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1160, 'answer', 780, 'B. Người đàn ông đang đứng cạnh xe trên tuyết.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1161, 'answer', 781, 'C. Người đàn ông đang xúc tuyết trên lối đi.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1162, 'answer', 782, 'D. Người đàn ông đang chạy qua tuyết.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1163, 'answer', 783, 'A. Một số nhân viên đang treo tranh trong phòng trưng bày.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1164, 'answer', 784, 'B. Hai người đang trò chuyện với nhau.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1165, 'answer', 785, 'C. Một người đàn ông đang sắp xếp gối trên ghế sofa.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1166, 'answer', 786, 'D. Một người đàn ông đang vẽ tranh.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1167, 'answer', 787, 'A. Xe đang đi vào bãi đậu xe.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1168, 'answer', 788, 'B. Móc quần áo nằm rải rác trên mặt đất.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1169, 'answer', 789, 'C. Giá đỡ trống được xếp dọc theo tòa nhà.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1170, 'answer', 790, 'D. Quần áo đang được trưng bày dưới một chiếc lều.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1171, 'answer', 791, 'A. Cây chậu được treo từ trần nhà.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1172, 'answer', 792, 'B. Ghế được xếp chồng trước lối vào.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1173, 'answer', 793, 'C. Một trạm máy tính được lắp đặt trên bàn.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1174, 'answer', 794, 'D. Một tấm thảm được cuộn lại đặt cạnh tường.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1175, 'answer', 795, 'A. Một người đàn ông đang quét sân.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1176, 'answer', 796, 'B. Một người đàn ông đang thay sàn nhà.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1177, 'answer', 797, 'C. Một cánh cửa đã bị tháo khỏi khung.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1178, 'answer', 798, 'D. Đèn chiếu sáng đã được đặt trên sàn.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1179, 'answer', 799, 'A. Để vận chuyển vật liệu.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1180, 'answer', 800, 'B. Khoảng mười năm.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1181, 'answer', 801, 'C. Tôi nghĩ là văn phòng công ty.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1182, 'answer', 802, 'A. Tôi xin lỗi vì đến muộn cuộc họp.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1183, 'answer', 803, 'B. Chủ yếu là nhạc sĩ địa phương.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1184, 'answer', 804, 'C. Chắc chắn rồi, tôi sẽ đến!', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1185, 'answer', 805, 'A. Đó là việc bạn làm để kiếm sống.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1186, 'answer', 806, 'B. Nộp bài tập ở đây.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1187, 'answer', 807, 'C. Nó đến từ người thuê căn B23.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1188, 'answer', 808, 'A. Tất nhiên rồi, tôi sẽ lo liệu.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1189, 'answer', 809, 'B. Biên lai qua email.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1190, 'answer', 810, 'C. Tôi có thể đổi tiền lẻ không?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1191, 'answer', 811, 'A. Không, anh ấy không đến.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1192, 'answer', 812, 'B. Từ ba giờ đến bốn giờ.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1193, 'answer', 813, 'C. Vì một bóng đèn cần sửa.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1194, 'answer', 814, 'A. Đặt nó lên kệ cao nhất.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1195, 'answer', 815, 'B. Phòng nhân sự.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1196, 'answer', 816, 'C. Vâng, họ đã chọn Jacob Borgman.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1197, 'answer', 817, 'A. Anh ấy đã đến đó hôm qua.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1198, 'answer', 818, 'B. Ừm, có thể là một cái sandwich.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1199, 'answer', 819, 'C. Hãy ăn ở đây.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1200, 'answer', 820, 'A. Vâng, tôi đồng ý.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1201, 'answer', 821, 'B. Không, tôi sẽ gửi ngay bây giờ.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1202, 'answer', 822, 'C. Kiểm tra sổ tay nhân viên.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1203, 'answer', 823, 'A. Dự báo có nhiều mưa.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1204, 'answer', 824, 'B. Tất nhiên, tôi thích salad.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1205, 'answer', 825, 'C. Ở cuối hành lang này.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1206, 'answer', 826, 'A. Cho tôi nước lọc thôi.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1207, 'answer', 827, 'B. Thêm vài đô nữa.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1208, 'answer', 828, 'C. Nghỉ giải lao 15 phút.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1209, 'answer', 829, 'A. Đó là tin tuyệt vời!', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1210, 'answer', 830, 'B. Vài lần mỗi ngày.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1211, 'answer', 831, 'C. Đến cuối tháng Tư.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1212, 'answer', 832, 'A. Mọi việc ổn cả.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1213, 'answer', 833, 'B. Vâng, tôi đã tìm được một cái.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1214, 'answer', 834, 'C. Khoảng một lần mỗi tháng.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1215, 'answer', 835, 'A. Ghế này còn trống.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1216, 'answer', 836, 'B. Tôi không mang theo giày leo núi.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1217, 'answer', 837, 'C. Ở trung tâm khách tham quan.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1218, 'answer', 838, 'A. Rất thú vị, cảm ơn.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1219, 'answer', 839, 'B. Anh ấy thường đi tàu.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1220, 'answer', 840, 'C. Vâng, tôi đã đặt phòng từ tuần trước.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1221, 'answer', 841, 'A. Đã bán hết rồi.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1222, 'answer', 842, 'B. Anh ấy là nghệ sĩ vĩ cầm.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1223, 'answer', 843, 'C. Họ đã đi rồi.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1224, 'answer', 844, 'A. Tôi có thể ghi món của bạn không?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1225, 'answer', 845, 'B. Tôi chưa có cơ hội.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1226, 'answer', 846, 'C. Khoảng 40 đô.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1227, 'answer', 847, 'A. Chỉ dùng với rau củ quả thôi.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1228, 'answer', 848, 'B. Trong tủ bếp.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1229, 'answer', 849, 'C. Sản phẩm mẫu vẫn đang được thử nghiệm.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1230, 'answer', 850, 'A. Họ quyết định tự lái xe.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1231, 'answer', 851, 'B. Ở ga số 2.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1232, 'answer', 852, 'C. Đó là vị trí tiếp thị.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1233, 'answer', 853, 'A. Khoảng ba lít nước.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1234, 'answer', 854, 'B. Không, tôi chưa kiểm tra đợt giảm giá.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1235, 'answer', 855, 'C. Tôi cần một ít để làm bó hoa lớn.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1236, 'answer', 856, 'A. Sao chúng ta không đi xem?', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1237, 'answer', 857, 'B. Sau khi công bố.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1238, 'answer', 858, 'C. Anh ấy có bài phát biểu hay.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1239, 'answer', 859, 'A. Cảm ơn, nhưng tôi không biết bơi.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1240, 'answer', 860, 'B. Clara đã bắt đầu tổ chức rồi.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1241, 'answer', 861, 'C. Đó là một bài viết rất thú vị.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1242, 'answer', 862, 'A. Chúng tôi vừa gửi email cho tất cả giảng viên.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1243, 'answer', 863, 'B. 5 đến 7 tháng.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1244, 'answer', 864, 'C. Vâng, đó là một tòa nhà đẹp.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1245, 'answer', 865, 'A. Trung tâm mua sắm mới.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1246, 'answer', 866, 'B. Vâng, chúng có màu khác.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1247, 'answer', 867, 'C. Hàng hóa mùa xuân của chúng ta sắp đến rồi.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1248, 'answer', 868, 'A. Cảm ơn vì đã gặp tôi.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1249, 'answer', 869, 'B. Đơn thuốc kính áp tròng.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1250, 'answer', 870, 'C. Tôi có rất ít thời gian.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1251, 'answer', 871, 'A. Không, lúc 10 giờ sáng.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1252, 'answer', 872, 'B. Tôi thực sự thích làm việc với máy tính.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1253, 'answer', 873, 'C. Chỉ cần một sơ yếu lý lịch là đủ.', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1254, 'answer', 874, 'A. Hội chợ việc làm', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1255, 'answer', 875, 'B. Lớp học nấu ăn', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1256, 'answer', 876, 'C. Buổi gây quỹ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1257, 'answer', 877, 'D. Buổi dã ngoại công ty', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1258, 'answer', 878, 'A. Danh sách khách mời', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1259, 'answer', 879, 'B. Công thức món tráng miệng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1260, 'answer', 880, 'C. Danh thiếp', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1261, 'answer', 881, 'D. Mã khuyến mãi', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1262, 'answer', 882, 'A. Trả lại một số hàng hóa', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1263, 'answer', 883, 'B. Xem một video', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1264, 'answer', 884, 'C. Tạo tài khoản', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1265, 'answer', 885, 'D. Đọc một bài đánh giá', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1266, 'answer', 886, 'A. Kế toán', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1267, 'answer', 887, 'B. Nghiên cứu và phát triển', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1268, 'answer', 888, 'C. Bảo trì', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1269, 'answer', 889, 'D. Tiếp thị', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1270, 'answer', 890, 'A. Báo cáo chưa được nộp', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1271, 'answer', 891, 'B. Hóa đơn không chính xác', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1272, 'answer', 892, 'C. Chính sách không được tuân thủ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1273, 'answer', 893, 'D. Đơn hàng chưa được giao', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1274, 'answer', 894, 'A. Xóa một tệp điện tử', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1275, 'answer', 895, 'B. Phê duyệt hoàn tiền', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1276, 'answer', 896, 'C. Sắp xếp cuộc họp bán hàng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1277, 'answer', 897, 'D. Xem xét bảng tính', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1278, 'answer', 898, 'A. Vận chuyển', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1279, 'answer', 899, 'B. Sản xuất', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1280, 'answer', 900, 'C. Dịch vụ khách hàng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1281, 'answer', 901, 'D. Khí tượng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1282, 'answer', 902, 'A. Lịch trình viết sai', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1283, 'answer', 903, 'B. Thiết bị chưa được lắp đặt đúng cách', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1284, 'answer', 904, 'C. Thời tiết xấu', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1285, 'answer', 905, 'D. Một số nhân viên vắng mặt', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1286, 'answer', 906, 'A. Cập nhật lịch ca', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1287, 'answer', 907, 'B. Dọn dẹp không gian làm việc', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1288, 'answer', 908, 'C. Hoàn thành danh sách kiểm', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1289, 'answer', 909, 'D. Gọi điện thoại', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1290, 'answer', 910, 'A. Để mừng về hưu', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1291, 'answer', 911, 'B. Để kiểm tra', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1292, 'answer', 912, 'C. Gặp gỡ khách hàng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1293, 'answer', 913, 'D. Viết một bài báo', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1294, 'answer', 914, 'A. Cô ấy không thể chấp nhận lời mời', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1295, 'answer', 915, 'B. Hệ thống làm mát bị hỏng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1296, 'answer', 916, 'C. Một cuộc họp sẽ kết thúc sớm', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1297, 'answer', 917, 'D. Cô ấy muốn đổi chỗ ngồi', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1298, 'answer', 918, 'A. Miễn phí cho khách hàng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1299, 'answer', 919, 'B. Đang xây dựng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1300, 'answer', 920, 'C. Sắp đóng cửa', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1301, 'answer', 921, 'D. Có hợp đồng hàng tháng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1302, 'answer', 922, 'A. Tại một trường đại học', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1303, 'answer', 923, 'B. Tại một công ty xuất bản', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1304, 'answer', 924, 'C. Tại một cửa hàng điện tử', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1305, 'answer', 925, 'D. Tại một cửa hàng tạp hóa', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1306, 'answer', 926, 'A. Mức giá của một món hàng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1307, 'answer', 927, 'B. Khi nào sự kiện bắt đầu', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1308, 'answer', 928, 'C. Có bao nhiêu người tham gia', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1309, 'answer', 929, 'D. Lắp đặt thiết bị ở đâu', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1310, 'answer', 930, 'A. Cung cấp giảm giá', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1311, 'answer', 931, 'B. Trưng bày tài liệu thông tin', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1312, 'answer', 932, 'C. Tổ chức một cuộc thi', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1313, 'answer', 933, 'D. Đến bàn đăng ký', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1314, 'answer', 934, 'A. Sản xuất dệt may', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1315, 'answer', 935, 'B. Sản xuất thực phẩm', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1316, 'answer', 936, 'C. Y tế', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1317, 'answer', 937, 'D. Dịch vụ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1318, 'answer', 938, 'A. Thiếu nhân viên đủ tiêu chuẩn', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1319, 'answer', 939, 'B. Chi phí sản xuất tăng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1320, 'answer', 940, 'C. Thay đổi trong sở thích người tiêu dùng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1321, 'answer', 941, 'D. Sự cạnh tranh gia tăng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1322, 'answer', 942, 'A. Tìm hiểu thêm thông tin', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1323, 'answer', 943, 'B. Đàm phán giảm giá', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1324, 'answer', 944, 'C. Nâng cấp thiết bị', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1325, 'answer', 945, 'D. Đào tạo nhân viên mới', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1326, 'answer', 946, 'A. Giải thích về việc sáp nhập doanh nghiệp', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1327, 'answer', 947, 'B. Mô tả chính sách mới của công ty', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1328, 'answer', 948, 'C. Giao nhiệm vụ công việc cho người phụ nữ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1329, 'answer', 949, 'D. Mời người phụ nữ phát biểu tại hội thảo', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1330, 'answer', 950, 'A. Mua một doanh nghiệp khác', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1331, 'answer', 951, 'B. Tìm văn phòng mới', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1332, 'answer', 952, 'C. Sửa đổi đề xuất ngân sách', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1333, 'answer', 953, 'D. Tạo một chiến dịch marketing', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1334, 'answer', 954, 'A. Một bản mô tả dự án', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1335, 'answer', 955, 'B. Lời mời tham dự sự kiện', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1336, 'answer', 956, 'C. Một số liên kết mạng xã hội', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1337, 'answer', 957, 'D. Một số thông tin liên hệ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1338, 'answer', 958, 'A. Một chiếc xe không hoạt động', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1339, 'answer', 959, 'B. Một nhân viên đến muộn', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1340, 'answer', 960, 'C. Một lô hàng bị hỏng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1341, 'answer', 961, 'D. Giao thông đông đúc', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1342, 'answer', 962, 'A. Tại phòng thu âm', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1343, 'answer', 963, 'B. Tại công ty cung cấp dịch vụ ăn uống', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1344, 'answer', 964, 'C. Tại đài phát thanh', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1345, 'answer', 965, 'D. Tại đại lý xe hơi', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1346, 'answer', 966, 'A. Sắp xếp sửa xe', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1347, 'answer', 967, 'B. Đặt thêm dụng cụ bếp', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1348, 'answer', 968, 'C. Mang một số vật dụng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1349, 'answer', 969, 'D. Đề nghị hoàn tiền', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1350, 'answer', 970, 'A. Lên kế hoạch cho sự kiện công ty', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1351, 'answer', 971, 'B. Xác nhận hạn chót công việc', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1352, 'answer', 972, 'C. Thảo luận về con đường sự nghiệp', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1353, 'answer', 973, 'D. Nhận lời mời làm việc', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1354, 'answer', 974, 'A. Biên tập viên báo chí', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1355, 'answer', 975, 'B. Giáo sư đại học', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1356, 'answer', 976, 'C. Nhân viên giao hàng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1357, 'answer', 977, 'D. Diễn viên chuyên nghiệp', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1358, 'answer', 978, 'A. Đàm phán hợp đồng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1359, 'answer', 979, 'B. Giải thích chính sách văn phòng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1360, 'answer', 980, 'C. Xem xét sơ yếu lý lịch', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1361, 'answer', 981, 'D. Mô tả lịch trình làm việc', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1362, 'answer', 982, 'A. Một tuyến giao thông mới', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1363, 'answer', 983, 'B. Một vụ sáp nhập công ty', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1364, 'answer', 984, 'C. Một chiến dịch truyền thông', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1365, 'answer', 985, 'D. Thiết kế cơ sở y tế', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1366, 'answer', 986, 'A. Để bày tỏ nghi ngờ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1367, 'answer', 987, 'B. Để giải thích một quy trình', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1368, 'answer', 988, 'C. Để đưa ra đề xuất', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1369, 'answer', 989, 'D. Để cập nhật thông tin', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1370, 'answer', 990, 'A. Trả phí chứng nhận', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1371, 'answer', 991, 'B. Đào tạo thêm nhân viên', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1372, 'answer', 992, 'C. Nâng cấp công nghệ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1373, 'answer', 993, 'D. Chuyển đến thành phố khác', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1374, 'answer', 994, 'A. Người quyên góp', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1375, 'answer', 995, 'B. Tình nguyện viên', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1376, 'answer', 996, 'C. Nhân viên', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1377, 'answer', 997, 'D. Khách hàng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1378, 'answer', 998, 'A. 21 đô', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1379, 'answer', 999, 'B. 18 đô', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1380, 'answer', 1000, 'C. 24 đô', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1381, 'answer', 1001, 'D. 15 đô', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1382, 'answer', 1002, 'A. Một tệp đồ họa', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1383, 'answer', 1003, 'B. Danh sách tên', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1384, 'answer', 1004, 'C. Địa chỉ giao hàng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1385, 'answer', 1005, 'D. Số tài khoản', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1386, 'answer', 1006, 'A. Tác phẩm điêu khắc đất sét', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1387, 'answer', 1007, 'B. Tranh sơn dầu', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1388, 'answer', 1008, 'C. Ảnh trắng đen', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1389, 'answer', 1009, 'D. Tranh chì', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1390, 'answer', 1010, 'A. Ánh nhìn cẩn trọng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1391, 'answer', 1011, 'B. Lời hứa', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1392, 'answer', 1012, 'C. Biển động', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1393, 'answer', 1013, 'D. Khoảnh khắc', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1394, 'answer', 1014, 'A. Nói chuyện với họa sĩ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1395, 'answer', 1015, 'B. Chỉnh sửa bản thu âm', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1396, 'answer', 1016, 'C. Dọn dẹp không gian triển lãm', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1397, 'answer', 1017, 'D. Chào đón khách tham quan', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1398, 'answer', 1018, 'A. Người quy hoạch đô thị', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1399, 'answer', 1019, 'B. Nhà báo', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1400, 'answer', 1020, 'C. Kỹ sư', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1401, 'answer', 1021, 'D. Nhà khoa học môi trường', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1402, 'answer', 1022, 'A. Địa điểm A', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1403, 'answer', 1023, 'B. Địa điểm B', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1404, 'answer', 1024, 'C. Địa điểm C', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1405, 'answer', 1025, 'D. Địa điểm D', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1406, 'answer', 1026, 'A. Cơ hội việc làm', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1407, 'answer', 1027, 'B. Chi phí tua-bin gió', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1408, 'answer', 1028, 'C. Vấn đề chuỗi cung ứng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1409, 'answer', 1029, 'D. Công suất điện', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1410, 'answer', 1030, 'A. Văn phòng thị trưởng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1411, 'answer', 1031, 'B. Bộ phận bảo trì', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1412, 'answer', 1032, 'C. Đại lý ô tô', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1413, 'answer', 1033, 'D. Văn phòng quản lý tòa nhà', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1414, 'answer', 1034, 'A. Di chuyển xe của họ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1415, 'answer', 1035, 'B. Trả tiền phạt đỗ xe', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1416, 'answer', 1036, 'C. Sử dụng lối vào khác', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1417, 'answer', 1037, 'D. Tham gia một cuộc họp', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1418, 'answer', 1038, 'A. Lá phiếu bầu cử', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1419, 'answer', 1039, 'B. Kế hoạch bảo trì', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1420, 'answer', 1040, 'C. Một bản đồ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1421, 'answer', 1041, 'D. Phiếu giảm giá', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1422, 'answer', 1042, 'A. Chăm sóc vườn', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1423, 'answer', 1043, 'B. Lắp đặt cửa sổ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1424, 'answer', 1044, 'C. Bảo trì mái nhà', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1425, 'answer', 1045, 'D. Cải tạo bếp', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1426, 'answer', 1046, 'A. Nên được làm sạch thường xuyên', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1427, 'answer', 1047, 'B. Nên chọn loại chất lượng cao', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1428, 'answer', 1048, 'C. Mới được phát minh gần đây', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1429, 'answer', 1049, 'D. Dễ cất giữ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1430, 'answer', 1050, 'A. Xử lý gỗ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1431, 'answer', 1051, 'B. Tham khảo ý kiến thợ điện', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1432, 'answer', 1052, 'C. Chụp ảnh', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1433, 'answer', 1053, 'D. Thoát nước', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1434, 'answer', 1054, 'A. Người dẫn chương trình radio', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1435, 'answer', 1055, 'B. Hướng dẫn viên', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1436, 'answer', 1056, 'C. Nhân viên bán hàng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1437, 'answer', 1057, 'D. Giáo sư', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1438, 'answer', 1058, 'A. Một buổi thuyết trình sẽ bắt đầu', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1439, 'answer', 1059, 'B. Một buổi trình diễn sẽ diễn ra', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1440, 'answer', 1060, 'C. Một cuộc phỏng vấn sẽ diễn ra', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1441, 'answer', 1061, 'D. Một công viên sẽ đóng cửa', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1442, 'answer', 1062, 'A. Một cuốn sách', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1443, 'answer', 1063, 'B. Một album', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1444, 'answer', 1064, 'C. Một bộ phim', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1445, 'answer', 1065, 'D. Một tạp chí', '2025-06-29 17:52:21', '2025-06-29 17:52:21');
INSERT INTO `translations` (`id`, `content_type`, `content_id`, `vietnamese_text`, `created_at`, `updated_at`) VALUES
(1446, 'answer', 1066, 'A. Một buổi hòa nhạc gây quỹ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1447, 'answer', 1067, 'B. Một cuộc thi thể thao', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1448, 'answer', 1068, 'C. Một buổi tập kịch', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1449, 'answer', 1069, 'D. Một buổi lễ trao giải', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1450, 'answer', 1070, 'A. Thay đổi chính sách', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1451, 'answer', 1071, 'B. Sửa chữa một toà nhà', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1452, 'answer', 1072, 'C. Chọn ra người chiến thắng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1453, 'answer', 1073, 'D. Tài trợ một đội', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1454, 'answer', 1074, 'A. Đặt vé sớm', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1455, 'answer', 1075, 'B. Tham quan trung tâm cộng đồng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1456, 'answer', 1076, 'C. Mua đồ ăn thức uống', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1457, 'answer', 1077, 'D. Quyên góp quần áo', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1458, 'answer', 1078, 'A. Quản lý thời gian', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1459, 'answer', 1079, 'B. Diễn thuyết trước công chúng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1460, 'answer', 1080, 'C. Kỹ năng lãnh đạo', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1461, 'answer', 1081, 'D. Mở rộng mạng lưới nghề nghiệp', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1462, 'answer', 1082, 'A. Một diễn giả khách vừa đến', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1463, 'answer', 1083, 'B. Có người hỗ trợ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1464, 'answer', 1084, 'C. Người tham dự nên nói to rõ ràng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1465, 'answer', 1085, 'D. Nên bố trí thêm ghế', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1466, 'answer', 1086, 'A. Ký tên vào danh sách', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1467, 'answer', 1087, 'B. Nghỉ giải lao', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1468, 'answer', 1088, 'C. Tham gia hoạt động làm quen', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1469, 'answer', 1089, 'D. Điền vào phiếu khảo sát', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1470, 'answer', 1090, 'A. Những bức tường phòng thủ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1471, 'answer', 1091, 'B. Cư dân hoàng gia', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1472, 'answer', 1092, 'C. Một sự kiện đã xảy ra', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1473, 'answer', 1093, 'D. Một vài tác phẩm nghệ thuật', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1474, 'answer', 1094, 'A. Người nghe không được chụp ảnh', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1475, 'answer', 1095, 'B. Một khu vực bị đóng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1476, 'answer', 1096, 'C. Không có cửa hàng quà tặng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1477, 'answer', 1097, 'D. Chuyến tham quan bắt đầu trễ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1478, 'answer', 1098, 'A. Xuất trình vé', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1479, 'answer', 1099, 'B. Mặc đồ bảo hộ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1480, 'answer', 1100, 'C. Bám vào tay vịn', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1481, 'answer', 1101, 'D. Nói chuyện nhỏ nhẹ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1482, 'answer', 1102, 'A. Một chiến dịch quảng cáo', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1483, 'answer', 1103, 'B. Mở rộng thị trường', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1484, 'answer', 1104, 'C. Một số cuộc đàm phán hợp đồng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1485, 'answer', 1105, 'D. Một số quy trình kiểm toán', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1486, 'answer', 1106, 'A. Đã phê duyệt trả lương làm thêm', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1487, 'answer', 1107, 'B. Phải đáp ứng thời hạn', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1488, 'answer', 1108, 'C. Khách hàng bày tỏ lo ngại', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1489, 'answer', 1109, 'D. Quản lý sẽ theo dõi sát sao', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1490, 'answer', 1110, 'A. Xem một bài thuyết trình', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1491, 'answer', 1111, 'B. Xem lại ngân sách', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1492, 'answer', 1112, 'C. Chỉnh sửa một số công việc', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1493, 'answer', 1113, 'D. Thực hiện nghiên cứu', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1494, 'answer', 1114, 'A. Tại bệnh viện', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1495, 'answer', 1115, 'B. Tại nhà hàng', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1496, 'answer', 1116, 'C. Tại cửa hàng tạp hóa', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1497, 'answer', 1117, 'D. Tại cửa hàng điện tử', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1498, 'answer', 1118, 'A. Đưa ra yêu cầu', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1499, 'answer', 1119, 'B. Giải quyết phàn nàn của nhân viên', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1500, 'answer', 1120, 'C. Trình bày lịch làm việc mới', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1501, 'answer', 1121, 'D. Giải thích quy trình kỹ thuật', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1502, 'answer', 1122, 'A. Một quy trình chưa được thực hiện', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1503, 'answer', 1123, 'B. Có thể yêu cầu làm thêm giờ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1504, 'answer', 1124, 'C. Người nghe nên liên hệ quản lý', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1505, 'answer', 1125, 'D. Sự thay đổi sẽ không diễn ra ngay lập tức', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1506, 'answer', 1126, 'A. Tái cấu trúc công ty', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1507, 'answer', 1127, 'B. Cải tạo công viên', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1508, 'answer', 1128, 'C. Tập huấn tình nguyện viên', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1509, 'answer', 1129, 'D. Dự án bảo tồn', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1510, 'answer', 1130, 'A. Vị trí 1', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1511, 'answer', 1131, 'B. Vị trí 2', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1512, 'answer', 1132, 'C. Vị trí 3', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1513, 'answer', 1133, 'D. Vị trí 4', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1514, 'answer', 1134, 'A. Hoàn thành khảo sát', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1515, 'answer', 1135, 'B. Quyên góp tiền', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1516, 'answer', 1136, 'C. Tham gia một tổ chức', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1517, 'answer', 1137, 'D. Đăng ảnh chụp', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1518, 'answer', 1138, 'A. Khi nào thu hoạch mùa vụ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1519, 'answer', 1139, 'B. Trồng cây ở đâu', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1520, 'answer', 1140, 'C. Cách trồng rau', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1521, 'answer', 1141, 'D. Loại hoa nào cần nhiều ánh sáng hơn', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1522, 'answer', 1142, 'A. 12 inch', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1523, 'answer', 1143, 'B. 4 inch', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1524, 'answer', 1144, 'C. 6 inch', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1525, 'answer', 1145, 'D. 8 inch', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1526, 'answer', 1146, 'A. Tắt điện thoại', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1527, 'answer', 1147, 'B. Ăn nhẹ', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1528, 'answer', 1148, 'C. Mua hạt giống', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1529, 'answer', 1149, 'D. Đăng ký danh sách gửi thư', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1530, 'answer', 1150, 'A. Anh ấy', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1531, 'answer', 1151, 'B. Của anh ấy', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1532, 'answer', 1152, 'C. Anh ấy (tân ngữ)', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1533, 'answer', 1153, 'D. Chính anh ấy', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1534, 'answer', 1154, 'A. Kết nối', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1535, 'answer', 1155, 'B. Kết nối (động từ)', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1536, 'answer', 1156, 'C. Kết nối', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1537, 'answer', 1157, 'D. Chuyển tiếp', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1538, 'answer', 1158, 'A. Đã ăn', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1539, 'answer', 1159, 'B. Mở', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1540, 'answer', 1160, 'C. Ngon', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1541, 'answer', 1161, 'D. Miễn phí', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1542, 'answer', 1162, 'A. Sơn', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1543, 'answer', 1163, 'B. Gạch lát', '2025-06-29 17:52:21', '2025-06-29 17:52:21'),
(1544, 'answer', 1164, 'C. Đồ nội thất', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1545, 'answer', 1165, 'D. Rèm cửa', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1546, 'answer', 1166, 'A. Cập nhật', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1547, 'answer', 1167, 'B. Đang cập nhật', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1548, 'answer', 1168, 'C. Các bản cập nhật', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1549, 'answer', 1169, 'D. Đã cập nhật', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1550, 'answer', 1170, 'A. Vì vậy', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1551, 'answer', 1171, 'B. Như thế nào', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1552, 'answer', 1172, 'C. Giống như', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1553, 'answer', 1173, 'D. Trước khi', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1554, 'answer', 1174, 'A. Nhiệt tình', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1555, 'answer', 1175, 'B. Sự nhiệt huyết', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1556, 'answer', 1176, 'C. Nhiệt huyết', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1557, 'answer', 1177, 'D. Được truyền cảm hứng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1558, 'answer', 1178, 'A. Kiểm tra', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1559, 'answer', 1179, 'B. Người kiểm tra', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1560, 'answer', 1180, 'C. Đã được kiểm tra', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1561, 'answer', 1181, 'D. Các cuộc kiểm tra', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1562, 'answer', 1182, 'A. cho đến', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1563, 'answer', 1183, 'B. vào', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1564, 'answer', 1184, 'C. tuy nhiên', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1565, 'answer', 1185, 'D. trong khi', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1566, 'answer', 1186, 'A. riêng biệt', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1567, 'answer', 1187, 'B. bị giới hạn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1568, 'answer', 1188, 'C. sẵn lòng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1569, 'answer', 1189, 'D. đa dạng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1570, 'answer', 1190, 'A. các đợt giao hàng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1571, 'answer', 1191, 'B. đã giao', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1572, 'answer', 1192, 'C. giao hàng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1573, 'answer', 1193, 'D. có thể giao', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1574, 'answer', 1194, 'A. lái xe', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1575, 'answer', 1195, 'B. cấm', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1576, 'answer', 1196, 'C. làm phiền', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1577, 'answer', 1197, 'D. đi lại', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1578, 'answer', 1198, 'A. tìm kiếm', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1579, 'answer', 1199, 'B. nhìn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1580, 'answer', 1200, 'C. lái xe', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1581, 'answer', 1201, 'D. nghiêng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1582, 'answer', 1202, 'A. hoàn hảo', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1583, 'answer', 1203, 'B. làm hoàn hảo', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1584, 'answer', 1204, 'C. một cách hoàn hảo', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1585, 'answer', 1205, 'D. sự hoàn hảo', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1586, 'answer', 1206, 'D. hữu ích', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1587, 'answer', 1207, 'A. sự hữu ích', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1588, 'answer', 1208, 'B. sự giúp đỡ', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1589, 'answer', 1209, 'C. một cách có ích', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1590, 'answer', 1210, 'C. trong suốt', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1591, 'answer', 1211, 'A. lên trên', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1592, 'answer', 1212, 'B. phía trên', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1593, 'answer', 1213, 'D. giữa', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1594, 'answer', 1214, 'D. sớm', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1595, 'answer', 1215, 'A. xa', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1596, 'answer', 1216, 'B. rất', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1597, 'answer', 1217, 'C. gần như', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1598, 'answer', 1218, 'A. có tổ chức', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1599, 'answer', 1219, 'C. tổ chức (v)', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1600, 'answer', 1220, 'D. thuộc về tổ chức', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1601, 'answer', 1221, 'A. tạm thời', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1602, 'answer', 1222, 'B. một cách cạnh tranh', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1603, 'answer', 1223, 'C. gần đây', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1604, 'answer', 1224, 'D. một cách tập thể', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1605, 'answer', 1225, 'C. về', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1606, 'answer', 1226, 'A. từ', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1607, 'answer', 1227, 'B. dưới', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1608, 'answer', 1228, 'D. chống lại', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1609, 'answer', 1229, 'D. vô tình', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1610, 'answer', 1230, 'A. tai nạn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1611, 'answer', 1231, 'B. mang tính tình cờ', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1612, 'answer', 1232, 'C. các tai nạn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1613, 'answer', 1233, 'A. tới', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1614, 'answer', 1234, 'B. với', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1615, 'answer', 1235, 'C. cái nào', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1616, 'answer', 1236, 'D. bây giờ', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1617, 'answer', 1237, 'B. cần', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1618, 'answer', 1238, 'A. đang cần', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1619, 'answer', 1239, 'C. đã cần', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1620, 'answer', 1240, 'D. đã đang cần', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1621, 'answer', 1241, 'A. đã', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1622, 'answer', 1242, 'B. chính xác', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1623, 'answer', 1243, 'C. hầu như không', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1624, 'answer', 1244, 'D. một cách kỹ lưỡng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1625, 'answer', 1245, 'D. tiêu chuẩn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1626, 'answer', 1246, 'A. chuyên gia', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1627, 'answer', 1247, 'B. tài khoản', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1628, 'answer', 1248, 'C. khuyến nghị', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1629, 'answer', 1249, 'D. một vài', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1630, 'answer', 1250, 'A. bất kỳ', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1631, 'answer', 1251, 'B. mọi người', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1632, 'answer', 1252, 'C. những người', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1633, 'answer', 1253, 'C. yêu cầu', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1634, 'answer', 1254, 'A. thông qua', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1635, 'answer', 1255, 'B. quyết định', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1636, 'answer', 1256, 'D. thực hiện', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1637, 'answer', 1257, 'C. đã được phê duyệt', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1638, 'answer', 1258, 'A. đang phê duyệt', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1639, 'answer', 1259, 'B. phê duyệt', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1640, 'answer', 1260, 'D. sẽ được phê duyệt', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1641, 'answer', 1261, 'C. vì lý do của', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1642, 'answer', 1262, 'A. mặc dù', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1643, 'answer', 1263, 'B. giống như', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1644, 'answer', 1264, 'D. theo như', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1645, 'answer', 1265, 'B. bổ sung', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1646, 'answer', 1266, 'A. tùy ý', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1647, 'answer', 1267, 'C. dư thừa', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1648, 'answer', 1268, 'D. tiềm năng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1649, 'answer', 1269, 'D. Thứ Bảy tới lúc 4 giờ chiều, chúng tôi sẽ tổ chức một buổi hội thảo miễn phí cho công chúng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1650, 'answer', 1270, 'A. Trẻ em ở mọi lứa tuổi sẽ thích các triển lãm mới.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1651, 'answer', 1271, 'B. Tìm hiểu về các kiểu mưa trong khu vực.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1652, 'answer', 1272, 'C. Lắp bộ bàn ghế sân đơn giản với vật liệu dễ kiếm.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1653, 'answer', 1273, 'A. để sử dụng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1654, 'answer', 1274, 'B. đã từng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1655, 'answer', 1275, 'C. bằng cách sử dụng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1656, 'answer', 1276, 'D. mà sử dụng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1657, 'answer', 1277, 'B. Ví dụ', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1658, 'answer', 1278, 'A. Tốt nhất là', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1659, 'answer', 1279, 'C. Dù sao đi nữa', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1660, 'answer', 1280, 'D. Thực tế là', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1661, 'answer', 1281, 'A. chúng tôi', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1662, 'answer', 1282, 'B. họ', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1663, 'answer', 1283, 'C. cả hai', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1664, 'answer', 1284, 'D. của bạn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1665, 'answer', 1285, 'C. Đáng kinh ngạc', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1666, 'answer', 1286, 'A. Bị kinh ngạc', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1667, 'answer', 1287, 'B. Sự kinh ngạc', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1668, 'answer', 1288, 'D. Một cách kinh ngạc', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1669, 'answer', 1289, 'B. Những đề xuất', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1670, 'answer', 1290, 'A. Sự chú ý', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1671, 'answer', 1291, 'C. Sự đổi mới', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1672, 'answer', 1292, 'D. Sự chỉ trích', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1673, 'answer', 1293, 'B. Cảm ơn bạn vì sự linh hoạt trong việc lên kế hoạch cho sự kiện.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1674, 'answer', 1294, 'A. Một vài sự kiện khác cũng đã diễn ra tốt đẹp.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1675, 'answer', 1295, 'C. Hãy ghé qua văn phòng chúng tôi lần tới khi bạn đến thành phố.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1676, 'answer', 1296, 'D. Tokyo là điểm đến du lịch hàng đầu vì nhiều lý do.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1677, 'answer', 1297, 'A. Sẽ có lợi', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1678, 'answer', 1298, 'B. Để có lợi', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1679, 'answer', 1299, 'C. Đã có lợi', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1680, 'answer', 1300, 'D. Có lợi (hiện tại)', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1681, 'answer', 1301, 'C. Của chúng tôi', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1682, 'answer', 1302, 'A. Nó', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1683, 'answer', 1303, 'B. Bạn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1684, 'answer', 1304, 'D. Mỗi', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1685, 'answer', 1305, 'A. Để đăng ký thẻ, hãy đến chi nhánh thư viện địa phương của bạn.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1686, 'answer', 1306, 'B. Nếu có câu hỏi về việc đăng ký thành viên thư viện, hãy truy cập website của chúng tôi.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1687, 'answer', 1307, 'C. Việc gia hạn phải được thực hiện ít nhất một tuần trước khi thẻ hết hạn.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1688, 'answer', 1308, 'D. Bạn có thể rút khỏi chương trình này bất cứ lúc nào.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1689, 'answer', 1309, 'C. Bởi vì', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1690, 'answer', 1310, 'A. Ngoài ra', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1691, 'answer', 1311, 'B. Nên', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1692, 'answer', 1312, 'D. Mặc dù', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1693, 'answer', 1313, 'A. Một cách cụ thể', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1694, 'answer', 1314, 'B. Những chi tiết', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1695, 'answer', 1315, 'C. Được chỉ rõ', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1696, 'answer', 1316, 'D. Sự cụ thể', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1697, 'answer', 1317, 'A. Tôi muốn giới thiệu bạn với doanh nghiệp của chúng tôi.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1698, 'answer', 1318, 'B. Những bức ảnh đẹp có thể giúp tài sản của bạn nổi bật.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1699, 'answer', 1319, 'C. Chúng tôi mong chờ chuyến thăm của bạn.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1700, 'answer', 1320, 'D. Đây là studio đầu tiên thuộc loại này mở ở khu vực này.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1701, 'answer', 1321, 'B. Tạo ra', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1702, 'answer', 1322, 'A. Nghiên cứu', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1703, 'answer', 1323, 'C. Mua', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1704, 'answer', 1324, 'D. Trưng bày', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1705, 'answer', 1325, 'C. Nếu không thì', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1706, 'answer', 1326, 'A. Nếu không', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1707, 'answer', 1327, 'B. So sánh mà nói', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1708, 'answer', 1328, 'D. Thật vậy', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1709, 'answer', 1329, 'D. Đã phải nhận', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1710, 'answer', 1330, 'A. Nhận', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1711, 'answer', 1331, 'B. Đang nhận', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1712, 'answer', 1332, 'C. Đã nhận', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1713, 'answer', 1333, 'D. Trên một trang web', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1714, 'answer', 1334, 'A. Trên cánh cửa', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1715, 'answer', 1335, 'B. Trên hoá đơn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1716, 'answer', 1336, 'C. Trong một cái hộp', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1717, 'answer', 1337, 'B. Một món đồ nội thất', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1718, 'answer', 1338, 'A. Một máy tính để bàn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1719, 'answer', 1339, 'C. Một thiết bị gia dụng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1720, 'answer', 1340, 'D. Một dụng cụ điện', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1721, 'answer', 1341, 'D. Một số thời gian họp đã bị thay đổi', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1722, 'answer', 1342, 'A. Một hội nghị đã được lên lịch', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1723, 'answer', 1343, 'B. Một công ty có văn phòng ở hai múi giờ', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1724, 'answer', 1344, 'C. Trợ lý hành chính lên kế hoạch đi lại', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1725, 'answer', 1345, 'B. Đó là khi nhân viên ở Toulouse bắt đầu ngày làm việc của họ', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1726, 'answer', 1346, 'A. Đó là khi văn phòng Winnipeg đóng cửa để ăn trưa', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1727, 'answer', 1347, 'C. Đây không phải là thời gian lý tưởng để lên lịch họp', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1728, 'answer', 1348, 'D. Nó vừa được thêm vào lịch trình', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1729, 'answer', 1349, 'B. Nó mới được cải tạo gần đây', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1730, 'answer', 1350, 'A. Nó nằm bên bờ hồ', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1731, 'answer', 1351, 'C. Nó sẽ xây dựng một khu vườn thực vật cho khách', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1732, 'answer', 1352, 'D. Nó được dành riêng cho các sự kiện doanh nghiệp', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1733, 'answer', 1353, 'D. Nó rất được người dân địa phương ưa chuộng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1734, 'answer', 1354, 'A. Nó được bắt đầu bởi một đầu bếp quốc tế', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1735, 'answer', 1355, 'B. Nó cung cấp các lựa chọn thực đơn hạn chế', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1736, 'answer', 1356, 'C. Hiện tại nó được tài trợ bởi một tổ chức từ thiện', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1737, 'answer', 1357, 'B. Cô ấy có thể cung cấp dụng cụ mà cô Evers cần', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1738, 'answer', 1358, 'A. Cô ấy sẽ mang bữa trưa cho cô Evers', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1739, 'answer', 1359, 'C. Một số tọa độ hiện trường là đúng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1740, 'answer', 1360, 'D. Một số số đo cần được kiểm tra lại', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1741, 'answer', 1361, 'A. Cô Chi sẽ lấy tọa độ hiện trường mới', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1742, 'answer', 1362, 'B. Cô Chi và cô Lim sẽ ra ngoài một lúc', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1743, 'answer', 1363, 'C. Cô Evers sẽ chia sẻ một công thức', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1744, 'answer', 1364, 'D. Cô Lim sẽ bắt đầu đo đạc', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1745, 'answer', 1365, 'A. Nông dân', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1746, 'answer', 1366, 'B. Đầu bếp chuyên nghiệp', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1747, 'answer', 1367, 'C. Tài xế xe tải', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1748, 'answer', 1368, 'D. Quản lý siêu thị', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1749, 'answer', 1369, 'B. Có lượng mưa lớn hơn bình thường', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1750, 'answer', 1370, 'A. Nó gây ra sự chậm trễ vận chuyển', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1751, 'answer', 1371, 'C. Nó thường xuyên là chủ đề trên bản tin địa phương', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1752, 'answer', 1372, 'D. Nó có lợi cho mùa màng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1753, 'answer', 1373, 'C. Sửa chữa máy móc nông nghiệp', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1754, 'answer', 1374, 'A. Tuyển dụng cho doanh nghiệp địa phương', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1755, 'answer', 1375, 'B. Thu gom và phân phối thực phẩm', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1756, 'answer', 1376, 'D. Hội thảo làm vườn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1757, 'answer', 1377, 'B. Trong hội trường âm nhạc', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1758, 'answer', 1378, 'A. Trên máy bay', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1759, 'answer', 1379, 'C. Tại nhà hàng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1760, 'answer', 1380, 'D. Tại bưu điện', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1761, 'answer', 1381, 'B. Chúng phải để lại bên ngoài tòa nhà', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1762, 'answer', 1382, 'A. Chúng có thể để trong hộp khóa với một khoản phí', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1763, 'answer', 1383, 'C. Chúng sẽ được kiểm tra bởi nhân viên', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1764, 'answer', 1384, 'D. Chúng phải để dưới ghế', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1765, 'answer', 1385, 'C. [3]', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1766, 'answer', 1386, 'A. [1]', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1767, 'answer', 1387, 'B. [2]', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1768, 'answer', 1388, 'D. [4]', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1769, 'answer', 1389, 'D. Để quảng bá sản phẩm tráng miệng mới', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1770, 'answer', 1390, 'A. Để yêu cầu xác nhận đơn hàng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1771, 'answer', 1391, 'B. Để điều chỉnh một số ngày giao hàng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1772, 'answer', 1392, 'C. Để thông báo mở rộng kinh doanh', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1773, 'answer', 1393, 'C. Cô ấy đã từng là khách hàng của Sweeter Specialties', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1774, 'answer', 1394, 'A. Cô ấy đang nhận một giải thưởng chuyên môn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1775, 'answer', 1395, 'B. Cô ấy đã từng làm đầu bếp bánh', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1776, 'answer', 1396, 'D. Cô ấy nhận được một đề xuất tích cực về đầu bếp', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1777, 'answer', 1397, 'A. Đây là sản phẩm bán chạy nhất với khách hàng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1778, 'answer', 1398, 'B. Đây là chiếc bánh đắt nhất tại Sweeter Specialties', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1779, 'answer', 1399, 'C. Nó được làm cho Esplin Electronics hàng năm', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1780, 'answer', 1400, 'D. Đây là sự kết hợp hương vị mới cho Sweeter Specialties', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1781, 'answer', 1401, 'C. Quyết định', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1782, 'answer', 1402, 'A. Chỉ trích', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1783, 'answer', 1403, 'B. Giải quyết', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1784, 'answer', 1404, 'D. Mô tả', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1785, 'answer', 1405, 'C. Nó được đánh giá rất cao', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1786, 'answer', 1406, 'A. Nó rẻ hơn hầu hết các mẫu khác', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1787, 'answer', 1407, 'B. Nó là mẫu lớn nhất có sẵn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1788, 'answer', 1408, 'D. Nó cùng thương hiệu với các thiết bị khác', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1789, 'answer', 1409, 'D. Vận hành', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1790, 'answer', 1410, 'A. Điều chỉnh', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1791, 'answer', 1411, 'B. Kiểm soát', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1792, 'answer', 1412, 'C. Di chuyển', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1793, 'answer', 1413, 'A. Cô ấy quan tâm đến việc tiết kiệm nước', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1794, 'answer', 1414, 'B. Cô ấy vừa chuyển đến nhà mới', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1795, 'answer', 1415, 'C. Cô ấy đã mua máy rửa chén một năm trước', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1796, 'answer', 1416, 'D. Cô ấy chuyên thiết kế lại nhà bếp', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1797, 'answer', 1417, 'A. Nhân viên của Skyler Airlines', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1798, 'answer', 1418, 'B. Khách hàng của Skyler Airlines', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1799, 'answer', 1419, 'C. Người đăng ký tạp chí tiềm năng', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1800, 'answer', 1420, 'D. Người đang tìm việc', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1801, 'answer', 1421, 'A. Trả phí cho chi phí học tập', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1802, 'answer', 1422, 'B. Vé máy bay miễn phí', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1803, 'answer', 1423, 'C. Cơ hội được cố vấn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1804, 'answer', 1424, 'D. Ngày nghỉ có lương', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1805, 'answer', 1425, 'C. Hãng được khen ngợi bởi một tạp chí chuyên ngành', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1806, 'answer', 1426, 'A. Bay đến nhiều nơi nhất trên thế giới', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1807, 'answer', 1427, 'B. Đang lên kế hoạch sáp nhập', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1808, 'answer', 1428, 'D. Đã thay ghế thoải mái hơn', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1809, 'answer', 1429, 'B. [2]', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1810, 'answer', 1430, 'A. [1]', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1811, 'answer', 1431, 'C. [3]', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1812, 'answer', 1432, 'D. [4]', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1813, 'answer', 1433, 'B. Nó sẽ làm nổi bật một số sản phẩm bán chạy.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1814, 'answer', 1434, 'A. Việc sản xuất sẽ tốn kém.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1815, 'answer', 1435, 'C. Đây sẽ là dự án đầu tiên của cô Gowan.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1816, 'answer', 1436, 'D. Nó sẽ được gửi đến nhiều địa điểm.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1817, 'answer', 1437, 'B. Thông tin từ nghiên cứu người dùng là quan trọng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1818, 'answer', 1438, 'A. Nhiều nhân viên nên tham dự cuộc họp.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1819, 'answer', 1439, 'C. Bài thuyết trình phải trôi chảy.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1820, 'answer', 1440, 'D. Cửa hàng đối tác cần được thông báo về báo cáo.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1821, 'answer', 1441, 'C. Một nhà nghiên cứu sản phẩm.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1822, 'answer', 1442, 'A. Quản lý cửa hàng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1823, 'answer', 1443, 'B. Một vận động viên nghiệp dư.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1824, 'answer', 1444, 'D. Giám đốc quảng cáo.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1825, 'answer', 1445, 'D. Vào thứ Sáu.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1826, 'answer', 1446, 'A. Vào thứ Hai.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1827, 'answer', 1447, 'B. Vào thứ Tư.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1828, 'answer', 1448, 'C. Vào thứ Năm.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1829, 'answer', 1449, 'D. Chúc mừng người nhận giải thưởng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1830, 'answer', 1450, 'A. Quảng bá khai trương nhà hàng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1831, 'answer', 1451, 'B. Thông báo quan hệ đối tác kinh doanh.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1832, 'answer', 1452, 'C. Giới thiệu chương trình du lịch.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1833, 'answer', 1453, 'C. thể hiện', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1834, 'answer', 1454, 'A. dẫn đến', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1835, 'answer', 1455, 'B. thay đổi', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1836, 'answer', 1456, 'D. nghĩ về', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1837, 'answer', 1457, 'C. Nó cung cấp nhiều lựa chọn bữa ăn.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1838, 'answer', 1458, 'A. Nó tăng giá cho mọi khách hàng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1839, 'answer', 1459, 'B. Nó đã sửa đổi lịch giao hàng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1840, 'answer', 1460, 'D. Nó có một phó chủ tịch mới.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1841, 'answer', 1461, 'D. Cô ấy thường xuyên đặt hàng từ Kitchen Swifts.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1842, 'answer', 1462, 'A. Cô ấy đã đến nhà hàng của ông Cordero.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1843, 'answer', 1463, 'B. Cô ấy vừa đi nghỉ ở Sydney.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1844, 'answer', 1464, 'C. Cô ấy là đồng nghiệp của cô Chambers.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1845, 'answer', 1465, 'A. Nó có thực đơn bữa trưa giới hạn.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1846, 'answer', 1466, 'B. Nó nhận đặt bàn ăn tối.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1847, 'answer', 1467, 'C. Nó phục vụ bánh mì từ tiệm địa phương.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1848, 'answer', 1468, 'D. Nó có chi nhánh ở Hồng Kông.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1849, 'answer', 1469, 'A. Hoàn tất một kế hoạch.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1850, 'answer', 1470, 'B. Chấp nhận lời mời.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1851, 'answer', 1471, 'C. Quảng bá dịch vụ mới.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1852, 'answer', 1472, 'D. Yêu cầu phản hồi về một chính sách.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1853, 'answer', 1473, 'C. Trả xe thuê.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1854, 'answer', 1474, 'A. Giao hàng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1855, 'answer', 1475, 'B. Dự họp.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1856, 'answer', 1476, 'D. Thăm người thân.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1857, 'answer', 1477, 'B. Ông Boyle đã thất vọng với các công ty vận chuyển bằng tàu và máy bay.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1858, 'answer', 1478, 'A. Chị gái ông Boyle là đồng sáng lập Ceelarie Classics.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1859, 'answer', 1479, 'C. Cô Savard từng mua hàng từ ông Boyle.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1860, 'answer', 1480, 'D. Cô Savard thích một thương hiệu hành lý cụ thể.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1861, 'answer', 1481, 'A. Cô ấy thường đi công tác.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1862, 'answer', 1482, 'B. Cô ấy trả thêm để giao tận tay.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1863, 'answer', 1483, 'C. Cô ấy mua nhạc cụ gần đây.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1864, 'answer', 1484, 'D. Cô sẽ gặp ông Boyle tại văn phòng thuê xe.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1865, 'answer', 1485, 'C. Bằng thuyền.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1866, 'answer', 1486, 'A. Bằng ô tô.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1867, 'answer', 1487, 'B. Bằng tàu hỏa.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1868, 'answer', 1488, 'D. Bằng máy bay.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1869, 'answer', 1489, 'C. TTA cung cấp các lớp học do chuyên gia trong ngành giảng dạy.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1870, 'answer', 1490, 'A. Được thành lập bởi một nhà thiết kế đồ họa.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1871, 'answer', 1491, 'B. Có bản tin trực tuyến riêng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1872, 'answer', 1492, 'D. Có cơ sở học tại các thành phố ở Tây Phi.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1873, 'answer', 1493, 'D. Một chứng chỉ.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1874, 'answer', 1494, 'A. Hội thảo viết sơ yếu lý lịch.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1875, 'answer', 1495, 'B. Giảm giá lớp tiếp theo.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1876, 'answer', 1496, 'C. Danh sách việc làm hiện tại.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1877, 'answer', 1497, 'B. Ông ấy đã từng tham gia lớp học của TTA.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1878, 'answer', 1498, 'A. Thiết kế diễn đàn thảo luận.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1879, 'answer', 1499, 'C. Phát triển phần mềm hội nghị video.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1880, 'answer', 1500, 'D. Vừa bán xe tải bán bánh.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1881, 'answer', 1501, 'B. Trở thành một nhà văn tự do thành công.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1882, 'answer', 1502, 'A. Giới thiệu về tiếp thị mạng xã hội.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1883, 'answer', 1503, 'C. Khởi nghiệp đài phát thanh Internet.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1884, 'answer', 1504, 'D. Cơ bản về thiết kế đồ họa.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1885, 'answer', 1505, 'D. Phần 4.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1886, 'answer', 1506, 'A. Phần 1.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1887, 'answer', 1507, 'B. Phần 2.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1888, 'answer', 1508, 'C. Phần 3.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1889, 'answer', 1509, 'D. Nó khai trương cách đây sáu tháng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1890, 'answer', 1510, 'A. Đang tuyển dụng nhân viên phục vụ.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1891, 'answer', 1511, 'B. Nằm trên con phố yên tĩnh.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1892, 'answer', 1512, 'C. Có chi nhánh khác ở Jamaica.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1893, 'answer', 1513, 'C. Gà jerk.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1894, 'answer', 1514, 'A. Cá hồng đỏ.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1895, 'answer', 1515, 'B. Súp đuôi bò.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1896, 'answer', 1516, 'D. Dê cà ri.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1897, 'answer', 1517, 'C. Cô ấy đã yêu cầu thêm cơm.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1898, 'answer', 1518, 'A. Cô ấy đến vào thứ Sáu.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1899, 'answer', 1519, 'B. Cô ấy đi ăn một mình.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1900, 'answer', 1520, 'D. Cô ấy gọi món tráng miệng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1901, 'answer', 1521, 'B. Đưa ra lời xin lỗi.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1902, 'answer', 1522, 'A. Trả lời câu hỏi.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1903, 'answer', 1523, 'C. Yêu cầu phản hồi.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1904, 'answer', 1524, 'D. Xác nhận đặt bàn.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1905, 'answer', 1525, 'D. Cô Smith.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1906, 'answer', 1526, 'A. Cô Roats.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1907, 'answer', 1527, 'B. Ông Deslandes.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1908, 'answer', 1528, 'C. Ông Brown.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1909, 'answer', 1529, 'A. Thực hiện các dự án cảnh quan.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1910, 'answer', 1530, 'B. Thiết kế đường cao tốc.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1911, 'answer', 1531, 'C. Sửa chữa nhà cũ.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1912, 'answer', 1532, 'D. Vận hành một trang trại.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1913, 'answer', 1533, 'B. Là thành viên của Câu lạc bộ Mua hàng Thường xuyên.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1914, 'answer', 1534, 'A. Là tổ chức từ thiện.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1915, 'answer', 1535, 'C. Đã mua hàng trên 4000 đô.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1916, 'answer', 1536, 'D. Nằm gần trung tâm cung ứng của Orbys.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1917, 'answer', 1537, 'C. Hệ thống lập hóa đơn.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1918, 'answer', 1538, 'A. Địa chỉ email của nó.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1919, 'answer', 1539, 'B. Danh sách ưu đãi.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1920, 'answer', 1540, 'D. Lịch giao hàng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1921, 'answer', 1541, 'D. Là khách hàng khoảng 20 năm của Orbys.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1922, 'answer', 1542, 'A. Yêu cầu gặp ông Singh.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1923, 'answer', 1543, 'B. Quan tâm đến việc làm tại Orbys.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1924, 'answer', 1544, 'C. Gần đây đặt hàng máy móc xây dựng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1925, 'answer', 1545, 'D. Cập nhật số tài khoản.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1926, 'answer', 1546, 'A. Thanh toán hóa đơn.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1927, 'answer', 1547, 'B. Giải quyết vấn đề.', '2025-06-29 17:52:22', '2025-06-29 17:52:22'),
(1928, 'answer', 1548, 'C. Xác nhận đơn hàng.', '2025-06-29 17:52:22', '2025-06-29 17:52:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_email_verified` tinyint(1) DEFAULT NULL,
  `auth_provider` enum('email','google') DEFAULT NULL,
  `auth_provider_id` varchar(255) DEFAULT NULL,
  `role` enum('student','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'student',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL,
  `uuid` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `name`, `avatar`, `is_email_verified`, `auth_provider`, `auth_provider_id`, `role`, `created_at`, `updated_at`, `last_login`, `uuid`) VALUES
(2, 'ngochoanghuy0504@gmail.com', '$2b$10$ozcMaOTHw8E2LbbC8oeOCuwzHEHWhw4OURSFKB2kWBviJjLZvNM4a', 'hoang', NULL, 1, 'google', NULL, 'student', '2025-06-16 22:37:36', '2025-06-28 15:58:11', '2025-06-28 15:58:11', 'c282a6be-20c2-4ec1-a90c-0f4b28538879'),
(5, 'huyhoangtran281@gmail.com', '', 'Hoàng Trần', NULL, 1, 'google', '105163267029214394861', 'admin', '2025-06-28 14:26:13', '2025-06-28 15:16:01', '2025-06-28 15:16:01', '5462d806-1813-4d90-8304-1df4f7bff210');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_answers`
--

CREATE TABLE `user_answers` (
  `id` int NOT NULL,
  `user_exam_attempt_id` int NOT NULL,
  `question_id` int NOT NULL,
  `answer_id` int DEFAULT NULL,
  `user_text_answer` text,
  `is_correct` tinyint(1) DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_attempt_parts`
--

CREATE TABLE `user_attempt_parts` (
  `id` int NOT NULL,
  `user_exam_attempt_id` int NOT NULL,
  `part_id` int NOT NULL,
  `order_index` int DEFAULT NULL,
  `score` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `user_attempt_parts`
--

INSERT INTO `user_attempt_parts` (`id`, `user_exam_attempt_id`, `part_id`, `order_index`, `score`, `created_at`) VALUES
(1, 1, 27, 1, NULL, '2025-06-29 14:50:41'),
(2, 1, 29, 2, NULL, '2025-06-29 14:50:41'),
(3, 1, 31, 3, NULL, '2025-06-29 14:50:41');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_exam_attempts`
--

CREATE TABLE `user_exam_attempts` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `exam_id` int NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `score` int DEFAULT NULL,
  `status` enum('in_progress','completed','abandoned') DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `user_exam_attempts`
--

INSERT INTO `user_exam_attempts` (`id`, `user_id`, `exam_id`, `start_time`, `end_time`, `score`, `status`, `created_at`) VALUES
(1, 2, 5, NULL, NULL, NULL, NULL, '2025-06-29 14:47:08');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `study_time_preference` int DEFAULT NULL,
  `level` enum('beginner','intermediate','advanced') DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_progresses`
--

CREATE TABLE `user_progresses` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `listening_score` int DEFAULT NULL,
  `reading_score` int DEFAULT NULL,
  `speaking_score` int DEFAULT NULL,
  `writing_score` int DEFAULT NULL,
  `total_study_time` int DEFAULT NULL,
  `last_activity_date` datetime DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_settings`
--

CREATE TABLE `user_settings` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `pomodoro_work_time` int DEFAULT NULL,
  `pomodoro_break_time` int DEFAULT NULL,
  `ui_theme` enum('light','dark','system') DEFAULT NULL,
  `study_music_id` int DEFAULT NULL,
  `notification_settings` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_study_preferences`
--

CREATE TABLE `user_study_preferences` (
  `user_id` int NOT NULL,
  `skill_id` int NOT NULL,
  `daily_minutes` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_target_skills`
--

CREATE TABLE `user_target_skills` (
  `user_id` int NOT NULL,
  `skill_id` int NOT NULL,
  `target_score` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vocabularies`
--

CREATE TABLE `vocabularies` (
  `id` int NOT NULL,
  `word` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `pronunciation` varchar(255) DEFAULT NULL,
  `speech_audio_url` varchar(255) DEFAULT NULL,
  `meaning` text,
  `example` text,
  `context` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `vocabularies`
--

INSERT INTO `vocabularies` (`id`, `word`, `image_url`, `pronunciation`, `speech_audio_url`, `meaning`, `example`, `context`, `status`, `created_at`, `updated_at`) VALUES
(4, 'efficient', NULL, NULL, NULL, 'hiệu quả', 'She designed an efficient workflow...', 'business', 'pending', '2025-06-20 13:51:25', '2025-06-20 13:51:25'),
(5, 'She’s eating', NULL, NULL, NULL, 'Cô ấy đang ăn', 'She’s eating in a picnic area.', 'casual', 'pending', '2025-06-21 18:55:02', '2025-06-21 18:55:02'),
(6, 'again', 'again.jpg', '/əˈɡen/', 'again.mp3', 'Once more; another time.', 'Can you say that again?', 'daily communication', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(7, 'clean', 'clean.jpg', '/kliːn/', 'clean.mp3', 'Free from dirt or mess.', 'She likes to keep her room clean.', 'casual', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(8, 'close', 'close.png', '/kloʊz/', 'close.mp3', 'To shut something.', 'Please close the door when you leave.', 'casual', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(9, 'cold', 'cold.jpg', '/koʊld/', 'cold.mp3', 'Having a low temperature.', 'It’s very cold outside today.', 'health', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(10, 'come', 'come.jpg', '/kʌm/', 'come.mp3', 'To move toward someone or something.', 'Can you come here for a minute?', 'daily communication', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(11, 'doctor', 'doctor.png', '/ˈdɒktər/', 'doctor.mp3', 'A person who treats sick people.', 'The doctor gave me medicine.', 'career', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(12, 'dream', 'dream.jpg', '/driːm/', 'dream.mp3', 'Thoughts during sleep or a goal.', 'I had a strange dream last night.', 'casual', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(13, 'give', 'give.jpg', '/ɡɪv/', 'give.mp3', 'To offer something to someone.', 'She will give you a gift.', 'daily communication', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(14, 'make', 'make.jpg', '/meɪk/', 'make.mp3', 'To create or build something.', 'Let’s make a cake together.', 'casual', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(15, 'peace', 'peace.jpg', '/piːs/', 'peace.mp3', 'A state of calm and no war.', 'The world needs more peace.', 'daily communication', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(16, 'popular', 'popular.jpg', '/ˈpɒpjələr/', 'popular.mp3', 'Liked by many people.', 'He is very popular at school.', 'daily communication', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(17, 'right', 'right.jpg', '/raɪt/', 'right.mp3', 'Correct or a direction.', 'You were right about the answer.', 'casual', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(18, 'small', 'small.jpg', '/smɔːl/', 'small.mp3', 'Not large in size.', 'That’s a small dog.', 'casual', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(19, 'so', 'so.jpg', '/soʊ/', 'so.mp3', 'To a great extent.', 'I am so happy today.', 'casual', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(20, 'some', 'some.jpg', '/sʌm/', 'some.mp3', 'An unspecified amount.', 'I have some cookies to share.', 'casual', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(21, 'stone', 'stone.jpg', '/stoʊn/', 'stone.mp3', 'A hard, solid material.', 'He threw a stone into the lake.', 'casual', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(22, 'such', 'such.png', '/sʌtʃ/', 'such.mp3', 'Of a kind or degree.', 'It was such a nice day.', 'daily communication', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(23, 'there', 'there.jpg', '/ðer/', 'there.mp3', 'In that place.', 'The book is over there.', 'casual', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(24, 'think', 'think.jpg', '/θɪŋk/', 'think.mp3', 'To use your mind to consider.', 'I think it will rain today.', 'casual', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(25, 'wait', 'wait.jpg', '/weɪt/', 'wait.mp3', 'To stay until something happens.', 'Please wait for your turn.', 'casual', 'approved', '2025-06-21 19:53:41', '2025-06-21 19:53:41'),
(26, 'The man', NULL, NULL, NULL, 'Người đàn ông', 'The man is standing in the snow beside a car.', 'business', 'pending', '2025-06-21 23:19:08', '2025-06-21 23:19:08');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `ai_feedbacks`
--
ALTER TABLE `ai_feedbacks`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `ai_generated_contents`
--
ALTER TABLE `ai_generated_contents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_ai_generated_contents_slug` (`slug`);

--
-- Chỉ mục cho bảng `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Chỉ mục cho bảng `api_usages`
--
ALTER TABLE `api_usages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `audio_files`
--
ALTER TABLE `audio_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `part_id` (`part_id`);

--
-- Chỉ mục cho bảng `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `exam_parts`
--
ALTER TABLE `exam_parts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_id` (`exam_id`),
  ADD KEY `part_id` (`part_id`);

--
-- Chỉ mục cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `flashcards`
--
ALTER TABLE `flashcards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `vocabulary_id` (`vocabulary_id`);

--
-- Chỉ mục cho bảng `leader_boards`
--
ALTER TABLE `leader_boards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `listening_transcripts`
--
ALTER TABLE `listening_transcripts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audio_file_id` (`audio_file_id`);

--
-- Chỉ mục cho bảng `parts`
--
ALTER TABLE `parts`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `part_id` (`part_id`),
  ADD KEY `group_id` (`group_id`);

--
-- Chỉ mục cho bảng `question_groups`
--
ALTER TABLE `question_groups`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `speaking_writing_prompts`
--
ALTER TABLE `speaking_writing_prompts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Chỉ mục cho bảng `speaking_writing_submissions`
--
ALTER TABLE `speaking_writing_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `prompt_id` (`prompt_id`),
  ADD KEY `ai_feedback_id` (`ai_feedback_id`);

--
-- Chỉ mục cho bảng `study_musics`
--
ALTER TABLE `study_musics`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `study_sessions`
--
ALTER TABLE `study_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `translations`
--
ALTER TABLE `translations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_users_uuid` (`uuid`);

--
-- Chỉ mục cho bảng `user_answers`
--
ALTER TABLE `user_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_exam_attempt_id` (`user_exam_attempt_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `answer_id` (`answer_id`);

--
-- Chỉ mục cho bảng `user_attempt_parts`
--
ALTER TABLE `user_attempt_parts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_exam_attempt_id` (`user_exam_attempt_id`),
  ADD KEY `part_id` (`part_id`);

--
-- Chỉ mục cho bảng `user_exam_attempts`
--
ALTER TABLE `user_exam_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Chỉ mục cho bảng `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `user_progresses`
--
ALTER TABLE `user_progresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `study_music_id` (`study_music_id`);

--
-- Chỉ mục cho bảng `user_study_preferences`
--
ALTER TABLE `user_study_preferences`
  ADD PRIMARY KEY (`user_id`,`skill_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Chỉ mục cho bảng `user_target_skills`
--
ALTER TABLE `user_target_skills`
  ADD PRIMARY KEY (`user_id`,`skill_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Chỉ mục cho bảng `vocabularies`
--
ALTER TABLE `vocabularies`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `ai_feedbacks`
--
ALTER TABLE `ai_feedbacks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `ai_generated_contents`
--
ALTER TABLE `ai_generated_contents`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1549;

--
-- AUTO_INCREMENT cho bảng `api_usages`
--
ALTER TABLE `api_usages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `audio_files`
--
ALTER TABLE `audio_files`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `exam_parts`
--
ALTER TABLE `exam_parts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `flashcards`
--
ALTER TABLE `flashcards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `leader_boards`
--
ALTER TABLE `leader_boards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `listening_transcripts`
--
ALTER TABLE `listening_transcripts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `parts`
--
ALTER TABLE `parts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT cho bảng `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=412;

--
-- AUTO_INCREMENT cho bảng `question_groups`
--
ALTER TABLE `question_groups`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=218;

--
-- AUTO_INCREMENT cho bảng `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `speaking_writing_prompts`
--
ALTER TABLE `speaking_writing_prompts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `speaking_writing_submissions`
--
ALTER TABLE `speaking_writing_submissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `study_musics`
--
ALTER TABLE `study_musics`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `study_sessions`
--
ALTER TABLE `study_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `translations`
--
ALTER TABLE `translations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1929;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `user_answers`
--
ALTER TABLE `user_answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user_attempt_parts`
--
ALTER TABLE `user_attempt_parts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `user_exam_attempts`
--
ALTER TABLE `user_exam_attempts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user_progresses`
--
ALTER TABLE `user_progresses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `vocabularies`
--
ALTER TABLE `vocabularies`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `api_usages`
--
ALTER TABLE `api_usages`
  ADD CONSTRAINT `api_usages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `audio_files`
--
ALTER TABLE `audio_files`
  ADD CONSTRAINT `audio_files_ibfk_1` FOREIGN KEY (`part_id`) REFERENCES `parts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `exam_parts`
--
ALTER TABLE `exam_parts`
  ADD CONSTRAINT `exam_parts_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`),
  ADD CONSTRAINT `exam_parts_ibfk_2` FOREIGN KEY (`part_id`) REFERENCES `parts` (`id`);

--
-- Ràng buộc cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ràng buộc cho bảng `flashcards`
--
ALTER TABLE `flashcards`
  ADD CONSTRAINT `flashcards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flashcards_ibfk_2` FOREIGN KEY (`vocabulary_id`) REFERENCES `vocabularies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `leader_boards`
--
ALTER TABLE `leader_boards`
  ADD CONSTRAINT `leader_boards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `listening_transcripts`
--
ALTER TABLE `listening_transcripts`
  ADD CONSTRAINT `listening_transcripts_ibfk_1` FOREIGN KEY (`audio_file_id`) REFERENCES `audio_files` (`id`);

--
-- Ràng buộc cho bảng `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`part_id`) REFERENCES `parts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `question_groups` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ràng buộc cho bảng `speaking_writing_prompts`
--
ALTER TABLE `speaking_writing_prompts`
  ADD CONSTRAINT `speaking_writing_prompts_ibfk_1` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `speaking_writing_submissions`
--
ALTER TABLE `speaking_writing_submissions`
  ADD CONSTRAINT `speaking_writing_submissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `speaking_writing_submissions_ibfk_2` FOREIGN KEY (`prompt_id`) REFERENCES `speaking_writing_prompts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `speaking_writing_submissions_ibfk_3` FOREIGN KEY (`ai_feedback_id`) REFERENCES `ai_feedbacks` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Ràng buộc cho bảng `study_sessions`
--
ALTER TABLE `study_sessions`
  ADD CONSTRAINT `study_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `user_answers`
--
ALTER TABLE `user_answers`
  ADD CONSTRAINT `user_answers_ibfk_1` FOREIGN KEY (`user_exam_attempt_id`) REFERENCES `user_exam_attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_answers_ibfk_3` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `user_attempt_parts`
--
ALTER TABLE `user_attempt_parts`
  ADD CONSTRAINT `user_attempt_parts_ibfk_1` FOREIGN KEY (`user_exam_attempt_id`) REFERENCES `user_exam_attempts` (`id`),
  ADD CONSTRAINT `user_attempt_parts_ibfk_2` FOREIGN KEY (`part_id`) REFERENCES `parts` (`id`);

--
-- Ràng buộc cho bảng `user_exam_attempts`
--
ALTER TABLE `user_exam_attempts`
  ADD CONSTRAINT `user_exam_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_exam_attempts_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `user_progresses`
--
ALTER TABLE `user_progresses`
  ADD CONSTRAINT `user_progresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_settings_ibfk_2` FOREIGN KEY (`study_music_id`) REFERENCES `study_musics` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `user_study_preferences`
--
ALTER TABLE `user_study_preferences`
  ADD CONSTRAINT `user_study_preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_study_preferences_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`);

--
-- Ràng buộc cho bảng `user_target_skills`
--
ALTER TABLE `user_target_skills`
  ADD CONSTRAINT `user_target_skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_target_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
