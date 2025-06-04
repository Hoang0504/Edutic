-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th6 04, 2025 lúc 01:03 PM
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
-- Cấu trúc bảng cho bảng `aifeedbacks`
--

CREATE TABLE `aifeedbacks` (
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
-- Cấu trúc bảng cho bảng `aigeneratedcontents`
--

CREATE TABLE `aigeneratedcontents` (
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
-- Cấu trúc bảng cho bảng `apiusages`
--

CREATE TABLE `apiusages` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `request_count` int DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `audiofiles`
--

CREATE TABLE `audiofiles` (
  `id` int NOT NULL,
  `part_id` int NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `transcript` text,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `exams`
--

CREATE TABLE `exams` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `difficulty_level` enum('easy','medium','hard') DEFAULT NULL,
  `estimated_time` int DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
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
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `leaderboards`
--

CREATE TABLE `leaderboards` (
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
-- Cấu trúc bảng cho bảng `parts`
--

CREATE TABLE `parts` (
  `id` int NOT NULL,
  `exam_id` int NOT NULL,
  `part_number` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `instruction` text,
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
  `content` text,
  `question_type` enum('multiple_choice','fill_in_blank','matching','speaking','writing') DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20250604081912-create-user.js'),
('20250604081956-create-skill.js'),
('20250604082046-create-study-music.js'),
('20250604082124-create-vocabulary.js'),
('20250604082200-create-exam.js'),
('20250604082325-create-user-profile.js'),
('20250604083906-create-user-setting.js'),
('20250604084654-create-part.js'),
('20250604084957-create-flashcard.js'),
('20250604090326-create-user-progress.js'),
('20250604091249-create-api-usage.js'),
('20250604091703-create-question.js'),
('20250604091945-create-audio-file.js'),
('20250604092141-create-speaking-writing-prompt.js'),
('20250604092559-create-user-exam-attempt.js'),
('20250604093121-create-study-session.js'),
('20250604104939-create-user-skill.js'),
('20250604105414-create-answer.js'),
('20250604110833-create-translation.js'),
('20250604110927-create-user-answer.js'),
('20250604112637-create-ai-feedback.js'),
('20250604112711-create-speaking-writing-submission.js'),
('20250604113156-create-ai-generated-content.js'),
('20250604113233-create-leaderboard.js');

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
-- Cấu trúc bảng cho bảng `speakingwritingprompts`
--

CREATE TABLE `speakingwritingprompts` (
  `id` int NOT NULL,
  `topic` varchar(255) DEFAULT NULL,
  `skill_id` int NOT NULL,
  `description` text,
  `difficulty_level` enum('easy','medium','hard') DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `speakingwritingsubmissions`
--

CREATE TABLE `speakingwritingsubmissions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `prompt_id` int NOT NULL,
  `content` text,
  `file_path` varchar(255) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `ai_feedback_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `studymusics`
--

CREATE TABLE `studymusics` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `studysessions`
--

CREATE TABLE `studysessions` (
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
  `content_type` enum('question','answer','instruction','transcript') DEFAULT NULL,
  `content_id` int DEFAULT NULL,
  `english_text` text,
  `vietnamese_text` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `useranswers`
--

CREATE TABLE `useranswers` (
  `id` int NOT NULL,
  `user_exam_attempt_id` int NOT NULL,
  `question_id` int NOT NULL,
  `answer_id` int DEFAULT NULL,
  `user_text_answer` text,
  `is_correct` tinyint(1) DEFAULT NULL,
  `time_spent` int DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `userexamattempts`
--

CREATE TABLE `userexamattempts` (
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
-- Cấu trúc bảng cho bảng `userprofiles`
--

CREATE TABLE `userprofiles` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `target_score` int DEFAULT NULL,
  `study_time_preference` int DEFAULT NULL,
  `level` enum('beginner','intermediate','advanced') DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `userprogresses`
--

CREATE TABLE `userprogresses` (
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
  `role` enum('student','teacher','admin') DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `usersettings`
--

CREATE TABLE `usersettings` (
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
-- Cấu trúc bảng cho bảng `userskills`
--

CREATE TABLE `userskills` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `skill_id` int NOT NULL,
  `type` enum('strong','weak') DEFAULT NULL
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
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `aifeedbacks`
--
ALTER TABLE `aifeedbacks`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `aigeneratedcontents`
--
ALTER TABLE `aigeneratedcontents`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Chỉ mục cho bảng `apiusages`
--
ALTER TABLE `apiusages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `audiofiles`
--
ALTER TABLE `audiofiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `part_id` (`part_id`);

--
-- Chỉ mục cho bảng `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `flashcards`
--
ALTER TABLE `flashcards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `vocabulary_id` (`vocabulary_id`);

--
-- Chỉ mục cho bảng `leaderboards`
--
ALTER TABLE `leaderboards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `parts`
--
ALTER TABLE `parts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Chỉ mục cho bảng `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `part_id` (`part_id`);

--
-- Chỉ mục cho bảng `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `speakingwritingprompts`
--
ALTER TABLE `speakingwritingprompts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Chỉ mục cho bảng `speakingwritingsubmissions`
--
ALTER TABLE `speakingwritingsubmissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `prompt_id` (`prompt_id`),
  ADD KEY `ai_feedback_id` (`ai_feedback_id`);

--
-- Chỉ mục cho bảng `studymusics`
--
ALTER TABLE `studymusics`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `studysessions`
--
ALTER TABLE `studysessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `translations`
--
ALTER TABLE `translations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `useranswers`
--
ALTER TABLE `useranswers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_exam_attempt_id` (`user_exam_attempt_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `answer_id` (`answer_id`);

--
-- Chỉ mục cho bảng `userexamattempts`
--
ALTER TABLE `userexamattempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Chỉ mục cho bảng `userprofiles`
--
ALTER TABLE `userprofiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `userprogresses`
--
ALTER TABLE `userprogresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `usersettings`
--
ALTER TABLE `usersettings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `study_music_id` (`study_music_id`);

--
-- Chỉ mục cho bảng `userskills`
--
ALTER TABLE `userskills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
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
-- AUTO_INCREMENT cho bảng `aifeedbacks`
--
ALTER TABLE `aifeedbacks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `aigeneratedcontents`
--
ALTER TABLE `aigeneratedcontents`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `apiusages`
--
ALTER TABLE `apiusages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `audiofiles`
--
ALTER TABLE `audiofiles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `flashcards`
--
ALTER TABLE `flashcards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `leaderboards`
--
ALTER TABLE `leaderboards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `parts`
--
ALTER TABLE `parts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `speakingwritingprompts`
--
ALTER TABLE `speakingwritingprompts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `speakingwritingsubmissions`
--
ALTER TABLE `speakingwritingsubmissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `studymusics`
--
ALTER TABLE `studymusics`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `studysessions`
--
ALTER TABLE `studysessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `translations`
--
ALTER TABLE `translations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `useranswers`
--
ALTER TABLE `useranswers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `userexamattempts`
--
ALTER TABLE `userexamattempts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `userprofiles`
--
ALTER TABLE `userprofiles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `userprogresses`
--
ALTER TABLE `userprogresses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `usersettings`
--
ALTER TABLE `usersettings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `userskills`
--
ALTER TABLE `userskills`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `vocabularies`
--
ALTER TABLE `vocabularies`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `apiusages`
--
ALTER TABLE `apiusages`
  ADD CONSTRAINT `apiusages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `audiofiles`
--
ALTER TABLE `audiofiles`
  ADD CONSTRAINT `audiofiles_ibfk_1` FOREIGN KEY (`part_id`) REFERENCES `parts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `flashcards`
--
ALTER TABLE `flashcards`
  ADD CONSTRAINT `flashcards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flashcards_ibfk_2` FOREIGN KEY (`vocabulary_id`) REFERENCES `vocabularies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `leaderboards`
--
ALTER TABLE `leaderboards`
  ADD CONSTRAINT `leaderboards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `parts`
--
ALTER TABLE `parts`
  ADD CONSTRAINT `parts_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`part_id`) REFERENCES `parts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `speakingwritingprompts`
--
ALTER TABLE `speakingwritingprompts`
  ADD CONSTRAINT `speakingwritingprompts_ibfk_1` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `speakingwritingsubmissions`
--
ALTER TABLE `speakingwritingsubmissions`
  ADD CONSTRAINT `speakingwritingsubmissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `speakingwritingsubmissions_ibfk_2` FOREIGN KEY (`prompt_id`) REFERENCES `speakingwritingprompts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `speakingwritingsubmissions_ibfk_3` FOREIGN KEY (`ai_feedback_id`) REFERENCES `aifeedbacks` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Ràng buộc cho bảng `studysessions`
--
ALTER TABLE `studysessions`
  ADD CONSTRAINT `studysessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `useranswers`
--
ALTER TABLE `useranswers`
  ADD CONSTRAINT `useranswers_ibfk_1` FOREIGN KEY (`user_exam_attempt_id`) REFERENCES `userexamattempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `useranswers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `useranswers_ibfk_3` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `userexamattempts`
--
ALTER TABLE `userexamattempts`
  ADD CONSTRAINT `userexamattempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userexamattempts_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `userprofiles`
--
ALTER TABLE `userprofiles`
  ADD CONSTRAINT `userprofiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `userprogresses`
--
ALTER TABLE `userprogresses`
  ADD CONSTRAINT `userprogresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `usersettings`
--
ALTER TABLE `usersettings`
  ADD CONSTRAINT `usersettings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usersettings_ibfk_2` FOREIGN KEY (`study_music_id`) REFERENCES `studymusics` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `userskills`
--
ALTER TABLE `userskills`
  ADD CONSTRAINT `userskills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userskills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
