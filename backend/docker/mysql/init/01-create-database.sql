CREATE DATABASE IF NOT EXISTS blubber_baron;
CREATE USER IF NOT EXISTS 'blubber_user'@'%' IDENTIFIED BY 'RootPasswort0815';
ALTER USER 'blubber_user'@'%' IDENTIFIED BY 'RootPasswort0815';
GRANT ALL PRIVILEGES ON blubber_baron.* TO 'blubber_user'@'%';
FLUSH PRIVILEGES;
