let runningTotal = 0;
let buffer = "0";
let expression = "";
let previousOperator = null;
let piDisplayed = false;

const screen = document.querySelector("#display");
const piValue = "3.1415926535";

function buttonClick(value) {
  if (!isNaN(value) || value === ".") {
    handleNumber(value);
  } else {
    handleSymbol(value);
  }
  screen.innerText = expression || "0";
}

function handleNumber(number) {
  if (number === "." && buffer.includes(".")) return;
  if (buffer === "0" || piDisplayed) {
    buffer = number;
    piDisplayed = false;
  } else {
    buffer += number;
  }
  expression += number;
}

function handleSymbol(symbol) {
  switch (symbol) {
    case "C":
      buffer = "0";
      runningTotal = 0;
      previousOperator = null;
      expression = "";
      piDisplayed = false;
      break;
    case "←":
      if (piDisplayed) {
        buffer = "0";
        expression = expression.slice(0, -piValue.length);
        piDisplayed = false;
      } else {
        buffer = buffer.slice(0, -1) || "0";
        expression = expression.slice(0, -1);
      }
      break;
    case "=":
      try {
        const sanitized = expression
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/−/g, "-");

        const result = eval(sanitized);
        runningTotal = result;
        buffer = result.toString();
        expression = buffer;
        piDisplayed = false;
      } catch (e) {
        expression = "Error";
      }
      break;
    case "÷":
    case "×":
    case "−":
    case "+":
      handleMath(symbol);
      expression += symbol;
      break;
    case "π":
      buffer = piValue;
      expression += piValue;
      piDisplayed = true;
      break;
    case "(":
      if (expression.slice(-1).match(/[0-9π)]/)) {
        expression += "×(";
      } else {
        expression += "(";
      }
      break;

    case ")":
      expression += ")";
      break;
  }
}

function handleMath(symbol) {
  if (buffer === "" || (buffer === "0" && !piDisplayed)) return;

  const floatBuffer = parseFloat(buffer);
  if (runningTotal === 0) {
    runningTotal = floatBuffer;
  } else {
    flushOperation(floatBuffer);
  }

  previousOperator = symbol;
  buffer = "";
}

function flushOperation(floatBuffer) {
  switch (previousOperator) {
    case "+":
      runningTotal += floatBuffer;
      break;
    case "−":
      runningTotal -= floatBuffer;
      break;
    case "×":
      runningTotal *= floatBuffer;
      break;
    case "÷":
      runningTotal /= floatBuffer;
      break;
  }
}

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (!isNaN(key) || key === ".") buttonClick(key);
  if (key === "+") buttonClick("+");
  if (key === "-") buttonClick("−");
  if (key === "*") buttonClick("×");
  if (key === "/") buttonClick("÷");
  if (key === "(" || key === ")") buttonClick(key);
  if (key === "Enter" || key === "=") {
    event.preventDefault();
    buttonClick("=");
  }
  if (key === "Backspace") buttonClick("←");
  if (key.toLowerCase() === "c") buttonClick("C");
  if (key.toLowerCase() === "p") buttonClick("π");
});
