export type PromptCategory = {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  created_at: string;
  user_id: string;
};

export type Prompt = {
  id: string;
  name: string;
  description: string | null;
  content: string;
  category_id: string;
  created_at: string;
  user_id: string;
}; 