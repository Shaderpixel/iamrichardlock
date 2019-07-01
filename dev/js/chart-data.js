$(function(){
    if ($('.skill-charts-section').length) {
        var skillChart = {
            "html" : {
                "elementID" : "htmlSkill",
                "skillMastery" : "95",
                "backgroundColor" : '#23527c'
            },
            "css" : {
                "elementID" : "cssSkill",
                "skillMastery" : "90",
                "backgroundColor" : '#23527c'
            },
            "javascript" : {
                "elementID" : "jsSkill",
                "skillMastery" : "80",
                "backgroundColor" : '#23527c'
            },
            "drupal" : {
                "elementID" : "drupalSkill",
                "skillMastery" : "75",
                "backgroundColor" : '#23527c'
            },
            "php&mysql" : {
                "elementID" : "phpSkill",
                "skillMastery" : "40",
                "backgroundColor" : '#607D8B'
            },
            "photoshop" : {
                "elementID" : "psSkill",
                "skillMastery" : "60",
                "backgroundColor" : '#607D8B'
            },
            "illustrator" : {
                "elementID" : "aiSkill",
                "skillMastery" : "45",
                "backgroundColor" : '#607D8B'
            },
            "sql" : {
                "elementID" : "sqlSkill",
                "skillMastery" : "60",
                "backgroundColor" : '#607D8B'
            },
            "vb&vba" : {
                "elementID" : "vbSkill",
                "skillMastery" : "70",
                "backgroundColor" : '#607D8B'
            },
            "asp" : {
                "elementID" : "aspSkill",
                "skillMastery" : "20",
                "backgroundColor" : '#607D8B'
            }

        };

        //loop through all skills and draw chart for each skill
        for (var skill in skillChart) {
            var ctx = document.getElementById(skillChart[skill].elementID);
            var skillValue = skillChart[skill].skillMastery;
            drawSkillChart(ctx, skillValue, skillChart[skill].backgroundColor);
        }
    }

        //to draw just skill charts
        function drawSkillChart(ctx, skillValue, chartColor) {
            var drawChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ["HTML Mastery", "Remaining to Awesome"],
                    datasets: [{
                        label: '# of Votes',
                        data: [skillValue, 100 - skillValue],
                        backgroundColor: [
                            chartColor, "#eee"
                        ],
                        hoverBackgroundColor: [
                            chartColor, "#eee"
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    cutoutPercentage: 75,
                    legend : {
                        display: false
                    },
                    tooltips : {
                        enabled: false
                    }
                }
            });
        }


    }
);
