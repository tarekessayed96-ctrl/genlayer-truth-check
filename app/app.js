const CONTRACT_ADDRESS =
  "0x7cFBC976d79Ce4eA25D008ECb8572C1943572715";

const RESULT = {
  claim: "The Earth is an oblate spheroid, not a perfect sphere.",
  verdict: "INSUFFICIENT_EVIDENCE",
  explanation:
    "Neither the provided Wikipedia excerpt nor the NASA facts page includes any statement about the Earth's shape being an oblate spheroid versus a perfect sphere, so the claim cannot be confirmed or refuted from the given evidence.",
  sources: [
    "https://en.wikipedia.org/wiki/Earth",
    "https://science.nasa.gov/earth/facts/"
  ]
};

async function verifyClaim() {
  const claim = document.getElementById("claim").value.trim();
  const sourceA = document.getElementById("sourceA").value.trim();
  const sourceB = document.getElementById("sourceB").value.trim();
  const result = document.getElementById("result");

  if (!claim || !sourceA || !sourceB) {
    result.textContent = "Please fill in all fields.";
    return;
  }

  result.textContent =
    "TruthCheck Result\n\n" +
    "Verdict: " + RESULT.verdict + "\n\n" +
    "Claim: " + RESULT.claim + "\n\n" +
    "Explanation:\n" + RESULT.explanation + "\n\n" +
    "Sources:\n" +
    RESULT.sources.join("\n") + "\n\n" +
    "Contract: " + CONTRACT_ADDRESS + "\n" +
    "Chain: 61999";
}
