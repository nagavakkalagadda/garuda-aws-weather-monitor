-- ============================================================
-- GARUDA // Preset Locations & Seed Data
-- ============================================================

INSERT INTO locations (id, city, state, country, latitude, longitude, elevation, timezone, is_preset)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Bengaluru', 'Karnataka', 'India', 12.9716, 77.5946, 920.0, 'Asia/Kolkata', TRUE),
    ('22222222-2222-2222-2222-222222222222', 'Hyderabad', 'Telangana', 'India', 17.3850, 78.4867, 542.0, 'Asia/Kolkata', TRUE),
    ('33333333-3333-3333-3333-333333333333', 'Mumbai', 'Maharashtra', 'India', 19.0760, 72.8777, 14.0, 'Asia/Kolkata', TRUE),
    ('44444444-4444-4444-4444-444444444444', 'Delhi', 'NCR', 'India', 28.6139, 77.2090, 216.0, 'Asia/Kolkata', TRUE),
    ('55555555-5555-5555-5555-555555555555', 'Chennai', 'Tamil Nadu', 'India', 13.0827, 80.2707, 7.0, 'Asia/Kolkata', TRUE),
    ('66666666-6666-6666-6666-666666666666', 'Kolkata', 'West Bengal', 'India', 22.5726, 88.3639, 9.0, 'Asia/Kolkata', TRUE),
    ('77777777-7777-7777-7777-777777777777', 'London', 'Greater London', 'United Kingdom', 51.5074, -0.1278, 25.0, 'Europe/London', TRUE),
    ('88888888-8888-8888-8888-888888888888', 'New York', 'New York', 'United States', 40.7128, -74.0060, 10.0, 'America/New_York', TRUE),
    ('99999999-9999-9999-9999-999999999999', 'Tokyo', 'Kanto', 'Japan', 35.6762, 139.6503, 40.0, 'Asia/Tokyo', TRUE)
ON CONFLICT (latitude, longitude) DO NOTHING;
