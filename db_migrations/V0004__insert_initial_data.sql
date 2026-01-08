INSERT INTO users (username, password_hash, is_admin, role) 
VALUES ('TOURIST-WAGNER', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYvIpuS6pKu', true, 'admin')
ON CONFLICT (username) DO NOTHING;

INSERT INTO factions (name, type, is_open, description, general_username) VALUES
('ЦОДД', 'open', true, 'Центр организации дорожного движения', 'TOURIST-WAGNER'),
('Армия', 'open', true, 'Вооруженные силы', 'pancake'),
('Полиция', 'open', true, 'Министерство внутренних дел', 'cailon86'),
('ДПС', 'open', true, 'Дорожно-патрульная служба', NULL),
('СОБР', 'open', true, 'Специальный отряд быстрого реагирования', NULL),
('Росгвардия', 'open', true, 'Федеральная служба войск национальной гвардии', NULL),
('ОПГ Темное', 'criminal', true, 'Криминальная структура', NULL),
('ОПГ Красное', 'criminal', true, 'Криминальная структура', NULL),
('Тамбовское ОПГ', 'criminal', true, 'Криминальная структура', NULL),
('ССО', 'closed', false, 'Силы специальных операций', NULL),
('ФСБ', 'closed', false, 'Федеральная служба безопасности', NULL),
('ФСО', 'closed', false, 'Федеральная служба охраны', NULL),
('СПБ', 'closed', false, 'Специальное подразделение', NULL)
ON CONFLICT (name) DO NOTHING;

INSERT INTO statistics (key, value) VALUES
('online_players', '47'),
('total_members', '1243'),
('messages_daily', '856'),
('active_voice', '12')
ON CONFLICT (key) DO NOTHING;
