import { supabase } from './supabase-client.js';

async function loadServices() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;

    // Fetch services and the provider's name from the related 'profiles' table
    const { data: services, error } = await supabase
        .from('services')
        .select(`
            id,
            title,
            description,
            price,
            price_type,
            images,
            profiles ( first_name, email )
        `);

    if (error) {
        console.error('Error fetching services:', error);
        servicesGrid.innerHTML = '<p class="error">Could not load services. Please try again later.</p>';
        return;
    }

    if (services.length === 0) {
        servicesGrid.innerHTML = '<p>No services have been listed yet. Check back soon!</p>';
        return;
    }

    servicesGrid.innerHTML = services.map(service => `
        <a href="service-detail.html?id=${service.id}" class="service-card">
            <img src="${service.images?.[0] || 'https://placehold.co/600x400?text=No+Image'}" alt="${service.title}" class="service-card-image">
            <div class="service-card-content">
                <h3>${service.title}</h3>
                <p class="service-card-provider">by ${service.profiles?.first_name || 'A Helpa'}</p>
                <p class="service-card-price">$${service.price} ${service.price_type === 'hourly' ? '/ hour' : ''}</p>
            </div>
        </a>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadServices);