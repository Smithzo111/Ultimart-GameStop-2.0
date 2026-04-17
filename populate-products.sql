-- ============================================
-- INSERT 42 GAMES INTO PRODUCTS TABLE
-- ============================================
-- Copy ALL this code and paste into Supabase SQL Editor
-- DO NOT include the comment lines if copying

INSERT INTO products (name, category, price, description) VALUES
('Black Myth: Wukong', 'New & Trending', 29900, 'An action RPG based on the Chinese novel'),
('Elden Ring', 'New & Trending', 19900, 'A collaboration between FromSoftware and George R. R. Martin'),
('Stellar Blade', 'New & Trending', 19900, 'Fast-paced action game with incredible visuals'),
('The First Berserker: Khazan', 'New & Trending', 19900, 'Intense action RPG experience'),
('Hollow Knight: Silksong', 'New & Trending', 19900, 'Highly anticipated sequel to Hollow Knight'),
('Ghost of Tsushima', 'New & Trending', 19900, 'Beautiful samurai action adventure'),
('God of War Ragnarök', 'New & Trending', 24900, 'Epic Norse mythology conclusion'),
('Cities Skylines II', 'Simulation & Strategy', 19900, 'City building simulation'),
('Cities Skylines', 'Simulation & Strategy', 9900, 'Original city building game'),
('Jurassic World Evolution 3', 'Simulation & Strategy', 29900, 'Build your dinosaur park'),
('Jurassic World Evolution 2', 'Simulation & Strategy', 24900, 'Manage a dinosaur theme park'),
('Planet Coaster 2', 'Simulation & Strategy', 19900, 'Create your theme park'),
('Planet Zoo', 'Simulation & Strategy', 19900, 'Build and manage a zoo'),
('Farming Simulator 25', 'Simulation & Strategy', 19900, 'Agricultural simulation'),
('Spider-Man 2', 'Action & Adventure', 24900, 'Marvel superhero action game'),
('The Last of Us Part II', 'Action & Adventure', 24900, 'Post-apocalyptic adventure'),
('Assassin''s Creed Shadows', 'Action & Adventure', 29900, 'Historical assassin gameplay'),
('Days Gone', 'Action & Adventure', 19900, 'Zombie survival adventure'),
('Red Dead Redemption 2', 'Action & Adventure', 19900, 'Wild West open world'),
('Hitman: World of Assassination', 'Action & Adventure', 19900, 'Stealth assassination game'),
('Hitman', 'Action & Adventure', 14900, 'Original Hitman game'),
('EA Sports FC26', 'Racing & Sports', 34900, 'Football simulation game'),
('EA Sports FC25', 'Racing & Sports', 29900, 'Previous year football game'),
('Forza Horizon 5', 'Racing & Sports', 19900, 'Open world racing'),
('F1 25', 'Racing & Sports', 34900, 'Formula 1 racing simulation'),
('SnowRunner', 'Racing & Sports', 14900, 'Off-road truck simulator'),
('Roadcraft', 'Racing & Sports', 19900, 'Racing simulation'),
('Need For Speed Unbound', 'Racing & Sports', 14900, 'Street racing game'),
('Grand Theft Auto V', 'Classics & Indie', 19900, 'Open world crime game'),
('Hollow Knight', 'Classics & Indie', 14900, 'Metroidvania classic'),
('Plants vs Zombies Replanted', 'Classics & Indie', 14900, 'Tower defense game'),
('It Takes Two', 'Classics & Indie', 14900, 'Co-op adventure game'),
('Split Fiction', 'Classics & Indie', 14900, 'Narrative adventure'),
('Palworld', 'Classics & Indie', 14900, 'Pokemon-like game'),
('Stardew Valley', 'Classics & Indie', 9900, 'Cozy farming adventure'),
('Tekken 8', 'Fighting & Others', 14900, 'Fighting game'),
('WWE 2K26', 'Fighting & Others', 34900, 'Wrestling simulation'),
('Mortal Kombat 1', 'Fighting & Others', 19900, 'Fighting game'),
('Sekiro: Shadows Die Twice', 'Fighting & Others', 9900, 'Challenging action game'),
('Cyberpunk 2077', 'Fighting & Others', 19900, 'Sci-fi open world RPG'),
('Hogwarts Legacy', 'Fighting & Others', 19900, 'Harry Potter magic game'),
('Street Fighter 6', 'Fighting & Others', 14900, 'Classic fighting game');

SELECT COUNT(*) as total_games FROM products;
