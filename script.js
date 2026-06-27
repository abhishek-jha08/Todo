// Select DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// State variables
let tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', renderTasks);

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
clearCompletedBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active class on buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Set current filter and re-render
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

// Functions
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return alert('Please enter a task!');

    const newTask = {
        id: Date.now(), // Unique ID based on timestamp
        text: text,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    saveAndRender();
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

function editTask(id, oldText) {
    const newText = prompt("Edit your task:", oldText);
    if (newText !== null && newText.trim() !== "") {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, text: newText.trim() } : task
        );
        saveAndRender();
    }
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = ''; // Clear current list

    // Filter tasks based on selection
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Update active task count
    const activeTasksCount = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${activeTasksCount} item${activeTasksCount !== 1 ? 's' : ''} left`;

    // Create DOM elements for filtered tasks
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        const span = document.createElement('span');
        span.classList.add('task-text');
        span.textContent = task.text;
        span.addEventListener('click', () => toggleTask(task.id));

        const actionButtons = document.createElement('div');
        actionButtons.classList.add('action-buttons');

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', () => editTask(task.id, task.text));

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        actionButtons.appendChild(editBtn);
        actionButtons.appendChild(deleteBtn);
        li.appendChild(span);
        li.appendChild(actionButtons);
        taskList.appendChild(li);
    });
}

// --- NEW: Theme Toggle Logic ---
// Check if they previously enabled dark mode
const savedTheme = localStorage.getItem('todoTheme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

// Listen for clicks on the toggle button
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Check if dark mode is now active and update icon/storage
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('todoTheme', 'dark');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('todoTheme', 'light');
    }
});