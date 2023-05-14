function updateSecondShiftOptions() {
    let firstShift = document.getElementById("firstShift").value;
    let secondShift = document.getElementById("secondShift");
    secondShift.innerHTML = "";

    let validShifts;

    if (firstShift === "día") {
        validShifts = ["día", "noche"];
    } else if (firstShift === "noche") {
        validShifts = ["noche", "descanso"];
    } else {
        validShifts = ["descanso", "día"];
    }

    // Agregar la opción vacía al inicio
    let emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.innerText = "Selecciona un turno";
    emptyOption.selected = true;
    emptyOption.disabled = true;
    secondShift.appendChild(emptyOption);

    for (let shift of validShifts) {
        let option = document.createElement("option");
        option.value = shift;
        option.innerText = shift;
        secondShift.appendChild(option);
    }

    secondShift.disabled = false;
}

        function enableEndDate() {
            document.getElementById("endDate").disabled = false;
        }

        function enableFirstShift() {
            document.getElementById("firstShift").disabled = false;
        }