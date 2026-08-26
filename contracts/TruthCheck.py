# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json
import typing


class TruthCheck(gl.Contract):
    last_claim: str
    last_verdict: str
    last_explanation: str
    last_sources: str

    def __init__(self):
        pass

    @gl.public.write
    def verify_claim(
        self,
        claim: str,
        source_a: str,
        source_b: str,
        request_id: str
    ) -> typing.Any:

        if not claim.strip():
            raise gl.UserError("Claim cannot be empty")

        if not request_id.strip():
            raise gl.UserError("Request ID cannot be empty")

        if not source_a.startswith("https://"):
            raise gl.UserError("Source A must use HTTPS")

        if not source_b.startswith("https://"):
            raise gl.UserError("Source B must use HTTPS")

        def evaluate_sources():
            response_a = gl.nondet.web.get(source_a)
            response_b = gl.nondet.web.get(source_b)

            evidence_a = response_a.body.decode("utf-8")[:10000]
            evidence_b = response_b.body.decode("utf-8")[:10000]

            prompt = f"""
You are a neutral decentralized fact-checking adjudicator.

Evaluate this real-world claim using ONLY the supplied evidence.

CLAIM:
{claim}

SOURCE A:
{evidence_a}

SOURCE B:
{evidence_b}

Return JSON only:

{{
  "verdict": "TRUE | FALSE | MISLEADING | INSUFFICIENT_EVIDENCE",
  "explanation": "A concise explanation based only on the evidence."
}}

Rules:
- TRUE: the evidence clearly supports the claim.
- FALSE: the evidence clearly contradicts the claim.
- MISLEADING: the claim contains some truth but creates a materially misleading impression.
- INSUFFICIENT_EVIDENCE: the supplied evidence is not sufficient to decide.
- Do not invent facts.
"""

            result = gl.nondet.exec_prompt(
                prompt,
                response_format="json"
            )

            if isinstance(result, str):
                return json.loads(result)

            return result

        result = gl.eq_principle.prompt_comparative(
            evaluate_sources,
            principle="""
The verdict field must match exactly.

The verdict must be one of:
TRUE
FALSE
MISLEADING
INSUFFICIENT_EVIDENCE

The explanation may differ in wording, but it must be consistent
with the supplied sources and the agreed verdict.
"""
        )

        self.last_claim = claim
        self.last_verdict = result["verdict"]
        self.last_explanation = result["explanation"]
        self.last_sources = json.dumps([source_a, source_b])

        return result

    @gl.public.view
    def get_result(self) -> dict:
        return {
            "claim": self.last_claim,
            "verdict": self.last_verdict,
            "explanation": self.last_explanation,
            "sources": self.last_sources,
        }
