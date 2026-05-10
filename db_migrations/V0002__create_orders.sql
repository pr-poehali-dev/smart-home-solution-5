CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    product_id INTEGER,
    product_name VARCHAR(255),
    message TEXT,
    delivery_address TEXT,
    budget_min INTEGER,
    budget_max INTEGER,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);