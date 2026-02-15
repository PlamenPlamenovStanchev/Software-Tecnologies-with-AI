// Initialize Supabase client
const supabaseUrl = 'https://ihbwtmfjhunmjzcfekag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloYnd0bWZqaHVubWp6Y2Zla2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTYwODIsImV4cCI6MjA4NjczMjA4Mn0._9qkBY95CVUFZniQ9MGaWzMbkazb6euKwo56hU_HvbY';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const userEmailSpan = document.getElementById('user-email');
const taskList = document.getElementById('task-list');
const authMessage = document.getElementById('auth-message');
const loadingSpinner = document.getElementById('loading-spinner');

// Authentication Functions
async function signUp() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (!email || !password) {
        authMessage.textContent = 'Please enter both email and password.';
        authMessage.className = 'mt-3 text-center text-danger';
        return;
    }
    
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password
        });
        
        if (error) throw error;

        // Check if user is already confirmed (e.g. if email confirmation is disabled)
        if (data.session) {
             authMessage.textContent = 'Registration successful! Logging in...';
             authMessage.className = 'mt-3 text-center text-success';
             checkUser();
        } else {
            authMessage.textContent = 'Check your email for the confirmation link!';
            authMessage.className = 'mt-3 text-center text-success';
        }

    } catch (error) {
        console.error("Sign up error:", error);
        authMessage.textContent = error.message;
        authMessage.className = 'mt-3 text-center text-danger';
    }
}

async function signIn() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        checkUser();
    } catch (error) {
        authMessage.textContent = error.message;
        authMessage.className = 'mt-3 text-center text-danger';
    }
}

async function signOut() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        checkUser();
    } catch (error) {
        console.error('Error signing out:', error.message);
    }
}

// User Session Check
async function checkUser() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (session) {
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
        userEmailSpan.textContent = session.user.email;
        fetchTasks();
    } else {
        authContainer.style.display = 'block';
        appContainer.style.display = 'none';
        taskList.innerHTML = '';
    }
}

