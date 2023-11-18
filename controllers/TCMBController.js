const axios=require("axios");

// API URL'sini ve parametrelerini oluşturun

const fetchCurrencyData=()=>{

const baseURL = "https://evds2.tcmb.gov.tr/service/evds/";
const series = "TP.DK.USD.A.YTL"; // Döviz serisi kodu
const startDate = "01-01-2023";
const endDate = "31-01-2023";
const apiKey = process.env.TCMB_API_KEY; // API anahtarınız
const url = `${baseURL}series=${series}&startDate=${startDate}&endDate=${endDate}&type=json&key=${apiKey}`;

console.log(url);

// Axios ile GET isteği yapın
axios.get(url)
.then(response=>{
    console.log(response.data);
})
.catch(err=>{
    console.error("Hata: ",err);
});

}

module.exports=fetchCurrencyData;