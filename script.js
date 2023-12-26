const fieldsWeigth = document.querySelectorAll(".box-field-weigth");
const fieldsNote = document.querySelectorAll(".box-field-note");
const calcMethod = document.getElementById("method");
const inputsNotes = document.querySelectorAll(".box-field-note input");
const inputsWeights = document.querySelectorAll(".box-field-weigth input");
const situationCard = document.querySelector(".situacion");
const btnCloseSituacionCard = document.querySelector(".close-contain i");
const btnCalc = document.getElementById("btn-calc");

calcMethod.addEventListener("change", () => {
  if (calcMethod.value != "WEIGHTED") {
    fieldsWeigth.forEach((fieldWeigth) => (fieldWeigth.style.display = "none"));

    fieldsNote.forEach((fieldNote) => (fieldNote.style.width = "80%"));
  } else {
    fieldsWeigth.forEach((fieldWeigth) => (fieldWeigth.style.display = "flex"));

    fieldsNote.forEach((fieldNote) => (fieldNote.style.width = "40%"));
  }
});

fieldsNote.forEach((fieldNote) => {
  fieldNote.addEventListener("change", () => {
    //calculateAvg();
    console.log("adicionou ou tirou nota");
  });
});

fieldsWeigth.forEach((fieldWeigth) => {
  fieldWeigth.addEventListener("change", () => {
    //calculateAvg();
    console.log("adicionou ou tirou peso");
  });
});

const getCalcMethod = (method) => {
  const calcMethods = {
    ARITHMETIC: ({ notes }) => {
      let sumNotes = 0;

      notes.forEach((note) => (sumNotes += note));

      return sumNotes / notes.length;
    },
    WEIGHTED: ({ notes, weights }) => {
      let sumProducts = 0;
      let sumweights = 0;

      for (let i = 0; i < notes.length; i++) {
        sumProducts += notes[i] * weights[i];
        sumweights += weights[i];
      }

      console.log(sumProducts);
      console.log(sumweights);

      return sumProducts / sumweights;
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
  const noteDefalt = method != "WEIGHTED" ? 0 : 1;

  inputsNotes.forEach((inputNote) => {
    let note = inputNote.value != "" ? parseInt(inputNote.value) : noteDefalt;
    notes.push(note);
  });

  return notes;
};

const getWeights = () => {
  const weights = [];

  inputsWeights.forEach((inputWeight) => {
    let weigth = inputWeight.value != "" ? parseInt(inputWeight.value) : 1;
    weights.push(weigth);
  });

  return weights;
};

const getSituacion = (result) => {
  if (result >= 60) return "aprovado(a)";
  else return "reprovado(a)";
};

const setDataSitucionCard = (result) => {
  const situacion = getSituacion(result);

  situationCard.querySelector("#situacion").innerHTML = situacion;
  situationCard.querySelector("#avg").innerHTML = result;

  showSituacionCard();
};

const showSituacionCard = () => {
  situationCard.style.right = "0";
};

const hideSituacionCard = () => {
  situationCard.style.right = "-30rem";
};

const calculateAvg = () => {
  const method = calcMethod.value;

  console.log(method);

  if (method == "DEFAULT") return;

  const selectedCalcMethod = getCalcMethod(method);
  const notes = getNotes(method);
  const weights = getWeights();
  const result = selectedCalcMethod({ notes: notes, weights: weights }); // Chamando a função com os parâmetros corretos

  setDataSitucionCard(result);
};

btnCalc.addEventListener("click", calculateAvg);
btnCloseSituacionCard.addEventListener("click", hideSituacionCard);
