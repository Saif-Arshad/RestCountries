const axios = require('axios');
const RESTCOUNTRIES_URL = 'https://restcountries.com/v3.1';

exports.getCountryInfo = async (req, res) => {
    const countryName = req.query.name;
    if (!countryName)
        return res.status(400).json({ error: "Country name is required: ?name=CountryName" });

    try {
        const response = await axios.get(`${RESTCOUNTRIES_URL}/name/${countryName}`);
        if (response.status !== 200)
            return res.status(response.status).json({ error: "Failed to fetch data from restcountries." });

        const countriesData = response.data;
        const filteredList = countriesData.map(c => {
            return {
                country_name: c.name?.common || 'N/A',
                capital: Array.isArray(c.capital) ? c.capital[0] : 'N/A',
                languages: c.languages ? Object.values(c.languages) : [],
                currencies: c.currencies
                    ? Object.entries(c.currencies).map(([curCode, curInfo]) => ({
                        code: curCode,
                        name: curInfo.name || "",
                        symbol: curInfo.symbol || ""
                    }))
                    : [],
                flag_url: c.flags?.png || ''
            };
        });
        res.json(filteredList);
    } catch (error) {
        console.error("Error fetching country data:", error);
        res.status(500).json({ error: "Server error fetching country data." });
    }
};
