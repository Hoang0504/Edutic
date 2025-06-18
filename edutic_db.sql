-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th6 18, 2025 lúc 04:39 PM
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

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ai_generated_contents`
--

CREATE TABLE `ai_generated_contents` (
  `id` int NOT NULL,
  `content_type` enum('question','part','exam','vocabulary') DEFAULT NULL,
  `content_id` varchar(255) DEFAULT NULL,
  `generated_text` text,
  `prompt_used` text,
  `created_at` datetime NOT NULL
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
(1, 1, 'PART_1-TEST_1.mp3', NULL, '1. (A) She’s eating in a picnic area. (B) She’s waiting in line at a food truck. (C) She’s wiping off a bench. (D) She’s throwing away a plate.  2. (A) The man is brushing snow off the roof of a car. (B) The man is standing in the snow beside a car. (C) The man is shoveling snow from a walkway. (D) The man is running through the snow.  3. (A) Some workers are hanging art in a gallery. (B) Two of the people are having a conversation. (C) One of the men is rearranging cushions on a sofa. (D) One of the men is painting a picture.  4. (A) Vehicles are entering a parking garage. (B) Clothes hangers are scattered on the ground. (C) Empty racks are lined up next to a building. (D) Clothing is being displayed under a tent.  5. (A) Potted plants have been suspended from a ceiling. (B) Chairs have been stacked in front of an entryway. (C) A computer station has been set up on a desk. (D) A rug has been rolled up against a wall.  6. (A) One of the men is sweeping a patio. (B) One of the men is replacing some flooring. (C) A door has been taken off its frame. (D) A light fixture has been left on the ground.', '2025-06-18 14:38:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `exams`
--

CREATE TABLE `exams` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `year_of_release` int NOT NULL,
  `type` enum('random','full_test') NOT NULL DEFAULT 'full_test',
  `description` text,
  `estimated_time` int DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(3, 1, 3, 1, '2025-06-09 22:32:48', 1, '2025-06-08 15:29:30', '2025-06-08 15:29:30');

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
(1, 1, 'part 1', NULL, NULL, 'easy', NULL, '2025-06-18 14:26:47', '2025-06-18 14:26:47');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `questions`
--

CREATE TABLE `questions` (
  `id` int NOT NULL,
  `part_id` int NOT NULL,
  `question_number` int DEFAULT NULL,
  `group_id` int NOT NULL,
  `content` text,
  `question_type` enum('multiple_choice','fill_in_blank','matching','speaking','writing') DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `question_groups`
--

CREATE TABLE `question_groups` (
  `id` int NOT NULL,
  `part_id` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(1, 'audio_transcript', 1, '1. (A) Cô ấy đang ăn trong khu vực dã ngoại.\n(B) Cô ấy đang xếp hàng tại một xe bán đồ ăn.\n(C) Cô ấy đang lau ghế dài.\n(D) Cô ấy đang vứt đĩa đi.\n\n2. (A) Người đàn ông đang phủi tuyết khỏi mái xe.\n(B) Người đàn ông đang đứng trong tuyết bên cạnh một chiếc xe.\n(C) Người đàn ông đang xúc tuyết khỏi lối đi.\n(D) Người đàn ông đang chạy qua tuyết.\n\n3. (A) Một số công nhân đang treo tranh trong một phòng trưng bày.\n(B) Hai người trong số họ đang trò chuyện.\n(C) Một trong những người đàn ông đang sắp xếp lại gối trên ghế sofa.\n(D) Một trong những người đàn ông đang vẽ tranh.\n\n4. (A) Các phương tiện đang vào một bãi đỗ xe.\n(B) Móc treo quần áo bị vứt rải rác trên mặt đất.\n(C) Các giá treo quần áo trống được xếp hàng cạnh một tòa nhà.\n(D) Quần áo được trưng bày dưới một chiếc lều.\n\n5. (A) Cây cảnh đã được treo từ trần nhà.\n(B) Ghế đã được xếp chồng lên nhau trước lối vào.\n(C) Một trạm máy tính đã được thiết lập trên bàn.\n(D) Một tấm thảm đã được cuộn lại dựa vào tường.\n\n6. (A) Một trong những người đàn ông đang quét sân.\n(B) Một trong những người đàn ông đang thay thế sàn nhà.\n(C) Cửa đã được tháo khỏi khung.\n(D) Một thiết bị chiếu sáng đã được để lại trên mặt đất.', '2025-06-18 15:02:03', '2025-06-18 15:02:03');

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
  `role` enum('student','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `uuid` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `name`, `avatar`, `is_email_verified`, `auth_provider`, `auth_provider_id`, `role`, `created_at`, `updated_at`, `last_login`, `uuid`) VALUES
(1, NULL, NULL, 'hoang', NULL, NULL, NULL, NULL, NULL, '2025-06-08 01:55:14', '2025-06-08 01:55:14', NULL, 'ugejkghbkjg94393'),
(2, 'hoang@gmail.com', '$2b$10$8dYLg8xGhvGj6S23QKeUVu/iG6Z4u7n5X2OseI9z1.2GPaYVF9C4a', 'hoang', NULL, 0, 'email', NULL, 'student', '2025-06-16 22:37:36', '2025-06-16 22:37:36', NULL, 'c282a6be-20c2-4ec1-a90c-0f4b28538879');

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
  `score` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `status` enum('pending','approved','rejected') DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `vocabularies`
--

INSERT INTO `vocabularies` (`id`, `word`, `image_url`, `pronunciation`, `speech_audio_url`, `meaning`, `example`, `context`, `status`, `created_at`, `updated_at`) VALUES
(3, 'efficient', NULL, NULL, NULL, NULL, 'She designed an efficient workflow that eliminated unnecessary steps and reduced errors.', NULL, 'pending', '2025-06-08 15:29:30', '2025-06-08 15:29:30');

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
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `part_id` (`part_id`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `ai_generated_contents`
--
ALTER TABLE `ai_generated_contents`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `api_usages`
--
ALTER TABLE `api_usages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `audio_files`
--
ALTER TABLE `audio_files`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `exam_parts`
--
ALTER TABLE `exam_parts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `flashcards`
--
ALTER TABLE `flashcards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `question_groups`
--
ALTER TABLE `question_groups`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `user_answers`
--
ALTER TABLE `user_answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user_attempt_parts`
--
ALTER TABLE `user_attempt_parts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user_exam_attempts`
--
ALTER TABLE `user_exam_attempts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Ràng buộc cho bảng `question_groups`
--
ALTER TABLE `question_groups`
  ADD CONSTRAINT `question_groups_ibfk_1` FOREIGN KEY (`part_id`) REFERENCES `parts` (`id`);

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
