//variables
var totalTransfersMade = 0;
var zeroTransfers = 0;
var oneTransfers = 0;
var twoTransfers = 0;
var threeTransfers = 0;
var fourOrMoreTransfers = 0;
var captainsArray = [];
var viceCaptainsArray = [];
var gkArray = [];
var defArray = [];
var midArray = [];
var strArray = [];
var benchArray = [];
var totalGwScore = 0;
var loadingPicture = 0;
var transferredPlayers = [];
var transferlinks = [];
var count = 0;
var playersIn = [];
var playersOut = [];
var pointHitsTaken = 0;
var totalTeamValue = 0;
var totalBankValue = 0;
var totalNumberNotPlayed = 0;
var wildcardAvailable = 0;
var inCup = 0;
 
 
 
 
function getTeamValue(inSource, links) {
    if ((/Team value/g)
        .test(inSource) != false) {
        var teamValueCode = $(inSource)
            .find(".ismRHSFinanceList dd")
            .html();
        var teamValue = Number(teamValueCode.toString()
            .match(/(\d+)(.*)(\d+)/g)
            .toString());
        totalTeamValue += teamValue
        var bankValueCode = $(inSource)
            .find(".ismRHSFinanceList dd:odd")
            .html();
        var bankValue = Number(bankValueCode.toString()
            .match(/(\d+)(.*)(\d+)/g)
            .toString());
        totalBankValue += bankValue
        $('div#averageteamvalue')
            .text((totalTeamValue / links.length)
                .toFixed(1) + "m");
        $('div#averagebankvalue')
            .text((totalBankValue / links.length)
                .toFixed(1) + "m");
        if ((/<dd>Available/g)
            .test(inSource) != false) {
            wildcardAvailable++
            $('div#wildcard')
                .text(((wildcardAvailable / links.length) * 100)
                    .toFixed(2) + "%");
        }
    } else {
        $('div#averageteamvalue')
            .text("Login.");
        $('div#averagebankvalue')
            .text("Login.");
        $('div#wildcard')
            .text("Login.");
    }
}
 
function getPlayersLeft(inSource, links) {
    if ((/<td>Minutes played<\/td> <td>(.*)<\/td>/g)
        .test(inSource) != false) {
        var minutesPlayed = inSource.match(/<td>Minutes played<\/td> <td>(.*)<\/td>/g)
            .slice(0, 11);
        var notPlayed = (/<td>Minutes played<\/td> <td>0<\/td>/g)
            .test(minutesPlayed);
        var numberNotPlayed = 0;
        if (notPlayed != false) {
            numberNotPlayed = minutesPlayed.toString()
                .match(/<td>Minutes played<\/td> <td>0<\/td>/g)
                .length;
        }
        totalNumberNotPlayed += numberNotPlayed
        var totalNumberPlayed = 11 - totalNumberNotPlayed / links.length
        $('div#playersplayed')
            .text((totalNumberPlayed)
                .toFixed(2));
    } else {
        $('div#playersplayed')
            .text("n/a");
    }
}
 
function getLeagueName(inLeagueSource, links) {
    var leagueName = $(inLeagueSource)
        .find(".ismTabHeading")
        .html();
    $('div#leagueTitle')
        .text("Statistics for the following league: " + leagueName);
    var headToHead = (/<th scope="col">Pts<\/th\>/g)
        .test(inLeagueSource);
    console.log(headToHead)
    if (headToHead != true) {
        var standardScore = 0
        var overallScoreCode = $(inLeagueSource)
            .find(".ismStandingsTable")
            .html();
        var scores = overallScoreCode.match(/<td>(.*)<\/td>/g);
        newlinks = links.slice(0, 5)
        for (var l = 5; l < newlinks.length * 6; l += 6) {
            standardScore += Number(scores[l].split(">")[1].split("<")[0].replace(",", ""));
            $('div#leagueStandard')
                .text((standardScore / newlinks.length)
                    .toFixed(2));
        };
    } else {
        $('div#leagueStandard')
            .text("H2H");
    }
}
 
function getLeagueAverage(inSource, links) {
    var gwPoints = $(inSource)
        .find(".ismSBPrimary div")
        .html();
    gwPoints = Number(gwPoints.split("<")[0])
    totalGwScore += gwPoints
    $('div#output1')
        .text((totalGwScore / links.length)
            .toFixed(2));
 
}
 
