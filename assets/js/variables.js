google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

var SITEIDKEY = 'SITEID',
    URLBASE = '/sites/'+ SITEIDKEY +'/series/information.json',
    SERIESURLBASE = '/sites/'+ SITEIDKEY +'/variables/*/series',
    FROM = moment().subtract(7, 'days').format(),
    TO = moment().subtract(1, 'days').format(),
    ajaxRequest = function (seriesURL, callback) {
        
    $.ajax({
        type: 'GET',
        url: seriesURL
    }).done(function (result) {
        callback(result);
    });
},
    updateSeriesInformationHTML = function (result) {
    var htmlTemplate = $('#template-series-information').clone().html(),
        beginDateTemplate = $('#template-series-information-calendar').clone().html(),
        endDateTemplate = $('#template-series-information-calendar').clone().html();

    htmlTemplate = htmlTemplate.replace('SERIESCOUNT', result.seriesCount);
    htmlTemplate = htmlTemplate.replace('VARIABLENUMBER', result.variablesNumber);
    if (result.beginDate !== '' && result.endDate !== '') {
        htmlTemplate += beginDateTemplate.replace('DATE', result.startDate);
        htmlTemplate += endDateTemplate.replace('DATE', result.endDate);
    }
    $('.series-information').html(htmlTemplate);
},
    changeVariableFilterInformation = function (variableID) {
        var rowName = '#div-variables-list .'+variableID+'-informations',
            selectName = '#variables-chart-filter'
            classElement = [
                '-type',
                '-unit',
                '-start-date',
                '-end-date',
                '-series-number',
                '-lower-bound',
                '-upper-bound',
                '-delta-min',
                '-delta-max'
            ];
        
        for (var i = 0 ; i < classElement.length ; i++) {
            $(selectName + ' .variable' + classElement[i]).val($(rowName + ' .'+variableID+classElement[i]).html());
        }
},
    updateVariableSeriesInformationHTML = function (variables, callback) {
    var displayedVariableID = $('#variables-chart-filter')[0].className.replace('white-row ', '');

    variables = JSON.parse(variables);
    variables = variables.result;
    for (var i = 0 ; i < variables.length ; i++) {
        moment.locale('fr');
    
        var dateFormatIn = 'YYYY-MM-DDTHH:mm:ss.fffZ',
            dateFormatout = 'D MMM YYYY',
            beginDate = moment(variables[i].startDate, dateFormatIn).format(dateFormatout),
            endDate = moment(variables[i].endDate, dateFormatIn).format(dateFormatout),
            seriesNumber = variables[i].count,
            startDateClass = '.' + variables[i].variableID+ '-start-date',
            endDateClass = '.' + variables[i].variableID+ '-end-date',
            perioClass = '.' + variables[i].variableID+ '-period',
            seriesNumberClass = '.' + variables[i].variableID+ '-series-number';
        $(perioClass).html(beginDate +' - '+ endDate);
        $(seriesNumberClass).html(seriesNumber);
        $(startDateClass).html(beginDate);
        $(endDateClass).html(endDate);


        if (variables[i].variableID === displayedVariableID) {
            $('#variables-chart-filter .variable-start-date').val(beginDate);
            $('#variables-chart-filter .variable-end-date').val(endDate);
            $('#variables-chart-filter .variable-series-number').val(seriesNumber);
        }
    }
    callback();
},
    loadVariableTable = function () {
    $('#table-variables-list').dataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/725b2a2115b/i18n/French.json"
        }
    });
    $('#table-variables-list').removeClass('hidden');
    $('#variables-chart-filter .filter-properties').removeClass('hidden');
    $('.loading-variables-list').addClass('hidden');
},
    drawChart = function (seriesFromTo, fromDate, toDate) {
    
    var data = new google.visualization.DataTable(),
        seriesArray = [];
  
    seriesFromTo = JSON.parse(seriesFromTo);

    console.log(seriesFromTo);

    if (seriesFromTo.result.length > 0) {
        seriesFromTo = seriesFromTo.result[0];

        for (var i = 0 ; i < seriesFromTo.series.length ; i++) {
            seriesArray.push([new Date(seriesFromTo.series[i].isodate), parseInt(seriesFromTo.series[i].value)]);
        }
    }
    $('.chart-series-number').val(seriesArray.length);
    // Declare columns
    data.addColumn('datetime', 'Time of Day');
    data.addColumn('number', 'Consommation');
    // Add data.
    data.addRows(seriesArray);

    // Create and draw the visualization.
    new google.visualization.AreaChart(document.getElementById('chart')).draw(
        data,
        {
            curveType: 'function',
            hAxis: {
                maxValue: new Date(toDate),
                minValue: new Date(fromDate)
            },
            vAxis: {
                minValue: 0,
                minValue: 10
            },
            colors: ['#a0d0e0', '#3c8dbc'],
            chartArea:{
                width: '85%',
                height: '90%'
            },
            legend: {
                position: 'top',
                textStyle: {
                    fontSize: 16
                }
            }
        }
    );
};

