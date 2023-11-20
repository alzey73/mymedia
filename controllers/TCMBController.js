const axios = require("axios");

exports.getTCMB = async (req, res) => {
    try {

        const baseURL = "https://evds2.tcmb.gov.tr/service/evds/";
        const { series, startDate, endDate } = req.query;
        const apiKey = process.env.TCMB_API_KEY; 
        const url = `${baseURL}series=${series}&startDate=${startDate}&endDate=${endDate}&type=json&key=${apiKey}`;

        if (!series || !startDate || !endDate) {
            return res.status(400).send("The series, startDate, and endDate parameters are required.");
        }
        const response = await axios.get(url);
        res.json(response.data);
    }
    catch (err) {
        console.error("Error : ",err);
        res.status(500).send(err.message);
    }
};