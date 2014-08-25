var SITEIDKEY = 'SITEID',
    URLBASE = '/sites/'+ SITEIDKEY +'/series/information.json',
    getSeriesInformationPerSite = function (siteID, seriesURL, callback) {
        
    $.ajax({
        type: 'GET',
        url: seriesURL
    }).done(function (result) {
        callback(siteID, result);
    });
},
    updateSeriesInformationHTML = function (siteID, result) {
    var htmlTemplate = $('#template-series-information').clone().html(),
        beginDateTemplate = $('#template-series-information-calendar').clone().html(),
        endDateTemplate = $('#template-series-information-calendar').clone().html(),
        dateTemplate = '';

    htmlTemplate = htmlTemplate.replace('SERIESCOUNT', result.seriesCount);
    htmlTemplate = htmlTemplate.replace('VARIABLENUMBER', result.variablesNumber);
    if (result.startDate !== '' && result.endDate !== '') {
        dateTemplate += beginDateTemplate.replace('DATE', result.startDate);
        dateTemplate += endDateTemplate.replace('DATE', result.endDate);
    }
    $('.'+siteID+'-series-informations-number').html(htmlTemplate);
    $('.'+siteID+'-series-informations-date').html(dateTemplate);
},
    initialize_property_map = function () {
    var propertyLocation = new google.maps.LatLng(43.6732936, 6.8782122);
    var propertyLocation2 = new google.maps.LatLng(43.295237, -0.368205);
    var propertyMapOptions = {
        center: propertyLocation,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false
    };
    var propertyMap = new google.maps.Map(document.getElementById("gmap_default"), propertyMapOptions);
    var propertyMarker = new google.maps.Marker({
        position: propertyLocation,
        map: propertyMap
        //, icon: "assets/images/icons/realestate/map.png"
    });
    var propertyMarker2 = new google.maps.Marker({
        position: propertyLocation2,
        map: propertyMap
        //, icon: "assets/images/icons/realestate/map.png"
    });
};

$('document').ready(function () {
    var sites_list = $('.site-item-box');

    for (var i = 0 ; i < sites_list.length ; i++) {
        var siteID = sites_list[i].className.replace('item-box site-item-box ', ''),
            siteIDURL = URLBASE.replace(SITEIDKEY, siteID);
        getSeriesInformationPerSite(siteID, siteIDURL, function (siteID, result) {
            updateSeriesInformationHTML(siteID, result);
        });
    }
});

window.onload = initialize_property_map();
    