import UserManager from '../javascript/Users.js';

const itemNameInput = document.getElementById("itemName");
const itemPriceInput = document.getElementById("itemPrice");
const transactionList = document.getElementById("transactionList");
const totalDisplay = document.getElementById("totalDisplay");
const header = document.getElementById("transactionHeader");
const userManager = new UserManager();

const addItemBtn = document.getElementById("addItemBtn");
const clearTransactionBtn = document.getElementById("clearTransactionBtn");
const completeTransactionBtn = document.getElementById("completeTransactionBtn");
const managerButtons = document.querySelectorAll("button.manager");

let items = [];
let total = 0;

// Load logged-in user info
const loggedInUsername = localStorage.getItem("loggedInUser");
console.log("Logged in user:", loggedInUsername);  // debug check
if (!loggedInUsername) {
  alert("Please login first.");
  window.location.href = "../index.html";
}

// Get logged-in user object to check manager status
const loggedInUser = userManager.getUser(loggedInUsername);
const isLoggedInUserManager = loggedInUser?.isManager ?? false;

// Show date/time + username
function updateHeader() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  header.textContent = `Operator ID: ${loggedInUsername} (${loggedInUser.role}) | Date: ${date} Time: ${time}`;
}
updateHeader();
setInterval(updateHeader, 1000); // live clock every second

// Transaction functions
function addItem() {
  const name = itemNameInput.value.trim();
  const price = parseFloat(itemPriceInput.value);

  if (!name || isNaN(price) || price < 0) {
    alert("Enter valid item name and price.");
    return;
  }

  items.push({ name, price });
  total += price;

  renderTransaction();
  itemNameInput.value = "";
  itemPriceInput.value = "";
  itemNameInput.focus();
}

function renderTransaction() {
  const list = items.map(item =>
    `<div class="item"><span>${item.name}</span><span>$${item.price.toFixed(2)}</span></div>`
  ).join("");
  transactionList.innerHTML = `<h2>Items</h2>${list}`;
  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

function clearTransaction() {
  if (!confirm("Clear current transaction?")) return;
  items = [];
  total = 0;
  renderTransaction();
}

function completeTransaction() {
  if (items.length === 0) {
    alert("No items to complete.");
    return;
  }

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  const receiptLines = [];

   receiptLines.push(`
   _____  _______   _____                     _        _               
  / ____||__   __| |_   _|                   (_)      (_)              
 | |  __    | |      | |   _ __ __   __ ___   _   ___  _  _ __    __ _ 
 | | |_ |   | |      | |  | '_ \\ \\ / // _ \\ | | / __|| || '_ \\  / _\` |
 | |__| | _ | | _   _| |_ | | | |\\ V /| (_) || || (__ | || | | || (_| |
  \\_____|(_)|_|(_) |_____||_| |_| \\_/  \\___/ |_| \\___||_||_| |_| \\__, |
                                                                  __/ |
                                                                 |___/ 
 `);
  receiptLines.push(`Operator ID: ${loggedInUsername}\nDate: ${date} Time: ${time}`);
  receiptLines.push("-------------------------");

  items.forEach((item, index) => {
    const line = `${index + 1}. ${item.name} - $${item.price.toFixed(2)}`;
    receiptLines.push(line);
  });

  receiptLines.push("-------------------------");
  receiptLines.push(`TOTAL: $${total.toFixed(2)}`);
  receiptLines.push(" ");
  receiptLines.push(" ");
  receiptLines.push(" ");
  receiptLines.push("X_______________________________________");
  receiptLines.push("Have a Great day!");

  const receiptText = receiptLines.join("\n");

  const receiptOutput = document.getElementById("receiptOutput");
  receiptOutput.innerHTML = receiptText.replace(/\n/g, "<br>");

  alert("Transaction Complete! Click 'Print Receipt' to finish.");
}
function printReceipt() {
  const receiptContent = document.getElementById("receiptOutput").innerHTML;

  const printWindow = window.open("", "", "width=600,height=700");
  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            background-color: white;
            color: black;
            font-family: monospace;
            padding: 20px;
          }
          pre {
            white-space: pre-wrap;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <pre>${receiptContent}</pre>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// Manager function authorization with override logic
function managerFunction(action) {
  if (isLoggedInUserManager) {
    // Logged-in user is manager, no override needed
    alert(`Manager Access Granted: ${action}`);
    runManagerAction(action);
  } else {
    // Prompt for manager override
    const usernamePrompt = prompt("Manager Username:");
    const passwordPrompt = prompt("Manager Password:");

    const user = userManager.authenticate(usernamePrompt, passwordPrompt);

    if (user && user.isManager) {
      alert(`Manager Override Approved: ${action}`);
      runManagerAction(action);
    } else {
      alert("Access Denied. Manager credentials required.");
    }
  }
}

function runManagerAction(action) {
  switch (action) {
    case "Override Price":
      overridePricePrompt();
      break;
    case "View Reports":
      viewReports();
      break;
    case "Refund Transaction":
      refundTransaction();
      break;
    default:
      alert("Unknown manager action");
  }
}

// Demo: Override Price
function overridePricePrompt() {
  if (items.length === 0) {
    alert("No items to override price for.");
    return;
  }

  const indexStr = prompt(`Enter item number to override (1 to ${items.length}):`);
  const index = parseInt(indexStr) - 1;

  if (isNaN(index) || index < 0 || index >= items.length) {
    alert("Invalid item number.");
    return;
  }

  const newPriceStr = prompt(`Enter new price for "${items[index].name}":`);
  const newPrice = parseFloat(newPriceStr);

  if (isNaN(newPrice) || newPrice < 0) {
    alert("Invalid price.");
    return;
  }

  items[index].price = newPrice;
  recalculateTotal();
  renderTransaction();
  alert(`Price overridden for "${items[index].name}".`);
}

// Demo: View Reports (placeholder)
function viewReports() {
  alert("Reports feature is under construction.");
}

// Demo: Refund Transaction
function refundTransaction() {
  const confirmRefund = confirm("Are you sure you want to refund the current transaction?");
  if (confirmRefund) {
    clearTransaction();
    alert("Transaction refunded.");
  }
}

function recalculateTotal() {
  total = items.reduce((sum, item) => sum + item.price, 0);
}

// Event listeners
addItemBtn.addEventListener("click", addItem);
clearTransactionBtn.addEventListener("click", clearTransaction);
completeTransactionBtn.addEventListener("click", completeTransaction);

managerButtons.forEach(button => {
  button.addEventListener("click", () => {
    const action = button.getAttribute("data-action");
    managerFunction(action);
  });
});
window.printReceipt = printReceipt;
window.addItem = addItem;
window.clearTransaction = clearTransaction;
window.completeTransaction = completeTransaction;
