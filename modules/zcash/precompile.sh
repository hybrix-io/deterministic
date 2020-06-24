#!/bin/sh
OLDPATH=$PATH
WHEREAMI=`pwd`

# $HYBRIXD/deterministic/modules/zcash  => $HYBRIXD
SCRIPTDIR="`dirname \"$0\"`"
HYBRIXD="`cd \"$SCRIPTDIR/../../..\" && pwd`"
DETERMINISTIC="$HYBRIXD/deterministic"
MODULE="$DETERMINISTIC/modules/zcash"

# Replace missing lodash _.sumBy
sed s/_.sumBy/window.sumBy/g "$MODULE/node_modules/bitcore-lib-zcash/lib/transaction/transaction.js" > "$MODULE/transaction.js.tmp"
mv "$MODULE/transaction.js.tmp" "$MODULE/node_modules/bitcore-lib-zcash/lib/transaction/transaction.js"
rm -rf  "$MODULE/transaction.js.tmp"
cd "$WHEREAMI"
