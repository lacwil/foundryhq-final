// src/components/PromptFlow.jsx

import React, { useState } from "react";
import promptFlow from "../data/promptFlow";

const PromptFlow = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = promptFlow[currentStepIndex];

  const handleInputChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    let nextIndex = currentStepIndex + 1;

    // Skip conditionals if condition doesn't match
    while (promptFlow[nextIndex]?.type === "conditional") {
      const block = promptFlow[nextIndex];
      if (block.condition && block.condition(answers)) {
        // Unpack conditional questions
        const nextQuestions = block.questions;
        promptFlow.splice(nextIndex + 1, 0, ...nextQuestions);
        break;
      } else {
        nextIndex += 1;
      }
    }

    if (nextIndex >= promptFlow.length || currentStep.type === "end") {
      onComplete?.(answers);
    } else {
      setCurrentStepIndex(nextIndex);
    }
  };

  const renderStep = () => {
    if (!currentStep) return null;

    switch (currentStep.type) {
      case "text":
        return (
          <input
            type="text"
            placeholder="Type your answer..."
            value={answers[currentStep.id] || ""}
            onChange={(e) => handleInputChange(currentStep.id, e.target.value)}
            className="input"
          />
        );

      case "choice":
        return (
          <div className="choices">
            {currentStep.options.map((opt) => (
              <button
                key={opt}
                className={`choice-btn ${answers[currentStep.id] === opt ? "selected" : ""}`}
                onClick={() => {
                  handleInputChange(currentStep.id, opt);
                  handleNext();
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        );

      case "multi-select":
        const currentSelections = answers[currentStep.id] || [];
        return (
          <div className="choices">
            {currentStep.options.map((opt) => (
              <button
                key={opt}
                className={`choice-btn ${currentSelections.includes(opt) ? "selected" : ""}`}
                onClick={() => {
                  const updated = currentSelections.includes(opt)
                    ? currentSelections.filter((item) => item !== opt)
                    : [...currentSelections, opt];
                  handleInputChange(currentStep.id, updated);
                }}
              >
                {opt}
              </button>
            ))}
            <button className="next-btn" onClick={handleNext}>
              Continue
            </button>
          </div>
        );

      case "end":
        return <p className="text-xl font-semibold">{currentStep.prompt}</p>;

      default:
        return null;
    }
  };

  return (
    <div className="prompt-flow-container">
      <div className="prompt-text">
        <h2>{currentStep.prompt}</h2>
      </div>
      <div className="prompt-input">{renderStep()}</div>
    </div>
  );
};

export default PromptFlow;
