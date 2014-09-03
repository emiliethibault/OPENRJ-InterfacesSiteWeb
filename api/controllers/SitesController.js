/**
 * SitesController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

'use strict';

var request = require('request'),
    moment = require('moment'),
    DATE_FORMAT_OUT = 'D MMM YYYY',
    getSitesList = function (url, result, callback) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                result.sites = body.sites;
            } else {
                result.sites = [];
            }

            callback(result);
        });

    },
    updateSeriesInformation = function (site, variable) {
        moment.locale('fr');
        
        var dateFormatIn = 'YYYY-MM-DDTHH:mm:ss.fffZ',
            newStartDate = moment(variable.startDate, dateFormatIn),
            newEndDate = moment(variable.endDate, dateFormatIn);
        
        site.seriesCount += variable.count;
        if (site.startDate === '' || site.startDate > newStartDate) {
            site.startDate = newStartDate;
        }
        if (site.endDate === '' || site.endDate < newEndDate) {
            site.endDate = newEndDate;
        }
    },
    getVariablesNumber = function (variablesURL, callback) {
        
        request(variablesURL, function (error, response, body) {

            var variables = [];

            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                variables = body.variables;
            }
            
            callback(variables.length);
        });
    },
    getSeriesInformationPerSite = function (variablesURL, seriesURL, callback) {           
        var result = {
            'seriesCount': 0,
            'variablesNumber': 0,
            'startDate': '',
            'endDate': ''
        };
        
        request(seriesURL, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                var variables = body.result;
                for (var i = 0 ; i < variables.length ; i++) {
                    updateSeriesInformation(result, variables[i]);
                }
                if (result.startDate !== '') {
                    result.startDate = result.startDate.format(DATE_FORMAT_OUT);
                }
                if (result.endDate !== '') {
                    result.endDate = result.endDate.format(DATE_FORMAT_OUT);
                }
            }

            getVariablesNumber(variablesURL, function (variablesNumber) {
                result.variablesNumber = variablesNumber;
                callback(result);
            });
        });
    },
    locationStringifier = function (location) {
        var locationSt = location;

        if (location === '06') {
            locationSt = 'Alpes-Maritimes (' +location + ')';
        }
        else if (location === '64') {
            locationSt = 'Pyrénées-Atlantiques (' +location + ')';
        }

        return locationSt;
    },
    APIURL = 'https://api.openrj.eu/v1/sites';

module.exports = {
    
    sites: function (req, res) {

        var pageTitle = 'OpeNRJ - Sites',
            options = {
                'title': pageTitle,
                'locationStringifier': locationStringifier
            };

        getSitesList(APIURL, options, function (result) {
            res.view(null, result);
        });
    },

    seriesInformation: function (req, res) {
        var siteID = req.params.siteID,
            variablesURL = APIURL + '/' + siteID + '/variables',
            seriesURL = variablesURL + '/series';

        getSeriesInformationPerSite(variablesURL, seriesURL, function (result) {
            res.json(200, result);
        });
    },


    getSeriesInformationPerSite: getSeriesInformationPerSite,
    updateSeriesInformation: updateSeriesInformation,
    getSitesList: getSitesList,

    locationStringifier: locationStringifier,


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SitesController)
   */
  _config: {}

  
};
