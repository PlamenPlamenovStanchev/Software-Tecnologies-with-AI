document.addEventListener('DOMContentLoaded', function() {
    const breeds = [
        { name: 'Golden Retriever', description: 'Friendly, intelligent, and devoted.', image: 'images/Golden Retriever.webp' },
        { name: 'German Shepherd', description: 'Confident, courageous, and smart.', image: 'images/German Shepherd.webp' },
        { name: 'Labrador Retriever', description: 'Outgoing, even-tempered, and gentle.', image: 'images/Labrador Retriever.jpg' },
        { name: 'Beagle', description: 'Merry, friendly, and curious.', image: 'images/Beagle.webp' },
        { name: 'Poodle', description: 'Proud, active, and very smart.', image: 'images/Poodle.jpg' },
        { name: 'Bulldog', description: 'Docile, willful, and friendly.', image: 'images/Bulldog.jpg' }
    ];

    const breedsContainer = document.getElementById('breeds-container');
    const featuredCarousel = document.querySelector('#featuredCarousel .carousel-inner');

    function createBreedCard(breed) {
        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${breed.image}" class="card-img-top breed-image" alt="${breed.name}">
                    <div class="card-body">
                        <h5 class="card-title">${breed.name}</h5>
                        <p class="card-text">${breed.description}</p>
                        <a href="#" class="btn btn-primary">Learn More</a>
                    </div>
                </div>
            </div>
        `;
    }

    breeds.forEach(breed => {
        breedsContainer.innerHTML += createBreedCard(breed);
    });

    breeds.slice(0, 3).forEach((breed, index) => {
        const activeClass = index === 0 ? 'active' : '';
        featuredCarousel.innerHTML += `
            <div class="carousel-item ${activeClass}">
                <img src="${breed.image}" class="d-block w-100" alt="${breed.name}">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${breed.name}</h5>
                    <p>${breed.description}</p>
                </div>
            </div>
        `;
    });
});
