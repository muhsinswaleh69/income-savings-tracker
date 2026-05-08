// This is a simple version that stores data in the browser
// Later we'll connect it to Firebase

let incomeData = JSON.parse(localStorage.getItem('incomeData')) || [];

// Set today's date as default
document.getElementById('incomeDate').valueAsDate = new Date();

// Form submission
document.getElementById('incomeForm').addEventListener('submit', addIncome);

function addIncome(e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const date = document.getElementById('incomeDate').value;
    const source = document.getElementById('incomeSource').value;

    const entry = {
        id: Date.now(),
        amount,
        date,
        source
    };

    incomeData.push(entry);
    localStorage.setItem('incomeData', JSON.stringify(incomeData));

    // Clear form
    document.getElementById('incomeForm').reset();
    document.getElementById('incomeDate').valueAsDate = new Date();

    // Update display
    updateDisplay();

    alert('Income added successfully!');
}

function updateDisplay() {
    // Calculate statistics
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toISOString().slice(0, 7);

    const todayIncome = incomeData
        .filter(entry => entry.date === today)
        .reduce((sum, entry) => sum + entry.amount, 0);

    const monthlyIncome = incomeData
        .filter(entry => entry.date.startsWith(currentMonth))
        .reduce((sum, entry) => sum + entry.amount, 0);

    const totalIncome = incomeData.reduce((sum, entry) => sum + entry.amount, 0);

    // Update stat cards
    document.getElementById('todayIncome').textContent = '$' + todayIncome.toFixed(2);
    document.getElementById('monthlyIncome').textContent = '$' + monthlyIncome.toFixed(2);
    document.getElementById('totalSavings').textContent = '$' + totalIncome.toFixed(2);

    // Update income list
    const incomeList = document.getElementById('incomeList');
    
    if (incomeData.length === 0) {
        incomeList.innerHTML = '<p>No income entries yet. Add one above!</p>';
        return;
    }

    // Sort by date (newest first)
    const sortedData = [...incomeData].sort((a, b) => new Date(b.date) - new Date(a.date));

    incomeList.innerHTML = sortedData.map(entry => `
        <div class="income-item">
            <div class="income-item-info">
                <div class="income-item-date">${new Date(entry.date).toLocaleDateString()}</div>
                <div class="income-item-source">${entry.source}</div>
            </div>
            <div class="income-item-amount">$${entry.amount.toFixed(2)}</div>
        </div>
    `).join('');
}

// Initial display
updateDisplay();
