CREATE TABLE IF NOT EXISTS t_user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  display_name VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS t_request (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(32) NOT NULL,
  applicant_id BIGINT NOT NULL,
  approver_id BIGINT,
  applicant_email VARCHAR(255),
  created_at DATETIME NOT NULL,
  updated_at DATETIME,
  CONSTRAINT fk_request_applicant FOREIGN KEY (applicant_id) REFERENCES t_user (id),
  CONSTRAINT fk_request_approver FOREIGN KEY (approver_id) REFERENCES t_user (id)
);

ALTER TABLE t_request MODIFY approver_id BIGINT NULL;
