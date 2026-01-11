
let table = document.getElementById('table');

// ✅ NEW CODE: Clear previous localStorage once when app updates
const APP_VERSION = "2";  // change this value when you update table structure
if (localStorage.getItem("APP_VERSION") !== APP_VERSION) {
    localStorage.clear();               // clears old saved table
    localStorage.setItem("APP_VERSION", APP_VERSION);
}

// Show/hide category based on transaction type
document.getElementsByClassName('transcationType')[0].addEventListener('change', function () {
    let categorySelect = document.getElementsByClassName('category')[0];
    if (this.value === 'Expense') {
        categorySelect.style.display = 'block';
    } else {
        categorySelect.style.display = 'none';
        categorySelect.value = 'Category';
    }
});

// Save table to local storage
function saveData() {
    localStorage.setItem("tableData", table.innerHTML);
    localStorage.setItem("totalIncome", document.getElementById("totalIncome").innerText);
    localStorage.setItem("expense", document.getElementById("expense").innerText);
    localStorage.setItem("balance", document.getElementById("balance").innerText);
}

function deleteRow(row) {
    let amount = parseInt(row.children[0].innerText);
    let transcationType = row.children[1].innerText;

    let totalIncome = parseInt(document.getElementById('totalIncome').innerText);
    let totalExpense = parseInt(document.getElementById('expense').innerText);
    let totalBalance = parseInt(document.getElementById('balance').innerText);

    if (transcationType == 'Income') {
        document.getElementById('totalIncome').innerText = totalIncome - amount;
        document.getElementById('balance').innerText = totalBalance - amount;
    }
    else if (transcationType == 'Expense') {
        document.getElementById('expense').innerText = totalExpense - amount;
        document.getElementById('balance').innerText = totalBalance + amount;
    }

    row.remove();
    saveData();
}

function addRow() {
    let date = document.getElementsByClassName('dateInput')[0].value;
    let amount = document.getElementsByClassName('amountInput')[0].value;
    let transcationType = document.getElementsByClassName('transcationType')[0].value;
    let category = document.getElementsByClassName('category')[0].value;

    if (transcationType == 'Transcation Type' || date == '' || amount == '') {
        alert('Enter your transaction');
        return;
    }

    if (transcationType == 'Expense' && category == 'Category') {
        alert('Please select a category for the expense');
        return;
    }

    let row = document.createElement('tr');

    let amountcell = document.createElement('td');
    amountcell.innerText = amount;

    let transcationcell = document.createElement('td');
    transcationcell.innerText = transcationType;

    let categorycell = document.createElement('td');
    categorycell.innerText = transcationType == 'Expense' ? category : 'N/A';

    let datecell = document.createElement('td');
    datecell.innerText = date;

    let bincell = document.createElement('td');
    let deletebtn = document.createElement('button');

    let img = document.createElement('img');
    img.src = './imgs/bin.png';
    img.style.width = '40px';
    img.style.height = '35px';

    deletebtn.style.border = 'none';
    deletebtn.style.background = 'white';
    deletebtn.appendChild(img);
    deletebtn.onclick = () => deleteRow(row);

    bincell.appendChild(deletebtn);

    row.appendChild(amountcell);
    row.appendChild(transcationcell);
    row.appendChild(categorycell);
    row.appendChild(datecell);
    row.appendChild(bincell);

    table.appendChild(row);

    let totalIncome = document.getElementById('totalIncome').innerText;
    let totalExpense = document.getElementById('expense').innerText;
    let totalBalance = document.getElementById('balance').innerText;

    if (transcationType == 'Income') {
        document.getElementById('totalIncome').innerText = (totalIncome == '0') ? amount : parseInt(totalIncome) + parseInt(amount);
        document.getElementById('balance').innerText = (totalBalance == '0') ? amount : parseInt(totalBalance) + parseInt(amount);
    }
    else if (transcationType == 'Expense') {
        document.getElementById('expense').innerText = (totalExpense == '0') ? amount : parseInt(totalExpense) + parseInt(amount);
        document.getElementById('balance').innerText = (totalBalance == '0') ? amount : parseInt(totalBalance) - parseInt(amount);
    }

    document.getElementsByClassName('dateInput')[0].value = '';
    document.getElementsByClassName('amountInput')[0].value = '';
    document.getElementsByClassName('transcationType')[0].value = 'Transcation Type';
    document.getElementsByClassName('category')[0].value = 'Category';
    document.getElementsByClassName('category')[0].style.display = 'none';

    saveData();
}

// Load stored data after refresh
window.onload = function () {
    if (localStorage.getItem("tableData")) {
        table.innerHTML = localStorage.getItem("tableData");

        document.getElementById("totalIncome").innerText = localStorage.getItem("totalIncome") || "0";
        document.getElementById("expense").innerText = localStorage.getItem("expense") || "0";
        document.getElementById("balance").innerText = localStorage.getItem("balance") || "0";
    }

    // Re-attach delete events
    let rows = table.querySelectorAll("tr");
    rows.forEach((row, index) => {
        if (index === 0) return;

        let deleteBtn = row.querySelector("button");
        deleteBtn.onclick = () => deleteRow(row);
    });
}
