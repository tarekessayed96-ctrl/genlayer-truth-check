const CONTRACT_ADDRESS =
  "0x7cFBC976d79Ce4eA25D008ECb8572C1943572715";

async function verifyClaim() {
  const claim = document.getElementById("claim").value;
  const sourceA = document.getElementById("sourceA").value;
  const sourceB = document.getElementById("sourceB").value;
  const result = document.getElementById("result");

  if (!claim.trim() || !sourceA.trim() || !sourceB.trim()) {
    result.textContent = "Please fill in all fields.";
    return;
  }

  result.textContent = "Ready to connect to GenLayer...";

  console.log("Contract:", CONTRACT_ADDRESS);
  console.log("Claim:", claim);
  console.log("Source A:", sourceA);
  console.log("Source B:", sourceB);
}
