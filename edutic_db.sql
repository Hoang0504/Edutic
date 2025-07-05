-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th7 05, 2025 lúc 02:20 AM
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
  `content_type` enum('voice_recording','writing_submission','user_attempt_part') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `content_id` int DEFAULT NULL,
  `feedback_text` text,
  `suggestions` text,
  `strengths` text,
  `weaknesses` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `type` enum('random','full_test','speaking','writing') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'full_test',
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
  `content_type` enum('question','answer','audio_transcript','question_group') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `content_id` int DEFAULT NULL,
  `vietnamese_text` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(2, 'ngochoanghuy0504@gmail.com', '$2b$10$ozcMaOTHw8E2LbbC8oeOCuwzHEHWhw4OURSFKB2kWBviJjLZvNM4a', 'hoang', '/uploads/images/1751427283516-3x4 -2.jpg', 1, 'google', NULL, 'student', '2025-06-16 22:37:36', '2025-07-03 16:43:39', '2025-07-03 16:43:39', 'c282a6be-20c2-4ec1-a90c-0f4b28538879'),
(5, 'huyhoangtran281@gmail.com', '$2b$10$ozcMaOTHw8E2LbbC8oeOCuwzHEHWhw4OURSFKB2kWBviJjLZvNM4a', 'Hoàng Trần', NULL, 1, 'google', '105163267029214394861', 'admin', '2025-06-28 14:26:13', '2025-07-03 07:31:59', '2025-07-03 07:31:59', '5462d806-1813-4d90-8304-1df4f7bff210'),
(6, 'truonghuy@gmail.com', '$2b$10$nZ0zoh0tHJ1Tfi3tOyND7eW0XpBuq3SmU9saDJolQSUFTH8QJKm56', NULL, '/uploads/images/1751427263215-avatar_2.jpg', 1, 'email', NULL, 'student', '2025-07-02 10:34:23', '2025-07-02 10:34:23', NULL, '65b977fd-05a9-4085-b869-08b7d54b1e5c'),
(7, 'phong@gmail.com', '$2b$10$ugX2PtxQJ5m2A7EqDAT3f.obb7oWpM7EFy3PtUmJrSIIsUH5sKFAO', NULL, '/uploads/images/1751427410441-Huy-Hoang-ChatGpt.png', 1, 'email', NULL, 'student', '2025-07-02 10:36:50', '2025-07-02 10:36:50', NULL, '0e1d0cc6-3bb1-4279-b503-c9845a00d9a5');

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
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
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
  `ai_feedback_id` int NOT NULL,
  `score` int DEFAULT NULL,
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

--
-- Đang đổ dữ liệu cho bảng `user_progresses`
--

INSERT INTO `user_progresses` (`id`, `user_id`, `listening_score`, `reading_score`, `speaking_score`, `writing_score`, `total_study_time`, `last_activity_date`, `updated_at`) VALUES
(1, 6, 420, 390, 155, 168, 200, '2025-06-02 10:39:03', '2025-07-02 03:39:03'),
(2, 7, 425, 495, 200, 185, 600, '2025-06-23 10:39:03', '2025-07-02 03:39:03');

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `ai_generated_contents`
--
ALTER TABLE `ai_generated_contents`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2323;

--
-- AUTO_INCREMENT cho bảng `api_usages`
--
ALTER TABLE `api_usages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `audio_files`
--
ALTER TABLE `audio_files`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `exam_parts`
--
ALTER TABLE `exam_parts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=612;

--
-- AUTO_INCREMENT cho bảng `question_groups`
--
ALTER TABLE `question_groups`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=260;

--
-- AUTO_INCREMENT cho bảng `skills`
--
ALTER TABLE `skills`
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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2888;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `user_answers`
--
ALTER TABLE `user_answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=565;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
