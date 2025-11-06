#!/bin/bash

source ./node_modules/common-utils/scripts/setupdeps.sh

mv -f ./* "$DISTDIR/bin"
rm -rf $WORKINGDIR
