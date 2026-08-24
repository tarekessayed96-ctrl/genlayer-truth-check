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

  result.textContent = "Reading latest result from GenLayer...";

  try {
    const { createClient } =
      await import("https://esm.sh/genlayer-js@1.1.8");

    const { studionet } =
      await import("https://esm.sh/genlayer-js@1.1.8/chains");

    const client = createClient({
      chain: studionet
    });

    const data = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_result",
      args: []
    });

    let parsed = data;

    if (data instanceof Map) {
      parsed = Object.fromEntries(data.entries());
    }

    let sources = parsed.sources;

    if (typeof sources === "string") {
      try {
        sources = JSON.parse(sources);
      } catch {
        sources = [sources];
      }
    }

    result.textContent =
      "TruthCheck Result\n\n" +
      "Verdict: " + parsed.verdict + "\n\n" +
      "Claim: " + parsed.claim + "\n\n" +
      "Explanation:\n" +
      parsed.explanation + "\n\n" +
      "Sources:\n" +
      (Array.isArray(sources) ? sources.join("\n") : sources) +
      "\n\n" +
      "Contract: " + CONTRACT_ADDRESS +
      "\nChain: 61999";

  } catch (error) {
    console.error(error);

    result.textContent =
      "Unable to read GenLayer result.\n\n" +
      (error?.message || String(error));
  }
}
