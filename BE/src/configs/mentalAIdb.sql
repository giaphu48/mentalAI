-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 08, 2025 lúc 07:01 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `mentalaidb`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ai_model_versions`
--

CREATE TABLE `ai_model_versions` (
  `id` char(36) NOT NULL,
  `model_name` varchar(100) DEFAULT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `deployed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `appointments`
--

CREATE TABLE `appointments` (
  `id` char(36) NOT NULL,
  `client_id` char(36) DEFAULT NULL,
  `expert_id` char(36) DEFAULT NULL,
  `start_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `method` enum('video','chat') DEFAULT NULL,
  `status` enum('pending','confirmed','done','cancelled') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` char(36) NOT NULL,
  `actor_id` char(36) DEFAULT NULL,
  `action` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` char(36) NOT NULL,
  `session_id` char(36) DEFAULT NULL,
  `sender` enum('client','ai') DEFAULT NULL,
  `message` text DEFAULT NULL,
  `sentiment` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `session_id`, `sender`, `message`, `sentiment`, `created_at`) VALUES
('3045b94e-3505-442e-b961-a390f09880f4', '83c23a5b-fae7-43af-9d9f-40e9087f9599', 'client', 'Hôm nay tôi buồn quá', NULL, '2025-08-08 16:13:47'),
('353eff70-0170-4928-b438-2d95123efa23', NULL, 'client', 'Xin chào', NULL, '2025-08-07 23:48:30'),
('37f127b1-ba1b-434a-a2a0-4dfc417fd987', '83c23a5b-fae7-43af-9d9f-40e9087f9599', 'client', 'Xin chào', NULL, '2025-08-08 16:12:34'),
('4105edde-733c-464a-affc-c3dbd36539ba', '83c23a5b-fae7-43af-9d9f-40e9087f9599', 'client', 'Tôi cảm thấy mình vô dụng', NULL, '2025-08-08 16:21:51'),
('51b109be-1221-4de6-8590-4a9eb8de9315', NULL, 'client', 'Chào bạn', NULL, '2025-08-07 23:39:32'),
('621cd9dd-c769-4cfc-bb24-35417a0f04f9', NULL, 'ai', 'Chào bạn! Có điều gì tôi có thể giúp bạn không?', NULL, '2025-08-07 23:39:34'),
('a2311f97-b3fc-415b-aae1-49c7ad9450d3', NULL, 'ai', 'Xin chào! Có thể giúp gì cho bạn?', NULL, '2025-08-07 23:42:14'),
('a9978e85-7471-4c24-8022-acb103cf48fd', NULL, 'client', 'Xin chào', NULL, '2025-08-07 23:42:12'),
('b5a1f509-36de-4ea0-a0ec-bf5dd48314ad', NULL, 'client', 'Xin chào', NULL, '2025-08-07 23:47:19'),
('b9c16efd-9a6f-437c-9000-9e50b9a3f04f', NULL, 'client', 'Xin chào', NULL, '2025-08-07 23:37:34'),
('d8fc20ab-ff91-474b-90b1-e3d6b1137775', '83c23a5b-fae7-43af-9d9f-40e9087f9599', 'ai', 'Tôi hiểu cảm giác của bạn. Đôi khi chúng ta có thể cảm thấy như vậy khi gặp khó khăn hoặc không thành công trong mục tiêu của mình. Tuy nhiên, đừng tự trách bản thân quá nhiều. Mọi người đều có giá trị và khả năng của riêng mình. Hãy nhớ rằng không có ai hoàn hảo và mỗi thất bại đều là cơ hội để rút kinh nghiệm và phát triển.\n\nNếu cảm thấy quá áp lực, hãy thử tìm hiểu về những sở thích, niềm đam mê của bản thân và thực hiện những hoạt động mà bạn thích. Đôi khi việc thư giãn và giảm stress có thể giúp bạn cảm thấy tốt hơn. Nếu cần, hãy tìm sự hỗ trợ từ bạn bè, gia đình hoặc chuyên gia tâm lý để giúp bạn vượt qua cảm giác vô dụng này.Bạn là một người đáng quý và có giá trị, đừng quên điều đó.', NULL, '2025-08-08 16:21:54'),
('dae65934-6954-407d-a0ce-bd768844c7a7', '83c23a5b-fae7-43af-9d9f-40e9087f9599', 'ai', 'Rất tiếc về điều đó. Nếu bạn muốn chia sẻ hoặc tâm sự về điều gì, tôi sẽ lắng nghe và cố gắng giúp bạn. Đừng ngần ngại nhé.', NULL, '2025-08-08 16:13:49'),
('debcb539-33c7-4c08-a4c4-c2d06f1d3314', NULL, 'client', 'Xin chào', NULL, '2025-08-07 23:48:42'),
('faba76e5-12ce-426b-bf57-31483adcac26', NULL, 'ai', 'Xin chào! Tôi có thể giúp gì cho bạn?', NULL, '2025-08-07 23:37:35'),
('ff9e4bbe-0a39-4598-a60e-b9d902b13c6e', '83c23a5b-fae7-43af-9d9f-40e9087f9599', 'ai', 'Xin chào! Có điều gì tôi có thể giúp bạn không?', NULL, '2025-08-08 16:12:37');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chat_sessions`
--

CREATE TABLE `chat_sessions` (
  `id` char(36) NOT NULL,
  `client_id` char(36) DEFAULT NULL,
  `start_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_time` timestamp NULL DEFAULT NULL,
  `last_message` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `session_name` text DEFAULT NULL,
  `session_type` enum('ai','expert') DEFAULT 'ai'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chat_sessions`
--

INSERT INTO `chat_sessions` (`id`, `client_id`, `start_time`, `end_time`, `last_message`, `updated_at`, `session_name`, `session_type`) VALUES
('83c23a5b-fae7-43af-9d9f-40e9087f9599', '895c6336-8a04-404d-8553-3f409e39af66', '2025-08-08 16:12:34', NULL, 'Tôi hiểu cảm giác của bạn. Đôi khi chúng ta có thể cảm thấy như vậy khi gặp khó khăn hoặc không thành công trong mục tiêu của mình. Tuy nhiên, đừng tự trách bản thân quá nhiều. Mọi người đều có giá trị và khả năng của riêng mình. Hãy nhớ rằng không có ai hoàn hảo và mỗi thất bại đều là cơ hội để rút kinh nghiệm và phát triển.\n\nNếu cảm thấy quá áp lực, hãy thử tìm hiểu về những sở thích, niềm đam mê của bản thân và thực hiện những hoạt động mà bạn thích. Đôi khi việc thư giãn và giảm stress có thể giúp bạn cảm thấy tốt hơn. Nếu cần, hãy tìm sự hỗ trợ từ bạn bè, gia đình hoặc chuyên gia tâm lý để giúp bạn vượt qua cảm giác vô dụng này.Bạn là một người đáng quý và có giá trị, đừng quên điều đó.', '2025-08-08 16:21:54', 'Đoạn chat 1', 'ai');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `client_profiles`
--

CREATE TABLE `client_profiles` (
  `user_id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `avatar` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `client_profiles`
--

INSERT INTO `client_profiles` (`user_id`, `name`, `dob`, `gender`, `avatar`) VALUES
('04853e83-a413-426a-aaad-016314aeef0e', 'Huỳnh Gia Phú', '2025-07-08', 'male', 'https://res.cloudinary.com/dlzfacstr/image/upload/v1753204306/avatars/ziqjcpalivxwg7knysnw.jpg'),
('895c6336-8a04-404d-8553-3f409e39af66', 'ABCDEF', '2025-08-04', 'male', 'https://res.cloudinary.com/dlzfacstr/image/upload/v1751711430/avatars/zrjjy1zht3dfo35yvlg0.png');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `deleted_accounts`
--

CREATE TABLE `deleted_accounts` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `deleted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `emotion_diaries`
--

CREATE TABLE `emotion_diaries` (
  `id` char(36) NOT NULL,
  `client_id` char(36) DEFAULT NULL,
  `entry_date` date NOT NULL,
  `content` text DEFAULT NULL,
  `sentiment_score` float DEFAULT NULL,
  `emotion_tag` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `expert_profiles`
--

CREATE TABLE `expert_profiles` (
  `user_id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `certification` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `approved_by_admin` tinyint(1) DEFAULT 0,
  `avatar` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `expert_profiles`
--

INSERT INTO `expert_profiles` (`user_id`, `name`, `certification`, `bio`, `approved_by_admin`, `avatar`, `gender`, `dob`) VALUES
('89a3da78-4689-4520-88aa-f32d57eec8da', 'Dr. Nguyễn Văn A', 'bachelor', 'Tao đẹp trai, dưa leo', 1, 'https://res.cloudinary.com/dlzfacstr/image/upload/v1751708549/avatars/yiuihjm7a5uppm8nzsgy.png', 'male', '2025-07-04');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `psychological_tests`
--

CREATE TABLE `psychological_tests` (
  `id` char(36) NOT NULL,
  `client_id` char(36) DEFAULT NULL,
  `test_type` varchar(50) DEFAULT NULL,
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`answers`)),
  `result` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `resources`
--

CREATE TABLE `resources` (
  `id` char(36) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` enum('article','video','exercise') DEFAULT NULL,
  `content_url` text DEFAULT NULL,
  `tags` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `session_notes`
--

CREATE TABLE `session_notes` (
  `id` char(36) NOT NULL,
  `appointment_id` char(36) DEFAULT NULL,
  `expert_id` char(36) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `ai_report` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `training_data`
--

CREATE TABLE `training_data` (
  `id` char(36) NOT NULL,
  `source_type` enum('chat','diary','test') DEFAULT NULL,
  `content` text DEFAULT NULL,
  `label` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('client','expert','admin') NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `phone`, `password_hash`, `role`, `is_verified`, `created_at`, `updated_at`) VALUES
('04853e83-a413-426a-aaad-016314aeef0e', 'giaphu480@gmail.com', '0333333333', '$2b$10$ap8SifM.JmH6sIfZ6Xlmq.RceEPtQZwgWoF6Sg/ryV4182AmWOA1m', 'client', 1, '2025-07-03 21:42:15', '2025-07-03 21:42:43'),
('895c6336-8a04-404d-8553-3f409e39af66', 'chickyhello@gmail.com', '0352609042', '$2b$10$ejrUWPIlq6Of0fvBH3iuBu9OpnUSA3N7N80QgMaxCJW0mbpMIxWEO', 'client', 1, '2025-07-05 10:29:28', '2025-07-05 10:29:45'),
('89a3da78-4689-4520-88aa-f32d57eec8da', 'haku8088@gmail.com', '0919191913', '$2b$10$Lgqlyng7DYZsqCDL1lluN.DmM9pt1eUcJZfYdn6sCd63UOUXpZj36', 'expert', 1, '2025-07-03 16:46:37', '2025-07-04 11:48:54'),
('d2dd8f3a-6406-4fae-b1c1-62133405f603', 'admin@gmail.com', '0944748785', '$2b$10$Nwj16q7oLG.5VAQI9OQ/tuiQG5ySdqPz.AlRzYSpjUljOw/czARfC', 'admin', 1, '2025-07-03 23:21:54', '2025-07-04 00:20:37');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_resource_suggestions`
--

CREATE TABLE `user_resource_suggestions` (
  `id` char(36) NOT NULL,
  `client_id` char(36) DEFAULT NULL,
  `resource_id` char(36) DEFAULT NULL,
  `suggested_by_ai` tinyint(1) DEFAULT 1,
  `suggested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `clicked` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `ai_model_versions`
--
ALTER TABLE `ai_model_versions`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `expert_id` (`expert_id`);

--
-- Chỉ mục cho bảng `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `actor_id` (`actor_id`);

--
-- Chỉ mục cho bảng `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Chỉ mục cho bảng `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Chỉ mục cho bảng `client_profiles`
--
ALTER TABLE `client_profiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Chỉ mục cho bảng `deleted_accounts`
--
ALTER TABLE `deleted_accounts`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `emotion_diaries`
--
ALTER TABLE `emotion_diaries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Chỉ mục cho bảng `expert_profiles`
--
ALTER TABLE `expert_profiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Chỉ mục cho bảng `psychological_tests`
--
ALTER TABLE `psychological_tests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Chỉ mục cho bảng `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `session_notes`
--
ALTER TABLE `session_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `expert_id` (`expert_id`);

--
-- Chỉ mục cho bảng `training_data`
--
ALTER TABLE `training_data`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `user_resource_suggestions`
--
ALTER TABLE `user_resource_suggestions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `resource_id` (`resource_id`);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`expert_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD CONSTRAINT `chat_sessions_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `client_profiles`
--
ALTER TABLE `client_profiles`
  ADD CONSTRAINT `client_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `emotion_diaries`
--
ALTER TABLE `emotion_diaries`
  ADD CONSTRAINT `emotion_diaries_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `expert_profiles`
--
ALTER TABLE `expert_profiles`
  ADD CONSTRAINT `expert_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `psychological_tests`
--
ALTER TABLE `psychological_tests`
  ADD CONSTRAINT `psychological_tests_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `session_notes`
--
ALTER TABLE `session_notes`
  ADD CONSTRAINT `session_notes_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `session_notes_ibfk_2` FOREIGN KEY (`expert_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `user_resource_suggestions`
--
ALTER TABLE `user_resource_suggestions`
  ADD CONSTRAINT `user_resource_suggestions_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_resource_suggestions_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
