var w = 600;
var h = 500;
var padding = 30;

var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);
			
var histo = d3.select("body")
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

				//Brush
				  var brush = d3.svg.brush()
							      .x(xScale)
							      .y(yScale)
							      .on("brush", brushmove)
							      .on("brushend", brushend);
							      							      
				svg.append("g")
					.call(brush);
				
				  function brushmove(p) {
				  var e = brush.extent();
				  
				  // Hide all not Selected circles
				   svg.selectAll("circle").classed("hidden", function(d) {
				     	return isOutside(d,e);
				    });
					// Highlight the selected circles.
					svg.selectAll("circle").classed("selected", function(d) {
				     	return isInside(d,e);
				    });
				    
				    // Highlight Tablecells
				    table.selectAll("tr").classed("highlighted", function(d){
					    return isInside(d,e);
					});
									  
				   //update Histogramm
				   allData = svg.selectAll("circle").data();		   
				   var selected = [];
				   
				   for(var i in allData){
				   		if(isInside(allData[i],e)){
				   			selected.push(allData[i]);
				   		}
				   }
				    console.log(selected.length);
				   if(selected.length > 0){
				   		var histoSelected = histoFactory(selected);
				   }else{
				   		var histoSelected = histoFactory(rows);
				   }
				  
				   updateHistogram(histoSelected);   					
				  }
				
				  // If the brush is empty, select all circles.
				  function brushend() {
				  	if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
				  }
				  
				  //***** Bar Chart ******//
  
				  var xScaleHistogramm = d3.scale.linear()
                     .domain([d3.min(rows, function(d) { return d["Model year"]; })-0.5, d3.max(rows, function(d) { return d["Model year"]; })+0.5])
                     .range([padding, w-padding*2]);
                     
				  var yScaleHistogramm = d3.scale.linear()
                     .domain([0, yMax(rows)])
                     .range([h-padding, padding]);

				//Define X axis Histogramm
				var xAxisHistogramm = d3.svg.axis()
				                  .scale(xScaleHistogramm)
				                  .orient("bottom")
				                  .tickFormat(d3.format("d"));
				                  
				//Define Y axis Histogramm
				var yAxisHistogramm = d3.svg.axis()
				                  .scale(yScaleHistogramm)
				                  .orient("left");
	
				 var histoFactory = d3.layout.histogram().value(function(row){return row["Model year"]});
	 
				 var histogrammRange = d3.range(d3.min(rows, function(data){return data["Model year"];}), d3.max(rows, function(data){return data["Model year"];}) + 2);			 
        		 histoFactory.bins(histogrammRange);
        		 
				var histogramm = histoFactory(rows);
				
				var barChart = histo.append("g");

				var bars = histo.selectAll(".bar")
            						.data(histogramm)
            						.enter()
           	 						.append("g")
            						.attr("class", "bar")
            						.attr("transform", function(d){
            							return "translate(" + xScaleHistogramm(d.x) + ","+ (yScaleHistogramm(d.y)) + ")";
            						});

            	var barW = 38;
            	var barOffset = barW / 2 * -1;
            	
            	var rect = bars.append("rect")
            					.attr("x", barOffset)
            					.attr("width", barW)
            					.attr("height", function(d){
            						return h - yScaleHistogramm(d.y) - padding;
            					})
            	
            	var text = bars.append("text")
                				.attr("y", + 15)
                				.attr("text-anchor", "middle")
                				.text(function (d) {
                    				return d.y;
                				});
				
               	//Create X axis Histogramm
				histo.append("g")
				    .attr("class", "axis")
				    .attr("transform", "translate(0," + (h - padding) + ")")
				    .call(xAxisHistogramm);
				    
				//Create Y axis Histogramm
				histo.append("g")
				    .attr("class", "axis")
				    .attr("transform", "translate(" + padding + ",0)")
				    .call(yAxisHistogramm);
				
				// text label for the x axis Histogramm
				histo.append("text")      
			        .attr("x", w - 100 )
			        .attr("y",  h - 35)
			        .attr("font-family", "sans-serif")
					.attr("font-size", "11px")
			        .style("text-anchor", "middle")
			        .text("Model Year");
			        
			    // text label for the y axis Histogramm
				histo.append("text")  
					.attr("transform", "translate(45,50)rotate(270)")   
			        .attr("x", 0)
			        .attr("y", 0)
			        .attr("font-family", "sans-serif")
					.attr("font-size", "11px")
			        .style("text-anchor", "middle")
			        .text("Count");
				  
				  //Helper Functions	
				  function updateHistogram(data){
				  	bars.data(data)
                			.attr("transform", function (d) {
                    					return "translate(" + xScaleHistogramm(d.x) + "," + yScaleHistogramm(d.y) + ")";
                				  });
				   	bars.select("rect")
               	 			.data(data)
                			.attr("height", function (d) {
                    			return h - yScaleHistogramm(d.y) - padding;
                		});	             		
                	bars.select("text")
                			.text(function (d) {
                   				 return d.y;
                			});
				  }
				  			  
				  function isOutside(d,e){
				 	   if(d == undefined)
				  		return false;
				  		
					  return e[0][0] > d["Acceleration"] || d["Acceleration"] > e[1][0] 
				    	|| e[0][1] > d["Miles per gallon"] || d["Miles per gallon"] > e[1][1];
				  }
				  
				  function isInside(d,e){
				  	   if(d == undefined)
				  		return false;
				  		
					  return e[0][0] <= d["Acceleration"] && d["Acceleration"] <= e[1][0] 
				    	&& e[0][1] <= d["Miles per gallon"] && d["Miles per gallon"] <= e[1][1];
				  }
				  
				  function yMax(rows){
				  		var count = [];
				  		for(var i in rows){
				  			if(count[rows[i]["Model year"]] == undefined){
				  				count[rows[i]["Model year"]] = 0;
				  			}
				  			count[rows[i]["Model year"]]++;
				  		}
				  		return d3.max(count);				  
				  	}
							   		
   
            });