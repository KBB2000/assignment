let currentPage = 1;
let itemsPerPage = 10;

function populateSelects() {
    const departments = [...new Set(employees.map(e => e.department))];
    const roles = [...new Set(employees.map(e => e.role))];

    const deptSelect = document.getElementById("department");
    const roleSelect = document.getElementById("role");

    deptSelect.innerHTML = departments.map(d => `<option value="${d}">${d}</option>`).join('');
    roleSelect.innerHTML = roles.map(r => `<option value="${r}">${r}</option>`).join('');
}

function renderEmployees() {
    const list = document.getElementById("employee-list");
    list.innerHTML = "";
    let filtered = employees;

    const search = document.getElementById("search").value.toLowerCase();
    if (search) {
        filtered = filtered.filter(e =>
            `${e.firstName} ${e.lastName}`.toLowerCase().includes(search) ||
            e.email.toLowerCase().includes(search)
        );
    }

    const sort = document.getElementById("sort").value;
    if (sort) {
        filtered.sort((a, b) => a[sort].localeCompare(b[sort]));
    }

    itemsPerPage = parseInt(document.getElementById("showCount").value);
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    paginated.forEach(emp => {
        const div = document.createElement("div");
        div.className = "employee-card";
        div.innerHTML = `<h3>${emp.firstName} ${emp.lastName}</h3>
            <p><strong>Email:</strong> ${emp.email}</p>
            <p><strong>Department:</strong> ${emp.department}</p>
            <p><strong>Role:</strong> ${emp.role}</p>
            <button onclick="editEmployee(${emp.id})">Edit</button>
            <button onclick="deleteEmployee(${emp.id})">Delete</button>`;
        list.appendChild(div);
    });

    renderPagination(filtered.length);
}

function renderPagination(totalItems) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.onclick = () => {
            currentPage = i;
            renderEmployees();
        };
        if (i === currentPage) btn.style.fontWeight = 'bold';
        pagination.appendChild(btn);
    }
}

function applySearch() {
    currentPage = 1;
    renderEmployees();
}

function applySort() {
    renderEmployees();
}

function applyPagination() {
    renderEmployees();
}

function showForm(edit=false) {
    document.getElementById("form-modal").classList.remove("hidden");
    if (!edit) clearForm();
}

function closeForm() {
    document.getElementById("form-modal").classList.add("hidden");
    clearForm();
}

function clearForm() {
    document.getElementById("employee-id").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("department").selectedIndex = 0;
    document.getElementById("role").selectedIndex = 0;
}

function saveEmployee(event) {
    event.preventDefault();
    const id = document.getElementById("employee-id").value;
    const emp = {
        id: id ? parseInt(id) : Date.now(),
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        role: document.getElementById("role").value
    };
    if (id) {
        const index = employees.findIndex(e => e.id == id);
        employees[index] = emp;
    } else {
        employees.push(emp);
    }
    closeForm();
    renderEmployees();
}

function editEmployee(id) {
    const emp = employees.find(e => e.id === id);
    showForm(true);
    document.getElementById("employee-id").value = emp.id;
    document.getElementById("firstName").value = emp.firstName;
    document.getElementById("lastName").value = emp.lastName;
    document.getElementById("email").value = emp.email;
    document.getElementById("department").value = emp.department;
    document.getElementById("role").value = emp.role;
}

function deleteEmployee(id) {
    if (confirm("Are you sure?")) {
        employees = employees.filter(e => e.id !== id);
        renderEmployees();
    }
}

window.onload = () => {
    populateSelects();
    renderEmployees();
};
