
/* =========================================
   KINERJAKU AUTHENTICATION
========================================= */

const ACCOUNT_KEY = "kinerjaku_accounts";
const SESSION_KEY = "kinerjaku_session";

const DEFAULT_ACCOUNTS = [
    {
        id: 1,
        name: "Pemilik KinerjaKu",
        username: "owner",
        password: "owner123",
        role: "owner"
    },
    {
        id: 2,
        name: "Administrator",
        username: "admin",
        password: "admin123",
        role: "admin"
    },
    {
        id: 3,
        name: "Pengguna",
        username: "viewer",
        password: "viewer123",
        role: "viewer"
    }
];

// =========================================
// ACCOUNT & SESSION
// =========================================

function initializeAccounts() {
    if (!localStorage.getItem(ACCOUNT_KEY)) {
        localStorage.setItem(
            ACCOUNT_KEY,
            JSON.stringify(DEFAULT_ACCOUNTS)
        );
    }
}

function getAccounts() {
    try {
        return JSON.parse(localStorage.getItem(ACCOUNT_KEY)) || [];
    } catch {
        return [];
    }
}

function getCurrentUser() {
    try {
        return JSON.parse(sessionStorage.getItem(SESSION_KEY));
    } catch {
        return null;
    }
}

function loginUser(username, password) {
    const account = getAccounts().find(user =>
        user.username.toLowerCase() === username.trim().toLowerCase() &&
        user.password === password
    );

    if (!account) {
        return false;
    }

    const session = {
        id: account.id,
        name: account.name,
        username: account.username,
        role: account.role
    };

    sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
    );

    return true;
}

function logoutUser() {
    sessionStorage.removeItem(SESSION_KEY);

    const base = location.pathname.includes("/pages/")
        ? "../"
        : "";

    location.replace(base + "login.html");
}

// =========================================
// ROLE CHECK
// =========================================

function isOwner() {
    return getCurrentUser()?.role === "owner";
}

function isAdmin() {
    return getCurrentUser()?.role === "admin";
}

function isViewer() {
    return getCurrentUser()?.role === "viewer";
}

function canManageData() {
    return isOwner() || isAdmin();
}

function getRoleName(role) {
    return {
        owner: "Owner",
        admin: "Administrator",
        viewer: "Viewer"
    }[role] || "Pengguna";
}

// =========================================
// PROFILE
// =========================================

function updateUserProfile() {
    const user = getCurrentUser();

    if (!user) return;

    const elements = {
        sidebarName: user.name,
        sidebarRole: getRoleName(user.role),
        userAvatar: user.name.charAt(0).toUpperCase(),
        welcomeName: user.name,
        welcomeRole: getRoleName(user.role)
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    });

    const access = document.getElementById("accessDescription");

    if (access) {
        access.textContent = {
            owner: "Anda memiliki akses penuh untuk mengelola seluruh sistem.",
            admin: "Anda dapat mengelola data karyawan dan penilaian kinerja.",
            viewer: "Anda hanya dapat melihat informasi dan laporan."
        }[user.role];
    }
}

// =========================================
// PERMISSIONS
// =========================================

function applyRolePermissions() {
    const user = getCurrentUser();

    if (!user) return;

    document.body.classList.remove(
        "owner-mode",
        "admin-mode",
        "viewer-mode"
    );

    document.body.classList.add(`${user.role}-mode`);

    document.querySelectorAll("[data-permission]").forEach(element => {
        const permission = element.dataset.permission;

        if (permission === "owner" && !isOwner()) {
            element.hidden = true;
        }

        if (permission === "manage-data" && !canManageData()) {
            element.hidden = true;
        }
    });

    updateUserProfile();
}

// =========================================
// LOGIN PAGE
// =========================================

function setupLoginPage() {
    const form = document.getElementById("loginForm");

    if (!form) return;

    const passwordInput = document.getElementById("password");
    const usernameInput = document.getElementById("username");
    const error = document.getElementById("loginError");
    const toggle = document.getElementById("togglePassword");

    toggle?.addEventListener("click", () => {
        const show = passwordInput.type === "password";

        passwordInput.type = show ? "text" : "password";

        toggle.innerHTML = show
            ? '<i class="fa-regular fa-eye-slash"></i>'
            : '<i class="fa-regular fa-eye"></i>';
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!loginUser(username, password)) {
            error.textContent = "Username atau password salah.";
            passwordInput.value = "";
            return;
        }

        error.textContent = "";

        location.replace("index.html");
    });
}

// =========================================
// LOGOUT
// =========================================

function setupLogoutButton() {
    const button = document.getElementById("logoutButton");

    if (!button || button.dataset.authBound) return;

    button.dataset.authBound = "true";

    button.addEventListener("click", () => {
        if (confirm("Apakah Anda yakin ingin keluar?")) {
            logoutUser();
        }
    });
}

// =========================================
// VIEWER PROTECTION
// =========================================

function setupViewerProtection() {

    document.addEventListener("click", event => {
        if (!isViewer()) return;

        if (!(event.target instanceof Element)) return;

        const blocked = event.target.closest(
            "#addEmployeeButton, " +
            ".employee-action-btn, " +
            "#evaluationForm button[type='submit']"
        );

        if (blocked) {
            event.preventDefault();
            event.stopImmediatePropagation();

            alert(
                "Akses ditolak. Akun Viewer hanya dapat melihat data."
            );
        }
    }, true);

    document.addEventListener("submit", event => {
        if (isViewer() && event.target.id === "evaluationForm") {
            event.preventDefault();
            event.stopImmediatePropagation();

            alert(
                "Akun Viewer tidak dapat menyimpan penilaian."
            );
        }
    }, true);
}

// =========================================
// DATE
// =========================================

function showCurrentDate() {
    const element = document.getElementById("currentDate");

    if (!element) return;

    element.textContent = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

// =========================================
// APPLICATION START
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeAccounts();

    const currentPage = location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    // LOGIN PAGE
    if (currentPage === "login.html") {

        if (getCurrentUser()) {
            location.replace("index.html");
            return;
        }

        setupLoginPage();
        return;
    }

    // PROTECT ALL OTHER PAGES
    if (!getCurrentUser()) {

        const base = location.pathname.includes("/pages/")
            ? "../"
            : "";

        location.replace(base + "login.html");
        return;
    }

    // AUTHENTICATED USER
    applyRolePermissions();

    setupLogoutButton();
    setupViewerProtection();
    showCurrentDate();

    // SIDEBAR LOADED
    document.addEventListener("sidebarLoaded", () => {
        applyRolePermissions();
        setupLogoutButton();
    });

});
