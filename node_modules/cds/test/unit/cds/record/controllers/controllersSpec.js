/*
 * This file is part of CERN Document Server.
 * Copyright (C) 2016 CERN.
 *
 * CERN Document Server is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * CERN Document Server is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with CERN Document Server; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

'use strict';

describe('Unit: testing controllers', function() {

  var $controller;
  var $rootScope;
  var ctrl;
  var scope;

  // Inject the angular module
  beforeEach(angular.mock.module('cdsRecord'));

  beforeEach(inject(function(_$controller_, _$rootScope_) {
    // Controller
    $controller = _$controller_;
    // The Scope
    $rootScope = _$rootScope_;
    // Set the scope
    scope = $rootScope;
    // The controller
    ctrl = $controller('cdsRecordCtrl', {
      $scope: scope,
    });
  }));

  it('should have the default parameters', function() {
    // Expect error to be ``null``
    expect(ctrl.cdsRecordError).to.be.equal(null);

    // Expect warning to be ``null``
    expect(ctrl.cdsRecordWarning).to.be.equal(null);

    // Expect loading to be ``true``
    expect(ctrl.cdsRecordLoading).to.be.equal(true);
  });

  it('should trigger the events', function() {
    // Trigger init event
    scope.$broadcast('cds.record.init');

    // Expect loading to be ``false``
    expect(ctrl.cdsRecordLoading).to.be.equal(false);

    // Trigger error event
    scope.$broadcast('cds.record.error', {
      message: 'Bruce Wayne is not Superman Clark Kent is, dah!'
    });

    // Expect error to be the above message
    expect(ctrl.cdsRecordError.message).to.be.equal(
      'Bruce Wayne is not Superman Clark Kent is, dah!'
    );

    // Trigger warning event
    scope.$broadcast('cds.record.warn', {
      message: 'Tell me, do you bleed?'
    });

    // Expect warning to be the above message
    expect(ctrl.cdsRecordWarning.message).to.be.equal(
      'Tell me, do you bleed?'
    );

    // Trigger loading start event
    scope.$broadcast('cds.record.loading.start');

    // Expect loading to be ``false``
    expect(ctrl.cdsRecordLoading).to.be.equal(true);

    // Trigger loading start event
    scope.$broadcast('cds.record.loading.stop');

    // Expect loading to be ``false``
    expect(ctrl.cdsRecordLoading).to.be.equal(false);

    // Expect the url to be ``object``
    var url = ctrl.iframeSrc('suicide squad://Harlay Quinn');
    expect(typeof url).to.be.equal('object');
  });

});
