import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => {
  return createClientComponentClient({
    cookieOptions: {
      name: 'sb-auth-token',
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }
  });
}; 