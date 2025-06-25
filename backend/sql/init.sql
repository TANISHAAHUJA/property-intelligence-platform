-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create database if not exists
SELECT 'CREATE DATABASE property_intelligence'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'property_intelligence');

-- Connect to the database
\c property_intelligence;

-- Enable PostGIS extension in the database
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_geometry ON properties USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_properties_city_state ON properties (city, state);
CREATE INDEX IF NOT EXISTS idx_properties_analyzed ON properties (is_analyzed, created_at);
CREATE INDEX IF NOT EXISTS idx_properties_value ON properties (current_value);

CREATE INDEX IF NOT EXISTS idx_analyses_property_id ON property_analyses (property_id);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON property_analyses (status, created_at);
CREATE INDEX IF NOT EXISTS idx_analyses_risk_score ON property_analyses (overall_risk_score);

CREATE INDEX IF NOT EXISTS idx_hazards_property_id ON hazard_assessments (property_id);
CREATE INDEX IF NOT EXISTS idx_hazards_composite_risk ON hazard_assessments (composite_risk_score);

CREATE INDEX IF NOT EXISTS idx_valuations_property_id ON property_valuations (property_id);
CREATE INDEX IF NOT EXISTS idx_valuations_value ON property_valuations (estimated_value);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users (is_active, role);

-- Insert sample data for development
INSERT INTO users (id, email, full_name, hashed_password, role, company_name, is_active, is_verified)
VALUES 
    (gen_random_uuid(), 'demo@propertyintelligence.ai', 'Demo User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj9pANwrNvJG', 'user', 'Demo Insurance Co', true, true),
    (gen_random_uuid(), 'admin@propertyintelligence.ai', 'Admin User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj9pANwrNvJG', 'admin', 'Property Intelligence', true, true)
ON CONFLICT (email) DO NOTHING;

-- Sample properties for demo
INSERT INTO properties (id, address, city, state, zip_code, country, latitude, longitude, geometry, property_type, year_built, square_footage, bedrooms, bathrooms, current_value, is_analyzed)
VALUES 
    (gen_random_uuid(), '123 Market St', 'San Francisco', 'CA', '94103', 'USA', 37.7749, -122.4194, ST_Point(-122.4194, 37.7749), 'residential', 1995, 2500, 3, 2.5, 850000, true),
    (gen_random_uuid(), '456 Oak Ave', 'San Francisco', 'CA', '94102', 'USA', 37.7849, -122.4094, ST_Point(-122.4094, 37.7849), 'residential', 2005, 1800, 2, 2, 720000, false),
    (gen_random_uuid(), '789 Pine St', 'San Francisco', 'CA', '94104', 'USA', 37.7649, -122.4294, ST_Point(-122.4294, 37.7649), 'residential', 1988, 3200, 4, 3, 950000, true)
ON CONFLICT DO NOTHING;