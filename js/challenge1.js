var code_url;
var j = 0;
var timearticle;

// compare date from article/news to actual date

var getdayshours = function (data_time) {
    var today = new Date();
    var datearticle = new Date(data_time * 1000);
    var timeDiff = Math.abs(datearticle.getTime() - today.getTime());
    var diffHours = Math.ceil(timeDiff / (1000 * 3600)); 
    if (diffHours > 24) {
        return Math.ceil(timeDiff / 1000 * 3600 * 24) + " days";
    } else {
        return diffHours + " hours";
    }

}


// function to append data to html file

var show_html = function (data, j) {
    if (data.title !== undefined && data.url !== undefined && data.score !== undefined && data.by !== undefined && data.time !== undefined && data.descendants !== undefined) {
        $("body").append("<div class='col-xs-12' style='border:1px solid black'>");
        $("body").append("<p><a class='newstitle' href='" + data.url + "'>" + data.title +  "</a></p>");
        $("body").append("<p><span  class='scorecomments'>Points: " + data.score + "</span><span class='by'>" + " | by " + "<a class='by' href='https://news.ycombinator.com/user?id=" + data.by + "'>" + data.by +  "</a></p>");
        $("body").append("<p><span  class='scorecomments'>" + getdayshours(data.time) + " ago | </span><span class='by'>" + "<a class='by' href='https://news.ycombinator.com/item?id=" + code_url + "'>" + data.descendants + " " + "comments</a></p>");
        $("body").append("<p></p>");
        $("body").append("</div>");
        j++;
    } 
}

//

var getDataFromHN = function (i, j) {

    var firstpart_url = "https://hacker-news.firebaseio.com/v0/item/";
    var lastpart_url = ".json?print=pretty";
    var final_url = firstpart_url.concat(i,lastpart_url);

    $.get(final_url).done( function(data) {
        if (data.title !== undefined && data.url !== undefined && data.score !== undefined && data.by !== undefined && data.time !== undefined && data.descendants !== undefined) {
            show_html(data);
            j++;
        } 
        i--;
        getDataFromHN(i, j);
    }).fail( function(error){
        i--;
        getDataFromHN(i, j);
    });
}

// get value from last news

$.get( "https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty", function( data_code ) {
    var i = data_code;
    code_url = i;
    getDataFromHN(i, j);
}); 



// EndlessScroll

$(function() {
    $(document).endlessScroll({
      fireOnce: false,
      fireDelay: false,
      //loader: "<div><img src='../img/loader.gif'/></div>",
      callback: function(i) {
        code_url -= 1;
        var firstpart_url = "https://hacker-news.firebaseio.com/v0/item/";
        var lastpart_url = ".json?print=pretty";
        var final_url = firstpart_url.concat(code_url,lastpart_url);
        $("#code").html(final_url);
        $.get(final_url).done(function(data) {
            show_html(data);
            console.log("data: ", data);
            }).fail(
            function(error){
            });
        }  
    });
});




