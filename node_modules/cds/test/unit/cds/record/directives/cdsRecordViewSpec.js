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

describe('Unit: testing directive cds-record-view', function() {

  var $compile,
      $rootScope,
      scope,
      template,
      $httpBackend,
      urlRecord = 'https://cds.mydomain.com/record',
      urlRecordViews = 'https://cds.mydomain.com/recordviews',
      recordDefault = {
        title_statement: {
          title: 'Jessica Jones Vol. 1'
        }
      },
      recordViewsDefault = {};

  // Inject the angular module
  beforeEach(angular.mock.module('cdsRecord'));

  // Load the templates
  beforeEach(angular.mock.module('templates'));

  beforeEach(inject(function($injector) {
    // Template compiler
    $compile = $injector.get('$compile');
    // The Scope
    $rootScope = $injector.get('$rootScope');
    // Attach it
    scope = $rootScope;

    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should trigger init event', function() {
    // Spy the broadcast
    var spy = sinon.spy($rootScope, '$broadcast');

    $httpBackend.whenGET(urlRecord).respond(200, recordDefault);
    $httpBackend.whenGET(urlRecordViews).respond(200, recordViewsDefault);

    // Complile&Digest here to catch the event
    // The directive's template
    template = '<cds-record-view ' +
      ' record="' + urlRecord  + '"' +
      ' record-views="' + urlRecordViews  + '"' +
      ' template="src/cds/record/templates/record.html">' +
      ' </cds-record-view>';
    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();
    // execute backend call
    $httpBackend.flush();

    // Check if the event has been triggered
    spy.should.have.been.calledOnce;
  });

  it('should trigger error', function() {
    // Spy the broadcast
    var spy = sinon.spy($rootScope, '$broadcast');

    $httpBackend.whenGET(urlRecord).respond(500, 'error');
    $httpBackend.whenGET(urlRecordViews).respond(500, 'record');

    // Complile&Digest here to catch the event
    // The directive's template
    template = '<cds-record-view ' +
      ' record="' + urlRecord  + '"' +
      ' record-views="' + urlRecordViews  + '"' +
      ' template="src/cds/record/templates/record.html">' +
      ' </cds-record-view>';
    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();
    // execute backend call
    $httpBackend.flush();

    // Check if the event has been triggered
    spy.should.have.been.calledWith('cds.record.error');
  });

  it('should have the default parameters', function() {
    $httpBackend.whenGET(urlRecord).respond(200, recordDefault);
    $httpBackend.whenGET(urlRecordViews).respond(200, recordViewsDefault);

    // Complile&Digest here to catch the event
    // The directive's template
    template = '<cds-record-view ' +
      ' record="' + urlRecord  + '"' +
      ' record-views="' + urlRecordViews  + '"' +
      ' template="src/cds/record/templates/record.html">' +
      ' </cds-record-view>';
    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();
    // execute backend call
    $httpBackend.flush();

    expect(template.scope().record.title_statement.title)
      .to.be.equal('Jessica Jones Vol. 1');
    // Digest
    scope.$digest();
  });

  it('should log media download for master video file', function() {
    $httpBackend.whenGET(urlRecordViews).respond(200, recordViewsDefault);

    var endpoint = 'https://test.mydomain.com/download?',
        url = endpoint + 'recid={recid}&report_number={report_number}&format={format}&quality={quality}',
        recordMasterFile = {
          metadata: {
            recid: 12345,
            report_number: ['OPEN-MOVIE-2017-022-002'],
            _files: [{
              context_type: 'master',
              key: 'OPEN-MOVIE-2017-022-002-1436-kbps-853x480-audio-64-kbps-stereo.mp4',
            }]
          }
        },
        expectedUrl = url
        .replace('{recid}', recordMasterFile.metadata.recid)
        .replace('{report_number}', recordMasterFile.metadata.report_number[0])
        .replace('{format}', 'mp4')
        .replace('{quality}', 'master');

    $httpBackend.whenGET(urlRecord).respond(200, recordMasterFile);

    template = '<cds-record-view ' +
      ' record="' + urlRecord  + '"' +
      ' record-views="' + urlRecordViews  + '"' +
      ' template="src/cds/record/templates/downloads.html"' +
      ' media-download-event-url="' + url + '">' +
      ' </cds-record-view>';

    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();
    // execute backend call to fetch record
    $httpBackend.flush();

    $httpBackend.expectGET(expectedUrl).respond(204, '');
    // click on the link to donwload the file
    $(template).find('#download').click();
    // execute backend call to send log event
    $httpBackend.flush();
  });

  it('should log media download for a subformat video file', function() {
    $httpBackend.whenGET(urlRecordViews).respond(200, recordViewsDefault);

    var endpoint = 'https://test.mydomain.com/download?',
        url = endpoint + 'recid={recid}&report_number={report_number}&format={format}&quality={quality}',
        recordSubformatFile = {
          metadata: {
            recid: 12345,
            report_number: ['OPEN-MOVIE-2017-022-002'],
            _files: [{
              context_type: 'subformat',
              key: 'OPEN-MOVIE-2017-022-002-1436-kbps-853x480-audio-64-kbps-stereo.ogg',
              tags: {
                preset_quality: '240p'
              }
            }]
          }
        },
        expectedUrl = url
        .replace('{recid}', recordSubformatFile.metadata.recid)
        .replace('{report_number}', recordSubformatFile.metadata.report_number[0])
        .replace('{format}', 'ogg')
        .replace('{quality}', '240p');

    $httpBackend.whenGET(urlRecord).respond(200, recordSubformatFile);

    template = '<cds-record-view ' +
      ' record="' + urlRecord  + '"' +
      ' record-views="' + urlRecordViews  + '"' +
      ' template="src/cds/record/templates/downloads.html"' +
      ' media-download-event-url="' + url + '">' +
      ' </cds-record-view>';

    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();
    // execute backend call to fetch record
    $httpBackend.flush();

    $httpBackend.expectGET(expectedUrl).respond(204, '');
    // click on the link to donwload the file
    $(template).find('#download').click();
    // execute backend call to send log event
    $httpBackend.flush();
  });

  it('should log media download without report_number or file format', function() {
    $httpBackend.whenGET(urlRecordViews).respond(200, recordViewsDefault);

    // missing report_number
    var endpoint = 'https://test.mydomain.com/download?',
        url = endpoint + 'recid={recid}&report_number={report_number}&format={format}&quality={quality}',
        recordMasterFile = {
          metadata: {
            recid: 12345,
            _files: [{
              context_type: 'master',
              key: 'OPEN-MOVIE-2017-022-002-1436-kbps-853x480-audio-64-kbps-stereo.mp4',
            }]
          }
        },
        expectedUrl = url
          .replace('{recid}', recordMasterFile.metadata.recid)
          .replace('{report_number}', '')
          .replace('{format}', 'mp4')
          .replace('{quality}', 'master');

    $httpBackend.whenGET(urlRecord).respond(200, recordMasterFile);

    template = '<cds-record-view ' +
      ' record="' + urlRecord  + '"' +
      ' record-views="' + urlRecordViews  + '"' +
      ' template="src/cds/record/templates/downloads.html"' +
      ' media-download-event-url="' + url + '">' +
      ' </cds-record-view>';

    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();
    // execute backend call to fetch record
    $httpBackend.flush();

    $httpBackend.expectGET(expectedUrl).respond(204, '');
    // click on the link to donwload the file
    $(template).find('#download').click();
    // execute backend call to send log event
    $httpBackend.flush();

    // set empty report_number
    $httpBackend.expectGET(expectedUrl).respond(204, '');
    template.scope().record.metadata['report_number'] = [];
    $(template).find('#download').click();
    $httpBackend.flush();

    // set wrong report_number
    $httpBackend.expectGET(expectedUrl).respond(204, '');
    template.scope().record.metadata['report_number'] = 'wrong, it should be an array';
    $(template).find('#download').click();
    $httpBackend.flush();

    // put back report_number and set wrong filename
    expectedUrl = url
      .replace('{recid}', recordMasterFile.metadata.recid)
      .replace('{report_number}', 'OPEN-MOVIE-2017-022-002')
      .replace('{format}', '')
      .replace('{quality}', 'master');

    $httpBackend.expectGET(expectedUrl).respond(204, '');
    template.scope().record.metadata['report_number'] = ['OPEN-MOVIE-2017-022-002'];
    template.scope().record.metadata._files[0].key = 'filename_with_no_extension';
    $(template).find('#download').click();
    $httpBackend.flush();
  });

  it('should do nothing on video download when log url not set', function() {
    $httpBackend.whenGET(urlRecordViews).respond(200, recordViewsDefault);

    var recordMasterFile = {
          metadata: {
            recid: 12345,
            report_number: ['OPEN-MOVIE-2017-022-002'],
            _files: [{
              context_type: 'master',
              key: 'OPEN-MOVIE-2017-022-002-1436-kbps-853x480-audio-64-kbps-stereo.mp4',
            }]
          }
        };

    $httpBackend.whenGET(urlRecord).respond(200, recordMasterFile);

    template = '<cds-record-view ' +
      ' record="' + urlRecord  + '"' +
      ' record-views="' + urlRecordViews  + '"' +
      ' template="src/cds/record/templates/downloads.html">' +
      ' </cds-record-view>';

    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();
    // execute backend call to fetch record
    $httpBackend.flush();

    // click on the link to donwload the file
    $(template).find('#download').click();

    expect($httpBackend.verifyNoOutstandingExpectation).to.not.throw();
  });

});
