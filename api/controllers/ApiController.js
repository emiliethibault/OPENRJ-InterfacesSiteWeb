/**
 * ApiController
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

module.exports = {
    
    quickstart: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - API - Démarage rapide'
        });
    },

    postVariables: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - API - POST variables'
        });
    },

    postSiteSeries: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - API - POST series pour un site'
        });
    },

    getJob: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - API - GET job'
        });
    },

    getSites: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - API - GET liste des sites'
        });
    },

    getSite: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - API - GET information d\'un site'
        });
    },

    getVariables: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - API - GET liste des variables d\'un site'
        });
    },

    getVariable: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - API - GET information d\'une variable'
        });
    },

    getSiteSeries: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - API - GET series d\'un site'
        });
    },

    getVariableSeries: function (req, res) {
        res.view(null, {
            title: 'OpeNRJ - API - GET series d\'une variable'
        });
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ApiController)
   */
  _config: {}

  
};
