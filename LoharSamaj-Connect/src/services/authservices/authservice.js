import { supabase } from "../superbase";

export async function signUpUser({
  email,
  password
}) {
 const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password
});

  if (error) throw error;

  return data;
}
