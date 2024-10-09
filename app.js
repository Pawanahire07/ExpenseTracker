let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editingIndex = -1; 

// expenses in dashboard
function renderExpenses() {
    const expenseTableBody = document.getElementById('expenseTableBody');
    expenseTableBody.innerHTML = '';

    expenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    expenses.forEach((expense, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${expense.category}</td>
            <td>${expense.amount}</td>
            <td>${new Date(expense.createdAt).toLocaleString()}</td>
            <td>${new Date(expense.updatedAt).toLocaleString()}</td>
            <td>${expense.comments || 'N/A'}</td>
            <td>
                <button class="btn btn-warning btn-edit" onclick="editExpense(${index})">Edit</button>
                <button class="btn btn-danger btn-delete" onclick="deleteExpense(${index})">Delete</button>
            </td>
        `;
        expenseTableBody.appendChild(row);
    });
}

// Add or Update Expense
document.getElementById('expenseForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;
    const comments = document.getElementById('comments').value;

    if (editingIndex === -1) {
        // new expense
        const newExpense = {
            category,
            amount: parseFloat(amount),
            comments,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        expenses.push(newExpense);
    } else {
        // Update expense
        expenses[editingIndex] = {
            ...expenses[editingIndex],
            category,
            amount: parseFloat(amount),
            comments,
            updatedAt: new Date()
        };

        editingIndex = -1;
    }

    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
    this.reset();
});

// Edit Expense
function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('category').value = expense.category;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('comments').value = expense.comments || '';

    editingIndex = index;
}

// Delete Expense
function deleteExpense(index) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    }
}

if (document.getElementById('expenseTableBody')) {
    renderExpenses();
}

// Login functionality
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const storedPassword = localStorage.getItem(username);
    if (storedPassword === password) {
        document.getElementById('message').innerText = 'Login successful!';
        document.getElementById('message').style.color = 'green';

        // Redirect to the dashboard
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('message').innerText = 'Invalid username or password.';
        document.getElementById('message').style.color = 'red';
    }
});

// Sign Up
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const existingUser = localStorage.getItem(username);
    if (existingUser) {
        document.getElementById('message').innerText = 'Username already exists. Please choose a different one.';
        document.getElementById('message').style.color = 'red';
        return;
    }

    localStorage.setItem(username, password);
    document.getElementById('message').innerText = 'Account created successfully!';
    document.getElementById('message').style.color = 'green';
});

// Logout
document.getElementById('logoutButton')?.addEventListener('click', function() {
    localStorage.removeItem('loggedInUser'); 

    window.location.href = 'login.html';
});