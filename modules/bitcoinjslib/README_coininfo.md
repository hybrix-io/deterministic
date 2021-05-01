IMPORTANT:

A special networks.js is included in ./coininfo
This file should be copied to ./bitcoinjs-lib/src/
any time that library is updated!


To add deterministic support for a coin, please add a file (e.g. btc.js) to 
 ./coininfo/lib/coins/

Then make sure the coin is included (require) in
 ./coininfo/lib/coininfo.js

Finally reference to the coin in your recipe by specifying mode.submode
 Example: bitcoinjslib.litecoin

