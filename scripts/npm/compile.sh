#!/bin/sh
WHEREAMI=$(pwd);
OLDPATH="$PATH"

# $HYBRIXD/deterministic/scripts/npm  => $HYBRIXD
SCRIPTDIR="`dirname \"$0\"`"
HYBRIXD="`cd \"$SCRIPTDIR/../../..\" && pwd`"

DETERMINISTIC="$HYBRIXD/deterministic"

export PATH="$DETERMINISTIC/node_binaries/bin:$PATH"


cd "$DETERMINISTIC/modules"

for D in *; do
    if [ -d "${D}" ]; then
      sh "$DETERMINISTIC/scripts/npm/compile_module.sh" "$D"
    fi
done

rsync -aK "$DETERMINISTIC/lib/" "$DETERMINISTIC/dist/"


export PATH="$OLDPATH"
cd "$WHEREAMI"
