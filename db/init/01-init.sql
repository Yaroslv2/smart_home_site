-- Создание таблицы пользователей
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

-- Создание таблицы помещений
CREATE TABLE place (
    place_id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    address VARCHAR(50) NOT NULL
);

-- Создание таблицы устройств
CREATE TABLE device (
    device_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    protocol VARCHAR(100) NOT NULL,
    max_power INTEGER NOT NULL
);

-- Создание таблицы групп устройств
CREATE TABLE device_group (
    device_group_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    place_id INTEGER NOT NULL REFERENCES place(place_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Создание таблицы экземпляров устройств
CREATE TABLE device_instance (
    device_instance_id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES device(device_id) ON UPDATE CASCADE ON DELETE CASCADE,
    device_group_id INTEGER NOT NULL REFERENCES device_group(device_group_id) ON UPDATE CASCADE ON DELETE CASCADE,
    serial_number VARCHAR(20) NOT NULL,
    ip_address VARCHAR(20) NOT NULL,
    mac_address VARCHAR(20) NOT NULL,
    status BOOLEAN NOT NULL
);

-- Создание таблицы сценариев
CREATE TABLE script (
    script_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    actions JSONB NOT NULL,
    is_active BOOLEAN NOT NULL
);

-- Создание таблицы событий
CREATE TABLE event (
    event_id SERIAL PRIMARY KEY,
    device_instance_id INTEGER NOT NULL REFERENCES device_instance(device_instance_id) ON UPDATE CASCADE ON DELETE CASCADE,
    date_time TIMESTAMP NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL
);

-- Создание таблицы настроек
CREATE TABLE settings (
    settings_id SERIAL PRIMARY KEY,
    device_instance_id INTEGER NOT NULL REFERENCES device_instance(device_instance_id) ON UPDATE CASCADE ON DELETE CASCADE,
    parameter_name TEXT NOT NULL,
    value TEXT NOT NULL
);

-- Создание таблицы уведомлений
CREATE TABLE notification (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    text VARCHAR(100) NOT NULL,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы триггеров
CREATE TABLE trigger (
    trigger_id SERIAL PRIMARY KEY,
    activation_condition JSONB NOT NULL,
    status BOOLEAN NOT NULL
);

-- Создание таблицы связи пользователей и помещений (M:N)
CREATE TABLE users_places (
    user_id INTEGER NOT NULL REFERENCES "user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    place_id INTEGER NOT NULL REFERENCES place(place_id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (user_id, place_id)
);

-- Создание таблицы связи триггеров и сценариев (M:N)
CREATE TABLE triggers_scripts (
    trigger_id INTEGER NOT NULL REFERENCES trigger(trigger_id) ON UPDATE CASCADE ON DELETE CASCADE,
    script_id INTEGER NOT NULL REFERENCES script(script_id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (trigger_id, script_id)
);