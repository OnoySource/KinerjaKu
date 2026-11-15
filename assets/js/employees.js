
/* ==========================================
   DATA KARYAWAN - KINERJAKU
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("employeesTableBody");
    const searchInput = document.getElementById("employeeSearch");
    const departmentFilter = document.getElementById("departmentFilter");

    const totalElement = document.getElementById("totalEmployees");
    const activeElement = document.getElementById("activeEmployees");
    const departmentElement = document.getElementById("totalDepartments");
    const showingElement = document.getElementById("employeeShowing");

    const addButton = document.getElementById("addEmployeeButton");

    if (!tableBody) return;

    let editingEmployeeId = null;

    // ======================================
    // ESCAPE HTML
    // ======================================

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return entities[character];
        });
    }

    // ======================================
    // MEMBUAT MODAL TAMBAH / EDIT
    // ======================================

    function createModal() {
        if (document.getElementById("employeeModal")) return;

        const modal = document.createElement("div");
        modal.id = "employeeModal";
        modal.className = "employee-modal";

        modal.innerHTML = `
            <div class="employee-modal-content">

                <div class="employee-modal-header">
                    <div>
                        <h2 id="employeeModalTitle">Tambah Karyawan</h2>
                        <p>Lengkapi informasi karyawan berikut.</p>
                    </div>

                    <button type="button" id="closeEmployeeModal">
                        &times;
                    </button>
                </div>

                <form id="employeeForm">

                    <div class="employee-form-group">
                        <label for="employeeName">Nama Lengkap</label>
                        <input
                            type="text"
                            id="employeeName"
                            placeholder="Masukkan nama karyawan"
                            required
                        >
                    </div>

                    <div class="employee-form-group">
                        <label for="employeePosition">Jabatan</label>
                        <input
                            type="text"
                            id="employeePosition"
                            placeholder="Contoh: Manager"
                            required
                        >
                    </div>

                    <div class="employee-form-group">
                        <label for="employeeDepartment">Departemen</label>
                        <select id="employeeDepartment" required>
                            <option value="">Pilih Departemen</option>
                            <option value="Manajemen">Manajemen</option>
                            <option value="Operasional">Operasional</option>
                            <option value="Produksi">Produksi</option>
                            <option value="Pemasaran">Pemasaran</option>
                            <option value="Keuangan">Keuangan</option>
                            <option value="Distribusi">Distribusi</option>
                        </select>
                    </div>

                    <div class="employee-form-group">
                        <label for="employeeStatus">Status</label>
                        <select id="employeeStatus" required>
                            <option value="Aktif">Aktif</option>
                            <option value="Nonaktif">Nonaktif</option>
                        </select>
                    </div>

                    <div class="employee-modal-actions">
                        <button
                            type="button"
                            id="cancelEmployeeModal"
                            class="employee-cancel-button"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            class="employee-save-button"
                        >
                            <i class="fa-solid fa-floppy-disk"></i>
                            Simpan Karyawan
                        </button>
                    </div>

                </form>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById("closeEmployeeModal")
            .addEventListener("click", closeModal);

        document.getElementById("cancelEmployeeModal")
            .addEventListener("click", closeModal);

        modal.addEventListener("click", function (event) {
            if (event.target === modal) closeModal();
        });

        document.getElementById("employeeForm")
            .addEventListener("submit", saveEmployee);
    }

    // ======================================
    // BUKA MODAL
    // ======================================

    function openModal(employee = null) {
        createModal();

        const modal = document.getElementById("employeeModal");
        const form = document.getElementById("employeeForm");

        form.reset();

        editingEmployeeId = employee ? employee.id : null;

        document.getElementById("employeeModalTitle").textContent =
            employee ? "Edit Karyawan" : "Tambah Karyawan";

        document.getElementById("employeeName").value =
            employee ? employee.name : "";

        document.getElementById("employeePosition").value =
            employee ? employee.position : "";

        document.getElementById("employeeDepartment").value =
            employee ? employee.department : "";

        document.getElementById("employeeStatus").value =
            employee ? employee.status || "Aktif" : "Aktif";

        modal.classList.add("show");
        document.body.style.overflow = "hidden";

        document.getElementById("employeeName").focus();
    }

    // ======================================
    // TUTUP MODAL
    // ======================================

    function closeModal() {
        const modal = document.getElementById("employeeModal");

        if (modal) {
            modal.classList.remove("show");
        }

        document.body.style.overflow = "";
        editingEmployeeId = null;
    }

    // ======================================
    // SIMPAN KARYAWAN
    // ======================================

    function saveEmployee(event) {
        event.preventDefault();

        const name = document.getElementById("employeeName").value.trim();
        const position = document.getElementById("employeePosition").value.trim();
        const department = document.getElementById("employeeDepartment").value;
        const status = document.getElementById("employeeStatus").value;

        if (!name || !position || !department) {
            alert("Semua data wajib diisi.");
            return;
        }

        const isEditing = Boolean(editingEmployeeId);

        const employeeData = {
            name,
            position,
            department,
            status
        };

        if (isEditing) {
            updateEmployee(editingEmployeeId, employeeData);
        } else {
            addEmployee(employeeData);
        }

        closeModal();
        updateSummary();
        filterEmployees();

        alert(
            isEditing
                ? "Data karyawan berhasil diperbarui."
                : "Karyawan berhasil ditambahkan."
        );
    }

    // ======================================
    // MODAL DETAIL KARYAWAN
    // ======================================

    function createDetailModal() {
        if (document.getElementById("employeeDetailModal")) return;

        const modal = document.createElement("div");

        modal.id = "employeeDetailModal";
        modal.className = "employee-detail-modal";

        modal.innerHTML = `
            <div class="employee-detail-content">

                <div class="employee-detail-header">
                    <div>
                        <span class="employee-detail-label">
                            <i class="fa-solid fa-address-card"></i>
                            PROFIL KARYAWAN
                        </span>

                        <h2>Detail Karyawan</h2>

                        <p>
                            Informasi lengkap karyawan yang terdaftar.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="employee-detail-close"
                        id="closeEmployeeDetail"
                        aria-label="Tutup"
                    >
                        &times;
                    </button>
                </div>

                <!-- PROFIL -->
                <div class="employee-detail-profile">

                    <div
                        class="employee-detail-avatar"
                        id="detailAvatar"
                    >
                        U
                    </div>

                    <div class="employee-detail-identity">
                        <h3 id="detailName">Nama Karyawan</h3>

                        <p id="detailPosition">Jabatan</p>

                        <span
                            id="detailStatus"
                            class="employee-detail-status"
                        >
                            Aktif
                        </span>
                    </div>

                </div>

                <!-- INFORMASI PEKERJAAN -->
                <div class="employee-detail-information">

                    <div class="employee-detail-section-heading">
                        <i class="fa-solid fa-user-tie"></i>
                        <h4>Informasi Pekerjaan</h4>
                    </div>

                    <div class="employee-detail-list">

                        <div class="employee-detail-row">
                            <div class="employee-detail-info">
                                <i class="fa-solid fa-briefcase"></i>
                                <span>Jabatan</span>
                            </div>

                            <strong id="detailJob">-</strong>
                        </div>

                        <div class="employee-detail-row">
                            <div class="employee-detail-info">
                                <i class="fa-solid fa-building"></i>
                                <span>Departemen</span>
                            </div>

                            <strong id="detailDepartment">-</strong>
                        </div>

                        <div class="employee-detail-row">
                            <div class="employee-detail-info">
                                <i class="fa-solid fa-circle-check"></i>
                                <span>Status</span>
                            </div>

                            <strong id="detailStatusText">-</strong>
                        </div>

                    </div>
                </div>

                <!-- FOOTER -->
                <div class="employee-detail-footer">
                    <button
                        type="button"
                        id="closeEmployeeDetailButton"
                    >
                        Tutup
                    </button>
                </div>

            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById("closeEmployeeDetail")
            .addEventListener("click", closeDetailModal);

        document.getElementById("closeEmployeeDetailButton")
            .addEventListener("click", closeDetailModal);

        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeDetailModal();
            }
        });
    }

    // ======================================
    // TAMPILKAN DETAIL KARYAWAN
    // ======================================

    function openDetailModal(employee) {
        createDetailModal();

        const modal = document.getElementById("employeeDetailModal");

        const name = employee.name || "-";
        const position = employee.position || "-";
        const department = employee.department || "-";
        const status = employee.status || "Aktif";

        // Identitas
        document.getElementById("detailAvatar").textContent =
            name.trim().charAt(0).toUpperCase();

        document.getElementById("detailName").textContent = name;

        document.getElementById("detailPosition").textContent = position;

        // Informasi pekerjaan
        document.getElementById("detailJob").textContent = position;

        document.getElementById("detailDepartment").textContent = department;

        document.getElementById("detailStatusText").textContent = status;

        // Status
        const statusElement = document.getElementById("detailStatus");

        statusElement.textContent = status;

        statusElement.className =
            status.toLowerCase() === "aktif"
                ? "employee-detail-status"
                : "employee-detail-status inactive";

        // Tampilkan modal
        modal.classList.add("show");

        document.body.style.overflow = "hidden";
    }

    // ======================================
    // TUTUP MODAL DETAIL
    // ======================================

    function closeDetailModal() {
        const modal = document.getElementById("employeeDetailModal");

        if (modal) {
            modal.classList.remove("show");
        }

        document.body.style.overflow = "";
    }

    // ======================================
    // RENDER TABEL
    // ======================================

    function renderEmployees(data) {
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fa-solid fa-user-slash"></i>
                        <p>Tidak ada data karyawan ditemukan.</p>
                    </td>
                </tr>
            `;

            if (showingElement) {
                showingElement.textContent = "Menampilkan 0 karyawan";
            }

            return;
        }

        data.forEach((employee, index) => {
            const row = document.createElement("tr");

            const name = escapeHTML(employee.name);
            const position = escapeHTML(employee.position);
            const department = escapeHTML(employee.department);
            const status = escapeHTML(employee.status || "Aktif");
            const id = escapeHTML(employee.id);

            row.innerHTML = `
                <td>${index + 1}</td>

                <td>
                    <span class="employee-name">${name}</span>
                </td>

                <td>
                    <span class="employee-position">${position}</span>
                </td>

                <td>
                    <span class="employee-department">${department}</span>
                </td>

                <td>
                    <span class="employee-status ${
                        status.toLowerCase() === "aktif"
                            ? "active"
                            : "inactive"
                    }">
                        ${status}
                    </span>
                </td>

                <td>
                    <div class="employee-actions">

                        <button
                            type="button"
                            class="employee-action-btn"
                            title="Lihat Detail"
                            data-action="view"
                            data-id="${id}"
                        >
                            <i class="fa-solid fa-eye"></i>
                        </button>

                        <button
                            type="button"
                            class="employee-action-btn"
                            title="Edit Karyawan"
                            data-action="edit"
                            data-id="${id}"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button
                            type="button"
                            class="employee-action-btn delete"
                            title="Hapus Karyawan"
                            data-action="delete"
                            data-id="${id}"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        if (showingElement) {
            showingElement.textContent =
                `Menampilkan ${data.length} dari ${employees.length} karyawan`;
        }
    }

    // ======================================
    // UPDATE RINGKASAN
    // ======================================

    function updateSummary() {
        if (totalElement) {
            totalElement.textContent = employees.length;
        }

        if (activeElement) {
            activeElement.textContent = employees.filter(employee =>
                (employee.status || "Aktif").toLowerCase() === "aktif"
            ).length;
        }

        if (departmentElement) {
            const departments = new Set(
                employees.flatMap(employee =>
                    (employee.department || "")
                        .split(",")
                        .map(item => item.trim())
                        .filter(Boolean)
                )
            );

            departmentElement.textContent = departments.size;
        }
    }

    // ======================================
    // FILTER KARYAWAN
    // ======================================

    function filterEmployees() {
        const keyword = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const selectedDepartment = departmentFilter
            ? departmentFilter.value
            : "";

        const filteredData = employees.filter(employee => {
            const matchSearch =
                (employee.name || "").toLowerCase().includes(keyword) ||
                (employee.position || "").toLowerCase().includes(keyword) ||
                (employee.department || "").toLowerCase().includes(keyword);

            const matchDepartment =
                selectedDepartment === "" ||
                (employee.department || "").toLowerCase().includes(
                    selectedDepartment.toLowerCase()
                );

            return matchSearch && matchDepartment;
        });

        renderEmployees(filteredData);
    }

    // ======================================
    // HAPUS KARYAWAN
    // ======================================

    function removeEmployee(employee) {
        const confirmation = confirm(
            `Apakah lu yakin ingin menghapus karyawan "${employee.name}"?\n\nData yang dihapus tidak bisa dikembalikan melalui halaman ini.`
        );

        if (!confirmation) return;

        const success = deleteEmployee(employee.id);

        if (!success) {
            alert("Gagal menghapus data karyawan.");
            return;
        }

        updateSummary();
        filterEmployees();

        alert("Data karyawan berhasil dihapus.");
    }

    // ======================================
    // EVENT TAMBAH KARYAWAN
    // ======================================

    if (addButton) {
        addButton.addEventListener("click", function () {
            openModal();
        });
    }

    // ======================================
    // EVENT PENCARIAN
    // ======================================

    if (searchInput) {
        searchInput.addEventListener("input", filterEmployees);
    }

    if (departmentFilter) {
        departmentFilter.addEventListener("change", filterEmployees);
    }

    // ======================================
    // EVENT AKSI TABEL
    // ======================================

    tableBody.addEventListener("click", function (event) {
        const button = event.target.closest(".employee-action-btn");

        if (!button) return;

        const action = button.dataset.action;
        const employee = getEmployeeById(button.dataset.id);

        if (!employee) return;

        if (action === "view") {
            openDetailModal(employee);
        }

        if (action === "edit") {
            openModal(employee);
        }

        if (action === "delete") {
            removeEmployee(employee);
        }
    });

    // ======================================
    // INISIALISASI
    // ======================================

    updateSummary();
    renderEmployees(employees);

});