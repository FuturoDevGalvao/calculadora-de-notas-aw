const calcMethod = document.getElementById("method");
const situationCard = document.querySelector(".situacion");
const btnCloseSituacionCard = document.querySelector(".close-contain i");
const btnCalc = document.getElementById("btn-calc");
const btnAddNote = document.getElementById("add-note");
const btnRemoveNote = document.getElementById("remove-note");

const average = 60;

const toggleFieldStyles = () => {
  const { fieldsNote, fieldsWeigth } = getFields();

  if (calcMethod.value != "WEIGHTED") {
    fieldsWeigth.forEach((fieldWeigth) => (fieldWeigth.style.display = "none"));
    fieldsNote.forEach((fieldNote) => (fieldNote.style.width = "80%"));
  } else {
    fieldsWeigth.forEach((fieldWeigth) => (fieldWeigth.style.display = "flex"));
    fieldsNote.forEach((fieldNote) => (fieldNote.style.width = "40%"));
  }
};

const getCalcMethod = (method) => {
  const calcMethods = {
    ARITHMETIC: ({ notes }) => {
      let sumNotes = 0;

      notes.forEach((note) => (sumNotes += note));

      return (sumNotes / notes.length).toFixed(2);
    },
    WEIGHTED: ({ notes, weights }) => {
      let sumProducts = 0;
      let sumweights = 0;

      for (let i = 0; i < notes.length; i++) {
        sumProducts += notes[i] * weights[i];
        sumweights += weights[i];
      }

      return (sumProducts / sumweights).toFixed(2);
    },
    SUM: ({ notes }) => {
      let sumNotes = 0;

      notes.forEach((note) => (sumNotes += note));

      return sumNotes;
    },
  };

  return calcMethods[method];
};

const getNotes = (method) => {
  const notes = [];
  const { inputsNotes } = getInputs();
  const noteDefalt = method != "WEIGHTED" ? 0 : 1;

  inputsNotes.forEach((inputNote) => {
    let note = inputNote.value != "" ? parseInt(inputNote.value) : noteDefalt;
    notes.push(note);
  });

  return notes;
};

const getWeights = () => {
  const weights = [];
  const { inputsWeights } = getInputs();

  inputsWeights.forEach((inputWeight) => {
    let weigth = inputWeight.value != "" ? parseInt(inputWeight.value) : 1;
    weights.push(weigth);
  });

  return weights;
};

const getSituacion = (result) => {
  return result >= average ? "aprovado(a)" : "reprovado(a)";
};

const getNoteRequired = (result) => {
  return (result < average ? average - result : 0).toFixed(2);
};

const getFields = () => {
  const fieldsWeigth = document.querySelectorAll(".box-field-weigth");
  const fieldsNote = document.querySelectorAll(".box-field-note");

  return { fieldsNote: fieldsNote, fieldsWeigth: fieldsWeigth };
};

const getInputs = () => {
  const inputsNotes = document.querySelectorAll(".box-field-note input");
  const inputsWeights = document.querySelectorAll(".box-field-weigth input");

  return { inputsNotes: inputsNotes, inputsWeights: inputsWeights };
};

const getFieldsContain = () => {
  return document.querySelector(".fields");
};

const getNoteNumbersNynamically = () => {
  return getFieldsContain().querySelectorAll(".field").length;
};

const createField = () => {
  const field = `
    <div class="field">
      <div class="box-field-note">
        <input
          type="number"
          placeholder="Sua nota aqui"
          min="0"
          max="100"
        />
        <span>${getNoteNumbersNynamically() + 1}° Nota</span>
      </div>
      <div class="box-field-weigth">
        <input
          type="number"
          placeholder="Peso da nota aqui"
          min="1"
          max="100"
        />
        <span>Peso</span>
      </div>
    </div>`;

  getFieldsContain().insertAdjacentHTML("beforeend", field);
  toggleFieldStyles();
  addListenerInputs();
};

const removeField = () => {
  const fieldsContain = getFieldsContain();

  if (fieldsContain.childElementCount > 0) {
    const lastField = fieldsContain.lastElementChild; // Pega o último filho
    lastField.remove(); // Remove o último filho
  } else {
    console.log("Não há elementos para remover.");
  }
};

const setDataSitucionCard = (result) => {
  const situacion = getSituacion(result);
  const noteRequired = getNoteRequired(result);

  situationCard.querySelector("#situacion").innerHTML = situacion;
  situationCard.querySelector("#avg").innerHTML = result;
  situationCard.querySelector("#note-required").innerHTML = noteRequired;

  showSituacionCard();
};

const showSituacionCard = () => {
  situationCard.style.right = "0";
};

const hideSituacionCard = () => {
  situationCard.style.right = "-30rem";
};

const isValidateCalcMethod = () => {
  let validatedCalcMethod = true;

  if (calcMethod.value == "DEFAULT") {
    calcMethod.classList.add("error");
    validatedCalcMethod = false;
  }

  return validatedCalcMethod;
};

const isValidateInputs = (inputs) => {
  let validatedInputsNotes = true;

  inputs.forEach((inputNote) => {
    let empty = inputNote.value != "" ? true : false;

    if (!empty) {
      inputNote.classList.add("error");
      validatedInputsNotes = false;
    }
  });

  return validatedInputsNotes;
};

const isValidated = (method) => {
  const { inputsNotes, inputsWeights } = getInputs();

  let isValidNotes = isValidateInputs(inputsNotes);
  let isValidMethod = isValidateCalcMethod();

  if (method === "WEIGHTED") {
    let isValidWeights = isValidateInputs(inputsWeights);
    return isValidNotes && isValidWeights && isValidMethod;
  }

  return isValidNotes && isValidMethod;
};

const calculateAvg = () => {
  const method = calcMethod.value.trim();
  const validatedInputs = isValidated(method);

  if (validatedInputs && method != "DEFAULT") {
    const selectedCalcMethod = getCalcMethod(method);
    const notes = getNotes(method);
    const weights = getWeights();
    const result = selectedCalcMethod({ notes: notes, weights: weights });
    setDataSitucionCard(result);
  }
};

const addEventListenerElements = () => {
  calcMethod.addEventListener("change", () => {
    toggleFieldStyles();
    removeErrorStyle(calcMethod);
  });

  btnCalc.addEventListener("click", calculateAvg);
  btnCloseSituacionCard.addEventListener("click", hideSituacionCard);
  btnAddNote.addEventListener("click", createField);
  btnRemoveNote.addEventListener("click", removeField);
};

const removeErrorStyle = (element) => {
  element.classList.remove("error");
};

const addListenerInputs = () => {
  const { inputsNotes, inputsWeights } = getInputs();
  const allInputs = [...inputsNotes, ...inputsWeights];

  allInputs.forEach((input) => {
    input.addEventListener("input", () => {
      removeErrorStyle(input);
    });
  });
};

window.onload = () => {
  addEventListenerElements();
  addListenerInputs();
};
