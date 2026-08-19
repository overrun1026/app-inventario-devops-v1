-- ==========================================
-- CREAR TABLA DE PRODUCTOS
-- ==========================================

CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    precio_compra NUMERIC(10, 2) NOT NULL,
    precio_venta NUMERIC(10, 2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- PRODUCTOS INICIALES
-- ==========================================

INSERT INTO productos (
    nombre,
    marca,
    descripcion,
    precio_compra,
    precio_venta
)
VALUES
(
    'Teclado Mecánico',
    'Logitech',
    'Teclado mecánico inalámbrico con iluminación RGB y switches táctiles',
    250000,
    349900
),
(
    'Mouse Gamer',
    'Razer',
    'Mouse óptico de alta precisión con sensor avanzado e iluminación RGB',
    180000,
    259900
),
(
    'Monitor Gaming 27"',
    'ASUS',
    'Monitor gaming de 27 pulgadas con resolución QHD y alta frecuencia de actualización',
    850000,
    1199900
),
(
    'Audífonos Inalámbricos',
    'Sony',
    'Audífonos inalámbricos con cancelación activa de ruido y batería de larga duración',
    420000,
    599900
),
(
    'SSD NVMe 1TB',
    'Samsung',
    'Unidad SSD NVMe de 1 TB para almacenamiento rápido de aplicaciones y videojuegos',
    280000,
    399900
),
(
    'Memoria RAM 16GB',
    'Corsair',
    'Módulo de memoria DDR5 de 16 GB diseñado para equipos de alto rendimiento',
    190000,
    279900
),
(
    'Tarjeta Gráfica RTX 4060',
    'MSI',
    'Tarjeta gráfica dedicada para gaming con arquitectura NVIDIA y 8 GB de memoria',
    1250000,
    1599900
),
(
    'Procesador Ryzen 7',
    'AMD',
    'Procesador de ocho núcleos orientado a gaming, creación de contenido y productividad',
    850000,
    1099900
),
(
    'Placa Base B650',
    'Gigabyte',
    'Placa base compatible con procesadores AMD Ryzen y memoria DDR5 de alto rendimiento',
    620000,
    799900
),
(
    'Fuente de Poder 750W',
    'EVGA',
    'Fuente de alimentación de 750 watts con certificación de eficiencia energética',
    320000,
    459900
),
(
    'Webcam Full HD',
    'Logitech',
    'Cámara web Full HD con micrófono integrado para videollamadas y streaming',
    145000,
    219900
),
(
    'Micrófono USB',
    'HyperX',
    'Micrófono USB con patrón de captación cardioide para streaming y grabaciones',
    230000,
    329900
),
(
    'Router WiFi 6',
    'TP-Link',
    'Router inalámbrico WiFi 6 con mayor velocidad y cobertura para múltiples dispositivos',
    260000,
    379900
),
(
    'Disco Externo 2TB',
    'Western Digital',
    'Disco duro externo de 2 TB para realizar copias de seguridad y almacenar archivos',
    290000,
    419900
),
(
    'Control Gamer',
    'Xbox',
    'Control inalámbrico compatible con PC y consolas para videojuegos',
    240000,
    349900
),
(
    'Laptop Core i7',
    'Lenovo',
    'Computador portátil con procesador Intel Core i7 para trabajo y entretenimiento',
    2800000,
    3499900
),
(
    'Tablet 11 Pulgadas',
    'Samsung',
    'Tablet de 11 pulgadas diseñada para multimedia, navegación y productividad móvil',
    1100000,
    1399900
),
(
    'Smartwatch',
    'Xiaomi',
    'Reloj inteligente con pantalla táctil, seguimiento deportivo y notificaciones móviles',
    350000,
    499900
),
(
    'Hub USB-C',
    'Anker',
    'Adaptador USB-C multipuerto con conexiones HDMI, USB y lector de tarjetas',
    150000,
    229900
),
(
    'Monitor Ultrawide 34"',
    'LG',
    'Monitor ultrawide de 34 pulgadas ideal para multitarea, productividad y entretenimiento',
    1350000,
    1799900
);