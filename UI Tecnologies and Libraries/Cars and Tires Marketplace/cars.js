/* ====================================
   Cars and Tires Marketplace JS
   ==================================== */

// Data for cars
const CAR_BRANDS = {
    'BMW': ['M3', 'X5', '3 Series', '5 Series', 'Z4', '7 Series'],
    'Mercedes': ['C-Class', 'E-Class', 'GLE', 'A-Class', 'S-Class', 'CLA'],
    'Audi': ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
    'Toyota': ['Camry', 'Corolla', 'RAV4', 'Prius', 'Highlander', 'Tacoma'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Odyssey', 'Fit', 'Ridgeline'],
    'Ford': ['Mustang', 'F-150', 'Escape', 'Edge', 'Fusion', 'Explorer'],
    'Chevrolet': ['Corvette', 'Silverado', 'Cruze', 'Bolt', 'Tahoe', 'Equinox'],
    'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Roadster'],
    'Volkswagen': ['Golf', 'Jetta', 'Passat', 'Beetle', 'ID.4', 'Tiguan'],
    'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Ioniq', 'Kona']
};

const TIRE_BRANDS = ['Michelin', 'Goodyear', 'Bridgestone', 'Continental', 'Pirelli', 'Dunlop', 'Falken', 'Hankook', 'Cooper', 'Kumho'];

// Marketplace App Class
class MarketplaceApp {
    constructor() {
        this.carsPerPage = 6;
        this.tiresPerPage = 6;
        this.currentCarPage = 1;
        this.currentTirePage = 1;
        this.init();
    }

    init() {
        this.initializeData();
        this.setupEventListeners();
        this.renderHotCars();
        this.renderHotTires();
        this.renderCarSearchResults();
        this.renderTireSearchResults();
    }

    // Initialize data in localStorage
    initializeData() {
        if (!localStorage.getItem('marketplace_cars')) {
            const cars = this.generateCars(20);
            localStorage.setItem('marketplace_cars', JSON.stringify(cars));
        }
        
        if (!localStorage.getItem('marketplace_tires')) {
            const tires = this.generateTires(20);
            localStorage.setItem('marketplace_tires', JSON.stringify(tires));
        }
    }

    // Generate sample cars
    generateCars(count) {
        const cars = [];
        let id = 1;
        
        for (const [brand, models] of Object.entries(CAR_BRANDS)) {
            for (const model of models) {
                if (id > count) break;
                
                cars.push({
                    id: id,
                    brand: brand,
                    model: model,
                    year: 2018 + Math.floor(Math.random() * 8),
                    price: 15000 + Math.floor(Math.random() * 85000),
                    kilometers: Math.floor(Math.random() * 200000),
                    color: this.randomColor(),
                    transmission: ['Manual', 'Automatic'][Math.floor(Math.random() * 2)],
                    fuelType: ['Petrol', 'Diesel', 'Hybrid', 'Electric'][Math.floor(Math.random() * 4)],
                    featured: Math.random() > 0.7,
                    description: `Beautiful ${brand} ${model} in excellent condition. Low mileage, well-maintained.`
                });
                id++;
            }
            if (id > count) break;
        }
        
        return cars.slice(0, count);
    }

    // Generate sample tires
    generateTires(count) {
        const tires = [];
        const sizes = [
            { width: 165, height: 65, wheel: 13 },
            { width: 185, height: 65, wheel: 14 },
            { width: 195, height: 65, wheel: 15 },
            { width: 205, height: 55, wheel: 16 },
            { width: 225, height: 50, wheel: 17 },
            { width: 245, height: 45, wheel: 18 },
            { width: 265, height: 40, wheel: 19 },
            { width: 285, height: 35, wheel: 20 }
        ];
        
        for (let i = 1; i <= count; i++) {
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            const brand = TIRE_BRANDS[Math.floor(Math.random() * TIRE_BRANDS.length)];
            
            tires.push({
                id: i,
                brand: brand,
                model: `Pro Series ${i}`,
                width: size.width,
                height: size.height,
                wheel: size.wheel,
                price: 50 + Math.floor(Math.random() * 250),
                season: ['Summer', 'Winter', 'All-Season'][Math.floor(Math.random() * 3)],
                grip: (6 + Math.random() * 4).toFixed(1),
                treadDepth: (7 + Math.random() * 2).toFixed(1),
                featured: Math.random() > 0.7,
                description: `Premium quality ${brand} tire ${size.width}/${size.height}R${size.wheel}. High durability and comfort.`
            });
        }
        
        return tires;
    }

