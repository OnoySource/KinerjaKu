
/* ==========================================
   EVALUATION - KINERJAKU
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("evaluationForm");
    const employeeSelect = document.getElementById("employeeSelect");

    const scoreResult = document.getElementById("scoreResult");
    const gradeResult = document.getElementById("gradeResult");

    const scoreInputs = [
        document.getElementById("attendance"),
        document.getElementById("productivity"),
        document.getElementById("discipline"),
        document.getElementById("responsibility")
    ];

    const STORAGE_KEY = "kinerjaku_evaluations";

    if (!form || !employeeSelect) return;

    // ======================================
    // AMBIL RIWAYAT PENILAIAN
    // ======================================

    function getEvaluations() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (error) {
            console.error("Gagal membaca data penilaian:", error);
            return [];
        }
    }

    // ======================================
    // ISI DROPDOWN KARYAWAN
    // ======================================

    function loadEmployees() {
        employeeSelect.innerHTML = `
            <option value="">Pilih karyawan</option>
        `;

        employees.forEach(employee => {
            const option = document.createElement("option");

            option.value = employee.id;
            option.textContent = employee.name;

            employeeSelect.appendChild(option);
        });
    }

    // ======================================
    // HITUNG NILAI AKHIR
    // ======================================

    function calculateScore() {
        const values = scoreInputs.map(input => {
            return input.value === "" ? null : Number(input.value);
        });

        const hasEmptyValue = values.some(value => value === null);

        if (hasEmptyValue) {
            scoreResult.textContent = "0";
            gradeResult.textContent = "Belum dinilai";
            return null;
        }

        const hasInvalidValue = values.some(value =>
            !Number.isFinite(value) || value < 0 || value > 100
        );

        if (hasInvalidValue) {
            scoreResult.textContent = "0";
            gradeResult.textContent = "Nilai harus 0–100";
            return null;
        }

        // Bobot masing-masing indikator 25%
        const finalScore = values.reduce(
            (total, value) => total + value * 0.25,
            0
        );

        const roundedScore = Number(finalScore.toFixed(2));

        scoreResult.textContent = roundedScore.toFixed(2);
        gradeResult.textContent = getGrade(roundedScore);

        return roundedScore;
    }

    // ======================================
    // KATEGORI NILAI
    // ======================================

    function getGrade(score) {
        if (score >= 90) return "Sangat Baik";
        if (score >= 80) return "Baik";
        if (score >= 70) return "Cukup";

        return "Perlu Evaluasi";
    }

    // ======================================
    // SIMPAN PENILAIAN
    // ======================================

    function saveEvaluation(event) {
        event.preventDefault();

        const employeeId = employeeSelect.value;

        if (!employeeId) {
            alert("Silakan pilih karyawan terlebih dahulu.");
            employeeSelect.focus();
            return;
        }

        const employee = getEmployeeById(employeeId);

        if (!employee) {
            alert("Data karyawan tidak ditemukan.");
            return;
        }

        const finalScore = calculateScore();

        if (finalScore === null) {
            alert("Periksa kembali nilai. Semua nilai harus antara 0 sampai 100.");
            return;
        }

        const evaluation = {
            id: "EVL" + Date.now(),
            employeeId: employee.id,
            employeeName: employee.name,

            scores: {
                attendance: Number(scoreInputs[0].value),
                productivity: Number(scoreInputs[1].value),
                discipline: Number(scoreInputs[2].value),
                responsibility: Number(scoreInputs[3].value)
            },

            finalScore: finalScore,
            grade: getGrade(finalScore),
            date: new Date().toISOString()
        };

        const evaluations = getEvaluations();

        evaluations.push(evaluation);

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(evaluations)
            );
        } catch (error) {
            console.error("Gagal menyimpan penilaian:", error);
            alert("Penilaian gagal disimpan. Periksa penyimpanan browser.");
            return;
        }

        alert(
            "Penilaian berhasil disimpan!\n\n" +
            "Karyawan: " + employee.name +
            "\nNilai Akhir: " + finalScore +
            "\nKategori: " + evaluation.grade
        );

        form.reset();
        resetResult();
    }

    // ======================================
    // RESET HASIL NILAI
    // ======================================

    function resetResult() {
        scoreResult.textContent = "0";
        gradeResult.textContent = "Belum dinilai";
    }

    // ======================================
    // EVENT INPUT NILAI
    // ======================================

    scoreInputs.forEach(input => {
        input.addEventListener("input", calculateScore);
    });

    // ======================================
    // EVENT RESET FORM
    // ======================================

    form.addEventListener("reset", function () {
        setTimeout(resetResult, 0);
    });

    // ======================================
    // EVENT SIMPAN
    // ======================================

    form.addEventListener("submit", saveEvaluation);

    // ======================================
    // INISIALISASI
    // ======================================

    loadEmployees();
    resetResult();

});
