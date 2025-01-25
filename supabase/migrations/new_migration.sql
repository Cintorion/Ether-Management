-- Modify prompt_categories table to add icon column
ALTER TABLE prompt_categories 
ADD COLUMN icon TEXT;

-- Modify prompts table to add icon column
ALTER TABLE prompts 
ADD COLUMN icon TEXT;

-- Create new table for stored prompts
CREATE TABLE stored_prompts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    prompt_id UUID REFERENCES prompts(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(user_id, prompt_id)
); 