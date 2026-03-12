const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  await voting.waitForDeployment();

  console.log("Voting contract deployed to:", await voting.getAddress());
  
  const candidates = ["Candidate Apple", "Candidate Banana", "Candidate Cherry"];
  for (const name of candidates) {
    await voting.addCandidate(name);
    console.log(`Added candidate: ${name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
