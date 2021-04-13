#!/bin/sh
WHEREAMI=$(pwd);

SCRIPTDIR="`dirname \"$0\"`"
HYBRIXD="`cd \"$SCRIPTDIR/../../..\" && pwd`"
DETERMINISTIC="$HYBRIXD/deterministic"
NODE="$HYBRIXD/node"

if [ "`uname`" = "Darwin" ]; then
    SYSTEM="darwin-x64"
elif [ "`uname -m`" = "i386" ] || [ "`uname -m`" = "i686" ]; then
    SYSTEM="x86"
elif [ "`uname -m`" = "x86_64" ]; then
    SYSTEM="x86_64"
else
    echo "[!] Unknown Architecture (or incomplete implementation)"
    exit 1;
fi

MODULE="$1"
FORCE="$2"

cd "$DETERMINISTIC/modules/$MODULE"

if [ -n "$FORCE" ]; then
  echo "[.] Forcing compilation of $MODULE..."
else
  echo "[.] Checking $MODULE..."

  if [ "$SYSTEM" = "darwin-x64" ]; then
      NEWEST_FILE="$(find . -type f -print0 | xargs -0 stat -f '%m %N' | sort -rn | head -1 | cut -f2- -d' ')";
  else
      NEWEST_FILE="$(find . -printf '%p\n' | sort -r | head -n1)";
  fi
fi

mkdir -p "$DETERMINISTIC/dist/$MODULE"
#Check if compilation is required
if [ -n "$FORCE" ] || [ ! -e "$DETERMINISTIC/dist/$MODULE/deterministic.js.lzma" ] || [ "$NEWEST_FILE" -nt "$DETERMINISTIC/dist/$MODULE/deterministic.js.lzma" ]; then

  echo "[.] Compiling $MODULE..."

  if [ -e "precompile.sh" ]; then
      sh precompile.sh
  fi
  if [ -e "compile.sh" ]; then
      sh compile.sh
  else
      sh "$DETERMINISTIC/scripts/default/compile.default.sh" "$MODULE"
  fi

  if [ $? -eq 0 ]; then
     echo "[.] Compiling completed"
  else
     echo "[.] Compiling failed"
     exit 1;
  fi

  echo "[.] Move blob to dist"
  mv "deterministic.js.lzma" "$DETERMINISTIC/dist/$MODULE/deterministic.js.lzma"
  if [ -n "$FORCE" ]; then
    echo "[.] Distribute blob to node"
    cp "$DETERMINISTIC/dist/$MODULE/deterministic.js.lzma" "$NODE/modules/deterministic/$MODULE/deterministic.js.lzma"
    echo "[.] Request reload"
    cd "$NODE"
    sh "hybrixd" "/s/deterministic/reload/$MODULE"
  fi
else
    echo "[.] Skip compiling"
fi

cd "$WHEREAMI"
