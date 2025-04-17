import { supabase } from "./supabase";

export async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
        console.error('Error checking auth status:', error.message);
        return null;
    }
    
    return session;
}

export async function redirectIfNotAuthenticated() {
    const session = await checkAuth();
    if (!session) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

export async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error.message);
        alert('Error signing out');
        return;
    }
    window.location.href = '/login.html';
}

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        // Clear any user data from localStorage if needed
        localStorage.removeItem('user');
    } else if (event === 'SIGNED_IN') {
        // Store user data in localStorage if needed
        if (session?.user) {
            localStorage.setItem('user', JSON.stringify(session.user));
        }
    }
});