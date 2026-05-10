CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    dimensions VARCHAR(100),
    square_meters NUMERIC(6,1),
    year_built INTEGER DEFAULT 2024,
    status VARCHAR(50) DEFAULT 'available',
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);