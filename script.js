// Select DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Load tasks from local storage when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Event listener for adding a task via button click
addBtn.addEventListener('click', addTask);

// Event listener for adding a task via 'Enter' key
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    // Create list item
    const li = document.createElement('li');
    
    // Create span for text (makes it easier to click and toggle)
    const span = document.createElement('span');
    span.classList.add('task-text');
    span.textContent = taskText;
    
    // Toggle completion when clicking the text
    span.addEventListener('click', function() {
        li.classList.toggle('completed');
        saveData();
    });

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.classList.add('delete-btn');
    
    // Delete task event
    deleteBtn.addEventListener('click', function() {
        li.remove();
        saveData();
    });

    // Append elements
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Clear input and save
    taskInput.value = '';
    saveData();
}

// Function to save tasks to localStorage
function saveData() {
    // We can save the innerHTML of the task list container
    localStorage.setItem('todoList', taskList.innerHTML);
}

// Function to load tasks from localStorage
function loadTasks() {
    const savedData = localStorage.getItem('todoList');
    if (savedData) {
        taskList.innerHTML = savedData;
        
        // Re-attach event listeners to loaded items
        const listItems = taskList.querySelectorAll('li');
        listItems.forEach(li => {
            const span = li.querySelector('.task-text');
            const deleteBtn = li.querySelector('.delete-btn');
            
            span.addEventListener('click', function() {
                li.classList.toggle('completed');
                saveData();
            });
            
            deleteBtn.addEventListener('click', function() {
                li.remove();
                saveData();
            });
        });
    }
}