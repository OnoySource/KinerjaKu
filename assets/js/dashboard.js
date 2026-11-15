
document.addEventListener("DOMContentLoaded", function () {

    // ==================================
    // TANGGAL OTOMATIS
    // ==================================

    const currentDate = document.getElementById("currentDate");

    if (currentDate) {
        const today = new Date();

        currentDate.textContent = today.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }


    // ==================================
    // INFORMASI PENGGUNA
    // ==================================

    // Sementara menggunakan data contoh.
    // Nanti akan dihubungkan dengan sistem login.

    const user = {
        name: "Administrator",
        role: "Admin"
    };

    const sidebarName = document.getElementById("sidebarName");
    const sidebarRole = document.getElementById("sidebarRole");
    const userAvatar = document.getElementById("userAvatar");

    if (sidebarName) {
        sidebarName.textContent = user.name;
    }

    if (sidebarRole) {
        sidebarRole.textContent = user.role;
    }

    if (userAvatar) {
        userAvatar.textContent = user.name
            .charAt(0)
            .toUpperCase();
    }


    // ==================================
    // TOMBOL KELUAR
    // ==================================

    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {

            const confirmation = confirm(
                "Apakah kamu yakin ingin keluar?"
            );

            if (confirmation) {
                alert("Fitur logout akan diaktifkan setelah sistem login dibuat.");
            }

        });
    }

});
