import { getAllDogs, addDog, updateDog, deleteDog, getDogById } from '../store.js';

export const AdminPage = {
  render(container) {
    container.innerHTML = `
      <div class="container-fluid py-5">
        <div class="row mb-4">
          <div class="col">
            <h1>Admin Dashboard</h1>
            <p class="text-muted">Manage dogs in the database</p>
          </div>
          <div class="col-auto">
            <button class="btn btn-success btn-lg" id="addNewDogBtn">+ Add New Dog</button>
          </div>
        </div>

        <!-- Dogs Table -->
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Breed</th>
                <th>Age</th>
                <th>Type</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="dogsTableBody">
            </tbody>
          </table>
        </div>

        <!-- Add/Edit Dog Modal -->
        <div class="modal fade" id="dogFormModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="formModalLabel">Add New Dog</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form id="dogForm">
                  <input type="hidden" id="dogId">
                  
                  <div class="mb-3">
                    <label for="dogName" class="form-label">Name</label>
                    <input type="text" class="form-control" id="dogName" required>
                  </div>

                  <div class="mb-3">
                    <label for="dogBreed" class="form-label">Breed</label>
                    <input type="text" class="form-control" id="dogBreed" required>
                  </div>

                  <div class="mb-3">
                    <label for="dogAge" class="form-label">Age (years)</label>
                    <input type="number" class="form-control" id="dogAge" min="0" required>
                  </div>

                  <div class="mb-3">
                    <label for="dogDescription" class="form-label">Description</label>
                    <textarea class="form-control" id="dogDescription" rows="4" required></textarea>
                  </div>

                  <div class="mb-3">
                    <label for="dogImage" class="form-label">Image URL</label>
                    <input type="url" class="form-control" id="dogImage" required>
                  </div>

                  <div class="mb-3">
                    <label for="availableFor" class="form-label">Availability</label>
                    <select class="form-select" id="availableFor" required>
                      <option value="">Select an option</option>
                      <option value="adopt">Free for Adoption</option>
                      <option value="buy">For Sale (Purchase)</option>
                    </select>
                  </div>

                  <div class="mb-3" id="priceField" style="display: none;">
                    <label for="dogPrice" class="form-label">Price ($)</label>
                    <input type="number" class="form-control" id="dogPrice" min="0" step="0.01">
                  </div>

                  <div class="mb-0">
                    <img id="imagePreview" class="img-fluid rounded" style="max-height: 200px; display: none;" alt="Preview">
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="saveDogBtn">Save Dog</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Confirmation Modal -->
        <div class="modal fade" id="confirmDeleteModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header bg-danger text-white">
                <h5 class="modal-title">Confirm Deletion</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to delete <strong id="deleteDogName"></strong>?</p>
                <p class="text-muted">This action cannot be undone.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    loadDogsTable();
    setupEventListeners();
  }
};

function loadDogsTable() {
  const dogs = getAllDogs();
  const tbody = document.getElementById('dogsTableBody');
  
  tbody.innerHTML = dogs.map(dog => `
    <tr>
      <td>${dog.id}</td>
      <td><strong>${dog.name}</strong></td>
      <td>${dog.breed}</td>
      <td>${dog.age}</td>
      <td>
        <span class="badge ${dog.availableFor === 'adopt' ? 'bg-success' : 'bg-warning text-dark'}">
          ${dog.availableFor === 'adopt' ? '🏡 Adoption' : '💰 For Sale'}
        </span>
      </td>
      <td>${dog.availableFor === 'buy' ? '$' + dog.price : 'Free'}</td>
      <td class="text-truncate" style="max-width: 200px;">${dog.description}</td>
      <td>
        <button class="btn btn-sm btn-info edit-btn" data-dog-id="${dog.id}">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn" data-dog-id="${dog.id}">Delete</button>
      </td>
    </tr>
  `).join('');
}

function setupEventListeners() {
  // Add new dog
  document.getElementById('addNewDogBtn')?.addEventListener('click', openAddDogForm);
  
  // Save dog
  document.getElementById('saveDogBtn')?.addEventListener('click', saveDog);
  
  // Availability dropdown change
  document.getElementById('availableFor')?.addEventListener('change', (e) => {
    const priceField = document.getElementById('priceField');
    if (e.target.value === 'buy') {
      priceField.style.display = 'block';
      document.getElementById('dogPrice').required = true;
    } else {
      priceField.style.display = 'none';
      document.getElementById('dogPrice').required = false;
    }
  });
  
  // Edit dog
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
      const dogId = parseInt(e.target.dataset.dogId);
      openEditDogForm(dogId);
    }
  });
  
  // Delete dog
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const dogId = parseInt(e.target.dataset.dogId);
      openDeleteConfirmation(dogId);
    }
  });
  
  // Confirm delete
  document.getElementById('confirmDeleteBtn')?.addEventListener('click', confirmDelete);
  
  // Image preview
  document.getElementById('dogImage')?.addEventListener('change', (e) => {
    const preview = document.getElementById('imagePreview');
    if (e.target.value) {
      preview.src = e.target.value;
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
    }
  });
}

function openAddDogForm() {
  document.getElementById('dogId').value = '';
  document.getElementById('dogForm').reset();
  document.getElementById('formModalLabel').textContent = 'Add New Dog';
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('priceField').style.display = 'none';
  
  const modal = new bootstrap.Modal(document.getElementById('dogFormModal'));
  modal.show();
}

function openEditDogForm(dogId) {
  const dog = getDogById(dogId);
  if (!dog) return;
  
  document.getElementById('dogId').value = dog.id;
  document.getElementById('dogName').value = dog.name;
  document.getElementById('dogBreed').value = dog.breed;
  document.getElementById('dogAge').value = dog.age;
  document.getElementById('dogDescription').value = dog.description;
  document.getElementById('dogImage').value = dog.image;
  document.getElementById('availableFor').value = dog.availableFor;
  document.getElementById('dogPrice').value = dog.price || '';
  
  // Show/hide price field based on availability
  const priceField = document.getElementById('priceField');
  if (dog.availableFor === 'buy') {
    priceField.style.display = 'block';
  } else {
    priceField.style.display = 'none';
  }
  
  const preview = document.getElementById('imagePreview');
  preview.src = dog.image;
  preview.style.display = 'block';
  
  document.getElementById('formModalLabel').textContent = `Edit ${dog.name}`;
  
  const modal = new bootstrap.Modal(document.getElementById('dogFormModal'));
  modal.show();
}

function saveDog() {
  const dogId = document.getElementById('dogId').value;
  const form = document.getElementById('dogForm');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  const availableFor = document.getElementById('availableFor').value;
  let price = 0;
  
  if (availableFor === 'buy') {
    price = parseFloat(document.getElementById('dogPrice').value);
    if (!price || price <= 0) {
      alert('Please enter a valid price for purchase dogs');
      return;
    }
  }
  
  const dogData = {
    name: document.getElementById('dogName').value,
    breed: document.getElementById('dogBreed').value,
    age: parseInt(document.getElementById('dogAge').value),
    description: document.getElementById('dogDescription').value,
    image: document.getElementById('dogImage').value,
    availableFor: availableFor,
    price: price
  };
  
  if (dogId) {
    updateDog(parseInt(dogId), dogData);
  } else {
    addDog(dogData);
  }
  
  bootstrap.Modal.getInstance(document.getElementById('dogFormModal')).hide();
  loadDogsTable();
  setupEventListeners();
}

function openDeleteConfirmation(dogId) {
  const dog = getDogById(dogId);
  if (!dog) return;
  
  document.getElementById('deleteDogName').textContent = dog.name;
  document.getElementById('confirmDeleteBtn').dataset.dogId = dogId;
  
  const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  modal.show();
}

function confirmDelete() {
  const dogId = parseInt(document.getElementById('confirmDeleteBtn').dataset.dogId);
  deleteDog(dogId);
  
  bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal')).hide();
  loadDogsTable();
  setupEventListeners();
}
