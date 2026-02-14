# aMIrmxc Blog

<div align="center">
  <img src="public/icon2.png" alt="aMIrmxc Blog"  width="300" height="300 "/>
<h1>This is amirmxc's personal blog built with Astro.js.</h1>
</div>



## Important Note

This project is based on [astro-theme-cactus](https://github.com/chrismwilliams/astro-theme-cactus) by Chris Williams. I have customized and extended it to fit my personal blogging needs, including:

- Added multi-language support (English and Persian/Farsi)
- Integrated Supabase for authentication (sign up, sign in, sign out)
- Added comment system with GitHub authentication
- Enhanced with custom remark plugins for admonitions and GitHub cards
- Modified styling with Tailwind CSS
- Added more components and layouts for a richer blogging experience

Special thanks to Chris Williams for creating and maintaining the original theme!

---

## Core Technology Stack

Framework: Astro v5.10.1 - A modern static site builder that uses the "Islands Architecture" for optimal performance
Language: TypeScript for type safety throughout the project
Styling: Tailwind CSS for utility-first styling approach
Content Format: Markdown and MDX for blog posts and notes

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Building

```bash
# Build the site
npm run build
```

## Project Structure

- `src/content/post/` - Blog posts
- `src/content/note/` - Notes
- `src/pages/` - Page routes
- `src/components/` - UI components
- `src/layouts/` - Page layouts


## Supabase Authentication Integration

This project uses Supabase for authentication (Google OAuth). Here's a complete guide to setting it up.

### 1. Environment Setup

Create a `.env` file in the project root with your Supabase credentials:


### 2. Supabase Dashboard Configuration

#### A. Database Tables Setup

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name text,
  last_name text
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public profiles are viewable by everyone
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Create comments table
CREATE TABLE public.comments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id bigint NOT NULL,
  comment_text text NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read comments
CREATE POLICY "Comments are public"
  ON public.comments FOR SELECT
  USING (true);

-- Allow authenticated users to insert comments
CREATE POLICY "Authenticated users can post comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### B. Create Trigger for Auto-Profile Creation

When a user signs up (via Google OAuth), automatically create their profile:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $
DECLARE
  v_full_name text;
BEGIN
  v_full_name := new.raw_user_meta_data->>'full_name';

  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', SPLIT_PART(v_full_name, ' ', 1)),
    COALESCE(new.raw_user_meta_data->>'last_name', SPLIT_PART(v_full_name, ' ', 2))
  );
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

#### C. Configure Google OAuth

1. Go to **Supabase Dashboard > Authentication > Providers > Google**
2. Enable Google provider
3. Enter your Google OAuth credentials:
   4. Add the callback URL

#### D. Configure Redirect URLs

Go to **Authentication > URL Configuration** and add your redirect URLs:

- Local: `http://localhost:4321`
- Production: `https://your-domain.com`

### 3. Frontend Implementation

The project already includes authentication components in `src/components/auth/`:

- `SignIn.astro` - Sign in with email/password
- `Register.astro` - User registration
- `Auth.astro` - Main auth component
- `AuthStatus.tsx` - Auth status display
- `LogOut.astro` - Sign out functionality


### 4. How Authentication Works in This Project

1. **User clicks "Sign in with Google"** - Redirects to Google's consent screen
2. **Google redirects back** - Supabase creates/updates the user in `auth.users`
3. **Trigger fires** - Creates a profile in `public.profiles` table
4. **Session established** - User can now access authenticated features
5. **RLS policies** - Protect user data at the database level

### 5. Key Files

- `src/utils/supabase.ts` - Supabase client initialization
- `src/utils/authStore.ts` - Authentication state management
- `src/components/auth/` - Authentication UI components
