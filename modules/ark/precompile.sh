#!/bin/sh
OLDPATH=$PATH
WHEREAMI=`pwd`

# $HYBRIXD/deterministic/modules/ark  => $HYBRIXD
SCRIPTDIR="`dirname \"$0\"`"
HYBRIXD="`cd \"$SCRIPTDIR/../../..\" && pwd`"
DETERMINISTIC="$HYBRIXD/deterministic"
MODULE="$DETERMINISTIC/modules/ark"

cp "$MODULE/sleep.js" "$MODULE/node_modules/@arkecosystem/utils/dist/sleep.js"
cd "$WHEREAMI"
