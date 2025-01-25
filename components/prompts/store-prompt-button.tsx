'use client'

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Heart } from "lucide-react"
import { useState } from "react"

interface StorePromptButtonProps {
  promptId: string
}

export function StorePromptButton({ promptId }: StorePromptButtonProps) {
  const [isStored, setIsStored] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleStore = async () => {
    try {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please login to store prompts",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from('stored_prompts')
        .insert([
          { prompt_id: promptId, user_id: user.id }
        ])

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Already stored",
            description: "This prompt is already in your storage",
          })
        } else {
          throw error
        }
      } else {
        setIsStored(true)
        toast({
          title: "Success",
          description: "Prompt added to your storage",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to store prompt",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleStore}
      disabled={isLoading || isStored}
    >
      <Heart className={`h-4 w-4 mr-2 ${isStored ? 'fill-current' : ''}`} />
      {isStored ? 'Stored' : 'Store'}
    </Button>
  )
} 