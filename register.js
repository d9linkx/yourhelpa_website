document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const errorMessageDiv = document.getElementById('error-message');
    const successMessageDiv = document.getElementById('success-message');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Clear previous messages
            errorMessageDiv.style.display = 'none';
            errorMessageDiv.textContent = '';
            successMessageDiv.style.display = 'none';
            successMessageDiv.textContent = '';

            const fullName = registerForm['full-name'].value;
            const whatsappNumber = registerForm['whatsapp-number'].value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;

            // Disable button
            submitButton.disabled = true;
            submitButton.textContent = 'Creating Account...';

            // Use the global supabase client from supabase-client.js
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName,
                        whatsapp_number: whatsappNumber
                    }
                }
            });

            if (error) {
                errorMessageDiv.textContent = error.message;
                errorMessageDiv.style.display = 'block';
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = 'Continue to Step 2';
            } else if (data.user) {
                // User created successfully.
                // Show a temporary success message and then redirect.
                successMessageDiv.textContent = 'Account created! Redirecting to the next step...';
                successMessageDiv.style.display = 'block';

                // Redirect to step 2 after a short delay
                setTimeout(() => {
                    window.location.href = '/signup-step-2.html';
                }, 1500); // 1.5-second delay
            }
        });
    }
});