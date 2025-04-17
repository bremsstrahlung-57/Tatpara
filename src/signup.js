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
    // data.user contains the user object
    // data.session contains the active session information (including access token)

    alert("Sign in successful!");

    return { user: data.user, session: data.session, error: null };
  } catch (catchError) {
    console.error("Caught exception during sign in:", catchError);
    return { user: null, session: null, error: catchError };
  }
}

async function signUpNewUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error signing up:", error.message);
      alert(`Sign up failed: ${error.message}`);
      return { user: null, session: null, error };
    }

    console.log("Sign up successful:", data);
    alert("Sign up successful! Check your email for confirmation link.");
    
    window.location.href = "/login.html";
    
    return { user: data.user, session: data.session, error: null };
  } catch (catchError) {
    console.error("Caught exception during sign up:", catchError);
    alert(`An error occurred during sign up: ${catchError.message}`);
    return { user: null, session: null, error: catchError };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    await signUpNewUser(email, password);
  });
});
