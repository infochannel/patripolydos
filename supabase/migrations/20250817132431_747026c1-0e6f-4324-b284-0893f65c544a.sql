-- Add security policy to prevent self admin promotion
CREATE POLICY "Prevent self admin promotion" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = user_id AND 
  (
    -- Allow if not changing admin status
    OLD.is_admin = NEW.is_admin OR 
    -- Allow if current user is already admin
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  )
);

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

-- Create policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  public.is_current_user_admin()
);

-- Create policy for admins to update other profiles
CREATE POLICY "Admins can update other profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.is_current_user_admin());

-- Insert admin user (will need to be created in Supabase Auth first)
-- This is a placeholder - the actual user must be created through Supabase Dashboard
-- with email: admin@patripoly.com and a strong password