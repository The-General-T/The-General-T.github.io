import UserManager from '../javascript/Users.js';

const itemNameInput = document.getElementById("itemName");
const itemPriceInput = document.getElementById("itemPrice");
const transactionList = document.getElementById("transactionList");
const totalDisplay = document.getElementById("totalDisplay");
const header = document.getElementById("transactionHeader");
const userManager = new UserManager();

const addItemBtn = document.getElementById("addItemBtn");
const taxexemptbtn = document.getElementById("taxexemptbtn");
const clearTransactionBtn = document.getElementById("clearTransactionBtn");
const completeTransactionBtn = document.getElementById("completeTransactionBtn");
const managerButtons = document.querySelectorAll("button.manager");
const needHelp = document.getElementById("helpme");

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
  if (isLoggedInUserManager) {
    document.getElementById("manager-header").style.visibility = "visible";
    document.getElementById("manager-actions").style.visibility = "visible";
  }
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
  total += price * 1.07;

  renderTransaction();
  itemNameInput.value = "";
  itemPriceInput.value = "";
  itemNameInput.focus();
}
function addItemTE() {
  const name = itemNameInput.value.trim();
  const price = parseFloat(itemPriceInput.value);
  var ishouldntneedthis = "==== TAX EXEMPT NEXT ITEM ====";

  if (!name || isNaN(price) || price < 0) {
    alert("Enter valid item name and price.");
    return;
  }

  items.push({ name: ishouldntneedthis, price: 0 }); // Add tax exempt note
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

  const operatorID = loggedInUsername.toLowerCase().slice(0, 3) + "001";

  const itemsList = items.map(item => `
    <div class="receipt-item">
      <span>${item.name}</span>
      <span>$${item.price.toFixed(2)}</span>
    </div>
  `).join("");

  const html = `
    <div class="receipt-header">
      <h1>General T. Invoicing</h1>
      <p><strong>Operator ID:</strong> ${loggedInUsername}</p>
      <p><strong>Date/Time:</strong> ${date} ${time}</p>
    </div>

    <div class="receipt-body">
      ${itemsList}
    </div>

    <div class="receipt-footer">
      <div class="receipt-total">
        <strong>Total:</strong> $${total.toFixed(2)}
      </div>
      <div class="signature-line">
        Signature: ____________________________________
      </div>
      <p class="receipt-thankyou">Thank you for your business!</p>
    </div>
  `;

  document.getElementById("receiptOutput").innerHTML = html;
  document.getElementById("download").style.visibility = "visible";
  document.getElementById("print").style.visibility = "visible";
  document.getElementById("receiptWrapper").style.visibility = "visible";
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
function downloadReceiptPDF() {
  const element = document.getElementById("receiptWrapper");

  const opt = {
    margin: 0,
    filename: `receipt-${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, scrollY: 0 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().set(opt).from(element).save();
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

function helpMenu() {
  window.open("helpscreen.html", "Help Menu", "width=400,height=400,sizable=no");
}

// Event listeners
addItemBtn.addEventListener("click", addItem);
taxexemptbtn.addEventListener("click", addItemTE);
clearTransactionBtn.addEventListener("click", clearTransaction);
completeTransactionBtn.addEventListener("click", completeTransaction);
needHelp.addEventListener("click", helpMenu);

managerButtons.forEach(button => {
  button.addEventListener("click", () => {
    const action = button.getAttribute("data-action");
    managerFunction(action);
  });
});
window.printReceipt = printReceipt;
window.addItem = addItem;
window.addItemTE = addItemTE;
window.clearTransaction = clearTransaction;
window.completeTransaction = completeTransaction;
window.downloadReceiptPDF = downloadReceiptPDF;
window.needHelp = helpMenu;