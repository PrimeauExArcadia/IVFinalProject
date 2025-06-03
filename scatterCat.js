//scatterCat Chart
class ScatterCategorical {
    constructor(container,data,options={},table) {
        this.container = container;
        this.data = data;
        this.margin = {top:20,right:0,bottom:40,left:400};
        this.width = 900 - this.margin.left - this.margin.right;
        this.height = 700 - this.margin.top - this.margin.bottom;
        this.table = table;
        this.disorderCol = options.disorderCol;
        
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
    render(){ //create matrix
        
        const aggregatedData = {};
        this.data.forEach(game => {
            this.disorderCol.forEach(col => {
                if (game[col] === 1){
                    //Deepseek helped generate this part
                    const key = `${game.YearInterval}_${col}`;
                    if (!aggregatedData[key]){
                        aggregatedData[key] = {
                            YearInterval:game.YearInterval,
                            attribute: col,
                            count: 0,
                            games: [] //store all games this time
                        };
                    }
                    aggregatedData[key].count += 1;
                    aggregatedData[key].games.push(game);
                }
            });
        });
        this.data = Object.values(aggregatedData)
        //end of generated
        const maxCount = d3.min(this.data,d=>d.count)
        console.log(maxCount);
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
            .domain([0,d3.max(this.data, d => d.count)])
            .range([0,35]);
        
        this.svg.selectAll(".dot")
            .data(this.data)
            .enter()
            .append("circle")
            .attr("class","dot interactivePoint")
            .attr("cx",d=> this.x(d.YearInterval) + this.x.bandwidth() / 2)
            .attr("cy",d=> this.y(d.attribute) + this.y.bandwidth() / 2)
            .attr("r",d => this.radiusScale(d.count))
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
            })
            .on("click",(event,d) => {
                this.table.update(d.games)
            });
        
        //axis definition
        this.svg.append("g")
            .attr("transform",`translate(0,${this.height})`)
            .call(d3.axisBottom(this.x))

        this.svg.append("g")
            .call(d3.axisLeft(this.y))
        
        this.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${-this.margin.left + 100}, ${this.height / 2}) rotate(-90)`)
            .text("Game Aggregates by Disorder")
            .style("font-size","16px")
        
        this.svg.append("text")
            .attr("x",this.width / 2)
            .attr("y",this.height + this.margin.bottom)
            .style("text-anchor","middle")
            .text("Year Interval");
    }
    update(data){
        this.data = data
        this.render()
    }
} 
