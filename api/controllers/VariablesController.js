/**
 * VariablesController
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
    locationStringifier = require('./SitesController').locationStringifier,
    getSiteInformation = function (url, result, callback) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                result.site = body.sites[0];
            } else {
                result.site = {};
            }

            callback(result);
        });

    },
    getVariablesList = function (url, result, callback) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                result.variables = body.variables;
            } else {
                result.variables = [];
            }

            callback(result);
        });

    },
    HOST = 'https://api.openrj.eu/v1/sites/';

module.exports = {
    
    variables: function (req, res) {
        
        var siteID = req.params.siteID,
            siteURL = HOST + siteID,
            variablesURL = siteURL + '/variables',
            pageTitle = 'OpeNRJ - Variables',
            options = {
                'title': pageTitle,
                'locationStringifier': locationStringifier,
                'displayedVariable': {}
            };
        
        getSiteInformation(siteURL, options, function (result) {
            getVariablesList(variablesURL, result, function (newResult) {
                if (newResult.variables.length > 0) {
                    newResult.displayedVariable = newResult.variables[0];
                } else {
                    newResult.displayedVariable = undefined;
                }
                res.view(null, newResult);
            });
        });
    },

    series: function (req, res) {
        var siteID = req.params.siteID,
            variableID = req.params.variableID,
            siteURL = HOST + siteID,
            variablesURL = siteURL + '/variables',
            seriesURL,
            from = req.query.from,
            to = req.query.to,
            query = '?';

        if (variableID === '*') {
            seriesURL = variablesURL + '/series';
        } else {
            seriesURL =  variablesURL + '/' + variableID + '/series';
        }

        if (from !== undefined) {
            query += 'from='+from;
        }
        if (from !== undefined && to !== undefined) {
            query += '&to='+to;
        }
        if (from === undefined && to !== undefined) {
            query += 'to='+to;
        }
        if (from !== undefined || to !== undefined) {
            seriesURL += query;
        }
        request(seriesURL, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                res.json(200, body);
            } else {
                res.json(200, {});
            }
        });
    },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to VariablesController)
   */
  _config: {}

  
};