function getCount(myArray, links) {
    myArray = myArray.filter(Boolean);
    var results = new Array();
    var links = links
    for (var j = 0; j < myArray.length; j++) {
        var key = myArray[j].toString(); // make it an associative array
        if (!results[key]) {
            results[key] = 1
        } else {
            results[key] = results[key] + 1;
        }
    }
    var string = ""; // Display the results
    var sortedArray = [];
    for (var k in results) {
        if (results.hasOwnProperty(k))
            sortedArray.push({
                name: k,
                value: results[k]
            });
    }
    sortedArray.sort(function(a, b) {
        return parseFloat(b.value) - parseFloat(a.value)
    });
 
    for (var j in sortedArray) {
        string += sortedArray[j].name + ": " + (sortedArray[j].value * 100 / links.length)
            .toFixed(2) + "%, "
    }
    return (string);
}
 
function getTransfers(inTransfers, links) {
    if (inTransfers == 0) {
        zeroTransfers += 1;
    };
    if (inTransfers == 1) {
        oneTransfers += 1;
    };
    if (inTransfers == 2) {
        twoTransfers += 1;
    };
    if (inTransfers == 3) {
        threeTransfers += 1;
    };
    if (inTransfers > 3) {
        fourOrMoreTransfers += 1;
    };
    $('div#output2')
        .text((zeroTransfers * 100 / links.length)
            .toFixed(2) + "%");
    $('div#output3')
        .text((oneTransfers * 100 / links.length)
            .toFixed(2) + "%");
    $('div#output4')
        .text((twoTransfers * 100 / links.length)
            .toFixed(2) + "%");
    $('div#output5')
        .text((threeTransfers * 100 / links.length)
            .toFixed(2) + "%");
    $('div#output6')
        .text((fourOrMoreTransfers * 100 / links.length)
            .toFixed(2) + "%");
 
}
 
