
// Initialize Supabase Client
// NOTE: Ideally these should be environment variables, but for a simple HTML demo we'll place them here.
// Replace with your actual project details if they differ.
const SUPABASE_URL = 'https://vyfupxerookjtugfdpwz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZnVweGVyb29ranR1Z2ZkcHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNzg2NjYsImV4cCI6MjA4NTk1NDY2Nn0.tj70DK78249Keuhh_QNINX3TYz-BGcaKETk5Aw2wq68';

// We'll prompt user for these or they need to edit the file.
// For this environment, I'll insert a placeholder and show how to get them.
// Since I can't interactively ask the user for keys in this loop easily without blocking,
// I will create the logic and ask the user to input their keys in the file.

let supabaseClient;

// State management
let currentDeleteId = null;
let currentDeleteType = null; // 'department' or 'employee'
let selectionCallback = null;

// DOM Elements
const departmentsTableBody = document.getElementById('departments-list');
const employeesTableBody = document.getElementById('employees-list');
const deptLoading = document.getElementById('departments-loading');
const empLoading = document.getElementById('employees-loading');
const toastElement = document.getElementById('toast');

// --- Initialization ---

function initApp() {
    // Check if configuration is set
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        alert('Please config app.js with your Supabase URL and Anon Key!');
        return;
    }

    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Initial Load
    fetchDepartments();
    fetchEmployees();
}

// --- Tab Logic ---

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    // Show selected
    document.getElementById(`${tabName}-tab`).classList.add('active');
    // Find button (simple logic for now)
    const btns = document.querySelectorAll('.tab-btn');
    if(tabName === 'departments') btns[0].classList.add('active');
    else btns[1].classList.add('active');

    // Refresh data
    if (tabName === 'departments') fetchDepartments();
    else fetchEmployees();
}

// --- Data Fetching ---

async function fetchDepartments() {
    deptLoading.classList.remove('hidden');
    departmentsTableBody.innerHTML = '';

    const { data: departments, error } = await supabaseClient
        .from('departments')
        .select(`
            *,
            manager:manager_id (id, name)
        `)
        .order('name');

    deptLoading.classList.add('hidden');

    if (error) {
        showToast('Error loading departments: ' + error.message, true);
        return;
    }

    renderDepartments(departments);
}

async function fetchEmployees() {
    empLoading.classList.remove('hidden');
    employeesTableBody.innerHTML = '';

    const { data: employees, error } = await supabaseClient
        .from('employees')
        .select(`
            *,
            department:department_id (id, name),
            manager:manager_id (id, name, job_title)
        `)
        .order('name');

    empLoading.classList.add('hidden');

    if (error) {
        showToast('Error loading employees: ' + error.message, true);
        return;
    }

    renderEmployees(employees);
}

// --- Rendering ---

