


/*
//http://alignedleft.com/tutorials/d3/making-a-scatterplot
var dataset = [		
                  [ 5,     20 ],
                  [ 480,   90 ],
                  [ 250,   50 ],
                  [ 100,   33 ],
                  [ 330,   95 ],
                  [ 410,   12 ],
                  [ 475,   44 ],
                  [ 25,    67 ],
                  [ 85,    21 ],
                  [ 220,   88 ]
              ];
var w = 1000;
var h = 500;
var padding = 30;

var xScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) { return d[0]; })])
                     .range([padding, w-padding*2]);
                     
var yScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                     .range([h-padding, padding]);
                     
var rScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                     .range([2, 5]);


var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);
			
			
var circle = svg.selectAll("circle")
				.data(dataset)
				.enter()
				.append("circle")
				.attr("cx", function(d){
					return xScale(d[0]);
				})
				.attr("cy", function(d){
					return yScale(d[1]);
				})
				.attr("r", function(d){
					return rScale(d[1]);
				});

var text = svg.selectAll("text")
			   .data(dataset)
			   .enter()
			   .append("text")
			   .text(function(d) {
			        return d[0] + "," + d[1];
			   })
			    .attr("x", function(d) {
			        return xScale(d[0]);
			   })
			   .attr("y", function(d) {
			        return yScale(d[1]);
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "red");
			   


//Define X axis	
var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(10);
//Define Y axis
var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(10);

//Create X axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);
    
//Create Y axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

//var formatAsPercentage = d3.format(".1%");
//xAxis.tickFormat(formatAsPercentage);
*/						   


/*
//http://alignedleft.com/tutorials/d3/making-a-bar-chart
var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

//Width and height
var w = 500;
var h = 100;
var barPadding = 1;

var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);
			
var rect = svg.selectAll("rect")
				.data(dataset)
				.enter()
				.append("rect")
				.attr("x", function(d, i){
					return i * (w/dataset.length);
				})
				.attr("y", function(d){
					return h-d*4;
				})
				.attr("width", w/dataset.length - barPadding)
				.attr("height", function(d){
					return d*4;
				})
				.attr("fill", function(d){
					return "rgb(0,0,"+d*10+")";
				});

var text = svg.selectAll("text")
				.data(dataset)
				.enter()
				.append("text")
				.attr("x", function(d, i){
					return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
				})
				.attr("y", function(d){
					return h - (d*4) + 15;
				})
				.text(function(d){
					return d;
				})
				.attr("font-family", "sans-serif")
				.attr("font-size", "11px")
				.attr("fill", "white")
				.attr("text-anchor", "middle");
*/			

/*
//http://alignedleft.com/tutorials/d3/drawing-svgs
//Width and height
var w = 500;
var h = 50;

var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
           
       var dataset = [ 5, 10, 15, 20, 25 ];
      
       
var circles = svg.selectAll("circle")
                 .data(dataset)
                 .enter()
                 .append("circle");
                 
circles.attr("cx", function(d, i) {
            return (i * 50) + 25;
        })
       .attr("cy", h/2)
       .attr("r", function(d) {
            return d;
       });
*/