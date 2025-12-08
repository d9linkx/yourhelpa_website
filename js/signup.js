document.addEventListener('DOMContentLoaded', () => {
    // Ensure we have a Supabase client available
    if (typeof supabase === 'undefined') {
        console.error('Supabase client is not loaded. Make sure supabase-client.js is included before signup.js.');
        return;
    }

    const form1 = document.getElementById('signup-step-1-form');
    const form2 = document.getElementById('signup-step-2-form');
    const form3 = document.getElementById('signup-step-3-form');
    const errorMessageDiv = document.getElementById('error-message');

    // --- HELPER FUNCTIONS ---
    const show_error = (message) => {
        if (errorMessageDiv) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.style.display = 'block';
            window.scrollTo(0, 0);
        }
    };

    const clear_error = () => {
        if (errorMessageDiv) {
            errorMessageDiv.style.display = 'none';
        }
    };

    // --- STEP 1: Basic Account Info ---
    if (form1) {
        // Pre-fill form on page load if data exists
        const existingDataStep1 = JSON.parse(sessionStorage.getItem('helpaSignupData'));
        if (existingDataStep1) {
            form1.querySelector('#full-name').value = existingDataStep1.fullName || '';
            form1.querySelector('#email').value = existingDataStep1.email || '';
            form1.querySelector('#phone').value = existingDataStep1.phone || '';
            // Do not pre-fill password for security reasons
        }

        form1.addEventListener('submit', (e) => {
            e.preventDefault();
            clear_error();

            const formData = new FormData(form1);
            const signupData = {
                fullName: formData.get('full-name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                password: formData.get('password'),
            };
            
            // Basic validation
            // Only require password if it's not already stored (i.e., first time through)
            if (!existingDataStep1?.password && signupData.password.length < 6) {
                show_error('Password must be at least 6 characters long.');
                return;
            }

            // Preserve existing password if the field is left blank on a return visit
            if (existingDataStep1?.password && !signupData.password) {
                signupData.password = existingDataStep1.password;
            }

            // Store data in sessionStorage and move to the next step
            sessionStorage.setItem('helpaSignupData', JSON.stringify(signupData));
            window.location.href = '/signup-step-2.html';
        });
    }

    // --- STEP 2: Professional Profile ---
    if (form2) {
        // Pre-fill form if data exists (e.g., user clicks "Back")
        const existingData = JSON.parse(sessionStorage.getItem('helpaSignupData'));
        if (!existingData || !existingData.email) {
            // If no data from step 1, redirect back
            window.location.href = '/signup-step-1.html';
            return;
        }

        // --- Dynamic form logic for Step 2 ---
        const offeringTypeRadios = document.querySelectorAll('input[name="offering-type"]');
        const primarySkillLabel = document.getElementById('primary-skill-label');
        const primarySkillSelect = document.getElementById('primary-skill');
        const otherSkillGroup = document.getElementById('other-skill-group');
        const otherSkillInput = document.getElementById('other-skill');

        const updateSkillLabel = () => {
            const selectedType = document.querySelector('input[name="offering-type"]:checked').value;
            if (selectedType === 'product') {
                primarySkillLabel.textContent = 'Primary Product Category';
            } else {
                primarySkillLabel.textContent = 'Primary Skill';
            }
        };

        offeringTypeRadios.forEach(radio => radio.addEventListener('change', updateSkillLabel));

        primarySkillSelect.addEventListener('change', () => {
            if (primarySkillSelect.value === 'Other') {
                otherSkillGroup.style.display = 'block';
                otherSkillInput.required = true;
            } else {
                otherSkillGroup.style.display = 'none';
                otherSkillInput.required = false;
            }
        });

        // Initial setup on page load
        updateSkillLabel();

        // Pre-fill form fields from sessionStorage
        if (existingData) {
            // Pre-fill offering type
            if (existingData.offeringType) {
                form2.querySelector(`input[name="offering-type"][value="${existingData.offeringType}"]`).checked = true;
                updateSkillLabel(); // Update label based on pre-filled type
            }

            // Pre-fill location and bio
            form2.querySelector('#location').value = existingData.location || '';
            form2.querySelector('#bio').value = existingData.bio || '';

            // Pre-fill primary skill
            if (existingData.primarySkill) {
                const skillOption = Array.from(primarySkillSelect.options).find(opt => opt.value === existingData.primarySkill);
                if (skillOption) {
                    // The skill is a standard option
                    primarySkillSelect.value = existingData.primarySkill;
                } else {
                    // The skill is a custom "Other" value
                    primarySkillSelect.value = 'Other';
                    otherSkillGroup.style.display = 'block';
                    otherSkillInput.required = true;
                    otherSkillInput.value = existingData.primarySkill;
                }
            }
        }

        form2.addEventListener('submit', (e) => {
            e.preventDefault();
            clear_error();

            const formData = new FormData(form2);
            let primarySkillValue = formData.get('primary-skill');
            
            // If 'Other' is selected, use the value from the text input
            if (primarySkillValue === 'Other') {
                primarySkillValue = formData.get('other-skill');
            }

            const profileData = {
                offeringType: formData.get('offering-type'),
                primarySkill: primarySkillValue,
                location: formData.get('location'),
                bio: formData.get('bio'),
            };

            if (!profileData.primarySkill || !profileData.location || !profileData.offeringType) {
                show_error('Please fill out all required fields.');
                return;
            }

            // Merge with existing data and save
            const fullData = { ...existingData, ...profileData };
            sessionStorage.setItem('helpaSignupData', JSON.stringify(fullData));
            window.location.href = '/signup-step-3.html';
        });
    }

    // --- STEP 3: Verification & Final Submission ---
    if (form3) {
        const submitBtn = document.getElementById('submit-btn');
        const successMessageDiv = document.getElementById('success-message');

        // Check for data from previous steps
        const signupData = JSON.parse(sessionStorage.getItem('helpaSignupData'));
        if (!signupData || !signupData.email || !signupData.primarySkill) {
            window.location.href = '/signup-step-1.html';
            return;
        }

        // Pre-fill form on page load if data exists
        if (signupData) {
            form3.querySelector('#bank-name').value = signupData.bankName || '';
            form3.querySelector('#account-number').value = signupData.accountNumber || '';
            form3.querySelector('#account-name').value = signupData.accountName || '';
        }



        form3.addEventListener('submit', async (e) => {
            e.preventDefault();
            clear_error();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';

            const formData = new FormData(form3);
            const finalData = {
                bankName: formData.get('bank-name'),
                accountNumber: formData.get('account-number'),
                accountName: formData.get('account-name'),
            };

            // Merge final data into the main object before submission
            const fullSignupData = { ...signupData, ...finalData };
            sessionStorage.setItem('helpaSignupData', JSON.stringify(fullSignupData));

            // 1. Create the user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: signupData.email,
                password: signupData.password,
                options: {
                    data: {
                        full_name: signupData.fullName,
                        phone: signupData.phone,
                    }
                }
            });

            if (authError) {
                show_error(authError.message);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Complete Registration';
                return;
            }

            if (!authData.user) {
                show_error('Could not create user. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Complete Registration';
                return;
            }

            // 2. Insert the profile into the 'helpas' table
            // NOTE: Assumes you have a table named 'helpas'
            const { error: profileError } = await supabase
                .from('helpas') // <<< RENAME 'helpas' to your actual table name
                .insert({
                    id: authData.user.id, // Link to the auth.users table
                    full_name: fullSignupData.fullName,
                    phone_number: fullSignupData.phone,
                    email: fullSignupData.email,
                    offering_type: fullSignupData.offeringType,
                    primary_skill: fullSignupData.primarySkill,
                    location: fullSignupData.location,
                    bio: fullSignupData.bio,
                    bank_name: finalData.bankName,
                    account_number: finalData.accountNumber,
                    account_name: finalData.accountName,
                    status: 'pending_verification' // Set initial status
                });

            if (profileError) {
                // Note: In a real app, you might want to delete the created auth user if profile insertion fails.
                show_error(`Profile creation failed: ${profileError.message}`);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Complete Registration';
                return;
            }

            // 3. Handle profile picture upload (if provided)
            const profilePictureFile = document.getElementById('profile-picture')?.files[0];
            if (profilePictureFile) {
                // Upload logic will be added in a follow-up
                console.log('Profile picture selected, ready for upload.');
            }

            // 4. Success!
            sessionStorage.removeItem('helpaSignupData'); // Clear session data
            form3.style.display = 'none';
            successMessageDiv.style.display = 'block';
            window.scrollTo(0, 0);

            // Redirect to login after a few seconds
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 5000);
        });
    }
});