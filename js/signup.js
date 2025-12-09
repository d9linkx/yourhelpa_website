document.addEventListener('DOMContentLoaded', async () => {
    if (typeof supabase === 'undefined') {
        console.error('Supabase client is not loaded. Ensure supabase-client.js is included before signup.js.'); // Corrected typo
        return;
    }

    const signupForm = document.getElementById('helpa-signup-form');
    // If the form is not found, it means we are not on the signup page.
    // This prevents errors on other pages that might include signup.js.
    if (!signupForm) return; // Exit if the form is not on this page

    const errorMessageDiv = document.getElementById('error-message');
    const successMessageDiv = document.getElementById('success-message');
    const submitBtn = document.getElementById('submit-btn');
    const emailInput = document.getElementById('email');
    const emailFeedback = document.getElementById('email-feedback');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('toggle-password');

    // --- UI Helper Functions ---
    const show_error = (message) => {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
        successMessageDiv.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const setLoadingState = (isLoading, message = 'Complete Registration') => {
        // Ensure submitBtn exists before trying to access its properties
        submitBtn.disabled = isLoading;
        submitBtn.textContent = message;
    };

    // --- Real-time Email Validation ---
    let emailCheckTimeout;
    let isEmailAvailable = false; // Track email availability

    const checkEmailAvailability = async () => {
        if (!emailInput) return; // Ensure emailInput exists
        const email = emailInput.value.trim();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            emailFeedback.textContent = '';
            isEmailAvailable = false;
            return;
        }
        
        emailFeedback.textContent = 'Checking...';
        emailFeedback.style.color = 'var(--text-muted-color)';

        try {
            // We check the public 'helpas' table. This is a reasonable approach
            // as auth.users is not directly queryable from the client.
            const { data, error } = await supabase
                .from('helpas')
                .select('email')
                .eq('email', email)
                .single();

            if (error && error.code !== 'PGRST116' && error.code !== '406') { // PGRST116 = 'No rows found', 406 = 'No rows found' for older PostgREST
                throw error;
            }

            if (data) {
                emailFeedback.textContent = 'Email is already registered. Please login.';
                emailFeedback.style.color = 'var(--error-color)';
                isEmailAvailable = false;
            } else {
                emailFeedback.textContent = 'Email is available!';
                emailFeedback.style.color = 'var(--primary-color)';
                isEmailAvailable = true;
            }
        } catch (err) {
            console.error('Error checking email:', err);
            emailFeedback.textContent = 'Could not verify email.';
            emailFeedback.style.color = 'var(--error-color)';
            isEmailAvailable = false;
        }
    };

    if (emailInput && emailFeedback) {
        emailInput.addEventListener('input', () => {
            clearTimeout(emailCheckTimeout);
            emailCheckTimeout = setTimeout(checkEmailAvailability, 500); // Debounce for 500ms
            saveFormData(); // Save data on input
        });
    }

    // --- Form Data Persistence (localStorage) ---
    const localStorageKey = 'helpaSignupFormData';

    const saveFormData = () => {
        const currentData = {};
        const formElements = signupForm.elements;

        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.name && element.type !== 'password' && !element.disabled) {
                if (element.type === 'radio') {
                    if (element.checked) {
                        currentData[element.name] = element.value;
                    }
                } else if (element.type === 'checkbox') {
                    currentData[element.name] = element.checked;
                } else {
                    currentData[element.name] = element.value;
                }
            }
        }
        localStorage.setItem(localStorageKey, JSON.stringify(currentData));
    };

    const loadFormData = () => {
        const savedData = localStorage.getItem(localStorageKey);
        if (savedData) {
            const data = JSON.parse(savedData);
            const formElements = signupForm.elements;

            for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                if (element.name && data[element.name] !== undefined) {
                    if (element.type === 'radio') {
                        if (element.value === data[element.name]) {
                            element.checked = true;
                        }
                    } else if (element.type === 'checkbox') {
                        element.checked = data[element.name];
                    } else {
                        element.value = data[element.name];
                    }
                }
            }
            // The dynamic form interactions that needed manual triggering
            // (like updateSkillLabel) are removed, simplifying this function.

            // Re-check email availability if email was pre-filled
            if (emailInput.value) {
                checkEmailAvailability();
            }
        }
    };

    // Load data on page load
    loadFormData();

    // Save data on input change for all relevant fields
    signupForm.addEventListener('input', (e) => {
        // Only save if the input is not the password field
        if (e.target.type !== 'password') {
            saveFormData();
        }
    });
    signupForm.addEventListener('change', saveFormData); // For selects and radios

    // --- Form Submission Handler ---
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (errorMessageDiv) errorMessageDiv.style.display = 'none'; // Clear previous errors
        setLoadingState(true, 'Processing...');

        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData.entries());

        // --- Validation ---
        if (data['location_selected'] !== 'true') {
            show_error('Please select a valid location from the suggestions.');
            setLoadingState(false);
            document.getElementById('location').focus();
            return;
        }

        if (!isEmailAvailable) {
            show_error('Please use an available email address to register.');
            setLoadingState(false);
            emailInput.focus();
            return;
        }

        if (!isEmailAvailable) {
            show_error('Please use an available email address to register.');
            setLoadingState(false);
            emailInput.focus();
            return;
        }

        try {
            // --- Step 1: Create Auth User ---
            setLoadingState(true, 'Creating account...');
            const { data: authData, error: authError } = await createAuthUser(data);

            if (authError) {
                handleAuthError(authError);
                setLoadingState(false);
                return;
            }

            // --- Step 2: Insert Public Profile ---
            setLoadingState(true, 'Saving profile...');
            const { error: profileError } = await insertHelpaProfile(authData.user.id, data);

            if (profileError) {
                // IMPORTANT: In a production environment, you should not attempt to delete the user
                // from the client-side as it requires admin privileges. This is a security risk.
                // The best practice is to use a Supabase Edge Function triggered by a webhook
                // or a database trigger to clean up orphaned auth users if profile creation fails.
                console.error('Profile insertion failed:', profileError);
                show_error(`Profile creation failed: ${profileError.message}. Please contact support.`);
                setLoadingState(false);
                // The user will have an auth account but no profile. They should contact support.
                return;
            }

            // --- Step 3: Success ---
            showSuccessState(data.email);

        } catch (error) {
            // Catch any unexpected errors during the process
            console.error('An unexpected error occurred during signup:', error);
            show_error(error.message || 'An unexpected error occurred. Please try again.');
            setLoadingState(false);
        }
    });

    // --- Data & API Functions ---

    function createAuthUser(formData) {
        return supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData['full-name'], // This maps to full_name in auth.users.user_metadata
                    whatsapp_number: formData['phone-number'],
                    role: 'helpa' // Assign the 'helpa' role
                }
            }
        });
    }

    function insertHelpaProfile(userId, formData, skill) {
        return supabase
            .from('helpas')
            .insert({
                id: userId,
                full_name: formData['full-name'],
                phone_number: formData['whatsapp-number'],
                email: formData.email,
                primary_skill: formData['service-name'], // Use the new service-name field
                location: formData.location,
                status: 'pending_verification'
            });
    }

    function handleAuthError(error) {
        if (error.message.includes("already registered")) {
            show_error("This email address is already registered. Please try logging in.");
            emailInput.focus();
        } else if (error.message.includes("weak password")) {
            show_error("The password is too weak. Please use a stronger password.");
        } else {
            show_error(error.message);
        }
    }

    function showSuccessState(email) {
        signupForm.style.display = 'none';
        successMessageDiv.innerHTML = `
            <h4>Registration Complete! Check Your Email.</h4>
            <p>Welcome to YourHelpa! We've sent a confirmation link to <strong>${email}</strong>. Please click the link in that email to activate your account.</p>
        `;
        if (successMessageDiv) successMessageDiv.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        localStorage.removeItem(localStorageKey); // Clear saved form data on successful submission
    }
});