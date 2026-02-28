import { supabase } from "../superbase";

export async function signInUser({
  email,
  password
}) {
 const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
if (error) {
  throw error;
}
  return data;
}


