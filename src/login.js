import { supabase } from "./supabase";

async function signInUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error signing in:", error.message);
      alert(`Sign in failed: ${error.message}`);
      return { user: null, session: null, error };
    }

    console.log("Sign in successful:", data);
    
    window.location.href = "/";
    
    return { user: data.user, session: data.session, error: null };
  } catch (catchError) {
    console.error("Caught exception during sign in:", catchError);
    alert(`An error occurred during sign in: ${catchError.message}`);
    return { user: null, session: null, error: catchError };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    await signInUser(email, password);
  });
});