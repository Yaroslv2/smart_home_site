-- Пользователи
INSERT INTO "user" (fullname, email, password) VALUES
('Иван Петров', 'ivan@example.com', 'password123'),
('Мудров Ярослав Денисович', 'myad@example.com', 'password345'),
('Химлих Виктор Юрьевич', 'hihi@example.com', 'eto_pswrd'),
('Кто ты?', 'WhoAreYou@example.com', 'eto_toze))'),
('А кто я?', 'AndWhoIam@example.com', 'prd123sdfds'),
('Сахарова София', 'hehe@example.com', 'pass123ord'),
('Лысая Вера', 'vera@example.com', 'rrrrrrrrr'),
('HEHEHEHE', 'HEHEHEHEHEn@example.com', 'sdfghjkl'),
('Просто пользователь', 'user@example.com', 'hihimlih'),
('Мария Сидорова', 'maria@example.com', 'securepass');

-- Помещения
INSERT INTO place (name, address) VALUES
('Дом', 'ул. Центральная, 1'),
('Дом 2', 'ул. Центральная, 4'),
('Церковь', 'ул. Центральная, 3'),
('Вуз', 'ул. Центральная, 5'),
('Покебоул', 'ул. Центральная, 6'),
('Массажка', 'ул. Центральная, 7'),
('Шаурма', 'ул. Центральная, 8'),
('Бар', 'ул. Центральная, 9'),
('Работа', 'ул. Центральная, 2'),
('Сосед', 'ул. Центральная, 10');

-- Устройства
INSERT INTO device (name, type, manufacturer, model, protocol, max_power) VALUES
('LED лампа', 'Освещение', 'Sber', 'AtlassDesign', 'Zigbee 3.0', 10),
('Датчик температуры', 'Климат', 'Sber', 'Климат?', 'Zigbee 3.0', 10),
('Термостат', 'Климат', 'Xiaomi', 'Smart Termostat', 'WiFi', 10),
('Датчик движения', 'Безопасность', 'Ajax', 'MotionProtect', 'RadioFrequency', 10),
('Датчик открытия дверей', 'Безопасность', 'Aqara', 'DoorSensor', 'Zigbee 3.0', 10),
('Умная камера', 'Видеонаблюдение', 'TP-Link', 'Tapo C210', 'WiFi', 10),
('Умная камера', 'Видеонаблюдение', 'SberBoom', 'Cam', 'WiFi', 10),
('Умная розетка', 'Розетки', 'Sber', 'AtlasDesign Smart', 'Zigbee 3.0', 10),
('Умная розетка', 'Розетки', 'Xiaomi', 'Mi Smart Power Strip', 'WiFi', 10),
('Датчик протечки', 'Защита от аварий', 'Sber', 'Датчик протечки', 'Zigbee 3.0', 10),
('Датчик дыма', 'Защита от аварий', 'Fibare', 'Smoke Sensor', 'Z-Wave', 10),
('Робот пылесос', 'Бытовая техника', 'Roborock', 'S8 Pro Ultra', 'WiFi', 10),
('Умный холодильник', 'Бытовая техника', 'Samsung', 'Family Hub Fridge', 'WiFi', 10),
('Умная станция', 'Управление', 'Яндекс', 'Станция Миди', 'Zigbee 3.0', 10),
('Умная станция', 'Управления', 'Sber', 'SberBoom Home', 'Zigbee 3.0', 10),
('Выключатель', 'Сенсоры', 'Jung', 'Smart Switch', 'Zigbee 3.0', 10),
('Привод', 'Управление', 'Somfy', 'TaHome Switch', 'WiFi', 10),
('Датчик движения', 'Безопасность', 'Aqara', 'Motion Sensor', 'Zigbee', 1),
('Умная лампочка', 'Освещение', 'Xiaomi', 'Yeelight', 'WiFi', 10);

-- Группы устройств
INSERT INTO device_group(name, place_id) VALUES
('Безопасность', 1),
('Кухня', 2),
('Датчики', 3),
('Не знаю что это', 4),
('АОАОАО', 5),
('Далас', 6),
('Все что робот', 7),
('Кормушка', 8),
('Кот', 9),
('На двери', 10),
('Камеры', 10),
('Надо заменить', 2),
('Прочее', 7),
('Не выбрано', 4),
('Потолок', 1),
('Свет', 8),
('Прочее', 2),
('Свет', 4),
('Безопасность', 9);

