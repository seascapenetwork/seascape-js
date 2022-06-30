# CHANGELOG 2.0.1
* `ConfigPath` interface was replaced by `ProjectPath` class.
* `SmartcontractConfig` class was replaced by `SmartcontractParams` class.
* In the SeascapeCdnConfig files, the smartcontract type was renamed to smartcontract category.

# CHANGELOG 2.0.0
* Make the code object-oriented.
* remove `CdnRead` module.
* remove all functions in `CdnWrite` module except `setSmartcontract`.
* add `SeascapeCdnConfig` module.
* add `SeascapeApiConfig` module.
* add `SeascapeAbi` module.
* the truffle framework and hardhat framework CDN configuration update set through a single `setSmartcontract`.
* remove `ALIBABA_BUCKET` environment variable.
* remove `ALIBABA_REGION` environment variable.

# CHANGELOG 1.7.5
* Add the function to `cdnHost` as a preserved word. If the cdnHost is given, it will replace the default CDN host https://cdn.seascape.network

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