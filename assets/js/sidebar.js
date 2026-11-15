
document.addEventListener("DOMContentLoaded", async function () {

    const container = document.getElementById("sidebarContainer");

    if (!container) return;

    const basePath = container.dataset.base || "";

    try {
        const response = await fetch(`${basePath}partials/sidebar.html`);

        if (!response.ok) {
            throw new Error("Sidebar tidak ditemukan.");
        }

        let html = await response.text();

        html = html.replaceAll("{{BASE}}", basePath);

        container.innerHTML = html;

        // Menu aktif
        const currentPage = window.location.pathname.split("/").pop();

        document.querySelectorAll(".menu-item").forEach(link => {
            if (link.dataset.page === currentPage) {
                link.classList.add("active");
            }
        });

        // Isi profil pengguna
        const user = JSON.parse(
            localStorage.getItem("kinerjaku_user") || "null"
        );

        if (user) {
            const name = user.name || "Pengguna";
            const role = user.role || "Administrator";

            document.getElementById("sidebarName").textContent = name;
            document.getElementById("sidebarRole").textContent = role;
            document.getElementById("userAvatar").textContent =
                name.charAt(0).toUpperCase();
        }

        document.dispatchEvent(new Event("sidebarLoaded"));

    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <div style="padding:20px;color:#dc2626">
                Sidebar gagal dimuat.
            </div>
        `;
    }

});
