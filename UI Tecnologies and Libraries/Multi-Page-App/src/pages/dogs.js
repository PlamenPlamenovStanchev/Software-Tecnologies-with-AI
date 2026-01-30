import { getAvailableDogs, getDogById, adoptDog } from '../store.js';

export const DogsPage = {
  render(container) {
    const dogs = getAvailableDogs();

    container.innerHTML = `
      <div class="container py-5">
        <h1 class="mb-4">Our Dogs</h1>
        <p class="lead mb-4">Click on any dog card to view more details, adopt, or purchase</p>
        
        ${dogs.length === 0 ? `
          <div class="alert alert-info" role="alert">
            <h4 class="alert-heading">No dogs available</h4>
            <p>All our wonderful dogs have found their forever homes! Check back soon for new arrivals.</p>
          </div>
        ` : `
          <div class="row g-4">
            ${dogs.map(dog => `
              <div class="col-md-6 col-lg-4">
                <div class="card dog-card h-100 shadow-sm" style="cursor: pointer;" data-dog-id="${dog.id}">
                  <img src="${dog.image}" class="card-img-top" alt="${dog.name}">
                  <div class="card-body">
                    <h5 class="card-title">${dog.name}</h5>
                    <p class="card-text text-muted">${dog.breed}</p>
                    <p class="card-text small">
                      <strong>Age:</strong> ${dog.age} years old
                    </p>
                    ${dog.availableFor === 'buy' ? `
                      <p class="card-text">
                        <strong class="text-success">$${dog.price}</strong>
                      </p>
                    ` : ''}
                    <div class="d-grid gap-2">
                      <button class="btn btn-primary btn-sm view-details-btn">View Details</button>
                      ${dog.availableFor === 'adopt' || dog.availableFor === 'both' ? `
                        <button class="btn btn-success btn-sm adopt-btn">🏡 Adopt</button>
                      ` : ''}
                      ${dog.availableFor === 'buy' || dog.availableFor === 'both' ? `
                        <button class="btn btn-warning btn-sm buy-btn">🛒 Buy $${dog.price}</button>
                      ` : ''}
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}

        <!-- Dog Details Modal -->
        <div class="modal fade" id="dogModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="dogModalLabel"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body" id="dogModalBody">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" id="adoptFromModalBtn" style="display:none;">🏡 Adopt</button>
                <button type="button" class="btn btn-warning" id="buyFromModalBtn" style="display:none;">🛒 Buy</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Adoption Form Modal -->
        <div class="modal fade" id="adoptionModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Adopt <span id="adoptDogName"></span></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form id="adoptionForm">
                  <div class="mb-3">
                    <label for="adopterName" class="form-label">Your Name</label>
                    <input type="text" class="form-control" id="adopterName" required>
                  </div>
                  <div class="mb-3">
                    <label for="adopterEmail" class="form-label">Email</label>
                    <input type="email" class="form-control" id="adopterEmail" required>
                  </div>
                  <div class="mb-3">
                    <label for="adopterPhone" class="form-label">Phone</label>
                    <input type="tel" class="form-control" id="adopterPhone" required>
                  </div>
                  <div class="mb-3">
                    <label for="adopterAddress" class="form-label">Address</label>
                    <textarea class="form-control" id="adopterAddress" rows="2" required></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-success" id="submitAdoptionBtn">Complete Adoption</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Purchase Form Modal -->
        <div class="modal fade" id="purchaseModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Buy <span id="buyDogName"></span></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="alert alert-info">
                  <strong>Price:</strong> $<span id="dogPrice"></span>
                </div>
                <form id="purchaseForm">
                  <div class="mb-3">
                    <label for="buyerName" class="form-label">Your Name</label>
                    <input type="text" class="form-control" id="buyerName" required>
                  </div>
                  <div class="mb-3">
                    <label for="buyerEmail" class="form-label">Email</label>
                    <input type="email" class="form-control" id="buyerEmail" required>
                  </div>
                  <div class="mb-3">
                    <label for="buyerPhone" class="form-label">Phone</label>
                    <input type="tel" class="form-control" id="buyerPhone" required>
                  </div>
                  <div class="mb-3">
                    <label for="buyerAddress" class="form-label">Address</label>
                    <textarea class="form-control" id="buyerAddress" rows="2" required></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="cardNumber" class="form-label">Card Number</label>
                    <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-warning" id="submitPurchaseBtn">Complete Purchase</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const dogModalEl = document.getElementById('dogModal');
    const adoptionModalEl = document.getElementById('adoptionModal');
    const purchaseModalEl = document.getElementById('purchaseModal');
    let currentDogId = null;

    // Handle view details button
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('view-details-btn')) {
        const card = e.target.closest('[data-dog-id]');
        const dogId = parseInt(card.dataset.dogId);
        const dog = getDogById(dogId);
        
        if (dog) {
          showDogModal(dog);
        }
      }
    });

    // Handle adopt button from cards
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('adopt-btn')) {
        const card = e.target.closest('[data-dog-id]');
        currentDogId = parseInt(card.dataset.dogId);
        const dog = getDogById(currentDogId);
        if (dog && (dog.availableFor === 'adopt' || dog.availableFor === 'both')) {
          showAdoptionForm(dog);
        } else {
          alert('This dog is not available for adoption');
        }
      }
    });

    // Handle buy button from cards
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('buy-btn')) {
        const card = e.target.closest('[data-dog-id]');
        currentDogId = parseInt(card.dataset.dogId);
        const dog = getDogById(currentDogId);
        if (dog && (dog.availableFor === 'buy' || dog.availableFor === 'both')) {
          showPurchaseForm(dog);
        } else {
          alert('This dog is not available for purchase');
        }
      }
    });

    // Handle adopt button from modal
    document.getElementById('adoptFromModalBtn')?.addEventListener('click', () => {
      const dog = getDogById(currentDogId);
      if (dog && (dog.availableFor === 'adopt' || dog.availableFor === 'both')) {
        bootstrap.Modal.getInstance(dogModalEl).hide();
        showAdoptionForm(dog);
      } else {
        alert('This dog is not available for adoption');
      }
    });

    // Handle buy button from modal
    document.getElementById('buyFromModalBtn')?.addEventListener('click', () => {
      const dog = getDogById(currentDogId);
      if (dog && (dog.availableFor === 'buy' || dog.availableFor === 'both')) {
        bootstrap.Modal.getInstance(dogModalEl).hide();
        showPurchaseForm(dog);
      } else {
        alert('This dog is not available for purchase');
      }
    });

    // Handle adoption submission
    document.getElementById('submitAdoptionBtn')?.addEventListener('click', () => {
      const form = document.getElementById('adoptionForm');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const adoptionDetails = {
        adopterName: document.getElementById('adopterName').value,
        adopterEmail: document.getElementById('adopterEmail').value,
        adopterPhone: document.getElementById('adopterPhone').value,
        adopterAddress: document.getElementById('adopterAddress').value
      };

      adoptDog(currentDogId, adoptionDetails);
      bootstrap.Modal.getInstance(adoptionModalEl).hide();
      
      alert('🎉 Congratulations! You have successfully adopted a dog! Redirecting...');
      window.location.reload();
    });

    // Handle purchase submission
    document.getElementById('submitPurchaseBtn')?.addEventListener('click', () => {
      const form = document.getElementById('purchaseForm');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const { buyDog } = require('../store.js');
      const purchaseDetails = {
        buyerName: document.getElementById('buyerName').value,
        buyerEmail: document.getElementById('buyerEmail').value,
        buyerPhone: document.getElementById('buyerPhone').value,
        buyerAddress: document.getElementById('buyerAddress').value,
        cardNumber: '****' + document.getElementById('cardNumber').value.slice(-4)
      };

      import('../store.js').then(module => {
        module.buyDog(currentDogId, purchaseDetails);
        bootstrap.Modal.getInstance(purchaseModalEl).hide();
        alert('🎉 Purchase successful! You now own a dog! Redirecting...');
        window.location.reload();
      });
    });
  }
};

function showDogModal(dog) {
  const modalLabel = document.getElementById('dogModalLabel');
  const modalBody = document.getElementById('dogModalBody');
  const adoptBtn = document.getElementById('adoptFromModalBtn');
  const buyBtn = document.getElementById('buyFromModalBtn');
  
  modalLabel.textContent = dog.name;
  modalBody.innerHTML = `
    <img src="${dog.image}" class="img-fluid rounded mb-3" alt="${dog.name}">
    <p><strong>Breed:</strong> ${dog.breed}</p>
    <p><strong>Age:</strong> ${dog.age} years old</p>
    ${dog.availableFor === 'buy' || dog.availableFor === 'both' ? `
      <p><strong>Price:</strong> <span class="text-success">$${dog.price}</span></p>
    ` : ''}
    <p><strong>Description:</strong></p>
    <p>${dog.description}</p>
  `;
  
  // Show/hide buttons based on availability
  if (dog.availableFor === 'adopt' || dog.availableFor === 'both') {
    adoptBtn.style.display = 'block';
  } else {
    adoptBtn.style.display = 'none';
  }
  
  if (dog.availableFor === 'buy' || dog.availableFor === 'both') {
    buyBtn.style.display = 'block';
  } else {
    buyBtn.style.display = 'none';
  }
  
  const modal = new bootstrap.Modal(document.getElementById('dogModal'));
  modal.show();
}

function showAdoptionForm(dog) {
  document.getElementById('adoptDogName').textContent = dog.name;
  document.getElementById('adoptionForm').reset();
  
  const modal = new bootstrap.Modal(document.getElementById('adoptionModal'));
  modal.show();
}

function showPurchaseForm(dog) {
  document.getElementById('buyDogName').textContent = dog.name;
  document.getElementById('dogPrice').textContent = dog.price;
  document.getElementById('purchaseForm').reset();
  
  const modal = new bootstrap.Modal(document.getElementById('purchaseModal'));
  modal.show();
}
