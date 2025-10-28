const totalSeats = 20;
const seatsContainer = document.getElementById("seats");
const selectedSeatsText = document.getElementById("selectedSeats");
const totalText = document.getElementById("total");
const countText = document.getElementById("count");
const dateInput = document.getElementById("date");
const notification = document.getElementById("notification");

let bookings = JSON.parse(localStorage.getItem("bookings")) || {};
let selectedSeats = [];
const seatPrice = 200;

// Show notification
function showNotification(msg, color = "#16a34a") {
  notification.textContent = msg;
  notification.style.background = color;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 2000);
}

// Render seats
function renderSeats(date) {
  seatsContainer.innerHTML = "";
  const bookedSeats = bookings[date] || [];

  for (let i = 1; i <= totalSeats; i++) {
    const seat = document.createElement("div");
    seat.classList.add("seat");
    seat.textContent = i;

    if (bookedSeats.includes(i)) {
      seat.classList.add("booked");
    } else if (selectedSeats.includes(i)) {
      seat.classList.add("selected");
    }

    seat.addEventListener("click", () => {
      if (!seat.classList.contains("booked")) {
        if (selectedSeats.includes(i)) {
          selectedSeats = selectedSeats.filter(s => s !== i);
        } else {
          selectedSeats.push(i);
        }
        updateSummary(date);
        renderSeats(date);
      }
    });

    seatsContainer.appendChild(seat);
  }
  updateSummary(date);
}

// Update summary
function updateSummary(date) {
  if (selectedSeats.length === 0) {
    selectedSeatsText.textContent = "Selected Seats: None";
    totalText.textContent = "Total: ₹0";
  } else {
    selectedSeatsText.textContent = "Selected Seats: " + selectedSeats.join(", ");
    totalText.textContent = "Total: ₹" + (selectedSeats.length * seatPrice);
  }

  const bookedSeats = bookings[date] || [];
  const availableCount = totalSeats - bookedSeats.length;
  countText.textContent = `Available: ${availableCount} | Booked: ${bookedSeats.length}`;
}

// Confirm booking
document.getElementById("confirmBtn").addEventListener("click", () => {
  const date = dateInput.value;
  if (!date) return showNotification("⚠ Please select a date!", "#f59e0b");
  if (selectedSeats.length === 0) return showNotification("⚠ No seats selected!", "#f59e0b");

  bookings[date] = [...new Set([...(bookings[date] || []), ...selectedSeats])];
  localStorage.setItem("bookings", JSON.stringify(bookings));
  selectedSeats = [];
  renderSeats(date);
  showNotification("✅ Booking Confirmed!");
});

// Cancel booking (selected seats only)
document.getElementById("cancelBtn").addEventListener("click", () => {
  const date = dateInput.value;
  if (!date) return showNotification("⚠ Please select a date!", "#f59e0b");
  if (selectedSeats.length === 0) return showNotification("⚠ No seats selected!", "#f59e0b");

  bookings[date] = (bookings[date] || []).filter(seat => !selectedSeats.includes(seat));
  localStorage.setItem("bookings", JSON.stringify(bookings));
  selectedSeats = [];
  renderSeats(date);
  showNotification("❌ Booking Cancelled", "#dc2626");
});

// Reset all bookings
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("⚠ Are you sure you want to reset all bookings?")) {
    bookings = {};
    localStorage.setItem("bookings", JSON.stringify(bookings));
    selectedSeats = [];
    renderSeats(dateInput.value);
    showNotification("🗑 All bookings cleared!", "#dc2626");
  }
});

// Auto select today's date
function setTodayDate() {
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;
  renderSeats(today);
}

dateInput.addEventListener("change", () => {
  renderSeats(dateInput.value);
});

setTodayDate();
