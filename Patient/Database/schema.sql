-- MolarCoaster Dental Clinic database (MySQL / MariaDB)
CREATE DATABASE IF NOT EXISTS molarcoaster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE molarcoaster;

CREATE TABLE IF NOT EXISTS appointments (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name        VARCHAR(120) NOT NULL,
  phone            VARCHAR(20)  NOT NULL,
  email            VARCHAR(160) NULL,
  reason           VARCHAR(80)  NOT NULL,
  appointment_date DATE         NOT NULL,
  preferred_time   VARCHAR(10)  NOT NULL,           -- e.g. "9:00 AM"
  status           ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- one booking per slot; cancelled rows are removed by the clinic or re-used
  UNIQUE KEY uq_slot (appointment_date, preferred_time)
);

CREATE TABLE IF NOT EXISTS messages (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name  VARCHAR(120) NOT NULL,
  phone      VARCHAR(20)  NOT NULL,
  email      VARCHAR(160) NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);