document.getElementById("currencyForm").addEventListener("submit", function (event) {

    event.preventDefault();// Normal form gönderimini engelle

    const series = document.getElementById("series").value;
    //console.log("series: ",series);
    const series2 = series.replace(/\./g, '_');
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    fetch(`http://localhost:3000/api/currency?series=${series}&startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            displayCurrencyData(data, series2)
            createChart(data, series2);
        })
        .catch(error => console.error("Error", error));
});



function displayCurrencyData(data, selectedSeries) {
    const container = document.getElementById("currencyData");
    container.innerHTML = "<h2>Döviz Kuru Verileri</h2>";

    const list = document.createElement("ul");

    data.items.forEach(item => {
        //if(item.series!=null){
        const listItem = document.createElement("li");
        const seriesValue = item[selectedSeries];
        listItem.textContent = `Tarih : ${item.Tarih}, Değer: ${seriesValue}`;
        list.appendChild(listItem);
        //}
    });
    container.appendChild(list);
}

function createChart(data, selectedSeries) {
    const filterData=data.items.filter(item=>item[selectedSeries]!=null);
    const labels = filterData.map(item => item.Tarih);    
    const dataPoints = filterData.map(item => item[selectedSeries]);

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: selectedSeries,
                data: dataPoints,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}