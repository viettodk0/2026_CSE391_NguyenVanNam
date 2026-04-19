// 1. Lấy dữ liệu: Ưu tiên LocalStorage, nếu trống thì lấy từ data.js
let books = JSON.parse(localStorage.getItem("books")) || [
  ...initialBooks,
];
let editIndex = -1; // Biến dùng để đánh dấu: -1 là thêm mới, >= 0 là đang sửa

// DOM Elements
const tableBody = document.getElementById("employeeTableBody");
const modal = document.getElementById("employeeModal");
const form = document.getElementById("employeeForm");
const modalTitle = document.querySelector(".modal-header h3");

// Regex kiểm tra
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

function saveToStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

// 2. Render bảng
function renderTable() {
  tableBody.innerHTML = "";
  books.forEach((book, index) => {
    tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td style="font-weight: 500">${book.name}</td>
                <td>${book.author}</td>
                <td>${book.genre}</td>
                <td>${book.year}</td>
                <td>${book.quantity}</td>
                <td>${book.addedBy}</td>
                <td>${book.addedDate}</td>
                <td>
                    <button class="btn-edit" onclick="openEditModal(${index})">Sửa</button>
                    <button class="btn-delete" onclick="deleteBook(${index})">Xoá</button>
                </td>
            </tr>
        `;
  });
}

// 3. Mở Modal Thêm mới
document.getElementById("btnOpenModal").onclick = () => {
  editIndex = -1; // Reset về trạng thái thêm mới
  modalTitle.innerText = "Thêm sách mới";
  form.reset();
  modal.style.display = "block";
};

// 4. Mở Modal Chỉnh sửa (Điền ngược dữ liệu vào form)
function openEditModal(index) {
  editIndex = index; // Lưu lại vị trí đang sửa
  const book = books[index];

  // Đổ dữ liệu vào các ô input
  document.getElementById("fullName").value = book.name;
  document.getElementById("email").value = book.author;
  document.getElementById("phone").value = book.genre;
  document.getElementById("position").value = book.year;

  // Chọn radio button tương ứng
  document.querySelector(
    `input[name="gender"][value="${book.addedBy}"]`,
  ).checked = true;

  modalTitle.innerText = "Chỉnh sửa sách";
  modal.style.display = "block";
}

// Đóng Modal
document.getElementById("btnCancel").onclick = () => closeModal();
document.getElementById("btnClose").onclick = () => closeModal();

function closeModal() {
  modal.style.display = "none";
  form.reset();
  document.querySelectorAll(".error").forEach((el) => (el.innerText = ""));
}

// 5. Xử lý Lưu (Thêm hoặc Sửa)
form.onsubmit = function (e) {
  e.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const position = document.getElementById("position").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;

  let isValid = true;
  document.querySelectorAll(".error").forEach((el) => (el.innerText = ""));

  // Validate cơ bản
  if (name === "" || name.length > 30) {
    document.getElementById("nameError").innerText =
      "Họ tên không hợp lệ (tối đa 30 ký tự)";
    isValid = false;
  }
  if (!emailRegex.test(email)) {
    document.getElementById("emailError").innerText =
      "Email không đúng định dạng";
    isValid = false;
  }
  if (!phoneRegex.test(phone)) {
    document.getElementById("phoneError").innerText =
      "Số điện thoại phải đúng 10 số";
    isValid = false;
  }

  if (isValid) {
    const empData = { name, email, phone, position, gender };

    if (editIndex === -1) {
      // TRƯỜNG HỢP THÊM MỚI
      employees.push(empData);
      alert("Thêm nhân viên thành công!");
    } else {
      // TRƯỜNG HỢP CHỈNH SỬA: Thay thế phần tử cũ bằng dữ liệu mới
      employees[editIndex] = empData;
      alert("Cập nhật thông tin thành công!");
    }

    saveToStorage();
    renderTable();
    closeModal();
  }
};

// 6. Xóa
function deleteEmployee(index) {
  employees.splice(index, 1);
  saveToStorage();
  renderTable();
}

renderTable();
