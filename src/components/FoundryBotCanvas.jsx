import PromptFlow from "./PromptFlow"; // or "../components/PromptFlow"
import { useState } from "react";

export default function FoundryBotCanvas() {
  const [answers, setAnswers] = useState(null);

  return (
    <div className="foundry-bot-canvas">
      {!answers ? (
        <PromptFlow onComplete={(result) => {
          console.log("User input complete:", result);
          setAnswers(result);
          // You can trigger build steps or canvas content generation here
        }} />
      ) : (
        <div>
          <h2>✅ Flow complete. Next: Generating your project…</h2>
          {/* Later: show logo, domain search, or canvas editor */}
        </div>
      )}
    </div>
  );
}