$('document').ready(function () {
    var sites_list = $('.actual-site-information'),
        siteID = sites_list[0].className.replace('white-row actual-site-information ', ''),
        siteIDURL = URLBASE.replace(SITEIDKEY, siteID),
        siteSeriesURL = SERIESURLBASE.replace(SITEIDKEY, siteID),
        displayedVariableID = $('#variables-chart-filter')[0].className.replace('white-row ', ''),
        seriesFromToURL = siteSeriesURL.replace('*', displayedVariableID) + '?from='+ FROM +'&to='+ TO;

    ajaxRequest(siteIDURL, function (result) {
        updateSeriesInformationHTML(result);
        ajaxRequest(siteSeriesURL, function (series) {
            updateVariableSeriesInformationHTML(series, function () {
                loadVariableTable();
            });
            ajaxRequest(seriesFromToURL, function (seriesFromTo) {
                drawChart(seriesFromTo, FROM, TO);
            });
        });
    });

    $('#variables-chart-selector').change(function () {
        var variableID = $('#variables-chart-selector').val(),
            rowName = '#div-variables-list .'+variableID+'-informations'
            variableLabel = $(rowName + ' .'+variableID+'-label').html(),
            siteID = sites_list[0].className.replace('white-row actual-site-information ', ''),
            siteIDURL = URLBASE.replace(SITEIDKEY, siteID),
            siteSeriesURL = SERIESURLBASE.replace(SITEIDKEY, siteID),
            seriesFromToURL = siteSeriesURL.replace('*', variableID) + '?from='+ FROM +'&to='+ TO;

        changeVariableFilterInformation(variableID);

        $('#chart').html('<div style="text-align: center;"><img src="/images/loading.gif" alt="loading" /></div>');
        $('.chart-variable-label').html(variableLabel);
        ajaxRequest(seriesFromToURL, function (seriesFromTo) {
            drawChart(seriesFromTo, FROM, TO);
        });
    });
    $('#datepickerBeginDate').datepicker({
        onSelect: function() {
            var from = moment($('#datepickerBeginDate').datepicker('getDate')).format(),
                to = moment($('#datepickerEndDate').datepicker('getDate')).format(),
                variableID = $('#variables-chart-selector').val(),
                rowName = '#div-variables-list .'+variableID+'-informations'
                variableLabel = $(rowName + ' .'+variableID+'-label').html(),
                siteID = sites_list[0].className.replace('white-row actual-site-information ', ''),
                siteIDURL = URLBASE.replace(SITEIDKEY, siteID),
                siteSeriesURL = SERIESURLBASE.replace(SITEIDKEY, siteID),
                seriesFromToURL = siteSeriesURL.replace('*', variableID) + '?from='+ from +'&to='+ to;

            changeVariableFilterInformation(variableID);

            $('#chart').html('<div style="text-align: center;"><img src="/images/loading.gif" alt="loading" /></div>');
            $('.chart-variable-label').html(variableLabel);
            ajaxRequest(seriesFromToURL, function (seriesFromTo) {
                drawChart(seriesFromTo, from, to);
            });
        }
    });
    $('#datepickerEndDate').datepicker({
        onSelect: function() {
            var from = moment($('#datepickerBeginDate').datepicker('getDate')).format(),
                to = moment($('#datepickerEndDate').datepicker('getDate')).format(),
                variableID = $('#variables-chart-selector').val(),
                rowName = '#div-variables-list .'+variableID+'-informations'
                variableLabel = $(rowName + ' .'+variableID+'-label').html(),
                siteID = sites_list[0].className.replace('white-row actual-site-information ', ''),
                siteIDURL = URLBASE.replace(SITEIDKEY, siteID),
                siteSeriesURL = SERIESURLBASE.replace(SITEIDKEY, siteID),
                seriesFromToURL = siteSeriesURL.replace('*', variableID) + '?from='+ from +'&to='+ to;

            changeVariableFilterInformation(variableID);

            $('#chart').html('<div style="text-align: center;"><img src="/images/loading.gif" alt="loading" /></div>');
            $('.chart-variable-label').html(variableLabel);
            ajaxRequest(seriesFromToURL, function (seriesFromTo) {
                drawChart(seriesFromTo, from, to);
            });
        }
    });
    
    $('#datepickerBeginDate').datepicker('setDate', new Date(FROM));
    $('#datepickerEndDate').datepicker('setDate', new Date(TO));
});