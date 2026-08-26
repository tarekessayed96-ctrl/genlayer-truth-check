const CONTRACT_ADDRESS =
  "0x8b48adc727596D0C80AC9Fc5F2d1e08b6c270CBc";

async function verifyClaim() {
  const claim = document.getElementById("claim").value.trim();
  const sourceA = document.getElementById("sourceA").value.trim();
  const sourceB = document.getElementById("sourceB").value.trim();
  const result = document.getElementById("result");

  if (!claim || !sourceA || !sourceB) {
    result.textContent = "Please fill in all fields.";
    return;
  }

  if (!window.ethereum) {
    result.textContent =
      "Please open this app inside your OKX Wallet browser.";
    return;
  }

  try {
    result.textContent = "Connecting to OKX Wallet...";

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    const walletAddress = accounts[0];

    result.textContent =
      "Wallet connected:\n" +
      walletAddress +
      "\n\nConnecting to GenLayer...";

    const { createClient } =
      await import("https://esm.sh/genlayer-js@1.1.8");

    const { studionet } =
      await import("https://esm.sh/genlayer-js@1.1.8/chains");

    const client = createClient({
      chain: studionet,
      account: walletAddress,
      provider: window.ethereum
    });

    const requestId = crypto.randomUUID();

    result.textContent =
      "Submitting claim to GenLayer...\n\n" +
      "Request ID:\n" +
      requestId +
      "\n\nPlease confirm the transaction in OKX Wallet.";

    const txHash = await client.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: "verify_claim",
      args: [claim, sourceA, sourceB, requestId],
      value: BigInt(0)
    });

    result.textContent =
      "Verification submitted.\n\n" +
      "Request ID:\n" +
      requestId +
      "\n\n" +
      "Transaction:\n" +
      txHash +
      "\n\nWaiting for GenLayer transaction finality...";

    const receipt = await client.waitForTransactionReceipt({
      hash: txHash,
      status: "FINALIZED"
    });

    if (
      receipt.txExecutionResultName &&
      receipt.txExecutionResultName !== "FINISHED_WITH_RETURN"
    ) {
      throw new Error(
        "Transaction finalized but contract execution did not finish successfully: " +
        receipt.txExecutionResultName
      );
    }

    result.textContent =
      "Transaction finalized.\n\n" +
      "Reading the result for this request...\n\n" +
      "Request ID:\n" +
      requestId;

    const data = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_result",
      args: [requestId]
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
      "Request ID: " +
      parsed.request_id +
      "\n\n" +
      "Verdict: " +
      parsed.verdict +
      "\n\n" +
      "Claim: " +
      parsed.claim +
      "\n\n" +
      "Explanation:\n" +
      parsed.explanation +
      "\n\n" +
      "Sources:\n" +
      (Array.isArray(sources) ? sources.join("\n") : sources) +
      "\n\n" +
      "Transaction:\n" +
      txHash +
      "\n\n" +
      "Contract: " +
      CONTRACT_ADDRESS +
      "\nChain: 61999";
  } catch (error) {
    console.error(error);

    result.textContent =
      "Verification failed.\n\n" +
      (error?.message || String(error));
  }
}