function renderDepartments(departments) {
    if (departments.length === 0) {
        departmentsTableBody.innerHTML = '<tr><td colspan="4" class="text-muted" style="text-align:center">No departments found.</td></tr>';
        return;
    }

    departmentsTableBody.innerHTML = departments.map(dept => `
        <tr>
            <td><strong>${escapeHtml(dept.name)}</strong></td>
            <td>${escapeHtml(dept.description || '-')}</td>
            <td>${dept.manager ? `<i class="fa-solid fa-user-tie"></i> ${escapeHtml(dept.manager.name)}` : '<span class="text-muted">None</span>'}</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-secondary btn-sm" onclick="editDepartment(${dept.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDelete('department', ${dept.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderEmployees(employees) {
    if (employees.length === 0) {
        employeesTableBody.innerHTML = '<tr><td colspan="6" class="text-muted" style="text-align:center">No employees found.</td></tr>';
        return;
    }

    employeesTableBody.innerHTML = employees.map(emp => `
        <tr>
            <td>
                <strong>${escapeHtml(emp.name)}</strong>
                ${emp.manager ? `<div class="small text-muted">Manager: ${escapeHtml(emp.manager.name)}</div>` : ''}
            </td>
            <td>${escapeHtml(emp.job_title)}</td>
            <td>${emp.department ? `<span class="badge">${escapeHtml(emp.department.name)}</span>` : '<span class="text-muted">-</span>'}</td>
            <td>${emp.manager ? escapeHtml(emp.manager.name) : '<span class="text-muted">None (Top Level)</span>'}</td>
            <td>
                ${emp.email ? `<div><i class="fa-solid fa-envelope"></i> ${escapeHtml(emp.email)}</div>` : ''}
                ${emp.phone ? `<div><i class="fa-solid fa-phone"></i> ${escapeHtml(emp.phone)}</div>` : ''}
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-secondary btn-sm" onclick="editEmployee(${emp.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDelete('employee', ${emp.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// --- CRUD: Department ---

function openDepartmentModal(isEdit = false) {
    document.getElementById('department-modal').classList.add('show');
    document.getElementById('dept-modal-title').textContent = isEdit ? 'Edit Department' : 'Add Department';
    
    if (!isEdit) {
        // Reset form
        document.getElementById('dept-id').value = '';
        document.getElementById('dept-name').value = '';
        document.getElementById('dept-description').value = '';
        clearSelection('dept-manager');
    }
}

async function editDepartment(id) {
    const { data: dept, error } = await supabaseClient.from('departments').select('*, manager:manager_id(id, name)').eq('id', id).single();
    if (error) return showToast(error.message, true);

    openDepartmentModal(true);
    document.getElementById('dept-id').value = dept.id;
    document.getElementById('dept-name').value = dept.name;
    document.getElementById('dept-description').value = dept.description || '';
    
    if (dept.manager) {
        setSelection('dept-manager', dept.manager.id, dept.manager.name);
    } else {
        clearSelection('dept-manager');
    }
}

async function saveDepartment() {
    const id = document.getElementById('dept-id').value;
    const name = document.getElementById('dept-name').value;
    const description = document.getElementById('dept-description').value;
    const manager_id = document.getElementById('dept-manager-id').value || null;

    if (!name) return showToast('Department Name is required', true);

    const payload = { name, description, manager_id };
    
    let error;
    if (id) {
        // Update
        ({ error } = await supabaseClient.from('departments').update(payload).eq('id', id));
    } else {
        // Insert
        ({ error } = await supabaseClient.from('departments').insert([payload]));
    }

    if (error) {
        showToast('Error saving department: ' + error.message, true);
    } else {
        showToast('Department saved successfully!');
        closeModal('department-modal');
        fetchDepartments();
    }
}

// --- CRUD: Employee ---

function openEmployeeModal(isEdit = false) {
    document.getElementById('employee-modal').classList.add('show');
    document.getElementById('emp-modal-title').textContent = isEdit ? 'Edit Employee' : 'Add Employee';

    if (!isEdit) {
        // Reset form
        document.getElementById('emp-id').value = '';
        document.getElementById('emp-name').value = '';
        document.getElementById('emp-job').value = '';
        document.getElementById('emp-email').value = '';
        document.getElementById('emp-phone').value = '';
        clearSelection('emp-dept');
        clearSelection('emp-manager');
    }
}

async function editEmployee(id) {
    const { data: emp, error } = await supabaseClient
        .from('employees')
        .select(`*, department:department_id(id, name), manager:manager_id(id, name)`)
        .eq('id', id)
        .single();
    
    if (error) return showToast(error.message, true);

    openEmployeeModal(true);
    document.getElementById('emp-id').value = emp.id;
    document.getElementById('emp-name').value = emp.name;
    document.getElementById('emp-job').value = emp.job_title;
    document.getElementById('emp-email').value = emp.email || '';
    document.getElementById('emp-phone').value = emp.phone || '';

    if (emp.department) setSelection('emp-dept', emp.department.id, emp.department.name);
    else clearSelection('emp-dept');

    if (emp.manager) setSelection('emp-manager', emp.manager.id, emp.manager.name);
    else clearSelection('emp-manager');
}

async function saveEmployee() {
    const id = document.getElementById('emp-id').value;
    const name = document.getElementById('emp-name').value;
    const job_title = document.getElementById('emp-job').value;
    const email = document.getElementById('emp-email').value || null; // Convert empty string to null for DB unique constraints
    const phone = document.getElementById('emp-phone').value || null;
    const department_id = document.getElementById('emp-dept-id').value || null;
    const manager_id = document.getElementById('emp-manager-id').value || null;

    if (!name || !job_title) return showToast('Name and Job Title are required', true);

    const payload = { name, job_title, email, phone, department_id, manager_id };

    let error;
    if (id) {
        ({ error } = await supabaseClient.from('employees').update(payload).eq('id', id));
    } else {
        ({ error } = await supabaseClient.from('employees').insert([payload]));
    }

    if (error) {
        showToast('Error saving employee: ' + error.message, true);
    } else {
        showToast('Employee saved successfully!');
        closeModal('employee-modal');
        fetchEmployees();
    }
}

// --- Deletion Logic ---

function confirmDelete(type, id) {
    currentDeleteId = id;
    currentDeleteType = type;
    document.getElementById('delete-modal').classList.add('show');
}

document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
    if (!currentDeleteId) return;

    let table = currentDeleteType === 'department' ? 'departments' : 'employees';
    
    // NOTE: Foreign keys are set to "ON DELETE SET NULL" in our schema, 
    // so Supabase/Postgres handles the cleanup of relations automatically!
    const { error } = await supabaseClient.from(table).delete().eq('id', currentDeleteId);

    if (error) {
        showToast('Error deleting item: ' + error.message, true);
    } else {
        showToast('Item deleted successfully.');
        closeModal('delete-modal');
        if (currentDeleteType === 'department') fetchDepartments();
        else fetchEmployees();
    }
});

// --- Selection Modal Logic ---

async function openSelectionModal(type, targetInfos) {
    // type: 'employee' | 'department'
    // targetInfos: prefix for input ids, e.g., 'dept-manager'

    document.getElementById('selection-modal').classList.add('show');
    document.getElementById('selection-title').textContent = type === 'employee' ? 'Select Employee' : 'Select Department';
    
    const list = document.getElementById('selection-list');
    list.innerHTML = '<li class="selection-item">Loading...</li>';
    document.getElementById('selection-search').value = '';

    let data;
    if (type === 'employee') {
        const { data: emps } = await supabaseClient.from('employees').select('id, name, job_title').order('name');
        data = emps.map(e => ({ id: e.id, header: e.name, sub: e.job_title }));
    } else {
        const { data: depts } = await supabaseClient.from('departments').select('id, name').order('name');
        data = depts.map(d => ({ id: d.id, header: d.name, sub: '' }));
    }

    // store for searching
    list.dataset.items = JSON.stringify(data);
    renderSelectionList(data, targetInfos);
}

function renderSelectionList(items, targetPrefix) {
    const list = document.getElementById('selection-list');
    
    if (items.length === 0) {
        list.innerHTML = '<li class="selection-item">No items found.</li>';
        return;
    }

    list.innerHTML = items.map(item => `
        <li class="selection-item" onclick="selectItem('${targetPrefix}', ${item.id}, '${escapeHtml(item.header)}')">
            <div class="selection-item-main">${escapeHtml(item.header)}</div>
            ${item.sub ? `<div class="selection-item-sub">${escapeHtml(item.sub)}</div>` : ''}
        </li>
    `).join('');
}

function filterSelectionList() {
    const term = document.getElementById('selection-search').value.toLowerCase();
    const data = JSON.parse(document.getElementById('selection-list').dataset.items || '[]');
    
    const filtered = data.filter(item => 
        item.header.toLowerCase().includes(term) || 
        item.sub.toLowerCase().includes(term)
    );
    
    // Should pass the original targetPrefix.. but we lost it in lexical scope.
    // Hack: we'll regex it out of the onclick of the first item if possible, or store it in dataset.
    // Better way: Store targetPrefix in the modal dataset.
    // For now, let's just make sure selectItem works.
    // Re-rendering implies we need the targetPrefix again. 
    // Let's store targetPrefix on the list element too.
    const targetPrefix = document.getElementById('selection-list').dataset.target;
    renderSelectionList(filtered, targetPrefix);
}

// Enhance openSelectionModal to store target
const originalOpen = openSelectionModal;
openSelectionModal = function(type, targetInfos) {
    document.getElementById('selection-list').dataset.target = targetInfos;
    return originalOpen(type, targetInfos);
};

function selectItem(prefix, id, name) {
    setSelection(prefix, id, name);
    closeModal('selection-modal');
}

function setSelection(prefix, id, name) {
    document.getElementById(`${prefix}-id`).value = id;
    document.getElementById(`${prefix}-display`).value = name;
}

function clearSelection(prefix) {
    document.getElementById(`${prefix}-id`).value = '';
    document.getElementById(`${prefix}-display`).value = '';
}

// --- Utils ---

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function showToast(message, isError = false) {
    toastElement.textContent = message;
    toastElement.style.backgroundColor = isError ? '#ef4444' : '#333';
    toastElement.classList.add('show');
    setTimeout(() => {
        toastElement.classList.remove('show');
    }, 3000);
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initApp);

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}
