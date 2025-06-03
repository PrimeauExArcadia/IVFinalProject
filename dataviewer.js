//data table
class DataTable {
    constructor(id){
        this.tableBody = d3.select(id);
    }
    update(data){
        //const tableBody = this.container.select("tableBody");
        //console.log(this.container);
        //console.log(data.DigitalGame)
        this.tableBody.selectAll("*").remove();
        data.forEach(game => {
            const row = this.tableBody.append("tr");
            row.append("td").text(game.DigitalGame);
            row.append("td").text(game.Year);
            row.append("td").text(game.DigitalGameMainGenre);
        })
    };
}