// Task Management Functions
async function fetchTasks() {
    loadingSpinner.style.display = 'block';
    taskList.innerHTML = '';
    
    try {
        const { data: tasks, error } = await supabaseClient
            .from('tasks')
            .select('*')
            .order('inserted_at', { ascending: false });
            
        if (error) throw error;
        
        tasks.forEach(task => {
            renderTask(task);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

async function addTask() {
    const taskInput = document.getElementById('new-task-input');
    const taskText = taskInput.value;
    
    if (!taskText) return;
    
    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        const { data, error } = await supabaseClient
            .from('tasks')
            .insert([
                { user_id: user.id, task: taskText }
            ])
            .select();
            
        if (error) throw error;
        
        taskInput.value = '';
        renderTask(data[0], true); // true = prepend to list
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
        modal.hide();
        
    } catch (error) {
        console.error('Error adding task:', error.message);
        alert('Error adding task: ' + error.message);
    }
}

async function toggleTask(id, isComplete) {
    try {
        const { error } = await supabaseClient
            .from('tasks')
            .update({ is_complete: !isComplete })
            .eq('id', id);
            
        if (error) throw error;
        
        // Optimistically update UI
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
            const textCell = row.querySelector('.task-text');
            const checkIcon = row.querySelector('.check-icon');
            const btn = row.querySelector('.btn-toggle');
            
            if (!isComplete) {
                textCell.classList.add('completed-task');
                checkIcon.className = 'bi bi-check-circle-fill check-icon text-success';
                btn.className = 'btn btn-sm btn-outline-warning me-1 btn-toggle';
                btn.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';
                btn.title = "Undo";
                btn.setAttribute('onclick', `toggleTask(${id}, true)`);
            } else {
                textCell.classList.remove('completed-task');
                checkIcon.className = 'bi bi-circle check-icon text-secondary';
                btn.className = 'btn btn-sm btn-outline-success me-1 btn-toggle';
                btn.innerHTML = '<i class="bi bi-check-lg"></i>';
                btn.title = "Complete";
                btn.setAttribute('onclick', `toggleTask(${id}, false)`);
            }
        }
    } catch (error) {
        console.error('Error updating task:', error.message);
        fetchTasks(); // Revert on error
    }
}

// Edit Task Logic
let taskToEditId = null;

function openEditModal(id, currentText) {
    taskToEditId = id;
    document.getElementById('edit-task-input').value = currentText;
    document.getElementById('edit-task-id').value = id;
    const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
    modal.show();
}

async function saveEditTask() {
    const newText = document.getElementById('edit-task-input').value;
    if (!newText || !taskToEditId) return;

    try {
        const { error } = await supabaseClient
            .from('tasks')
            .update({ task: newText })
            .eq('id', taskToEditId);

        if (error) throw error;

        // Update UI
        const row = document.querySelector(`tr[data-id="${taskToEditId}"]`);
        if (row) {
            row.querySelector('.task-text').textContent = newText;
            const editBtn = row.querySelector('.btn-edit');
            const escapedText = newText.replace(/'/g, "\\'");
            editBtn.setAttribute('onclick', `openEditModal(${taskToEditId}, '${escapedText}')`);
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
        modal.hide();
    } catch (error) {
        console.error('Error editing task:', error.message);
        alert(error.message);
    }
}


// Delete Task Logic using Confirm Modal
let taskToDeleteId = null;

function openDeleteModal(id, taskText) {
    taskToDeleteId = id;
    document.getElementById('delete-task-preview').textContent = `"${taskText}"`;
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    modal.show();
}

async function confirmDeleteTask() {
    if (!taskToDeleteId) return;
    
    try {
        const { error } = await supabaseClient
            .from('tasks')
            .delete()
            .eq('id', taskToDeleteId);
            
        if (error) throw error;
        
        // Remove from UI
        const row = document.querySelector(`tr[data-id="${taskToDeleteId}"]`);
        if (row) row.remove();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
        modal.hide();
    } catch (error) {
        console.error('Error deleting task:', error.message);
        alert(error.message);
    }
}

function renderTask(task, prepend = false) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', task.id);
    tr.className = 'align-middle';
    
    // Format Date
    const date = new Date(task.inserted_at).toLocaleDateString() + ' ' + new Date(task.inserted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Status Icon
    const statusIcon = task.is_complete 
        ? '<i class="bi bi-check-circle-fill check-icon text-success"></i>' 
        : '<i class="bi bi-circle check-icon text-secondary"></i>';
        
    // Task Class
    const taskClass = task.is_complete ? 'task-text completed-task' : 'task-text';

    // Toggle Button
    const toggleBtn = task.is_complete
        ? `<button class="btn btn-sm btn-outline-warning me-1 btn-toggle" onclick="toggleTask(${task.id}, true)" title="Undo"><i class="bi bi-arrow-counterclockwise"></i></button>`
        : `<button class="btn btn-sm btn-outline-success me-1 btn-toggle" onclick="toggleTask(${task.id}, false)" title="Complete"><i class="bi bi-check-lg"></i></button>`;

    // Escape text for attribute
    const escapedTaskText = task.task.replace(/'/g, "\\'");

    tr.innerHTML = `
        <td class="text-center fs-5">${statusIcon}</td>
        <td><span class="${taskClass}">${task.task}</span></td>
        <td class="text-muted small">${date}</td>
        <td class="text-end">
            ${toggleBtn}
            <button class="btn btn-sm btn-outline-primary me-1 btn-edit" onclick="openEditModal(${task.id}, '${escapedTaskText}')" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-outline-danger" onclick="openDeleteModal(${task.id}, '${escapedTaskText}')" title="Delete"><i class="bi bi-trash"></i></button>
        </td>
    `;
    
    if (prepend) {
        taskList.prepend(tr);
    } else {
        taskList.appendChild(tr);
    }
}

function filterTasks() {
    const input = document.getElementById('search-input');
    const filter = input.value.toLowerCase();
    const rows = taskList.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const span = rows[i].querySelector('.task-text');
        if (span) {
            const txtValue = span.textContent || span.innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

// Check user on load
checkUser();
