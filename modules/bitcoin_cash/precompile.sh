#!/bin/sh
OLDPATH=$PATH
WHEREAMI=`pwd`

# $HYBRIXD/deterministic/modules/bitcoin_cash  => $HYBRIXD
SCRIPTDIR="`dirname \"$0\"`"
HYBRIXD="`cd \"$SCRIPTDIR/../../..\" && pwd`"
DETERMINISTIC="$HYBRIXD/deterministic"
MODULE="$DETERMINISTIC/modules/bitcoin_cash"

# Fix error caused by fault in deserialization of buffer to transaction
sed 's/var copy = new Transaction(transaction.toBuffer());/var copy = new Transaction(transaction.toObject());/g' "$MODULE/node_modules/bitcore-lib-cash/lib/transaction/transaction.js" > "$MODULE/transaction.js.tmp"
mv "$MODULE/transaction.js.tmp" "$MODULE/node_modules/bitcore-lib-cash/lib/transaction/transaction.js"
rm -rf  "$MODULE/transaction.js.tmp"
cd "$WHEREAMI"