    randomColor() {
        const colors = ['Red', 'Blue', 'Black', 'White', 'Silver', 'Gray', 'Green', 'Orange', 'Yellow', 'Purple', 'Gold', 'Bronze'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Setup event listeners
    setupEventListeners() {
        // Tab navigation
        const carTab = document.getElementById('cars-tab');
        const tireTab = document.getElementById('tires-tab');
        
        carTab?.addEventListener('click', () => this.updateBreadcrumbs('cars'));
        tireTab?.addEventListener('click', () => this.updateBreadcrumbs('tires'));

        // Search forms
        document.getElementById('car-search-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.currentCarPage = 1;
            this.renderCarSearchResults();
        });

        document.getElementById('tire-search-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.currentTirePage = 1;
            this.renderTireSearchResults();
        });

        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#' && href !== '#home') {
                    e.preventDefault();
                    const element = document.querySelector(href);
                    if (element) {
                        setTimeout(() => {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    }
                }
            });
        });

        // Contact form
        document.getElementById('contact-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            e.target.reset();
        });
    }

    // Update breadcrumbs
    updateBreadcrumbs(tab = 'cars') {
        const breadcrumbNav = document.getElementById('breadcrumb-nav');
        if (breadcrumbNav) {
            breadcrumbNav.innerHTML = `
                <li class="breadcrumb-item"><a href="#home">Home</a></li>
                <li class="breadcrumb-item active">${tab === 'cars' ? 'Cars' : 'Tires'}</li>
            `;
        }
    }

    // Render hot cars carousel
    renderHotCars() {
        const cars = JSON.parse(localStorage.getItem('marketplace_cars') || '[]');
        const hotCars = cars.filter(c => c.featured).slice(0, 5);
        const carousel = document.getElementById('hot-cars-carousel');
        const indicators = document.getElementById('cars-carousel-indicators');
        
        if (!carousel || hotCars.length === 0) return;

        // Render indicators
        if (indicators) {
            indicators.innerHTML = hotCars.map((_, index) => `
                <button type="button" data-bs-target="#carsCarousel" data-bs-slide-to="${index}" ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
            `).join('');
        }

        // Render carousel items
        carousel.innerHTML = hotCars.map((car, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <div>
                    <i class="bi bi-car-front-fill display-1"></i>
                    <h3>${car.brand} ${car.model}</h3>
                    <p class="text-muted">${car.year} | ${car.color} | ${car.fuelType}</p>
                    <p class="price">$${car.price.toLocaleString()}</p>
                    <p class="text-muted">${car.kilometers.toLocaleString()} km</p>
                </div>
            </div>
        `).join('');
    }

    // Render hot tires carousel
    renderHotTires() {
        const tires = JSON.parse(localStorage.getItem('marketplace_tires') || '[]');
        const hotTires = tires.filter(t => t.featured).slice(0, 5);
        const carousel = document.getElementById('hot-tires-carousel');
        const indicators = document.getElementById('tires-carousel-indicators');
        
        if (!carousel || hotTires.length === 0) return;

        // Render indicators
        if (indicators) {
            indicators.innerHTML = hotTires.map((_, index) => `
                <button type="button" data-bs-target="#tiresCarousel" data-bs-slide-to="${index}" ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
            `).join('');
        }

        // Render carousel items
        carousel.innerHTML = hotTires.map((tire, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <div>
                    <i class="bi bi-record-circle display-1" style="color: #6c757d;"></i>
                    <h3>${tire.brand} ${tire.model}</h3>
                    <p class="text-muted">${tire.width}/${tire.height}R${tire.wheel} | ${tire.season}</p>
                    <p class="price">$${tire.price.toLocaleString()}</p>
                    <p class="text-muted">Grip: ${tire.grip}/10 | Tread: ${tire.treadDepth}mm</p>
                </div>
            </div>
        `).join('');
    }

    // Check if car filters are active
    hasCarFilters() {
        const brand = document.getElementById('car-brand')?.value || '';
        const model = document.getElementById('car-model')?.value || '';
        const year = document.getElementById('car-year')?.value || '';
        const maxPrice = document.getElementById('car-max-price')?.value || '';
        const maxKm = document.getElementById('car-kilometers')?.value || '';
        
        return brand || model || year || maxPrice || maxKm;
    }

    // Get filtered cars
    getFilteredCars() {
        const cars = JSON.parse(localStorage.getItem('marketplace_cars') || '[]');
        const brand = document.getElementById('car-brand')?.value.toLowerCase() || '';
        const model = document.getElementById('car-model')?.value.toLowerCase() || '';
        const year = parseInt(document.getElementById('car-year')?.value || 0);
        const maxPrice = parseInt(document.getElementById('car-max-price')?.value || Infinity);
        const maxKm = parseInt(document.getElementById('car-kilometers')?.value || Infinity);

        return cars.filter(car => 
            (!brand || car.brand.toLowerCase().includes(brand)) &&
            (!model || car.model.toLowerCase().includes(model)) &&
            (!year || car.year === year) &&
            car.price <= maxPrice &&
            car.kilometers <= maxKm
        );
    }

    // Get filtered tires
    getFilteredTires() {
        const tires = JSON.parse(localStorage.getItem('marketplace_tires') || '[]');
        const brand = document.getElementById('tire-brand')?.value.toLowerCase() || '';
        const width = parseInt(document.getElementById('tire-width')?.value || 0);
        const height = parseInt(document.getElementById('tire-height')?.value || 0);
        const wheel = parseInt(document.getElementById('tire-wheel')?.value || 0);

        return tires.filter(tire =>
            (!brand || tire.brand.toLowerCase().includes(brand)) &&
            (!width || tire.width === width) &&
            (!height || tire.height === height) &&
            (!wheel || tire.wheel === wheel)
        );
    }

    // Render car search results
    renderCarSearchResults() {
        const filtered = this.getFilteredCars();
        const hasFilters = this.hasCarFilters();
        const itemsPerPage = hasFilters ? this.carsPerPage : 20;
        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        const start = (this.currentCarPage - 1) * itemsPerPage;
        const paginatedCars = filtered.slice(start, start + itemsPerPage);

        const resultsDiv = document.getElementById('car-search-results');
        if (!resultsDiv) return;

        if (paginatedCars.length === 0) {
            resultsDiv.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #6c757d;">No cars found matching your criteria.</div>';
        } else {
            resultsDiv.innerHTML = paginatedCars.map(car => `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="bi bi-car-front-fill"></i>
                            ${car.brand} ${car.model}
                        </h5>
                        <p class="card-text">${car.year} | ${car.color}</p>
                        
                        <div class="accordion">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#car-details-${car.id}">
                                        <i class="bi bi-info-circle"></i> View Details
                                    </button>
                                </h2>
                                <div id="car-details-${car.id}" class="accordion-collapse collapse">
                                    <div class="accordion-body">
                                        <p><strong>Transmission:</strong> ${car.transmission}</p>
                                        <p><strong>Fuel Type:</strong> ${car.fuelType}</p>
                                        <p><strong>Kilometers:</strong> ${car.kilometers.toLocaleString()} km</p>
                                        <p><strong>Description:</strong> ${car.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <p class="price">$${car.price.toLocaleString()}</p>
                    </div>
                </div>
            `).join('');
        }

        this.renderCarPagination(filtered.length, totalPages);
    }

    // Render car pagination
    renderCarPagination(totalItems, totalPages) {
        const paginationNav = document.getElementById('car-pagination');
        if (!paginationNav) return;

        if (totalPages <= 1) {
            paginationNav.innerHTML = '';
            return;
        }

        let html = '<li class="page-item ' + (this.currentCarPage <= 1 ? 'disabled' : '') + '">';
        html += '<a class="page-link" href="#" onclick="app.goToCarPage(' + (this.currentCarPage - 1) + '); return false;"><i class="bi bi-chevron-left"></i></a></li>';

        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentCarPage) {
                html += '<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>';
            } else {
                html += '<li class="page-item"><a class="page-link" href="#" onclick="app.goToCarPage(' + i + '); return false;">' + i + '</a></li>';
            }
        }

        html += '<li class="page-item ' + (this.currentCarPage >= totalPages ? 'disabled' : '') + '">';
        html += '<a class="page-link" href="#" onclick="app.goToCarPage(' + (this.currentCarPage + 1) + '); return false;"><i class="bi bi-chevron-right"></i></a></li>';

        paginationNav.innerHTML = html;
    }

    goToCarPage(page) {
        const filtered = this.getFilteredCars();
        const totalPages = Math.ceil(filtered.length / this.carsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.currentCarPage = page;
            this.renderCarSearchResults();
            document.getElementById('car-search-results')?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Render tire search results
    renderTireSearchResults() {
        const filtered = this.getFilteredTires();
        const totalPages = Math.ceil(filtered.length / this.tiresPerPage);
        const start = (this.currentTirePage - 1) * this.tiresPerPage;
        const paginatedTires = filtered.slice(start, start + this.tiresPerPage);

        const resultsDiv = document.getElementById('tire-search-results');
        if (!resultsDiv) return;

        if (paginatedTires.length === 0) {
            resultsDiv.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #6c757d;">No tires found matching your criteria.</div>';
        } else {
            resultsDiv.innerHTML = paginatedTires.map(tire => `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="bi bi-record-circle" style="color: #6c757d;"></i>
                            ${tire.brand} ${tire.model}
                        </h5>
                        <p class="card-text">${tire.width}/${tire.height}R${tire.wheel}</p>
                        
                        <div class="accordion">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#tire-details-${tire.id}">
                                        <i class="bi bi-info-circle"></i> View Details
                                    </button>
                                </h2>
                                <div id="tire-details-${tire.id}" class="accordion-collapse collapse">
                                    <div class="accordion-body">
                                        <p><strong>Season:</strong> ${tire.season}</p>
                                        <p><strong>Grip Rating:</strong> ${tire.grip}/10</p>
                                        <p><strong>Tread Depth:</strong> ${tire.treadDepth}mm</p>
                                        <p><strong>Description:</strong> ${tire.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <p class="price">$${tire.price.toLocaleString()}</p>
                    </div>
                </div>
            `).join('');
        }

        this.renderTirePagination(filtered.length, totalPages);
    }

    // Render tire pagination
    renderTirePagination(totalItems, totalPages) {
        const paginationNav = document.getElementById('tire-pagination');
        if (!paginationNav) return;

        if (totalPages <= 1) {
            paginationNav.innerHTML = '';
            return;
        }

        let html = '<li class="page-item ' + (this.currentTirePage <= 1 ? 'disabled' : '') + '">';
        html += '<a class="page-link" href="#" onclick="app.goToTirePage(' + (this.currentTirePage - 1) + '); return false;"><i class="bi bi-chevron-left"></i></a></li>';

        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentTirePage) {
                html += '<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>';
            } else {
                html += '<li class="page-item"><a class="page-link" href="#" onclick="app.goToTirePage(' + i + '); return false;">' + i + '</a></li>';
            }
        }

        html += '<li class="page-item ' + (this.currentTirePage >= totalPages ? 'disabled' : '') + '">';
        html += '<a class="page-link" href="#" onclick="app.goToTirePage(' + (this.currentTirePage + 1) + '); return false;"><i class="bi bi-chevron-right"></i></a></li>';

        paginationNav.innerHTML = html;
    }

    goToTirePage(page) {
        const filtered = this.getFilteredTires();
        const totalPages = Math.ceil(filtered.length / this.tiresPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.currentTirePage = page;
            this.renderTireSearchResults();
            document.getElementById('tire-search-results')?.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize app on DOM ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MarketplaceApp();
});
