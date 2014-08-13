/* global describe, it */
/*jshint expr: true*/

'use strict';

/*

    Given user visit openrj website
        Then it should see home page
        When he clicks on "Les données/Rechercher des données"
            Then he should see "OpenRJ - Sites" in title
            And he sould see CSTB site and metrics
            And he should see CCI site and metrics
            And he sould see Mairie de Biot site and metrics
            And he should see Axun site and metrics
            And he should see Antibes site and metrics
            And he should see Nice site and metrics
        When he selects Localisation/Alpes-Maritimes
            Then he sould see the same site as previous
        When he type "test site" in Nom du site input
            Then he should see only test site site
        When he clicks on test site site
            Then he should go on variable page
            And see a description of test site site
            And see list of variables for test site
            And see a graphic for test_site value

    Given 

*/
var expect = require('expect.js'),
    moment = require('moment'),
    DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    SITES_CONTROLLER = require('../../api/controllers/SitesController'),
    VARIABLE_1 = {
        'startDate': '2014-02-11T00:36:15.000+00:00',
        'endDate': '2014-02-11T23:50:01.000+00:00',
        'count': 105
    },
    VARIABLE_2 = {
        'startDate': '2014-02-11T00:36:15.000+00:00',
        'endDate': '2014-02-11T23:50:01.000+00:00',
        'count': 103
    },
    VARIABLE_3 = {
        'startDate': '2014-02-11T00:22:06.000+00:00',
        'endDate': '2014-02-11T23:50:32.000+00:00',
        'count': 87
    },
    VARIABLE_4 = {
        'startDate': '2013-02-11T00:36:06.000+00:00',
        'endDate': '2014-08-11T23:50:32.000+00:00',
        'count': 87
    },
    VARIABLE_5 = {
        'startDate': '2013-02-11T00:36:06.000+00:00',
        'endDate': '2013-08-11T23:50:32.000+00:00',
        'count': 87
    },
    VARIABLE_LIST = [VARIABLE_1, VARIABLE_2, VARIABLE_3, VARIABLE_4, VARIABLE_5],
    EXPECTED_START_DATE = VARIABLE_5.startDate,
    EXPECTED_END_DATE = VARIABLE_4.endDate,
    EXPECTED_SERIES_COUNT = VARIABLE_1.count + VARIABLE_2.count + VARIABLE_3.count + VARIABLE_4.count + VARIABLE_5.count,
    TEST_SITE_SERIES_COUNT = 569,
    TEST_SITE_START_DATE = '11 févr. 2014',
    TEST_SITE_END_DATE = '8 août 2014',
    TEST_SITE_VARIABLES_NUMBER = 12;

moment.locale('fr');

describe('Sites methods:', function () {

    describe('Given there is 3 Variables', function () {
            
        describe('When we ask for series update information', function () {
                
            it('Then we should receive according date and count for VARIABLE_1', function() {
                var result = {
                    'seriesCount': 0,
                    'variablesNumber': 0,
                    'startDate': '',
                    'endDate': ''
                };
                
                SITES_CONTROLLER.updateSeriesInformation(result, VARIABLE_1);
                
                expect(result.seriesCount).to.equal(VARIABLE_1.count);
                expect(result.startDate.utc().format(DATE_FORMAT)).to.equal(VARIABLE_1.startDate);
                expect(result.endDate.utc().format(DATE_FORMAT)).to.equal(VARIABLE_1.endDate);
            });

            it('Then we should receive according date and count for all variables', function() {
                var result = {
                    'seriesCount': 0,
                    'variablesNumber': 0,
                    'startDate': '',
                    'endDate': ''
                };
                
                for (var i = 0 ; i < VARIABLE_LIST.length ; i++) {
                    SITES_CONTROLLER.updateSeriesInformation(result, VARIABLE_LIST[i]);
                }
                
                expect(result.seriesCount).to.equal(EXPECTED_SERIES_COUNT);
                expect(result.startDate.utc().format(DATE_FORMAT)).to.equal(EXPECTED_START_DATE);
                expect(result.endDate.utc().format(DATE_FORMAT)).to.equal(EXPECTED_END_DATE);
            });
        });

        describe('When we ask for series information per site', function () {
                
            it('Then we should receive according date and count for VARIABLE_1', function(done) {
                var variablesURL = 'https://api.openrj.eu/v1/sites/test_site/variables',
                    seriesURL = variablesURL + '/series';
                
                SITES_CONTROLLER.getSeriesInformationPerSite(variablesURL, seriesURL, function (result) {
                    expect(result.seriesCount).to.equal(TEST_SITE_SERIES_COUNT);
                    expect(result.startDate).to.equal(TEST_SITE_START_DATE);
                    expect(result.endDate).to.equal(TEST_SITE_END_DATE);
                    expect(result.variablesNumber).to.equal(TEST_SITE_VARIABLES_NUMBER);
                    done();
                }); 
            });
        });
    });
});