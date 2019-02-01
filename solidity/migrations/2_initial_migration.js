var token = artifacts.require("./tesContract.sol");
const superowner = '0x26442848FDd5fbD65602A87E173Bf6275B7540D1';

module.exports = function(deployer) {
  deployer.deploy(token, superowner);
};
