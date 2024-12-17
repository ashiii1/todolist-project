
let userworksInp = document.getElementById("userworksInp");
let tasks = localStorage.getItem("mytask") ? JSON.parse(localStorage.getItem("mytask")) : [];
let taskFilter = document.getElementById("taskFilter"); // Dropdown for filtering tasks
let searchBox = document.getElementById("searchBox"); // Search input box
let suggestions = document.getElementById("suggestions"); // Suggestions list
let searchResults = document.getElementById("searchResults"); // Div to display matched tasks
display();

/* Add Task */
document.getElementById("addBtn").addEventListener("click", function () {
    let task = userworksInp.value.trim();
    if (task) {
        // Add task as an object with a completed status and creation date
        tasks.push({ 
            task: task, 
            completed: false, 
            createdAt: new Date().toLocaleString() // Store the current date and time
        });
        localStorage.setItem("mytask", JSON.stringify(tasks));
        userworksInp.value = "";
        display();
    }
});

/* Display Tasks */
function display() {
    let temp = ``;
    let filteredTasks = tasks;

    // Filter tasks based on the selected option
    if (taskFilter.value === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (taskFilter.value === "incomplete") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    // Generate the table rows for filtered tasks
    for (let i = 0; i < filteredTasks.length; i++) {
        temp += `
        <tr>
            <td class="content">${filteredTasks[i].task}</td>
            <td>${filteredTasks[i].createdAt}</td> <!-- Display the creation date -->
            <td><button class="remove" onclick="remove(${i})">Delete</button></td>
            <td><button class="edit" onclick="edit(${i})">Edit</button></td>
            <td>
                <label>
                    <input type="checkbox" onchange="check(this, ${i})" ${filteredTasks[i].completed ? 'checked' : ''}> Done
                </label>
            </td>
        </tr>`;
    }
    document.getElementById("mylist").innerHTML = temp;
}

/* Remove Task */
function remove(index) {
    tasks.splice(index, 1);
    localStorage.setItem("mytask", JSON.stringify(tasks));
    display();
}

/* Edit Task */
let layer = document.getElementById("layer");
let edituserworksInp = document.getElementById("edituserworksInp");
let ChangeBtn = document.getElementById("ChangeBtn");

function edit(index) {
    layer.style.display = "block";
    edituserworksInp.value = tasks[index].task;
    ChangeBtn.onclick = function () {
        tasks[index].task = edituserworksInp.value.trim();
        localStorage.setItem("mytask", JSON.stringify(tasks));
        display();
        layer.style.display = "none";
    };
}

/* Hide Edit Layer */
document.getElementById("CancelBtn").addEventListener("click", function () {
    layer.style.display = "none";
});

/* Mark Task as Done */
function check(checkboxElem, index) {
    tasks[index].completed = checkboxElem.checked; // Update the completed status
    localStorage.setItem("mytask", JSON.stringify(tasks));

    let content = document.getElementsByClassName("content")[index];
    if (checkboxElem.checked) {
        content.style.textDecoration = "line-through";
        content.style.color = "gray";
    } else {
        content.style.textDecoration = "none";
        content.style.color = "black";
    }
}

/* Filter Tasks */
taskFilter.addEventListener("change", function () {
    display(); // Re-display tasks when filter changes
});

/* Search and Suggestions */
searchBox.addEventListener("input", function () {
    let searchQuery = searchBox.value.trim().toLowerCase();

    if (searchQuery.length > 0) {
        let filteredSuggestions = tasks.filter(task => task.task.toLowerCase().includes(searchQuery));
        displaySuggestions(filteredSuggestions);
    } else {
        suggestions.style.display = "none";
    }
});

// Display suggestions as you type
function displaySuggestions(filteredTasks) {
    suggestions.innerHTML = ""; // Clear previous suggestions
    filteredTasks.forEach(task => {
        let listItem = document.createElement("li");
        listItem.textContent = task.task;
        listItem.addEventListener("click", function () {
            searchBox.value = task.task; // Fill search box with clicked suggestion
            displayTaskDetails(task);  // Show task details below
            suggestions.style.display = "none"; // Hide suggestions
        });
        suggestions.appendChild(listItem);
    });
    suggestions.style.display = filteredTasks.length > 0 ? "block" : "none"; // Show or hide the suggestions
}

// Function to handle displaying the task details after pressing Enter
searchBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        let searchQuery = searchBox.value.trim().toLowerCase();
        let matchedTask = tasks.find(task => task.task.toLowerCase() === searchQuery);
        
        if (matchedTask) {
            displayTaskDetails(matchedTask); // Show task details
        } else {
            searchResults.innerHTML = "<p>No matching tasks found.</p>"; // If no match, show message
        }
    }
});

// Function to display the details of the searched task
function displayTaskDetails(task) {
    searchResults.innerHTML = `
        <div class="task-details">
            <p><strong>Task:</strong> ${task.task}</p>
            <p><strong>Date Created:</strong> ${task.createdAt}</p>
            <p><strong>Status:</strong> ${task.completed ? 'Done' : 'Not Done'}</p>
        </div>
    `;
}
/* Clear All Button functionality */
document.getElementById('clearAllBtn').addEventListener('click', function() {
    // Clear tasks from localStorage
    localStorage.removeItem('mytask');
    
    // Clear the tasks array
    tasks = [];
    
    // Clear the tasks list from the DOM
    const taskList = document.getElementById('mylist');
    taskList.innerHTML = '';
    
    alert('All tasks have been cleared!');
});