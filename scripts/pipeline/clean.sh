#!/bin/bash
WHEREAMI=$(pwd)

# extract dist
echo "[.] Extract dist folder"
mkdir /tmp/dist
mv ./dist/* /tmp/dist

rm -rf * || true
rm -rf ./.git* || true
rm -rf ./.* || true

mv /tmp/dist/* ./

echo "[.] Done"
cd "$WHEREAMI"
