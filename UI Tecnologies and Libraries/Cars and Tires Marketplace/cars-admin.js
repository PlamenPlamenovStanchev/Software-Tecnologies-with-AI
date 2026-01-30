/* ====================================
   Admin Panel JavaScript
   ==================================== */

class AdminApp {
    constructor() {
        this.carModal = null;
        this.tireModal = null;
        this.viewModal = null;
        this.deleteModal = null;
        this.currentDeleteType = null;
        this.currentDeleteId = null;
        this.init();
    }

    init() {
        // Initialize Bootstrap modals
        this.carModal = new bootstrap.Modal(document.getElementById('carModal'));
        this.tireModal = new bootstrap.Modal(document.getElementById('tireModal'));
        this.viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
        this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

        // Fix duplicate tire names
        this.fixTireNames();

        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize tooltips
        this.initTooltips();
        
        // Render initial data
        this.renderCars();
        this.renderTires();
    }

    fixTireNames() {
        const tires = JSON.parse(localStorage.getItem('marketplace_tires') || '[]');
        let updated = false;

        tires.forEach(tire => {
            // Check if model starts with the brand name
            if (tire.model.startsWith(tire.brand + ' ')) {
                tire.model = tire.model.substring(tire.brand.length + 1);
                updated = true;
            }
        });

        if (updated) {
            localStorage.setItem('marketplace_tires', JSON.stringify(tires));
        }
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.target;
                this.switchSection(target);
            });
        });

        // Delete confirmation
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDelete();
        });
    }

    initTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }

    switchSection(target) {
        // Update sidebar navigation
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.closest('.nav-link').classList.add('active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(target).classList.add('active');
    }

    // ====== ALERTS ======
    showAlert(message, type = 'success') {
        const alertContainer = document.getElementById('alert-container');
        const alertId = 'alert-' + Date.now();
        
        const iconMap = {
            success: 'bi-check-circle-fill',
            danger: 'bi-x-circle-fill',
            info: 'bi-info-circle-fill'
        };

        const alertHTML = `
            <div class="custom-alert alert-${type}" id="${alertId}">
                <i class="bi ${iconMap[type]}"></i>
                <div class="alert-message">${message}</div>
            </div>
        `;

        alertContainer.insertAdjacentHTML('beforeend', alertHTML);

        // Auto-close after 3 seconds
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                alert.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => alert.remove(), 300);
            }
        }, 3000);
    }

    // ====== CARS CRUD ======
    renderCars() {
        const cars = JSON.parse(localStorage.getItem('marketplace_cars') || '[]');
        const grid = document.getElementById('cars-grid');

        if (cars.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #6c757d;">No cars available. Click "Add New Car" to get started.</div>';
            return;
        }

        grid.innerHTML = cars.map(car => `
            <div class="admin-card">
                <div class="card-header-section">
                    <div class="card-title-section">
                        <h5><i class="bi bi-car-front-fill"></i> ${car.brand} ${car.model}</h5>
                        <div class="card-subtitle">${car.year} | ${car.color}</div>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-info btn-sm" onclick="adminApp.viewCarDetails(${car.id})" 
                                data-bs-toggle="tooltip" title="View Details">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="adminApp.openEditCarModal(${car.id})" 
                                data-bs-toggle="tooltip" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="adminApp.openDeleteModal('car', ${car.id})" 
                                data-bs-toggle="tooltip" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body-section">
                    <p><strong>Transmission:</strong> <span>${car.transmission}</span></p>
                    <p><strong>Fuel Type:</strong> <span>${car.fuelType}</span></p>
                    <p><strong>Kilometers:</strong> <span>${car.kilometers.toLocaleString()} km</span></p>
                    <span class="price-tag">$${car.price.toLocaleString()}</span>
                    ${car.featured ? '<span class="featured-badge"><i class="bi bi-star-fill"></i> Featured</span>' : ''}
                </div>
            </div>
        `).join('');

        this.initTooltips();
    }

    openAddCarModal() {
        document.getElementById('carModalTitle').textContent = 'Add New Car';
        document.getElementById('carForm').reset();
        document.getElementById('carId').value = '';
        this.carModal.show();
    }

    openEditCarModal(id) {
        const cars = JSON.parse(localStorage.getItem('marketplace_cars') || '[]');
        const car = cars.find(c => c.id === id);
        
        if (!car) return;

        document.getElementById('carModalTitle').textContent = 'Edit Car';
        document.getElementById('carId').value = car.id;
        document.getElementById('carBrand').value = car.brand;
        document.getElementById('carModel').value = car.model;
        document.getElementById('carYear').value = car.year;
        document.getElementById('carPrice').value = car.price;
        document.getElementById('carKilometers').value = car.kilometers;
        document.getElementById('carColor').value = car.color;
        document.getElementById('carTransmission').value = car.transmission;
        document.getElementById('carFuelType').value = car.fuelType;
        document.getElementById('carDescription').value = car.description || '';
        document.getElementById('carFeatured').checked = car.featured || false;

        this.carModal.show();
    }

    saveCar() {
        const form = document.getElementById('carForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const cars = JSON.parse(localStorage.getItem('marketplace_cars') || '[]');
        const carId = document.getElementById('carId').value;

        const carData = {
            id: carId ? parseInt(carId) : (cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1),
            brand: document.getElementById('carBrand').value,
            model: document.getElementById('carModel').value,
            year: parseInt(document.getElementById('carYear').value),
            price: parseInt(document.getElementById('carPrice').value),
            kilometers: parseInt(document.getElementById('carKilometers').value),
            color: document.getElementById('carColor').value,
            transmission: document.getElementById('carTransmission').value,
            fuelType: document.getElementById('carFuelType').value,
            description: document.getElementById('carDescription').value,
            featured: document.getElementById('carFeatured').checked
        };

        if (carId) {
            // Edit existing car
            const index = cars.findIndex(c => c.id === parseInt(carId));
            cars[index] = carData;
            this.showAlert('Car updated successfully!', 'success');
        } else {
            // Add new car
            cars.push(carData);
            this.showAlert('Car added successfully!', 'success');
        }

        localStorage.setItem('marketplace_cars', JSON.stringify(cars));
        this.carModal.hide();
        this.renderCars();
    }

    viewCarDetails(id) {
        const cars = JSON.parse(localStorage.getItem('marketplace_cars') || '[]');
        const car = cars.find(c => c.id === id);
        
        if (!car) return;

        document.getElementById('viewModalTitle').textContent = `${car.brand} ${car.model}`;
        document.getElementById('viewModalBody').innerHTML = `
            <div class="row g-3">
                <div class="col-md-6"><strong>Brand:</strong> ${car.brand}</div>
                <div class="col-md-6"><strong>Model:</strong> ${car.model}</div>
                <div class="col-md-4"><strong>Year:</strong> ${car.year}</div>
                <div class="col-md-4"><strong>Color:</strong> ${car.color}</div>
                <div class="col-md-4"><strong>Price:</strong> $${car.price.toLocaleString()}</div>
                <div class="col-md-6"><strong>Transmission:</strong> ${car.transmission}</div>
                <div class="col-md-6"><strong>Fuel Type:</strong> ${car.fuelType}</div>
                <div class="col-md-6"><strong>Kilometers:</strong> ${car.kilometers.toLocaleString()} km</div>
                <div class="col-md-6"><strong>Featured:</strong> ${car.featured ? 'Yes' : 'No'}</div>
                <div class="col-12"><strong>Description:</strong><br>${car.description || 'N/A'}</div>
            </div>
        `;

        this.viewModal.show();
    }

    // ====== TIRES CRUD ======
    renderTires() {
        const tires = JSON.parse(localStorage.getItem('marketplace_tires') || '[]');
        const grid = document.getElementById('tires-grid');

        if (tires.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #6c757d;">No tires available. Click "Add New Tire" to get started.</div>';
            return;
        }

        grid.innerHTML = tires.map(tire => `
            <div class="admin-card">
                <div class="card-header-section">
                    <div class="card-title-section">
                        <h5><i class="bi bi-record-circle"></i> ${tire.brand} ${tire.model}</h5>
                        <div class="card-subtitle">${tire.width}/${tire.height}R${tire.wheel}</div>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-info btn-sm" onclick="adminApp.viewTireDetails(${tire.id})" 
                                data-bs-toggle="tooltip" title="View Details">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="adminApp.openEditTireModal(${tire.id})" 
                                data-bs-toggle="tooltip" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="adminApp.openDeleteModal('tire', ${tire.id})" 
                                data-bs-toggle="tooltip" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body-section">
                    <p><strong>Season:</strong> <span>${tire.season}</span></p>
                    <p><strong>Grip Rating:</strong> <span>${tire.grip}/10</span></p>
                    <p><strong>Tread Depth:</strong> <span>${tire.treadDepth}mm</span></p>
                    <span class="price-tag">$${tire.price.toLocaleString()}</span>
                    ${tire.featured ? '<span class="featured-badge"><i class="bi bi-star-fill"></i> Featured</span>' : ''}
                </div>
            </div>
        `).join('');

        this.initTooltips();
    }

    openAddTireModal() {
        document.getElementById('tireModalTitle').textContent = 'Add New Tire';
        document.getElementById('tireForm').reset();
        document.getElementById('tireId').value = '';
        this.tireModal.show();
    }

    openEditTireModal(id) {
        const tires = JSON.parse(localStorage.getItem('marketplace_tires') || '[]');
        const tire = tires.find(t => t.id === id);
        
        if (!tire) return;

        document.getElementById('tireModalTitle').textContent = 'Edit Tire';
        document.getElementById('tireId').value = tire.id;
        document.getElementById('tireBrand').value = tire.brand;
        document.getElementById('tireModel').value = tire.model;
        document.getElementById('tireWidth').value = tire.width;
        document.getElementById('tireHeight').value = tire.height;
        document.getElementById('tireWheel').value = tire.wheel;
        document.getElementById('tirePrice').value = tire.price;
        document.getElementById('tireSeason').value = tire.season;
        document.getElementById('tireGrip').value = tire.grip;
        document.getElementById('tireTreadDepth').value = tire.treadDepth;
        document.getElementById('tireDescription').value = tire.description || '';
        document.getElementById('tireFeatured').checked = tire.featured || false;

        this.tireModal.show();
    }

    saveTire() {
        const form = document.getElementById('tireForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const tires = JSON.parse(localStorage.getItem('marketplace_tires') || '[]');
        const tireId = document.getElementById('tireId').value;

        const tireData = {
            id: tireId ? parseInt(tireId) : (tires.length > 0 ? Math.max(...tires.map(t => t.id)) + 1 : 1),
            brand: document.getElementById('tireBrand').value,
            model: document.getElementById('tireModel').value,
            width: parseInt(document.getElementById('tireWidth').value),
            height: parseInt(document.getElementById('tireHeight').value),
            wheel: parseInt(document.getElementById('tireWheel').value),
            price: parseInt(document.getElementById('tirePrice').value),
            season: document.getElementById('tireSeason').value,
            grip: parseFloat(document.getElementById('tireGrip').value),
            treadDepth: parseFloat(document.getElementById('tireTreadDepth').value),
            description: document.getElementById('tireDescription').value,
            featured: document.getElementById('tireFeatured').checked
        };

        if (tireId) {
            // Edit existing tire
            const index = tires.findIndex(t => t.id === parseInt(tireId));
            tires[index] = tireData;
            this.showAlert('Tire updated successfully!', 'success');
        } else {
            // Add new tire
            tires.push(tireData);
            this.showAlert('Tire added successfully!', 'success');
        }

        localStorage.setItem('marketplace_tires', JSON.stringify(tires));
        this.tireModal.hide();
        this.renderTires();
    }

    viewTireDetails(id) {
        const tires = JSON.parse(localStorage.getItem('marketplace_tires') || '[]');
        const tire = tires.find(t => t.id === id);
        
        if (!tire) return;

        document.getElementById('viewModalTitle').textContent = `${tire.brand} ${tire.model}`;
        document.getElementById('viewModalBody').innerHTML = `
            <div class="row g-3">
                <div class="col-md-6"><strong>Brand:</strong> ${tire.brand}</div>
                <div class="col-md-6"><strong>Model:</strong> ${tire.model}</div>
                <div class="col-md-4"><strong>Width:</strong> ${tire.width}mm</div>
                <div class="col-md-4"><strong>Height:</strong> ${tire.height}%</div>
                <div class="col-md-4"><strong>Wheel:</strong> ${tire.wheel}"</div>
                <div class="col-md-4"><strong>Price:</strong> $${tire.price.toLocaleString()}</div>
                <div class="col-md-4"><strong>Season:</strong> ${tire.season}</div>
                <div class="col-md-4"><strong>Featured:</strong> ${tire.featured ? 'Yes' : 'No'}</div>
                <div class="col-md-6"><strong>Grip Rating:</strong> ${tire.grip}/10</div>
                <div class="col-md-6"><strong>Tread Depth:</strong> ${tire.treadDepth}mm</div>
                <div class="col-12"><strong>Description:</strong><br>${tire.description || 'N/A'}</div>
            </div>
        `;

        this.viewModal.show();
    }

    // ====== DELETE ======
    openDeleteModal(type, id) {
        this.currentDeleteType = type;
        this.currentDeleteId = id;

        const items = JSON.parse(localStorage.getItem(`marketplace_${type}s`) || '[]');
        const item = items.find(i => i.id === id);

        if (!item) return;

        const itemName = type === 'car' 
            ? `${item.brand} ${item.model} (${item.year})`
            : `${item.brand} ${item.model} (${item.width}/${item.height}R${item.wheel})`;

        document.getElementById('deleteMessage').innerHTML = `
            Are you sure you want to delete <strong>${itemName}</strong>?<br>
            <span style="color: #dc3545; font-size: 0.9rem;">This action cannot be undone.</span>
        `;

        this.deleteModal.show();
    }

    confirmDelete() {
        if (!this.currentDeleteType || !this.currentDeleteId) return;

        const storageKey = `marketplace_${this.currentDeleteType}s`;
        const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const filteredItems = items.filter(i => i.id !== this.currentDeleteId);

        localStorage.setItem(storageKey, JSON.stringify(filteredItems));

        this.deleteModal.hide();
        this.showAlert(`${this.currentDeleteType === 'car' ? 'Car' : 'Tire'} deleted successfully!`, 'danger');

        if (this.currentDeleteType === 'car') {
            this.renderCars();
        } else {
            this.renderTires();
        }

        this.currentDeleteType = null;
        this.currentDeleteId = null;
    }
}

// Initialize app
let adminApp;
document.addEventListener('DOMContentLoaded', () => {
    adminApp = new AdminApp();
});
