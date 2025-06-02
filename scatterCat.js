//scatterCat Chart
class ScatterCategorical {
    constructor(container,data,options={}) {
        this.container = container;
        this.data = data;
        this.margin = {top:20,right:20,bottom:30,left:40};
        this.width = 700 - this.margin.left - this.margin.right;
        this.height = 700 - this.margin.top - this.margin.bottom;
        this.disorderCol = options.disorderCol;
        this.binCols = options.binCols;
        this.init();
    }
    init(){
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width',this.width + this.margin.left + this.margin.right)
            .attr('height',this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform',`translate(${this.margin.left},${this.margin.top})`);
    }
    render(){
        const scatterData = [];
        this.data.forEach(game => {
            this.disorderCol.forEach(col => {
                if (game[col] === 1){
                    scatterData.push({
                        YearInterval:game.YearInterval,
                        attribute: col,
                        game: game
                    });
                }
            });
        });
        this.data = scatterData
        this.x = d3.scaleBand()
            .domain(this.data.map(d => d.YearInterval)
            .filter((value,index,self) => self.indexOf(value) === index).sort())
            .range([0,this.width])
            .padding(0.1);
        this.y = d3.scaleBand()
            .domain(this.disorderCol)
            .range([this.height,0])
            .padding(0.1);

        this.radiusScale = d3.scaleSqrt()
            .domain([0,d3.max(this.data, d => {
                return this.data.filter(
                    p => p.YearInterval === d.YearInterval && p.attribute === d.attribute
            ).length; //get number of games with attribute
            })
        ])
            .range([0,15]);
        
        this.svg.selectAll(".dot")
            .data(this.data)
            .enter()
            .append("circle")
            .attr("class","dot")
            .attr("cx",d=> this.x(d.YearInterval) + this.x.bandwidth() / 2)
            .attr("cy",d=> this.y(d.attribute) + this.y.bandwidth() / 2)
            .attr("r",d => this.radiusScale(
                this.data.filter(
                    p => p.YearInterval === d.YearInterval && p.attribute === d.attribute
                ).length
            ))
            .style("fill","steelblue")
            .style("stroke-width","1px")
            .style("stroke","#127f90")
            .style("opacity",0.7)
            .on("mouseover",function(){
                d3.select(this)
                    .style("stroke-width","2.5px")
                    .style("stroke","black");
            })
            .on("mouseout",function(){
                d3.select(this)
                    .style("stroke-width","1px")
                    .style("stroke","#127f90");
            }
        )
        
        this.svg.append("g")
            .attr("transform",`translate(0,${this.height})`)
            .call(d3.axisBottom(this.x))

        this.svg.append("g")
            .call(d3.axisLeft(this.y))
        
        this.svg.append("text")
            .attr("transform","rotate(-90)")
            .attr("y",0-this.margin.left)
            .attr("x",0-(this.height/2))
            .text("Mental Health Themes Prevalence by Disorder")
            .style("font-size","16px")
        
        this.svg.append("text")
            .attr("transform",`translate(${this.width / 2},${this.height + this.margin.top - 20})`)
            .style("text-anchor","middle")
            .text("Year Interval");
    }
    update(data){
        this.data = data
        this.render()
    }
} 