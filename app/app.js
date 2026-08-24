const CONTRACT_ADDRESS =
  "0x7cFBC976d79Ce4eA25D008ECb8572C1943572715";

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
    "Claim ready for GenLayer verification.\n\n" +
    "Contract: " + CONTRACT_ADDRESS + "\n" +
    "Chain: 61999\n\n" +
    "Claim: " + claim + "\n\n" +
    "Source A: " + sourceA + "\n" +
    "Source B: " + sourceB;
}
