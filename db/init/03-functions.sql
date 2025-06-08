-- Поиск устройства по характеристике
CREATE OR REPLACE FUNCTION search_devices(
    p_name VARCHAR DEFAULT NULL,
    p_type VARCHAR DEFAULT NULL,
    p_manufacturer VARCHAR DEFAULT NULL,
    p_model VARCHAR DEFAULT NULL,
    p_protocol VARCHAR DEFAULT NULL
) RETURNS SETOF device AS $$
BEGIN
    RETURN QUERY
    SELECT * 
    FROM device
    WHERE 
        (p_name IS NULL OR name ILIKE '%' || p_name || '%')
        AND (p_type IS NULL OR type ILIKE '%' || p_type || '%')
        AND (p_manufacturer IS NULL OR manufacturer ILIKE '%' || p_manufacturer || '%')
        AND (p_model IS NULL OR model ILIKE '%' || p_model || '%')
        AND (p_protocol IS NULL OR protocol ILIKE '%' || p_protocol || '%')
    ORDER BY name;
END;
$$ LANGUAGE plpgsql;

-- Статистика по событиям устройства
CREATE OR REPLACE FUNCTION get_device_event_stats(
    p_device_id INTEGER,
    p_days INTEGER DEFAULT 30
) RETURNS TABLE (
    event_type VARCHAR(10),
    total_count BIGINT,
    avg_per_day NUMERIC,
    last_occurrence TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.type::VARCHAR(10) AS event_type,
        COUNT(*)::BIGINT AS total_count,
        ROUND(COUNT(*)::NUMERIC / NULLIF(p_days, 0), 2) AS avg_per_day,
        MAX(e.date_time) AS last_occurrence
    FROM event e
    JOIN device_instance di ON e.device_instance_id = di.device_instance_id
    WHERE di.device_id = p_device_id
        AND e.date_time >= CURRENT_TIMESTAMP - (p_days || ' days')::INTERVAL
    GROUP BY e.type
    ORDER BY total_count DESC;
END;
$$ LANGUAGE plpgsql;