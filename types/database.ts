export interface PromptCategory {
  id: string
  name: string
  description: string
  icon: string
  created_at: string
  user_id: string
}

export interface Prompt {
  id: string
  name: string
  description: string
  icon: string
  created_at: string
  user_id: string
}

export interface StoredPrompt {
  id: string
  user_id: string
  prompt_id: string
  created_at: string
} 