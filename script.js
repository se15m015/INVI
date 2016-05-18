var w = 1000;
var h = 500;
var padding = 30;

var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

var dsv = d3.dsv(";","text/plain");
        dsv("cars.csv", function(data) {
            var originLookup = ["","USA", "Europe", "Japan"];
            return {
                "Acceleration": +data["Acceleration"].replace(",","."),
                "Cylinders": +data["Cylinders"].replace(",","."),
                "Engine displacement": +data["Engine displacement"].replace(",","."),
                "Horsepower": +data["Horsepower"].replace(",","."),
                "Miles per gallon": +data["Miles per gallon"].replace(",","."),
                "Model year": +data["Model year"].replace(",",".") +1900,
                "Name": data["Name"],
                "Origin": originLookup[+data["Origin"].replace(",",".")],
                "Vehicle weight": +data["Vehicle weight"].replace(",",".")
            }; 
            }, function(error, rows) {
                if(error)
                    console.log(error);
                    
              //ref: https://gist.github.com/jfreels/6814721
            
              var columns = d3.keys(rows[0]);
              var table = d3.select("body").append("table");
              var thead =  table.append("thead");
              var tbody = table.append("tbody");
               
              thead.append("tr")
	            .selectAll("th")
	            .data(columns)
	            .enter()
	            .append("th")
	            .text(function (d) { return d });
	            
		        var tableRows = tbody.selectAll("tr")
		            .data(rows)
		            .enter()
		            .append("tr");
                
              var tabelCells = tableRows.selectAll("td")
	            .data(function(row) {
	    	        return columns.map(function (column) {
	    		    return { column: column, value: row[column] }
	                })
                    })
                    .enter()
                    .append("td")
                    .text(function (d) { return d.value })  
                    
            // Plot ---------------------------------------------
            
            var xScale = d3.scale.linear()
                     .domain([d3.min(rows, function(d) { return d["Acceleration"]; }), d3.max(rows, function(d) { return d["Acceleration"]; })])
                     .range([padding, w-padding*2]);
                     
			var yScale = d3.scale.linear()
                     .domain([d3.min(rows, function(d) { return d["Miles per gallon"]; }), d3.max(rows, function(d) { return d["Miles per gallon"]; })])
                     .range([h-padding, padding]);
                     
            var cScale = d3.scale.category10();
                     
            /*
var cScale = d3.scale.ordinal()
            		.domain(["USA", "Europe", "Japan"])
            		.rangeBands([0,360]);
            		
            		console.log("USA", cScale("USA"));
					console.log("Europe", cScale("Europe"));
					console.log("Japan", cScale("Japan"));
*/                     
			var tooltip = d3.select("body").append("div")
							.attr("class", "tooltip")
							.style("opacity",0);         
			
            var circle = svg.selectAll("circle")
				.data(rows)
				.enter()
				.append("circle")
				.attr("cx", function(d){
					return xScale(d["Acceleration"]);
				})
				.attr("cy", function(d){
					return yScale(d["Miles per gallon"]);
				})
				.attr("r", 3)
				.attr("fill", function(d){
					//return "hsl("+cScale(d["Origin"])+", 50%, 50%)";
					return cScale(d["Origin"]);

				})
				.on("mouseover", function(d){
					tooltip.transition()
							.duration(200)
							.style("opacity", .9);
					tooltip.html("<strong>" + d["Name"] + "</strong><br/>Acceleration: " + d["Acceleration"] + "<br/>Miles per gallon: " + d["Miles per gallon"]  + "<br/>Origin: " + d["Origin"])
							.style("left", (d3.event.pageX + 10) + "px")
							.style("top", (d3.event.pageY - 10) + "px")
				})
				.on("mouseout", function(d){
					tooltip.transition()
							.duration(500)
							.style("opacity", 0);
				});		   

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
				
				// text label for the x axis
				svg.append("text")      
			        .attr("x", w - 100 )
			        .attr("y",  h - 35)
			        .attr("font-family", "sans-serif")
					.attr("font-size", "11px")
			        .style("text-anchor", "middle")
			        .text("Acceleration");
			        
			    // text label for the y axis
				svg.append("text")  
					.attr("transform", "translate(45,70)rotate(270)")   
			        .attr("x", 0)
			        .attr("y", 0)
			        .attr("font-family", "sans-serif")
					.attr("font-size", "11px")
			        .style("text-anchor", "middle")
			        .text("Miles per gallon");
			        
			    //Legend
			    var legend = svg.selectAll(".legend")
							      .data(cScale.domain())
							      .enter().append("g")
							      .attr("class", "legend")
							      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
							
				  legend.append("rect")
				      .attr("x", w - 18)
				      .attr("width", 18)
				      .attr("height", 18)
				      .style("fill", cScale);
				
				  legend.append("text")
				      .attr("x", w - 24)
				      .attr("y", 9)
				      .attr("dy", ".35em")
				      .attr("font-family", "sans-serif")
				      .attr("font-size", "11px")
				      .style("text-anchor", "end")
				      .text(function(d) { return d; });
							   		
   
            });