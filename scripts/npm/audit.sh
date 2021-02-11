#!/bin/sh
WHEREAMI="`pwd`";
OLDPATH="$PATH"

# $DETERMINISTIC/scripts/npm  => $DETERMINISTIC
SCRIPTDIR="`dirname \"$0\"`"
DETERMINISTIC="`cd \"$SCRIPTDIR/../..\" && pwd`"

export PATH="$DETERMINISTIC/node_binaries/bin:$PATH"

cd "$DETERMINISTIC"
echo "[.] Checking deterministic..."
npm i
npm update
npm audit fix --force

cd "$DETERMINISTIC/modules"

for D in *; do
    if [ -d "${D}" ] && [ -e "$D/package.json" ]; then
        echo "[.] Checking deterministic: ${D}..."
        cd ${D}
        npm i
        npm update
        npm audit fix --force
        cd ..
    fi
done

export PATH="$OLDPATH"
cd "$WHEREAMI"
