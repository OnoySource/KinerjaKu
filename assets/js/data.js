
// ==========================================
// DATA KARYAWAN KINERJAKU
// ==========================================

const defaultEmployees = [
    {
        id: "KRY002",
        name: "Tahmid",
        position: "Manager",
        department: "Manajemen",
        status: "Aktif"
    },
    {
        id: "KRY003",
        name: "Trio Novrian",
        position: "Produksi",
        department: "Operasional",
        status: "Aktif"
    },
    {
        id: "KRY004",
        name: "Meiva",
        position: "Sortir & Packing",
        department: "Produksi, Pemasaran, Keuangan",
        status: "Aktif"
    },
    {
        id: "KRY005",
        name: "Olivia",
        position: "Pemasaran",
        department: "Pemasaran",
        status: "Aktif"
    },
    {
        id: "KRY006",
        name: "Hj. Suparti",
        position: "Keuangan",
        department: "Keuangan",
        status: "Aktif"
    },
    {
        id: "KRY007",
        name: "Ahmad Rizki",
        position: "Distribusi / Driver",
        department: "Distribusi",
        status: "Aktif"
    }
];


// ==========================================
// PENYIMPANAN DATA KARYAWAN
// ==========================================

const EMPLOYEE_STORAGE_KEY = "kinerjaku_employees";

let employees = loadEmployees();

function loadEmployees() {
    const savedData = localStorage.getItem(EMPLOYEE_STORAGE_KEY);

    if (savedData) {
        try {
            return JSON.parse(savedData);
        } catch (error) {
            console.error("Gagal membaca data karyawan:", error);
        }
    }

    localStorage.setItem(
        EMPLOYEE_STORAGE_KEY,
        JSON.stringify(defaultEmployees)
    );

    return [...defaultEmployees];
}


// ==========================================
// MENYIMPAN DATA KARYAWAN
// ==========================================

function saveEmployees() {
    localStorage.setItem(
        EMPLOYEE_STORAGE_KEY,
        JSON.stringify(employees)
    );
}


// ==========================================
// MEMBUAT ID KARYAWAN OTOMATIS
// ==========================================

function generateEmployeeId() {
    const numbers = employees.map(employee => {
        return parseInt(employee.id.replace("KRY", ""), 10) || 0;
    });

    const nextNumber = Math.max(0, ...numbers) + 1;

    return "KRY" + String(nextNumber).padStart(3, "0");
}


// ==========================================
// MENAMBAHKAN KARYAWAN
// ==========================================

function addEmployee(employeeData) {
    const newEmployee = {
        id: generateEmployeeId(),
        name: employeeData.name.trim(),
        position: employeeData.position.trim(),
        department: employeeData.department.trim(),
        status: employeeData.status || "Aktif"
    };

    employees.push(newEmployee);
    saveEmployees();

    return newEmployee;
}


// ==========================================
// MENGUBAH DATA KARYAWAN
// ==========================================

function updateEmployee(id, updatedData) {
    const index = employees.findIndex(employee => employee.id === id);

    if (index === -1) {
        return false;
    }

    employees[index] = {
        ...employees[index],
        ...updatedData
    };

    saveEmployees();

    return true;
}


// ==========================================
// MENGHAPUS DATA KARYAWAN
// ==========================================

function deleteEmployee(id) {
    const index = employees.findIndex(employee => employee.id === id);

    if (index === -1) {
        return false;
    }

    employees.splice(index, 1);
    saveEmployees();

    return true;
}


// ==========================================
// DATA OPERASIONAL PETERNAKAN
// ==========================================

const farmData = {
    chickenPopulation: 3000,
    totalCages: 2,
    eggProduction: 150,
    feedConsumption: 300,
    feedSacksPerDay: 6
};


// ==========================================
// DATA KRITERIA PENILAIAN
// ==========================================

const evaluationCriteria = [];


// ==========================================
// FUNGSI PENCARIAN KARYAWAN BERDASARKAN ID
// ==========================================

function getEmployeeById(id) {
    return employees.find(employee => employee.id === id);
}


// ==========================================
// FUNGSI PENCARIAN BERDASARKAN NAMA
// ==========================================

function searchEmployee(keyword) {
    const query = keyword.toLowerCase();

    return employees.filter(employee =>
        employee.name.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query)
    );
}


// ==========================================
// FUNGSI JUMLAH KARYAWAN
// ==========================================

function getTotalEmployees() {
    return employees.length;
}


// ==========================================
// FUNGSI JUMLAH KARYAWAN AKTIF
// ==========================================

function getActiveEmployees() {
    return employees.filter(employee =>
        employee.status.toLowerCase() === "aktif"
    ).length;
}


// ==========================================
// FUNGSI MENGAMBIL DATA BERDASARKAN BAGIAN
// ==========================================

function getEmployeesByDepartment(department) {
    return employees.filter(employee =>
        employee.department.toLowerCase().includes(
            department.toLowerCase()
        )
    );
}
