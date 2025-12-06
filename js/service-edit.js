import { supabase } from './supabase-client.js';

const serviceForm = document.getElementById('service-form');
const updateMessage = document.getElementById('update-message');
const pageTitle = document.getElementById('page-title');
const submitButton = document.getElementById('submit-button');
const deleteButton = document.getElementById('delete-button');
const serviceIdInput = document.getElementById('service-id');
const imagePreviews = document.getElementById('image-previews');

let currentUser = null;

/**
 * Gets the current logged-in user and redirects if not found.
 */
async function getUser() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
        window.location.href = 'login.html';
        return null;
    }
    currentUser = session.user;
    return currentUser;
}

/**
 * Gets the service ID from the URL query parameters.
 */
function getServiceId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Loads existing service data into the form if in edit mode.
 */
async function loadServiceData() {
    await getUser();
    const serviceId = getServiceId();

    if (serviceId) {
        // Edit mode
        pageTitle.textContent = 'Edit Service';
        submitButton.textContent = 'Update Service';
        deleteButton.style.display = 'block';
        serviceIdInput.value = serviceId;

        const { data: service, error } = await supabase
            .from('services')
            .select('*, images')
            .eq('id', serviceId)
            .single();

        if (error || !service) {
            console.error('Error fetching service:', error);
            updateMessage.textContent = 'Could not load service data.';
            return;
        }

        // Populate form
        document.getElementById('title').value = service.title;
        document.getElementById('description').value = service.description;
        document.getElementById('price').value = service.price;
        document.getElementById('price_type').value = service.price_type;

        // Display existing images
        if (service.images && service.images.length > 0) {
            imagePreviews.innerHTML = service.images.map((imageUrl, index) => `
                <div class="image-preview-item">
                    <img src="${imageUrl}" alt="Service Image ${index + 1}" width="100">
                    <button type="button" class="delete-image-btn" data-url="${imageUrl}">&times;</button>
                </div>
            `).join('');

            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-image-btn').forEach(btn => {
                btn.addEventListener('click', handleDeleteImage);
            });
        } else {
            imagePreviews.innerHTML = '<p>No images yet.</p>';
        }
    } else {
        document.getElementById('image-previews-container').style.display = 'none';
    }
}

/**
 * Handles form submission for creating or updating a service.
 */
serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    updateMessage.textContent = '';

    if (!currentUser) {
        await getUser();
        if (!currentUser) return;
    }

    const imageFiles = document.getElementById('images').files;
    const existingImageUrls = Array.from(imagePreviews.querySelectorAll('.image-preview-item img')).map(img => img.src);
    const newImageUrls = [];

    // Upload new images if any
    if (imageFiles.length > 0) {
        for (const file of imageFiles) {
            const filePath = `public/services/${currentUser.id}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage.from('service-images').upload(filePath, file);

            if (uploadError) {
                throw new Error('Image upload failed: ' + uploadError.message);
            }

            const { data: { publicUrl } } = supabase.storage.from('service-images').getPublicUrl(filePath);
            newImageUrls.push(publicUrl);
        }
    }

    const serviceData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        price_type: document.getElementById('price_type').value,
        provider_id: currentUser.id,
        images: [...existingImageUrls, ...newImageUrls] // Combine old and new image URLs
    };

    const serviceId = serviceIdInput.value;
    let error;

    if (serviceId) {
        // Update existing service
        ({ error } = await supabase.from('services').update(serviceData).eq('id', serviceId));
    } else {
        // Create new service
        ({ error } = await supabase.from('services').insert(serviceData));
    }

    if (error) {
        console.error('Error saving service:', error);
        updateMessage.textContent = 'Failed to save service. Please try again.';
        updateMessage.className = 'error';
    } else {
        alert('Service saved successfully!');
        window.location.href = 'dashboard-helpa.html';
    }
});

/**
 * Handles deleting a service.
 */
deleteButton.addEventListener('click', async () => {
    const serviceId = serviceIdInput.value;
    if (!serviceId) return;

    if (!confirm('Are you sure you want to permanently delete this service?')) {
        return;
    }

    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

    if (error) {
        alert('Failed to delete service: ' + error.message);
    } else {
        alert('Service deleted successfully.');
        window.location.href = 'dashboard-helpa.html';
    }
});

/**
 * Handles deleting a single image from a service.
 */
async function handleDeleteImage(event) {
    const imageUrlToDelete = event.target.dataset.url;
    const serviceId = getServiceId();

    if (!serviceId || !imageUrlToDelete) return;
    if (!confirm('Are you sure you want to delete this image?')) return;

    // 1. Remove from UI
    event.target.closest('.image-preview-item').remove();

    // 2. Update the database
    const remainingImageUrls = Array.from(imagePreviews.querySelectorAll('.image-preview-item img')).map(img => img.src);
    const { error: dbError } = await supabase
        .from('services')
        .update({ images: remainingImageUrls })
        .eq('id', serviceId);

    if (dbError) {
        alert('Failed to update image list in database. Please refresh and try again.');
        console.error(dbError);
        return;
    }

    // 3. Delete from Supabase Storage
    // Extract the file path from the URL
    const urlParts = imageUrlToDelete.split('/service-images/');
    const filePath = urlParts[1];

    const { error: storageError } = await supabase.storage.from('service-images').remove([filePath]);
    if (storageError) {
        alert('Image was removed from the listing, but could not be deleted from storage.');
        console.error(storageError);
    }
}

document.addEventListener('DOMContentLoaded', loadServiceData);