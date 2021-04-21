IMPORTANT:

A special networks.js is included in ./
This file is used to inject coininfo network definitions into bitcoinjslib.networks

Besides the definitions in node_modules/coininfo we also use coininfo_old which still supports flo.

To add deterministic support for a coin that is not or no longer in coininfo, please add a file (e.g. btc.js) to
 ./coininfo_old/lib/coins/

Then make sure the coin is included (require) in
 ./coininfo_old/lib/coininfo.js

Finally reference to the coin in your recipe by specifying mode.submode
 Example: bitcoinjslib.litecoin