-- Экземпляры устройств
INSERT INTO device_instance(device_id, device_group_id, serial_number, ip_address, mac_address, status) VALUES
(19, 10, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(1, 1, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(2, 9, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(3, 18, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(4, 14, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(5, 12, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(6, 5, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(7, 2, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(8, 5, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(9, 2, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(10, 8, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(15, 1, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(2, 14, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(3, 16, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(19, 15, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(5, 2, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(6, 8, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(7, 9, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(8, 10, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(9, 10, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(10, 12, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(11, 1, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(12, 10, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(14, 10, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(7, 10, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(18, 13, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(5, 14, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(5, 17, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(7, 16, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE),
(1, 10, 'V-KX-T61610G115145', '195.234.532.122', '00:1A:2B:3C:4D:5E', TRUE);

-- Сценарии (ИСПРАВЛЕННЫЙ БЛОК)
INSERT INTO script(name, description, actions, is_active) VALUES
('Утреннее пробуждение', 'Постепенное включение света и бытовых приборов', '[
    {"device_instance_id": 15, "action": "turn_on", "params": {"brightness": 50}},
    {"device_instance_id": 9, "action": "turn_on", "params": {}},
    {"device_instance_id": 24, "action": "play_music", "params": {"volume": 40, "playlist": "утренний"}}
]', TRUE),
('Никого нет дома', 'Активация охранных систем', '[
    {"device_instance_id": 5, "action": "enable", "params": {"sensitivity": "high"}},
    {"device_instance_id": 6, "action": "enable", "params": {}},
    {"device_instance_id": 7, "action": "start_recording", "params": {}},
    {"device_instance_id": 8, "action": "enable_motion_detection", "params": {}},
    {"device_instance_id": 1, "action": "turn_off", "params": {}}
]', TRUE),
('Вечерний киносеанс', 'Создание атмосферы для просмотра фильмов', '[
    {"device_instance_id": 1, "action": "dim", "params": {"level": 20, "color_temp": 2700}},
    {"device_instance_id": 30, "action": "turn_off", "params": {}},
    {"device_instance_id": 24, "action": "set_audio_output", "params": {"output": "home_theater"}}
]', TRUE),
('Тревожная сигнализация', 'Реакция на срабатывание датчиков безопасности', '[
    {"device_instance_id": 7, "action": "start_recording", "params": {"quality": "high"}},
    {"device_instance_id": 8, "action": "trigger_alarm", "params": {"duration": 300}},
    {"device_instance_id": 1, "action": "strobe", "params": {"color": "red", "frequency": 5}}
]', TRUE),
('Автоматическая уборка', 'Уборка при отсутствии дома людей', '[
    {"device_instance_id": 23, "action": "start_cleaning", "params": {"mode": "deep"}},
    {"device_instance_id": 20, "action": "turn_on", "params": {}},
    {"device_instance_id": 8, "action": "monitor_area", "params": {"area": "living_room"}}
]', TRUE),
('Кулинарный режим', 'Подготовка кухни к готовке', '[
    {"device_instance_id": 2, "action": "turn_on", "params": {"brightness": 100}},
    {"device_instance_id": 4, "action": "set_temperature", "params": {"value": 22}},
    {"device_instance_id": 10, "action": "turn_on", "params": {}}
]', TRUE),
('Ночной режим', 'Выключение света и активация датчиков', '[
    {"device_instance_id": 1, "action": "turn_off", "params": {}},
    {"device_instance_id": 15, "action": "turn_off", "params": {}},
    {"device_instance_id": 5, "action": "set_mode", "params": {"mode": "night"}},
    {"device_instance_id": 22, "action": "enable", "params": {}}
]', TRUE),
('Гостевой режим', 'Создание атмосферы для гостей', '[
    {"device_instance_id": 30, "action": "set_color", "params": {"rgb": [255, 150, 50]}},
    {"device_instance_id": 24, "action": "play_music", "params": {"genre": "jazz"}},
    {"device_instance_id": 4, "action": "set_temperature", "params": {"value": 23.5}}
]', TRUE),
('Энергосбережение', 'Автоматическое снижение энергопотребления', '[
    {"device_instance_id": 1, "action": "dim", "params": {"level": 40}},
    {"device_instance_id": 9, "action": "turn_off", "params": {}},
    {"device_instance_id": 10, "action": "turn_off", "params": {}},
    {"device_instance_id": 4, "action": "set_temperature", "params": {"value": 20}}
]', TRUE),
('Проветривание помещений', 'Автоматическое обновление воздуха', '[
    {"device_instance_id": 26, "action": "open", "params": {"percentage": 70}},
    {"device_instance_id": 4, "action": "turn_off", "params": {}},
    {"device_instance_id": 3, "action": "monitor", "params": {"threshold": 65}}
]', TRUE);

-- События
INSERT INTO event(device_instance_id, date_time, type, description) VALUES
(5, '2025-06-05 09:15:32', 'motion', 'Обнаружено движение в зоне гостиной'),
(6, '2025-06-05 08:02:11', 'door', 'Открытие входной двери'),
(3, '2025-06-04 19:45:03', 'temp', 'Температура превысила 28°C'),
(1, '2025-06-04 18:30:47', 'on', 'Ручное включение через приложение'),
(11, '2025-06-03 14:12:56', 'leak', 'Обнаружена вода возле раковины'),
(22, '2025-06-02 10:05:21', 'smoke', 'Обнаружена задымленность на кухне'),
(15, '2025-06-01 23:45:18', 'off', 'Автоматическое отключение по сценарию "Ночь"'),
(23, '2025-05-31 11:30:44', 'start', 'Запуск уборки по расписанию'),
(7, '2025-05-30 16:20:33', 'error', 'Потеря сетевого соединения'),
(24, '2025-05-30 02:15:07', 'update', 'Успешное обновление firmware v2.1.4');

-- Настройки
INSERT INTO settings (device_instance_id, parameter_name, value) VALUES
(1, 'brightness', '75'),
(1, 'color_temperature', '4000K'),
(5, 'sensitivity', 'high'),
(5, 'detection_range', '8m'),
(5, 'alarm_duration', '30s'),
(4, 'target_temperature', '22.5'),
(4, 'eco_mode', 'on'),
(4, 'schedule', '{"weekdays": [{"start":"07:00","temp":21},{"start":"23:00","temp":18}]}'),
(7, 'resolution', '1920x1080'),
(7, 'night_vision', 'auto'),
(7, 'motion_zones', '{"zones": [{"area":"entrance","sensitivity":80},{"area":"garden","sensitivity":60}]}'),
(9, 'power_limit', '2000'),
(9, 'auto_off', '{"enabled":true,"inactivity_period":120}'),
(23, 'cleaning_mode', 'deep'),
(23, 'water_level', 'medium'),
(23, 'restricted_zones', '["carpet_area","pet_bowl"]'),
(24, 'alarm_volume', '70'),
(24, 'voice_assistant', 'alice'),
(24, 'linked_devices', '[1,5,9]'),
(11, 'alarm_delay', '3'),
(11, 'notification_level', 'urgent'),
(26, 'auto_ventilation', '{"enabled":true,"co2_threshold":800}'),
(26, 'rain_protection', 'on'),
(3, 'temp_threshold_high', '28.0'),
(3, 'temp_threshold_low', '18.0'),
(3, 'hysteresis', '0.5');

-- Триггеры
INSERT INTO trigger (activation_condition, status) VALUES
('{
  "device_instance_id": 5,
  "event_type": "motion",
  "conditions": {
    "time_period": ["22:00", "06:00"],
    "presence": "away"
  }
}', TRUE),
('{
  "device_instance_id": 3,
  "event_type": "temp",
  "conditions": {
    "threshold": 28,
    "operator": ">",
    "duration": 300
  }
}', TRUE),
('{
  "device_instance_id": 11,
  "event_type": "leak",
  "conditions": {
    "location": "bathroom",
    "response_delay": 0
  }
}', TRUE),
('{
  "device_instance_id": 6,
  "event_type": "door",
  "conditions": {
    "state": "open",
    "time_period": ["00:00", "06:00"],
    "security_mode": "armed"
  }
}', TRUE),
('{
  "device_instance_id": 22,
  "event_type": "smoke",
  "conditions": {
    "severity": "high",
    "co_level": ">50"
  }
}', TRUE),
('{
  "device_instance_id": 5,
  "event_type": "no_motion",
  "conditions": {
    "area": "living_room",
    "duration": 3600,
    "time_period": ["09:00", "18:00"]
  }
}', TRUE),
('{
  "device_instance_id": 2,
  "event_type": "temp",
  "conditions": {
    "threshold": 20,
    "operator": "<",
    "persist_time": 600
  }
}', TRUE),
('{
  "device_instance_id": 1,
  "event_type": "on",
  "conditions": {
    "room_occupancy": "empty",
    "brightness": ">70"
  }
}', FALSE),
('{
  "device_instance_id": 7,
  "event_type": "offline",
  "conditions": {
    "duration": 300,
    "critical": true
  }
}', TRUE),
('{
  "device_instance_id": 3,
  "event_type": "soil_dry",
  "conditions": {
    "moisture_level": "<30%",
    "time_window": ["06:00", "10:00"],
    "weather": "no_rain"
  }
}', TRUE);

-- Связи пользователей и помещений
INSERT INTO users_places(user_id, place_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 6),
(6, 7),
(7, 8),
(8, 9),
(9, 10),
(2, 6),
(10, 3);

-- Связи триггеров и сценариев
INSERT INTO triggers_scripts(trigger_id, script_id) VALUES
(9, 1),
(2, 2),
(1, 3),
(4, 8),
(8, 5),
(6, 6),
(3, 2),
(2, 3),
(9, 9),
(10, 10);