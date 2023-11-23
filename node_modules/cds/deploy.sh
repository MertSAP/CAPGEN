# -*- coding: utf-8 -*-
#
# This file is part of CERN Document Server.
# Copyright (C) 2016 CERN.
#
# CERN Document Server is free software; you can redistribute it
# and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Document Server is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Document Server; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.

set -e # exit with nonzero exit code if anything fails

# clear and re-create the docs directory
rm -rf docs || exit 0;

# compile docs
npm run-script docs

# go to the docs directory and create a *new* Git repo
git clone -b gh-pages --single-branch https://${GH_TOKEN}@${GH_REF} gh-pages
rm -rf gh-pages/*.html gh-pages/styles gh-pages/scripts
cp -r docs/* gh-pages
cd gh-pages

# set the user to CERN Document Server-developer
git config user.name "Harris Tzovanakis"
git config user.email "me@drjova.com"

# add and commit
git add .
git commit -m "docs: deployment to github pages"

# push the docs to gh-pages
git push --quiet origin gh-pages > /dev/null 2>&1
