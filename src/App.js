import React, { useState } from "react";
import InputMask from "react-input-mask";
import "./App.css";

function App() {
  // let controller = new AbortController();
  // let isRequestPending = false;
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState({ email: "", number: "" });

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const validateFields = () => {
    let emailError = "";
    let numberError = "";

    if (!emailRegex.test(email)) {
      emailError = "Invalid email format";
    }

    if (number && number.length !== 8) {
      // Considering mask characters
      numberError = "Number should be in the format 99-99-99";
    }

    if (emailError || numberError) {
      setErrors({ email: emailError, number: numberError });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    const isValid = validateFields();

    if (!isValid) {
      return;
    }

    // if (isRequestPending) {
    //   controller.abort();
    //   controller = new AbortController();
    // }

    // isRequestPending = true;

    const sentNumber = number.replace(/-/g, "");
    console.log("Sending data:", { email, sentNumber });

    try {
      const response = await fetch("http://localhost:3001/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email, number: sentNumber }),
        // signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData.error); // Log the error or display to the user
        return;
      }

      const data = await response.json();
      console.log("Received data:", data);
      setResults(data);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error occurred:", error);
      }
    }
    // } finally {
    //   isRequestPending = false;
    // }
  };

  return (
    <div className="App">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div>
          <label>Number: </label>
          <InputMask
            mask="99-99-99"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          >
            {(inputProps) => <input {...inputProps} type="text" />}
          </InputMask>
          {errors.number && <div className="error">{errors.number}</div>}
        </div>
        <button type="submit">Submit</button>
      </form>

      <div>
        <h2>Results:</h2>
        <ul>
          {results.map((result, idx) => (
            <li key={idx}>
              {result.email} - {result.number}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
