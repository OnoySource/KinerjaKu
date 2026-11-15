
/* ==========================================
   LAPORAN PENILAIAN - KINERJAKU
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const tableBody = document.getElementById("reportsTableBody");
    const searchInput = document.getElementById("reportSearch");

    const totalElement = document.getElementById("reportTotal");
    const averageElement = document.getElementById("reportAverage");
    const excellentElement = document.getElementById("reportExcellent");
    const goodElement = document.getElementById("reportGood");

    const printButton = document.getElementById("printReport");

    const STORAGE_KEY = "kinerjaku_evaluations";


    // ======================================
    // AMBIL DATA PENILAIAN
    // ======================================

    function getEvaluations() {

        try {

            const data = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            return Array.isArray(data) ? data : [];

        } catch (error) {

            console.error("Gagal membaca laporan:", error);

            return [];

        }

    }


    // ======================================
    // FORMAT TANGGAL
    // ======================================

    function formatDate(date) {

        if (!date) return "-";

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) return "-";

        return parsedDate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    }


    // ======================================
    // FORMAT NILAI
    // ======================================

    function formatScore(score) {

        const value = Number(score);

        return Number.isFinite(value)
            ? value.toFixed(2)
            : "0.00";

    }


    // ======================================
    // STATUS PENILAIAN
    // ======================================

    function getStatusClass(grade) {

        switch (grade) {

            case "Sangat Baik":
                return "excellent";

            case "Baik":
                return "good";

            case "Cukup":
                return "average";

            default:
                return "poor";

        }

    }


    // ======================================
    // TAMPILKAN LAPORAN
    // ======================================

    function renderReports(data) {

        if (!tableBody) return;

        tableBody.innerHTML = "";

        if (data.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fa-solid fa-file-circle-exclamation"></i>
                        <p>Belum ada laporan penilaian.</p>
                    </td>
                </tr>
            `;

            return;

        }

        data.forEach((item, index) => {

            const row = document.createElement("tr");

            const score = Number(item.finalScore) || 0;
            const grade = item.grade || "Perlu Evaluasi";

            row.innerHTML = `
                <td>${index + 1}</td>

                <td class="report-employee-name"></td>

                <td class="report-employee-id"></td>

                <td>
                    <strong class="report-score">
                        ${formatScore(score)}
                    </strong>
                </td>

                <td>
                    <span class="status-badge ${getStatusClass(grade)}">
                        ${grade}
                    </span>
                </td>

                <td>${formatDate(item.date)}</td>
            `;

            // Gunakan textContent untuk data karyawan
            // agar teks tidak diperlakukan sebagai HTML.

            row.querySelector(".report-employee-name").textContent =
                item.employeeName || "-";

            row.querySelector(".report-employee-id").textContent =
                item.employeeId || "-";

            tableBody.appendChild(row);

        });

    }


    // ======================================
    // RINGKASAN LAPORAN
    // ======================================

    function updateSummary(data) {

        const total = data.length;

        const average = total > 0
            ? data.reduce((sum, item) => {
                return sum + (Number(item.finalScore) || 0);
            }, 0) / total
            : 0;

        const excellent = data.filter(
            item => item.grade === "Sangat Baik"
        ).length;

        const good = data.filter(
            item => item.grade === "Baik"
        ).length;


        if (totalElement) {
            totalElement.textContent = total;
        }

        if (averageElement) {
            averageElement.textContent = average.toFixed(2);
        }

        if (excellentElement) {
            excellentElement.textContent = excellent;
        }

        if (goodElement) {
            goodElement.textContent = good;
        }

    }


    // ======================================
    // PENCARIAN LAPORAN
    // ======================================

    function filterReports() {

        const keyword = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        const evaluations = getEvaluations();

        const filtered = evaluations.filter(item => {

            const employeeName =
                (item.employeeName || "").toLowerCase();

            const employeeId =
                (item.employeeId || "").toLowerCase();

            const grade =
                (item.grade || "").toLowerCase();

            return (
                employeeName.includes(keyword) ||
                employeeId.includes(keyword) ||
                grade.includes(keyword)
            );

        });

        renderReports(filtered);
        updateSummary(filtered);

    }


    // ======================================
    // EVENT PENCARIAN
    // ======================================

    if (searchInput) {

        searchInput.addEventListener("input", filterReports);

    }


    // ======================================
    // CETAK LAPORAN
    // ======================================

    if (printButton) {

        printButton.addEventListener("click", function () {

            const evaluations = getEvaluations();

            if (evaluations.length === 0) {

                alert("Belum ada data penilaian untuk dicetak.");

                return;

            }

            window.print();

        });

    }


    // ======================================
    // INISIALISASI
    // ======================================

    filterReports();

});
