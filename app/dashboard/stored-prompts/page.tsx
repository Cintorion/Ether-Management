import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { PromptCard } from "@/components/prompts/prompt-card"
import { redirect } from "next/navigation"

export default async function StoredPromptsPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: storedPrompts } = await supabase
    .from('stored_prompts')
    .select(`
      id,
      prompts (
        id,
        title,
        content,
        tags,
        prompt_categories (
          name,
          icon
        )
      )
    `)
    .eq('user_id', session.user.id)

  const handlePromptUpdated = async () => {
    'use server'
    // The page will automatically revalidate since it's a server component
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">My Stored Prompts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {storedPrompts?.map((stored) => (
          <PromptCard 
            key={stored.id} 
            prompt={stored.prompts} 
            onPromptUpdated={handlePromptUpdated}
            showStoreButton={false}
          />
        ))}
      </div>
    </div>
  )
} 