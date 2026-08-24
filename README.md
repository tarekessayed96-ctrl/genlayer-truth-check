TruthCheck

A GenLayer-powered decentralized truth verification application.

TruthCheck allows users to submit a real-world claim together with two web sources. The claim is sent to a GenLayer Intelligent Contract, where GenLayer’s consensus mechanism evaluates the provided evidence and returns a transparent verdict.

Live Demo

https://tarekessayed96-ctrl.github.io/genlayer-truth-check/

Intelligent Contract

* Contract: 0x7cFBC976d79Ce4eA25D008ECb8572C1943572715
* Network: GenLayer Studio
* Chain ID: 61999
* Main verification method: verify_claim
* Result method: get_result

How It Works

1. The user enters a claim.
2. The user provides two web sources.
3. TruthCheck connects to the user’s browser wallet.
4. The application calls verify_claim on the GenLayer Intelligent Contract.
5. GenLayer processes the claim using consensus.
6. The application reads the result with get_result.
7. The verdict and explanation are displayed to the user.

Possible Verdicts

* TRUE — the provided evidence supports the claim.
* FALSE — the provided evidence contradicts the claim.
* INSUFFICIENT_EVIDENCE — the provided sources do not provide enough evidence to reach a reliable conclusion.

Example

Claim:

The earth is round.

Example result:

TRUE

The result includes:

* Verdict
* Claim
* Explanation
* Sources
* Transaction hash
* Contract address
* Chain ID

Technology

* GenLayer Intelligent Contracts
* GenLayer Studio
* genlayer-js
* JavaScript
* GitHub Pages
* Browser wallet integration

Project Structure

genlayer-truth-check/
├── app/
│   ├── app.js
│   └── index.html
├── contracts/
└── README.md

Purpose

TruthCheck demonstrates how GenLayer can be used to build applications that evaluate real-world claims using web-based evidence and decentralized consensus.

This project is intended as a demonstration of an Intelligent Contract interacting with a real frontend application.
