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

var request = require('request');

module.exports = {
    
    sites: function (req, res) {

        var sitesURL = 'https://api.openrj.eu/v1/sites',
            pageTitle = 'OpeNRJ - Sites';

        request(sitesURL, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
            } else {
                body = {
                    'sites': []
                };
            }

            res.view(null, {
                'title': pageTitle,
                'sites': body.sites
            });
        });
    },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SitesController)
   */
  _config: {}

  
};
