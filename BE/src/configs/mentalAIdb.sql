-- Enable UUID function emulation (MySQL 8+ supports UUIDs as CHAR(36))
-- Consider using UUID as CHAR(36)
-- If you don't generate UUIDs in-app, consider using UUID() for default

-- Users
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('client', 'expert', 'admin') NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Client Profiles
CREATE TABLE client_profiles (
    user_id CHAR(36) PRIMARY KEY,
    name VARCHAR(255),
    avatar VARCHAR(255),
    dob DATE,
    gender ENUM('male', 'female', 'other'),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Emotion Diaries
CREATE TABLE emotion_diaries (
    id CHAR(36) PRIMARY KEY,
    client_id CHAR(36),
    entry_date DATE NOT NULL,
    content TEXT,
    sentiment_score FLOAT,
    emotion_tag VARCHAR(50),
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Psychological Tests
CREATE TABLE psychological_tests (
    id CHAR(36) PRIMARY KEY,
    client_id CHAR(36),
    test_type VARCHAR(50),
    answers JSON,
    result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat Sessions
CREATE TABLE chat_sessions (
    id CHAR(36) PRIMARY KEY,
    client_id CHAR(36),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat Messages
CREATE TABLE chat_messages (
    id CHAR(36) PRIMARY KEY,
    session_id CHAR(36),
    sender ENUM('client', 'ai'),
    message TEXT,
    sentiment VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

-- Expert Profiles
CREATE TABLE expert_profiles (
    user_id CHAR(36) PRIMARY KEY,
    full_name VARCHAR(255),
    avatar VARCHAR(255),
    certification TEXT,
    gender ENUM('male', 'female', 'other'),
    dob DATE;
    bio TEXT,
    approved_by_admin BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments
CREATE TABLE appointments (
    id CHAR(36) PRIMARY KEY,
    client_id CHAR(36),
    expert_id CHAR(36),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    method ENUM('video', 'chat'),
    status ENUM('pending', 'confirmed', 'done', 'cancelled'),
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (expert_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Session Notes
CREATE TABLE session_notes (
    id CHAR(36) PRIMARY KEY,
    appointment_id CHAR(36),
    expert_id CHAR(36),
    notes TEXT,
    ai_report TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (expert_id) REFERENCES users(id)
);

-- Resources
CREATE TABLE resources (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255),
    type ENUM('article', 'video', 'exercise'),
    content_url TEXT,
    tags TEXT
);

-- User Resource Suggestions
CREATE TABLE user_resource_suggestions (
    id CHAR(36) PRIMARY KEY,
    client_id CHAR(36),
    resource_id CHAR(36),
    suggested_by_ai BOOLEAN DEFAULT TRUE,
    suggested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    clicked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

-- Audit Logs
CREATE TABLE audit_logs (
    id CHAR(36) PRIMARY KEY,
    actor_id CHAR(36),
    action TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_id) REFERENCES users(id)
);

-- Deleted Accounts
CREATE TABLE deleted_accounts (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT
);

-- AI Model Versions
CREATE TABLE ai_model_versions (
    id CHAR(36) PRIMARY KEY,
    model_name VARCHAR(100),
    version VARCHAR(50),
    description TEXT,
    deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training Data
CREATE TABLE training_data (
    id CHAR(36) PRIMARY KEY,
    source_type ENUM('chat', 'diary', 'test'),
    content TEXT,
    label TEXT
);
