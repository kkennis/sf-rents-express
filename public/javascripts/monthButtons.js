$(document).ready(function(){

  var months = [
  "2010-11","2010-12","2011-01","2011-02","2011-03","2011-04","2011-05",
  "2011-06","2011-07","2011-08","2011-09","2011-10","2011-11","2011-12",
  "2012-01","2012-02","2012-03","2012-04","2012-05","2012-06","2012-07",
  "2012-08","2012-09","2012-10","2012-11","2012-12","2013-01","2013-02",
  "2013-03","2013-04","2013-05","2013-06","2013-07","2013-08","2013-09",
  "2013-10","2013-11","2013-12","2014-01","2014-02","2014-03","2014-04",
  "2014-05","2014-06","2014-07","2014-08","2014-09","2014-10","2014-11",
  "2014-12","2015-01","2015-02","2015-03","2015-04","2015-05","2015-06",
  "2015-07","2015-08"
  ]

  months.forEach(function(month){
    $("select").append("<option value='"+month+"'>"+month+"</option>")
  });


  $("#current-month").submit(function(event){
    event.preventDefault();

    $("#get-started").fadeOut(1000);

    var selectedMonth = $("select option:selected").val();
    updateMeshes(selectedMonth);

    currentMonth = selectedMonth;
  });

  $("#back-button").click(function(event){
    event.preventDefault();
    $("#back-button").fadeOut("slow");
    $("canvas").fadeIn("slow");
    $(".data-title").remove();
    $("#infobox").show();
    $("form").show();
  });

  $("body").on("click", "canvas", function(event){
    $("svg").remove();

    event.preventDefault();
    raycaster.setFromCamera(mouse,camera);
    var intersects = raycaster.intersectObjects(scene.children[scene.children.length - 1].children);
    for (var i=0; i<intersects.length; i++) {
      var zipCode = intersects[i].object.userData.zipCode;
      if (zipCode) {
        var zip = zips.get(zipCode);
        var margin = {top: 300, right: 20, bottom: 30, left: 50};
        var width = 1600;
        var height = 1000;

        $("form").hide();
        $("#infobox").hide();
        $("canvas").fadeOut("slow");
        $("<h3 class='data-title'>"+zipCode + " (" + zip.get(name) + ")</h3>").insertAfter("#page-head");
        $("#back-button").fadeIn("slow");

        var parseDate = d3.time.format("%Y-%m").parse;

        var x = d3.time.scale().range([0, width]);

        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");


        var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left")
                      .innerTickSize(-width)
                      .outerTickSize(0)
                      .tickPadding(10);

        var line = d3.svg.line()
                      .x(function(d) { return x(d.month); })
                      .y(function(d) { return y(d.rent); });

        var svg = d3.select("body").append("svg")
            .attr("class", "line-graph")
            .attr("width", width)
            .attr("height", 1500)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var data = []

        zip.forEach(function(d){
          if (d[0] === "2") {
            d.month = parseDate(d);
            d.rent = zip.get(d)

            data.push({ month: parseDate(d), rent: zip.get(d) })
          }
        });

        x.domain(d3.extent(data, function(d) { return d.month; }));
        y.domain(d3.extent(data, function(d) { return d.rent; }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("fill", "white")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("fill", "white")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("color", "white")
            .style("text-anchor", "end")
            .text("$/mo");



        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        break;
      }
    }
  });

});