function getCaptains(inSource, links, i) {
    var captainsCode = inSource.match(/ismCaptainOn(.*)ismElementText/g);
    var captainsName = (captainsCode.toString())
        .match(/JS_ISM_NAME">(.*)</g);
    captainsName = (captainsName[0].split(">")[1])
        .split("<")[0];
    captainsArray[i] = captainsName;
 
    var viceCaptainsCode = inSource.match(/ismViceCaptainOn(.*)ismElementText/g);
    var viceCaptainsName = (viceCaptainsCode.toString())
        .match(/JS_ISM_NAME">(.*)</g);
    viceCaptainsName = (viceCaptainsName[0].split(">")[1])
        .split("<")[0];
    viceCaptainsArray[i] = viceCaptainsName;
 
    captainsArray = captainsArray.filter(Boolean);
    viceCaptainsArray = viceCaptainsArray.filter(Boolean);
 
    $('div#output7')
        .text("Captain selections: " + getCount(captainsArray, links));
    $('div#output8')
        .text("Vice-Captain selections: " + getCount(viceCaptainsArray, links));
 
 
}
 
function getGks(inSource, links, i) {
    //Goalkeepers
    var gkCode = inSource.match(/ismPitchRow1(.*)ismPitchStat">/g);
    var gkName = (gkCode.toString())
        .match(/JS_ISM_NAME">(.*)</g);
    gkName = (gkName[0].split(">")[1])
        .split("<")[0];
    gkArray[i] = gkName;
    gkArray = gkArray.filter(Boolean)
    $('div#output9')
        .text("Goalkeeper selections: " + getCount(gkArray, links));
}
 
function getOtherPositions(inSource, links) {
 
    var defName = $(inSource)
        .map(function() {
            return $(this)
                .find("#ism .ismPitchRow2 .ismPitchWebName")
                .map(function() {
                    return $(this)
                        .html();
                })
                .get()
                .concat([]);
        })
        .get();
    for (var def = 0; def < defName.length; def++) {
        defName[def] = defName[def].replace(/ /g, "") + " "
    }
    defName = defName.filter(Boolean);
    defName[0] = defName.join("")
    defName = defName[0].split(" ")
        .filter(Boolean)
    defArray = defArray.concat(defName)
    $('div#output10')
        .text("Defender selections: " + getCount(defArray, links));
 
    var midName = $(inSource)
        .map(function() {
            return $(this)
                .find("#ism .ismPitchRow3 .ismPitchWebName")
                .map(function() {
                    return $(this)
                        .html();
                })
                .get()
                .concat([]);
        })
        .get();
    for (var mid = 0; mid < midName.length; mid++) {
        midName[mid] = midName[mid].replace(/ /g, "") + " "
    }
    midName = midName.filter(Boolean);
    midName[0] = midName.join("")
    midName = midName[0].split(" ")
        .filter(Boolean)
    midArray = midArray.concat(midName)
    $('div#output11')
        .text("Midfielder selections: " + getCount(midArray, links));
 
    var strName = $(inSource)
        .map(function() {
            return $(this)
                .find("#ism .ismPitchRow4 .ismPitchWebName")
                .map(function() {
                    return $(this)
                        .html();
                })
                .get()
                .concat([]);
        })
        .get();
    for (var str = 0; str < strName.length; str++) {
        strName[str] = strName[str].replace(/ /g, "") + " "
    }
    strName = strName.filter(Boolean)
    strName[0] = strName.join("")
    strName = strName[0].split(" ")
        .filter(Boolean)
    strArray = strArray.concat(strName)
    $('div#output12')
        .text("Striker selections: " + getCount(strArray, links));
 
    var benchName = $(inSource)
        .map(function() {
            return $(this)
                .find("#ism .ismPitchRow5 .ismPitchWebName")
                .map(function() {
                    return $(this)
                        .html();
                })
                .get()
                .concat([]);
        })
        .get();
    for (var ben = 0; ben < benchName.length; ben++) {
        benchName[ben] = benchName[ben].replace(/ /g, "") + " "
    }
    benchName = benchName.filter(Boolean);
    benchName[0] = benchName.join("")
    benchName = benchName[0].split(" ")
        .filter(Boolean)
    benchArray = benchArray.concat(benchName)
 
    $('div#output13')
        .text("Bench selections: " + getCount(benchArray, links));
}
 
function getTransfersInOut(inTransfers, transferlinks, links, count) {
    $.get(transferlinks[count], function(data) {
        var playersInOut = $(data)
            .map(function() {
                return $(this)
                    .find("#ism .ismViewProfile")
                    .map(function() {
                        return $(this)
                            .html();
                    })
                    .get()
                    .concat([]);
            })
            .get();
        var gameweek = Number($(data)
            .find("caption")
            .html()
            .split(" ")[1]);
        if ((/Failed to qualify for the cup./g)
            .test(data) != true) {
            var cupGw = Number($(data)
                .find(".ismRHSTable tbody tr td")
                .html()
                .split("W")[1]);
            if (cupGw >= gameweek) {
                inCup++
            }
            $('div#incup')
                .text(((inCup / links.length) * 100)
                    .toFixed(2) + "%");
        }
 
        $('div#gameweek')
            .text(gameweek);
        var string = "<td>" + gameweek + "</td>"
        var transfersMadeCode = $(data)
            .find("#ism .ismTable tbody")
            .html();
        var transfersMade = transfersMadeCode.toString()
            .split(string)
            .length - 1
        for (var p = 1; p < transfersMade * 2; p += 2) {
            playersIn = playersIn.concat(playersInOut[p])
            playersOut = playersOut.concat(playersInOut[p - 1])
 
 
        }
        $('div#output20')
            .text("Transferred in players: " + getCount(playersIn, links))
        $('div#output21')
            .text("Transferred out players: " + getCount(playersOut, links))
    });
}
 
function getAvgTransfers(inSource, links, transferlinks) {
    var transfersMadeCode = $(inSource)
        .find("div:nth-child(2) div div:nth-child(2) dd:nth-child(4)")
        .html();
    transfersMade = Number(transfersMadeCode.split("(")[0]);
    pointHit = transfersMadeCode.match(/-(\d+)/g);
    pointHitsTaken += Number(pointHit);
    $('div#output0')
        .text((pointHitsTaken / links.length)
            .toFixed(2));
    totalTransfersMade += transfersMade;
    $('div#output')
        .text((totalTransfersMade / links.length)
            .toFixed(2));
    getTransfers(transfersMade, links)
    getTransfersInOut(transfersMade, transferlinks, links, count)
    count++
}
 
function getWebsite(inUrl) {
    var url = inUrl;
    $.get(url, function(data) {
        var leaguesource = data;
        var links = leaguesource.match(/<td><a href="(.*)">/g)
            .slice(0, 50);
        getLeagueName(leaguesource, links);
        for (var i = 0; i < links.length; i++) {
            links[i] = "http://fantasy.premierleague.com" + links[i].split('"')[1]
            transferlinks[i] = links[i].split("event")[0] + "transfers/history/"
            $.get(links[i], function(data) {
                var teamsource = data;
                getLeagueAverage(teamsource, links);
                getAvgTransfers(teamsource, links, transferlinks);
                getCaptains(teamsource, links, i);
                getGks(teamsource, links, i);
                getOtherPositions(teamsource, links);
                getTeamValue(teamsource, links)
                getPlayersLeft(teamsource, links);
                loadingPicture++;
                if (loadingPicture >= links.length) {
                    $('div#output14')
                        .text(links.length);
                    $('div#loading')
                        .hide();
                }
            });
        };
    });
}
 
document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({}, function(response) {
        getWebsite(response);
    });
});