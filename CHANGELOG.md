# CHANGELOG 1.7.0
* Add the truffle framework companion that uploads the Smartcontract address and ABI file to the Seascape CDN.

# CHANGELOG 1.6.0
* Add the hardhat framework companion that uploads the Smartcontract address and ABI file to the Seascape CDN.
* Add the module to read the ABI
* Add the module to write the ABI
* Add examples for all features.

# CHANGELOG 1.3.3
* Add the `SmartcontractPath` interface.
* Hardcode the CDN base URL into the source code and use the utility `ConfigPath` interface to create the URL.
* The updating the CDN will use the `SmartcontractPath`.

# CHANGELOG 1.3.2
* Add the optional parameter to CdnRead. If the optional parameter is set to true, then it allows to create an empty global variable.

# CHANGELOG 1.3.0
* add `ALIBABA_REGION`
* add `ALIBABA_ACCESSID`
* add `ALIBABA_SECRET`
* add `ALIBABA_BUCKET`
* add the CDN writer `seascape.CdnWrite`