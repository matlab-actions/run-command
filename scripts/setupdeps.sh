#!/bin/bash

RMC_URL='https://ssd.mathworks.com/supportfiles/ci/run-matlab-command/v0/run-matlab-command.zip'

# Create dist directory if it doesn't already exist
DISTDIR="$(pwd)/dist/bin"
mkdir -p $DISTDIR

# Download and extract in a temporary directory
WORKINGDIR=$(mktemp -d -t rmc_build)
cd $WORKINGDIR
wget -O bin.zip $RMC_URL 
unzip -qod bin bin.zip

mv -f bin/* $DISTDIR/

rm -rf $WORKINGDIR
