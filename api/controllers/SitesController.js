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

var request = require('request'),
    moment = require('moment'),
    getSitesList = function (url, result, callback) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                result['sites'] = body.sites;
            } else {
                result['sites'] = [];
            }

            callback(result);
        });

    },
    updateSeriesInformation = function (site, variable) {
        moment.locale('fr');
        
        var dateFormatIn = 'YYYY-MM-DDTHH:mm:ss.fffZ',
            dateFormatout = 'D MMM YYYY',
            newBeginDate = moment(variable.series[0].isodate, dateFormatIn).format(dateFormatout),
            newEndDate = moment(variable.series[0].isodate, dateFormatIn).format(dateFormatout);
        
        site['seriesCount'] += variable.count;
        if (site['beginDate'] === '' || site['beginDate'] > newBeginDate) {
            site['beginDate'] = newBeginDate;
        }
        if (site['endDate'] === '' || site['endDate'] < newEndDate) {
            site['endDate'] = newEndDate;
        }
    },
    getSeriesInformationPerSite = function (url, result, index, callback) {
        var seriesInformation;
        
        if (index === result.sites.length) {
            callback(result);
        } else {
            var seriesURL = url + '/' + result.sites[index].extID + '/variables/series';
            
            result.sites[index]['seriesCount'] = 0;
            result.sites[index]['variablesNumber'] = 0;
            result.sites[index]['beginDate'] = '';
            result.sites[index]['endDate'] = '';
            
            request(seriesURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    body = JSON.parse(body);
                    var variables = body.result;
                    if (variables.length) {
                        result.sites[index]['variablesNumber'] = variables.length;
                    }
                    for (var i = 0 ; i < variables.length ; i++) {
                        updateSeriesInformation(result.sites[index], variables[i]);
                    }
                }

                getSeriesInformationPerSite(url, result, index + 1, callback);
            });
        }
    };

module.exports = {
    
    sites: function (req, res) {

        var sitesURL = 'https://api.openrj.eu/v1/sites',
            pageTitle = 'OpeNRJ - Sites',
            options = {
                'title': pageTitle
            };

        getSitesList(sitesURL, options, function (result) {
            getSeriesInformationPerSite(sitesURL, result, 0, function (result) {
                res.view(null, result);
            });
        });
    },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SitesController)
   */
  _config: {}

  
};
