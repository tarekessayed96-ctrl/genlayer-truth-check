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

  if (!window.ethereum) {
    result.textContent =
      "Please open this app with a browser wallet such as MetaMask.";
    return;
  }

  try {
    result.textContent = "Connecting to your wallet...";

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    const walletAddress = accounts[0];

    result.textContent =
      "Wallet connected:\n" +
      walletAddress +
      "\n\nConnecting to GenLayer Studio...";

    const { createClient } =
      await import("https://esm.sh/genlayer-js@1.1.8");

    const { studionet } =
      await import("https://esm.sh/genlayer-js@1.1.8/chains");

    const client = createClient({
      chain: studionet,
      account: walletAddress,
      provider: window.ethereum
    });

    await client.connect("studionet");

    result.textContent =
      "Submitting verification to GenLayer...\n\n" +
      "Please confirm the transaction in your wallet.";

    const txHash = await client.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: "verify_claim",
      args: [claim, sourceA, sourceB],
      value: BigInt(0)
    });

    result.textContent =
      "Verification submitted.\n\n" +
      "Transaction: " +
      txHash +
      "\n\nWaiting for GenLayer consensus...";

    const receipt = await client.waitForTransactionReceipt({
      hash: txHash,
      status: "ACCEPTED"
    });

    result.textContent =
      "Verification ACCEPTED by GenLayer.\n\n" +
      "Claim: " +
      claim +
      "\n\n" +
      "Transaction: " +
      txHash;
  } catch (error) {
    console.error(error);

    result.textContent =
      "Verification failed.\n\n" +
      (error?.message || String(error));
  }
}
