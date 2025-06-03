//Line plot comparison Chart
class LinePlotCompare {
    constructor(container,data,options={},table) {
        this.container = container;
        this.data = data;
        this.margin = {top:20,right:20,bottom:40,left:40};
        this.width = 700 - this.margin.left - this.margin.right;
        this.height = 700 - this.margin.top - this.margin.bottom;
        this.table = table
        //this.p1 = options.disorderCol;
        //this.binCols = options.binCols;
        this.init();
    };
    init(){
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width',this.width + this.margin.left + this.margin.right)
            .attr('height',this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform',`translate(${this.margin.left},${this.margin.top})`);
    }
    render(){
        //Process 
        const aggregate = d3.rollup(
            this.data,
            v => ({
                P1_sum: d3.sum(v,d => d.P1_MentalHelthRelatedContent),
                P2_sum: d3.sum(v,d => d.P2_B_MentalHelthRelatedContent),
                members: [...v]
            }),
            d => d.YearInterval
        )
        this.data = Array.from(aggregate,([interval,values]) => ({
            YearInterval: interval,
            P1_sum: values.P1_sum,
            P2_sum: values.P2_sum,
            members: values.members
            })
        )
        this.data.sort((a,b) => {
            const getStartYear = interval => parseInt(interval.split("-")[0]);
            return getStartYear(a.YearInterval) - getStartYear(b.YearInterval);
        });
        

        this.x = d3.scaleBand()
            .domain(this.data.map(d => d.YearInterval)
            .filter((value,index,self) => self.indexOf(value) === index).sort())
            .range([0,this.width])
            .padding(0.1);
        this.y = d3.scaleLinear()
            .domain([0,d3.max(this.data, d=> Math.max(d.P1_sum,d.P2_sum)) + 1])
            .range([this.height,0]);

    //axis definition
        this.svg.append("g")
            .attr("class","x axis")
            .attr("transform",`translate(0,${this.height})`)
            .call(d3.axisBottom(this.x));
        this.svg.append("g")
            .attr("class","y axis")
            .call(d3.axisLeft(this.y));
        this.svg.append("text")
            .attr("transform","rotate(-90)")
            .attr("y",0-this.margin.left)
            .attr("x",0-(this.height/2))
            .text("Prevalence Over Time Indicated by Research")
            .style("font-size","16px");
        this.svg.append("text")
            .attr("x",this.width /2)
            .attr("y",this.height + this.margin.bottom)
            .style("text-anchor","middle")
            .text("Year Interval");
    
    //map lines
        const lineP1 = d3.line()
            .defined(d => d.P1_sum !== null)
            .x(d => this.x(d.YearInterval)+this.x.bandwidth() / 2)
            .y(d => this.y(d.P1_sum));
        const lineP2 = d3.line()
            .defined(d => d.P1_sum !== null)
            .x(d => this.x(d.YearInterval)+this.x.bandwidth() / 2)
            .y(d => this.y(d.P2_sum));

    //create path for line    
        this.svg.append("path")
            .datum(this.data)
            .attr("class","line")
            .attr("d",lineP1)
            .attr("stroke","steelblue")
            .attr("stroke-width","5px")
            .attr("fill","none");
        this.svg.append("path")
            .datum(this.data)
            .attr("class","line")
            .attr("d",lineP2)
            .attr("stroke","crimson")
            .attr("stroke-width","5px")
            .attr("fill","none");    
    
    //dots on lines
        this.svg.append("g")
            .attr("class","p1group")
            .selectAll("circle")
            .data(this.data)
            .enter()
            .append("circle")
            .classed("dotP1",true)
            //.classed("interactivePoint",true)
            .attr("cx",d=>this.x(d.YearInterval) + this.x.bandwidth() / 2)
            .attr("cy",d=> this.y(d.P1_sum))
            .attr("r",5)
            .attr("fill","black")
            
            .on("mouseover",function(){
                d3.select(this)
                    .attr("fill","#00b3ff")
                    .attr("r",10);
            })
            .on("mouseout",function(){
                d3.select(this)
                    .attr("fill","black")
                    .attr("r",5);
            })
            .on("click",(event,d) => {
                this.table.update(d.members)
            });
            
        this.svg.append("g")
            .attr("class","p2group")
            .selectAll("circle")
            .data(this.data)
            .enter()
            .append("circle")
            .classed("dotP2",true)
            //.classed("interactivePoint",true)
            .attr("cx",d=>this.x(d.YearInterval) + this.x.bandwidth() / 2)
            .attr("cy",d=> this.y(d.P2_sum))
            .attr("r",5)
            .attr("fill","black")
            
            .on("mouseover",function(){
                d3.select(this)
                    .attr("fill","#ff6ee9")
                    .attr("r",10);
            })
            .on("mouseout",function(){
                d3.select(this)
                    .attr("fill","black")
                    .attr("r",5);
            })
            .on("click",(event,d) => {
                this.table.update(d.members)
            });
            
    }
    
}
