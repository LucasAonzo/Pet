-- ANIMALS TABLE
CREATE TABLE IF NOT EXISTS animals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  species VARCHAR(100) NOT NULL,
  breed VARCHAR(100),
  age INTEGER,
  gender VARCHAR(10),
  size VARCHAR(20),
  color VARCHAR(50),
  description TEXT,
  health_status VARCHAR(100),
  behavior TEXT,
  special_needs BOOLEAN DEFAULT false,
  special_needs_description TEXT,
  house_trained BOOLEAN DEFAULT false,
  good_with_kids BOOLEAN DEFAULT false,
  good_with_dogs BOOLEAN DEFAULT false,
  good_with_cats BOOLEAN DEFAULT false,
  microchipped BOOLEAN DEFAULT false,
  microchip_id VARCHAR(100),
  neutered BOOLEAN DEFAULT false,
  vaccinated BOOLEAN DEFAULT false,
  adoption_fee DECIMAL(10, 2),
  location VARCHAR(255),
  adoption_status VARCHAR(20) DEFAULT 'available',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public animals are viewable by everyone" 
  ON animals FOR SELECT 
  USING (true);

-- Create policy for authenticated users to insert their own animals
CREATE POLICY "Users can insert their own animals" 
  ON animals FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own animals
CREATE POLICY "Users can update their own animals" 
  ON animals FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own animals
CREATE POLICY "Users can delete their own animals" 
  ON animals FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- ANIMAL IMAGES TABLE
CREATE TABLE IF NOT EXISTS animal_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  caption TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE animal_images ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public animal images are viewable by everyone" 
  ON animal_images FOR SELECT 
  USING (true);

-- Create policy for users to insert images for their own animals
CREATE POLICY "Users can insert images for their own animals" 
  ON animal_images FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM animals WHERE id = animal_images.animal_id
    )
  );

-- Create policy for users to update images for their own animals
CREATE POLICY "Users can update images for their own animals" 
  ON animal_images FOR UPDATE 
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM animals WHERE id = animal_images.animal_id
    )
  );

-- Create policy for users to delete images for their own animals
CREATE POLICY "Users can delete images for their own animals" 
  ON animal_images FOR DELETE 
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM animals WHERE id = animal_images.animal_id
    )
  );

-- VACCINATIONS TABLE
CREATE TABLE IF NOT EXISTS vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  date TIMESTAMP WITH TIME ZONE,
  expiration_date TIMESTAMP WITH TIME ZONE,
  veterinarian VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public vaccinations are viewable by everyone" 
  ON vaccinations FOR SELECT 
  USING (true);

-- USERS TABLE (IF YOU WANT TO EXTEND THE AUTH.USERS TABLE)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  phone_number VARCHAR(20),
  address TEXT,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own profile
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- FAVORITES TABLE
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, animal_id)
);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own favorites
CREATE POLICY "Users can view their own favorites" 
  ON favorites FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own favorites
CREATE POLICY "Users can insert their own favorites" 
  ON favorites FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own favorites
CREATE POLICY "Users can delete their own favorites" 
  ON favorites FOR DELETE 
  USING (auth.uid() = user_id);

-- FUNCTION TO UPDATE UPDATED_AT TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- TRIGGER FOR ANIMALS TABLE
CREATE TRIGGER update_animals_updated_at
  BEFORE UPDATE ON animals
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- TRIGGER FOR PROFILES TABLE
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- SAMPLE DATA
-- First, create a sample user if not exists (this is just for demo purposes)
INSERT INTO auth.users (id, email, confirmed_at)
VALUES 
  ('d0e7df0e-3d2f-4c44-b90e-f9bba269b6a2', 'shelter@example.com', NOW())
ON CONFLICT DO NOTHING;

