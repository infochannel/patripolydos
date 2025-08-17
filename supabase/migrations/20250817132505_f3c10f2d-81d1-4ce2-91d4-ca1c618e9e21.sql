-- Create security definer function to get current user admin status
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop the existing update policy and create new ones
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Users can update their own profile but cannot change admin status
CREATE POLICY "Users can update their own profile (non-admin fields)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id AND NOT public.is_current_user_admin());

-- Only admins can update admin status
CREATE POLICY "Admins can update admin status" 
ON public.profiles 
FOR UPDATE 
USING (public.is_current_user_admin());

-- Admins can view all profiles, users can only view their own
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_current_user_admin());