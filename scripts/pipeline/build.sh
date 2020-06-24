#!/bin/sh
OLDPATH=$PATH
WHEREAMI=$(pwd)
export PATH=$WHEREAMI/node_binaries/bin:"$PATH"

echo "[i] Node version $(node --version) $(command -v node)"

echo "[D] list contents"

ls -la

echo "[.] Retrieve node artifact"

curl -s --location --header "JOB-TOKEN:$CI_JOB_TOKEN" "https://gitlab.com/api/v4/projects/hybrix%2Fhybrixd%2Fnode/jobs/artifacts/master/download?job=hybrixd" -o artifacts-hybrixd.zip

unzip -o artifacts-hybrixd.zip -d ./

# remove the zip-file (|| true --> on error, no problem)
rm -rf  artifacts-hybrixd.zip

echo "[D] list contents"

ls -la

echo "[.] Done"
export PATH="$OLDPATH"
cd "$WHEREAMI"
