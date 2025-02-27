# Migrating to Supabase

This document provides instructions for migrating the AdoptMe app from PostgreSQL to Supabase.

## What is Supabase?

Supabase is an open-source Firebase alternative that provides a PostgreSQL database, authentication, instant APIs, real-time subscriptions, and storage.

## Migration Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign up for an account
2. Create a new project and give it a name
3. Select a region close to your users
4. Set a secure database password
5. Once the project is created, copy your Supabase URL and anon key from the API settings page

### 2. Configure Environment Variables

1. Add your Supabase URL and anon key to the `.env` file:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Ensure the Expo config file (`app.config.js`) is set up to use these environment variables

### 3. Set Up Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase_schema.sql` into the SQL editor
3. Execute the SQL to create all the necessary tables, policies, and sample data

### 4. Integrate Supabase Client in the App

1. We've already installed `@supabase/supabase-js` and set up the Supabase client in `src/services/supabase.js`
2. The animal service is implemented in `src/services/animalService.js`
3. React Query hooks are updated in `src/hooks/useAnimals.js`

### 5. Update Frontend Components

1. The `AnimalList` component has been updated to use the Supabase animal service
2. The `PetDetailScreen` component has been updated to display animal details from Supabase

### 6. Add Authentication (Next Steps)

1. Create Supabase auth providers (email/password, Google, etc.)
2. Implement a sign-up and login flow
3. Update user profile management to use Supabase

```javascript
// Example code for signing up a user
import supabase from './supabase';

const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};
```

### 7. Set Up Storage (Next Steps)

1. Create storage buckets in Supabase
2. Implement image upload using Supabase storage
3. Update the image URLs in the database to point to Supabase storage

```javascript
// Example code for uploading an image
import supabase from './supabase';

const uploadImage = async (file, filePath) => {
  const { data, error } = await supabase.storage
    .from('animal-images')
    .upload(filePath, file);
  
  if (error) throw error;
  return data;
};
```

## User-Animal Relationship

The database schema includes a relationship between users and animals:

1. Each animal has a `user_id` field that references the `auth.users` table
2. This allows tracking which user published each animal
3. Row Level Security (RLS) policies ensure that:
   - Anyone can view animals (public read access)
   - Only authenticated users can create animals
   - Users can only update or delete their own animals
   - Users can only add/update/delete images for their own animals

### Accessing User's Animals

To get animals published by the current user:

```javascript
import { useUserAnimals } from '../hooks/useAnimals';

// In your component
const { data, isLoading, error } = useUserAnimals();

// Access the animals with data?.animals
```

### Publishing Animals

When creating a new animal, the user_id is automatically set to the current authenticated user:

```javascript
import { useCreateAnimal } from '../hooks/useAnimals';

// In your component
const createAnimal = useCreateAnimal();

// Later, when submitting the form
createAnimal.mutate(animalData);
```

## Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Supabase JavaScript Client](https://supabase.io/docs/reference/javascript/supabase-client)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [Row Level Security](https://supabase.io/docs/guides/auth/row-level-security)
- [Storage](https://supabase.io/docs/guides/storage)

## Troubleshooting

### Common Issues

1. **Authentication Issues**: Ensure that RLS policies are correctly set up for tables
2. **CORS Issues**: Check that your project's URL is added to the allowed origins in Supabase
3. **Data Sync Issues**: Use React Query's `invalidateQueries` to ensure fresh data

### Getting Help

- Join the [Supabase Discord](https://discord.supabase.com)
- Post questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)
- Check the [Supabase GitHub issues](https://github.com/supabase/supabase/issues) 