function enableCalculateButton() {
    document.getElementById("calculateButton").disabled = false;
}

function validateSecondShift(firstShift, secondShift) {
    if (firstShift === "día" && ["día", "noche"].includes(secondShift)) {
        return true;
    } else if (firstShift === "noche" && ["noche", "descanso"].includes(secondShift)) {
        return true;
    } else if (firstShift === "descanso" && ["descanso", "día"].includes(secondShift)) {
        return true;
    }
    return false;
}

function getNextShift(shift) {
    if (shift === "día") {
        return "noche";
    } else if (shift === "noche") {
        return "descanso";
    } else {
        return "día";
    }
}

function createShiftSequence(firstShift, secondShift, daysCount) {
    if (!validateSecondShift(firstShift, secondShift)) {
        return false;
    }

    let sequence = [firstShift, secondShift];

    if (firstShift === secondShift) {
        if (firstShift === "día") {
            sequence.push("noche", "noche");
        } else if (firstShift === "noche") {
            sequence.push("descanso", "descanso");
        } else {
            sequence.push("día", "día");
        }
    } else {
        sequence.push(secondShift);
    }

    while (sequence.length < daysCount) {
        let nextShift = getNextShift(sequence[sequence.length - 1]);
        sequence.push(nextShift, nextShift);
    }

    return sequence.slice(0, daysCount);
}

function groupShiftsByYearAndMonth(shiftSequence, startDate) {
    let shiftsByMonth = new Map();

    let current_date = new Date(startDate);

    for (let shift of shiftSequence) {
        let yearMonthKey = `${current_date.getFullYear()}-${current_date.getMonth() + 1}`;

        if (!shiftsByMonth.has(yearMonthKey)) {
            shiftsByMonth.set(yearMonthKey, []);
        }

        shiftsByMonth.get(yearMonthKey).push({ date: new Date(current_date), shift });

        current_date.setDate(current_date.getDate() + 1);
    }

    return shiftsByMonth;
}

function calculateSequence() {
    let startDateStr = document.getElementById("startDate").value;
    let endDateStr = document.getElementById("endDate").value;
    let firstShift = document.getElementById("firstShift").value.toLowerCase();
    let secondShift = document.getElementById("secondShift").value.toLowerCase();

    let startDate = new Date(startDateStr);
    let endDate = new Date(endDateStr);

    if (startDate > endDate) {
        alert("Error: La fecha de inicio debe ser anterior a la fecha de fin.");
        return;
    }

    let daysCount = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    let shiftSequence = createShiftSequence(firstShift, secondShift, daysCount);

    if (shiftSequence) {
        let shiftsByYearAndMonth = groupShiftsByYearAndMonth(shiftSequence, startDate);
        displayResults(shiftsByYearAndMonth);
        document.getElementById("startDate").disabled = true;
        document.getElementById("endDate").disabled = true;
        document.getElementById("firstShift").disabled = true;
        document.getElementById("secondShift").disabled = true;
        document.getElementById("calculateButton").disabled = true;
        document.getElementById("clearButton").disabled = false;
    } else {
        alert("Error: Secuencia de turnos inválida.");
    }
}

function displayResults(shiftsByYearAndMonth) {
    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    let monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    for (let [yearMonth, shifts] of shiftsByYearAndMonth) {
        let [year, month] = yearMonth.split("-");

        let table = document.createElement("table");
        let caption = table.createCaption();
        caption.innerText = `Secuencia de turnos: ${year} - ${monthNames[parseInt(month) - 1]}`;

        let thead = table.createTHead();
        let headerRow = thead.insertRow();
        let dateHeader = document.createElement("th");
        dateHeader.innerText = "Fecha";
        headerRow.appendChild(dateHeader);
        let shiftHeader = document.createElement("th");
        shiftHeader.innerText = "Turno";
        headerRow.appendChild(shiftHeader);

        let tbody = document.createElement("tbody");

        for (let shiftData of shifts) {
            let row = tbody.insertRow();
            let dateCell = row.insertCell();
            dateCell.innerText = shiftData.date.toISOString().slice(0, 10);
            let shiftCell = row.insertCell();
            shiftCell.innerText = shiftData.shift;
        }

        table.appendChild(tbody);
        resultDiv.appendChild(table);
    }
}
function resetSecondShiftOptions() {
let secondShift = document.getElementById("secondShift");
secondShift.innerHTML = "";

let emptyOption = document.createElement("option");
emptyOption.value = "";
emptyOption.innerText = "Selecciona un turno";
emptyOption.selected = true;
emptyOption.disabled = true;
secondShift.appendChild(emptyOption);

secondShift.disabled = true;
}
function clearData() {
document.getElementById("shiftForm").reset();
resetSecondShiftOptions(); 
document.getElementById("startDate").disabled = false;
document.getElementById("endDate").disabled = true;
document.getElementById("firstShift").disabled = true;
document.getElementById("calculateButton").disabled = true;
document.getElementById("clearButton").disabled = true;
document.getElementById("result").innerHTML = "";
}