-- Then insert sample animals with the user_id
INSERT INTO animals (name, species, breed, age, gender, size, color, description, health_status, behavior, good_with_kids, good_with_dogs, good_with_cats, adoption_status, location, user_id)
VALUES
  ('Luna', 'Dog', 'Labrador Retriever', 2, 'female', 'medium', 'Golden', 'Luna is a friendly and energetic Labrador who loves to play fetch and go for long walks. She has been trained basic commands and is great with children.', 'Excellent', 'Friendly and outgoing', true, true, false, 'available', 'San Francisco, CA', 'd0e7df0e-3d2f-4c44-b90e-f9bba269b6a2'),
  ('Oliver', 'Cat', 'Maine Coon', 3, 'male', 'large', 'Gray and White', 'Oliver is a majestic Maine Coon who loves lounging by the window and playing with feather toys. He''s independent but affectionate once he warms up to you.', 'Good', 'Independent and calm', true, false, true, 'available', 'Portland, OR', 'd0e7df0e-3d2f-4c44-b90e-f9bba269b6a2'),
  ('Max', 'Dog', 'German Shepherd', 4, 'male', 'large', 'Black and Tan', 'Max is a loyal and intelligent German Shepherd who would make an excellent companion or guard dog. He has had obedience training and follows commands well.', 'Good', 'Alert and protective', false, true, false, 'available', 'Denver, CO', 'd0e7df0e-3d2f-4c44-b90e-f9bba269b6a2'),
  ('Bella', 'Cat', 'Siamese', 1, 'female', 'small', 'Cream and Brown', 'Bella is a talkative Siamese kitten with striking blue eyes. She loves attention and will follow you around the house, always ready to play.', 'Excellent', 'Playful and vocal', true, false, true, 'available', 'Miami, FL', 'd0e7df0e-3d2f-4c44-b90e-f9bba269b6a2'),
  ('Charlie', 'Dog', 'Beagle', 5, 'male', 'small', 'Tricolor', 'Charlie is a sweet Beagle with a great nose! He loves going on scent adventures and then curling up for a nap on the couch. He has a mellow personality.', 'Good', 'Curious and gentle', true, true, false, 'available', 'Chicago, IL', 'd0e7df0e-3d2f-4c44-b90e-f9bba269b6a2');

-- SAMPLE IMAGES
INSERT INTO animal_images (animal_id, image_url, is_primary, caption, "order")
VALUES
  ((SELECT id FROM animals WHERE name = 'Luna'), 'https://images.unsplash.com/photo-1579032450926-48f99f689a89?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', true, 'Luna looking happy at the park', 0),
  ((SELECT id FROM animals WHERE name = 'Luna'), 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2668&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', false, 'Luna playing fetch', 1),
  ((SELECT id FROM animals WHERE name = 'Oliver'), 'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', true, 'Oliver lounging by the window', 0),
  ((SELECT id FROM animals WHERE name = 'Max'), 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', true, 'Max standing alert', 0),
  ((SELECT id FROM animals WHERE name = 'Bella'), 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2660&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', true, 'Bella being curious', 0),
  ((SELECT id FROM animals WHERE name = 'Charlie'), 'https://images.unsplash.com/photo-1612260673791-3e3eef900e9a?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', true, 'Charlie enjoying the outdoors', 0);

-- SAMPLE VACCINATIONS
INSERT INTO vaccinations (animal_id, name, date, expiration_date, veterinarian)
VALUES
  ((SELECT id FROM animals WHERE name = 'Luna'), 'Rabies', '2023-02-15', '2024-02-15', 'Dr. Johnson'),
  ((SELECT id FROM animals WHERE name = 'Luna'), 'DHPP', '2023-01-10', '2024-01-10', 'Dr. Johnson'),
  ((SELECT id FROM animals WHERE name = 'Oliver'), 'FVRCP', '2023-03-05', '2024-03-05', 'Dr. Miller'),
  ((SELECT id FROM animals WHERE name = 'Oliver'), 'Rabies', '2023-03-05', '2024-03-05', 'Dr. Miller'),
  ((SELECT id FROM animals WHERE name = 'Max'), 'Rabies', '2023-05-20', '2024-05-20', 'Dr. Wilson'),
  ((SELECT id FROM animals WHERE name = 'Max'), 'DHPP', '2023-04-12', '2024-04-12', 'Dr. Wilson'),
  ((SELECT id FROM animals WHERE name = 'Bella'), 'FVRCP', '2023-09-03', '2024-09-03', 'Dr. Roberts'),
  ((SELECT id FROM animals WHERE name = 'Charlie'), 'Rabies', '2023-07-22', '2024-07-22', 'Dr. Thompson'),
  ((SELECT id FROM animals WHERE name = 'Charlie'), 'DHPP', '2023-07-22', '2024-07-22', 'Dr. Thompson'),
  ((SELECT id FROM animals WHERE name = 'Charlie'), 'Bordetella', '2023-07-22', '2024-01-22', 'Dr. Thompson'); 