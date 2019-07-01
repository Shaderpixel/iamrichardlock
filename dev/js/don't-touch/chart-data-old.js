    //**********************
    //Chart.js related code
    //**********************

    //Chart is a global variable

  //Chart settings
     // make charts responsive to browser size
    Chart.defaults.global.responsive = true;

     // String - Template string for multiple tooltips with thousand comma separator
    //Original multi-tooltip template without thousand separator "<%if (datasetLabel){%><%=datasetLabel%>: <%= value %> <%}%>";
    Chart.defaults.global.multiTooltipTemplate = function(label) {
        if (label.datasetLabel) {
          return label.datasetLabel + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };
    }

     // There is no global legendTemplate !!

     // Add thousand comma separator to y-axis numbers
     Chart.defaults.global.scaleLabel = function(label){
      return label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

  var barData = {

  ucrData: {
        unit:'mtongsf',
        chartType: 'line',
            labels: ['2012', '2013', '2014', '2015 YTD'],
          datasets: [
            {
                label: 'Murder',
                fillColor: 'rgba(0,0,0,0)',
                strokeColor: '#F57F29',      //if strokeColor is not provided but hightlightStroke is, it will break the hover highlight property
                    //highlightFill:'rgba(27, 154, 232,0.75)',
                pointColor: '#F57F29',
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#F57F29",

                data: [0,0,0,0]
            },
            {
                label: 'Forcible Rape',
                fillColor: 'rgba(0,0,0,0)',
                strokeColor: '#D00000',      //if strokeColor is not provided but hightlightStroke is, it will break the hover highlight property
                    //highlightFill:'rgba(27, 154, 232,0.75)',
                pointColor: '#D00000',
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#D00000",

                data: [2,1,1,1]
            },
            {
                label: 'Robbery',
                fillColor: 'rgba(0,0,0,0)',
                strokeColor: '#19857E',      //if strokeColor is not provided but hightlightStroke is, it will break the hover highlight property
                    //highlightFill:'rgba(27, 154, 232,0.75)',
                pointColor: '#19857E',
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#19857E",

                data: [3,1,2,0]
            },
            {
                label: 'Aggravated Assault',
                fillColor: 'rgba(0,0,0,0)',
                strokeColor: '#3B403C',      //if strokeColor is not provided but hightlightStroke is, it will break the hover highlight property
                    //highlightFill:'rgba(27, 154, 232,0.75)',
                pointColor: '#3B403C',
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#3B403C",

                data: [3,2,1,1]
            },
            {
                label: 'Burglary',
                fillColor: 'rgba(0,0,0,0)',
                strokeColor: '#10669D',      //if strokeColor is not provided but hightlightStroke is, it will break the hover highlight property
                    //highlightFill:'rgba(27, 154, 232,0.75)',
                pointColor: '#10669D',
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#10669D",

                data: [5,6,9,6]
            },
            {
                label: 'Larceny-Theft',
                fillColor: 'rgba(0,0,0,0)',
                strokeColor: '#369D3E',      //if strokeColor is not provided but hightlightStroke is, it will break the hover highlight property
                    //highlightFill:'rgba(27, 154, 232,0.75)',
                pointColor: '#369D3E',
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#369D3E",

                data: [201,209,243,198]
            },
            {
                label: 'Motor Vehicle Theft',
                fillColor: 'rgba(0,0,0,0)',
                strokeColor: '#634BAA',      //if strokeColor is not provided but hightlightStroke is, it will break the hover highlight property
                    //highlightFill:'rgba(27, 154, 232,0.75)',
                pointColor: '#634BAA',
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#634BAA",

                data: [5,4,7,1]
            },
            {
                label: 'Arson',
                fillColor: 'rgba(0,0,0,0)',
                strokeColor: '#4BA8AA',      //if strokeColor is not provided but hightlightStroke is, it will break the hover highlight property
                    //highlightFill:'rgba(27, 154, 232,0.75)',
                pointColor: '#4BA8AA',
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#4BA8AA",

                data: [1,0,2,1]
            }
          ]
    }


  };



  function drawChart(targetID) {
   var targetCanvas = targetID + "-canvas";
   var context = document.getElementById(targetCanvas).getContext('2d');


     //additional options for generating chart can go in to the localChartOptions variable e.g. custom legendTemplate like below
        //E.g. legendTemplate: "<h6>Legends</h6><ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span class=\"legends-color\" style=\"background-color:<%=datasets[i].strokeColor%>\">&nbsp;</span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
     //The above legendTemplate will be dynamic because the labels are dynamically generated from the data source variable bardata[targetID]
  var localChartOptions = {};

  //if units exist in barData then add units to the multiTooltipTemplate which is then assigned to the localChartOptions variable. Add other chart options at the back of this option! e.g. localChartOptions = localChartOptions + ", animation: false"
    switch (barData[targetID].unit) {
      case 'dollars':
        localChartOptions.multiTooltipTemplate = function(label) {
        if (label.datasetLabel) {
          return label.datasetLabel + ': $' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };
        };
        break;
      case 'gallons':
        localChartOptions.multiTooltipTemplate = function(label) {
        if (label.datasetLabel) {
          return label.datasetLabel + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' gal';
        };
        };
        break;
      case 'watts':
    // String - Template string for single tooltips
      localChartOptions.tooltipTemplate = function(label) {
        if (label.datasetLabel) {
          return label.datasetLabel + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' KWh';
        };
        };
        // String - Template string for multiple tooltips
        localChartOptions.multiTooltipTemplate = function(label) {
        if (label.datasetLabel) {
          return label.datasetLabel + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' KWh';
        };
        };
        break;
      case 'klb':
        localChartOptions.multiTooltipTemplate = function(label) {
        if (label.datasetLabel) {
          return label.datasetLabel + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' Klbs';
        };
        };
        break;
      case 'ktons':
        localChartOptions.multiTooltipTemplate = function(label) {
        if (label.datasetLabel) {
          return label.datasetLabel + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' Ktons';
        };
        };
        break;
      case 'kcf':
        localChartOptions.multiTooltipTemplate = function(label) {
        if (label.datasetLabel) {
          return label.datasetLabel + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' KCf';
        };
        };
        break;
       case 'percent':
        //pie chart uses tooltipTemplate and doesn't have datasetLabel
        localChartOptions.tooltipTemplate = function(label) {
        if (label.datasetLabel) {
          return label.datasetLabel + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' %';
        }
        else if (label.label) {
          return label.label + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '%';
        };
      };

      localChartOptions.multiTooltipTemplate = function(label) {
        if (label.datasetLabel) {
          return label.datasetLabel + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' %';
        };
        };
        break;
      case 'mtongsf':
    // String - Template string for single tooltips
      localChartOptions.tooltipTemplate = function(label) {
        if (label.datasetLabel) {
          return label.datasetLabel + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' Mton/GSF';
        };
        };
        break;
       case 'mtonfte':
    // String - Template string for single tooltips
      localChartOptions.tooltipTemplate = function(label) {
        if (label.datasetLabel) {
          return label.datasetLabel + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' Mton/FTE';
        };
        };
        break;
      default:
        //use the default global chart options
    }

  //generate chart according to specified chartType property
  //for piecharts, chart.js library is written with just one array for data instead of multidimension array like bar charts.
  //so for pie and donut charts, need to specify which property array to look at in this case datasets array in barData[targetID]
    switch (barData[targetID].chartType) {
      case 'bar':
        var clientsChart = new Chart(context).Bar(barData[targetID], localChartOptions);
        break;
      case 'line':
        var clientsChart = new Chart(context).Line(barData[targetID], localChartOptions);
        break;
      case 'pie':
        var clientsChart = new Chart(context).Pie(barData[targetID].data, localChartOptions);
        break;
      case 'doughnut':
        var clientsChart = new Chart(context).Doughnut(barData[targetID].data, localChartOptions);
        break;
      default:
        //no default at this point
    }

   //var clientsChart = new Chart(context).Bar(barData[targetID], localChartOptions);

    //use default legend template
   $('.' + targetID + '-legendsContainer').replaceWith(clientsChart.generateLegend());
  };


  //if charts class exists on page, draw chart
  $(function() {


    if  ($('.ucrData-chart').length)
     {
       drawChart('ucrData');
     }

  });

