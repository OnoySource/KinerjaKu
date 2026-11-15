
/* ==========================================
   MONITORING KINERJA - KINERJAKU
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const tableBody = document.getElementById("monitoringTableBody");

    const averageElement = document.getElementById("monitoringAverage");
    const totalElement = document.getElementById("monitoringTotal");
    const excellentElement = document.getElementById("monitoringExcellent");
    const evaluationElement = document.getElementById("monitoringNeedsEvaluation");

    const searchInput = document.getElementById("monitoringSearch");

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

            console.error("Gagal membaca data penilaian:", error);

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
            month: "short",
            year: "numeric"
        });

    }


    // ======================================
    // FORMAT STATUS
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
    // FORMAT NILAI
    // ======================================

    function formatScore(score) {

        const value = Number(score);

        return Number.isFinite(value)
            ? value.toFixed(2)
            : "0.00";

    }


    // ======================================
    // TAMPILKAN TABEL MONITORING
    // ======================================

    function renderMonitoring(data) {

        if (!tableBody) return;

        tableBody.innerHTML = "";

        if (data.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fa-solid fa-clipboard-list"></i>
                        <p>Belum ada data penilaian.</p>
                    </td>
                </tr>
            `;

            return;

        }

        data.forEach((evaluation, index) => {

            const row = document.createElement("tr");

            const score = Number(evaluation.finalScore) || 0;
            const grade = evaluation.grade || "Perlu Evaluasi";

            const statusClass = getStatusClass(grade);

            const safeName = document.createElement("span");
            safeName.textContent = evaluation.employeeName || "-";

            row.innerHTML = `
                <td>${index + 1}</td>

                <td class="monitoring-name"></td>

                <td>
                    <div class="score-progress">

                        <div class="progress-track">
                            <div
                                class="progress-fill"
                                style="width: ${Math.max(0, Math.min(100, score))}%"
                            ></div>
                        </div>

                        <strong>${formatScore(score)}</strong>

                    </div>
                </td>

                <td>
                    <span class="status-badge ${statusClass}">
                        ${grade}
                    </span>
                </td>

                <td>${formatDate(evaluation.date)}</td>
            `;

            row.querySelector(".monitoring-name").appendChild(safeName);

            tableBody.appendChild(row);

        });

    }


    // ======================================
    // UPDATE RINGKASAN
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

        const needsEvaluation = data.filter(
            item => item.grade === "Perlu Evaluasi"
        ).length;


        if (averageElement) {
            averageElement.textContent = average.toFixed(2);
        }

        if (totalElement) {
            totalElement.textContent = total;
        }

        if (excellentElement) {
            excellentElement.textContent = excellent;
        }

        if (evaluationElement) {
            evaluationElement.textContent = needsEvaluation;
        }

    }


    // ======================================
    // PENCARIAN MONITORING
    // ======================================

    function filterMonitoring() {

        const keyword = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        const evaluations = getEvaluations();

        const filtered = evaluations.filter(item => {

            const name = (item.employeeName || "").toLowerCase();
            const grade = (item.grade || "").toLowerCase();

            return name.includes(keyword) || grade.includes(keyword);

        });

        renderMonitoring(filtered);

    }


    // ======================================
    // EVENT PENCARIAN
    // ======================================

    if (searchInput) {

        searchInput.addEventListener("input", filterMonitoring);

    }


    // ======================================
    // INISIALISASI
    // ======================================

    const evaluations = getEvaluations();

    updateSummary(evaluations);

    renderMonitoring(evaluations);

});
