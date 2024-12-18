// DOM Elements
const entryForm = document.getElementById("entry-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const entriesList = document.getElementById("entries-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpensesEl = document.getElementById("total-expenses");
const netBalanceEl = document.getElementById("net-balance");
const filterButtons = document.querySelectorAll(".filter-btn");

// State
let entries = JSON.parse(localStorage.getItem("entries")) || [];

// Functions
const updateOverview = () => {
  const income = entries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const expenses = entries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  const netBalance = income - expenses;

  totalIncomeEl.textContent = `$${income.toFixed(2)}`;
  totalExpensesEl.textContent = `$${expenses.toFixed(2)}`;
  netBalanceEl.textContent = `$${netBalance.toFixed(2)}`;
};

const saveEntries = () => {
  localStorage.setItem("entries", JSON.stringify(entries));
};

const renderEntries = (filter = "all") => {
  entriesList.innerHTML = "";

  const filteredEntries =
    filter === "all" ? entries : entries.filter((e) => e.type === filter);

  filteredEntries.forEach((entry, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div>
        <strong>${entry.description}</strong>
        <span>${entry.type === "income" ? "+" : "-"}$${entry.amount.toFixed(
      2
    )}</span>
      </div>
      <div>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Edit Button
    li.querySelector(".edit-btn").addEventListener("click", () => {
      descriptionInput.value = entry.description;
      amountInput.value = entry.amount;
      entryForm.elements["type"].value = entry.type;
      entries.splice(index, 1);
      saveEntries();
      renderEntries(filter);
      updateOverview();
    });

    // Delete Button
    li.querySelector(".delete-btn").addEventListener("click", () => {
      entries.splice(index, 1);
      saveEntries();
      renderEntries(filter);
      updateOverview();
    });

    entriesList.appendChild(li);
  });

  updateOverview();
};

// Event Listeners
entryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const type = entryForm.elements["type"].value;

  if (description && amount) {
    entries.push({ description, amount: Math.abs(amount), type });
    saveEntries();
    renderEntries();
    entryForm.reset();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const filter = e.target.dataset.filter;
    renderEntries(filter);
  });
});

// Initial Load
renderEntries();
