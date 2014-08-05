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

var request = require('request'),
    getSiteInformation = function (url, result, callback) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                result['site'] = body.sites[0];
            } else {
                result['site'] = {};
            }

            callback(result);
        });

    },
    getVariablesList = function (url, result, callback) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                result['variables'] = body.variables;
                result['displayedVariable'] = body.variables[0];
            } else {
                result['variables'] = [];
            }

            callback(result);
        });

    };

module.exports = {
    
    variables: function (req, res) {
        
        var siteID = req.params.siteID,
            host = 'https://api.openrj.eu/v1/sites/',
            siteURL = host + siteID,
            variablesURL = siteURL + '/variables',
            seriesURL = variablesURL + '/series',
            pageTitle = 'OpeNRJ - Variables',
            options = {
                'title': pageTitle,
                'displayedVariable': {}
            };
        
        getSiteInformation(siteURL, options, function (result) {
            getVariablesList(variablesURL, result, function (newResult) {
                res.view(null, newResult);
            });
        });
    },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to VariablesController)
   */
  _config: {}

  
};
