CREATE DATABASE IF NOT EXISTS blubber_baron;
CREATE USER IF NOT EXISTS 'blubber_user'@'%' IDENTIFIED BY 'blubber_pass';
GRANT ALL PRIVILEGES ON blubber_baron.* TO 'blubber_user'@'%';
FLUSH PRIVILEGES;
