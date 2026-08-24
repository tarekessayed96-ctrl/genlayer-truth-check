import { createClient } from "https://esm.sh/genlayer-js@1.1.8";
import { studionet } from "https://esm.sh/genlayer-js@1.1.8/chains";

const CONTRACT_ADDRESS =
  "0x7cFBC976d79Ce4eA25D008ECb8572C1943572715";

export async function submitClaim(account, claim, sourceA, sourceB) {
  const client = createClient({
    chain: studionet,
    account: account,
    provider: window.ethereum
  });

  await client.connect("studionet");

  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "verify_claim",
    args: [claim, sourceA, sourceB],
    value: BigInt(0)
  });

  return txHash;
}
