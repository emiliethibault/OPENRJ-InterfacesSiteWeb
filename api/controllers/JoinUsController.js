/**
 * JoinUsController
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

module.exports = {
    
    openData: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - Open Data'
        });
    },

    joinUs: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - Nous rejoindre'
        });
    },

    faq: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - FAQ'
        });
    },

    api: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - API'
        });
    },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to JoinUsController)
   */
  _config: {}

  
};