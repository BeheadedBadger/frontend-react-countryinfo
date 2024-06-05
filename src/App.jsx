import './App.css';
import axios from "axios";
import {useState} from "react";
import {convertToMillions} from "./helpers/convertToMillions.js"

function App() {

    const [error, toggleError] = useState(false);
    const [resultFound, toggleResultFound] = useState(false);
    //If it's possible that an object is empty, or might take a while to load, set it to null so you can do a bool check
    const [countries, setCountries] = useState([]);
    const [searchedCountry, setSearchedCountry] = useState(null);
    const [search, setSearch] = useState({
        search: ""
    });

    async function searchCountry() {
        toggleError(false);
        toggleResultFound(false);
        const apiKeyRestfulCountries = "1006|ZTIQDdc5tdnjSPbcWn5KMVMDzD8AVx3gv48Yy5IJ";

        let searchTerm = {search}.search;

        try {
            const response = await axios.get(("https://restfulcountries.com/api/v1/countries/" + searchTerm), {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${apiKeyRestfulCountries}`
                }
            });
            console.log(response)
            setSearchedCountry(response.data.data);

            console.log(searchedCountry)
            toggleResultFound(true);
        } catch (e) {
            toggleError(true);
            toggleResultFound(false);
            console.error(e);
        }
    }

    async function fetchCountries() {
        toggleError(false);
        const apiKeyRestfulCountries = "1006|ZTIQDdc5tdnjSPbcWn5KMVMDzD8AVx3gv48Yy5IJ";

        try {
            const response = await axios.get("https://restfulcountries.com/api/v1/countries", {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${apiKeyRestfulCountries}`
                }
            });
            response.data.data.sort((a, b) => parseFloat(a.population.replace(/,/g, "")) - parseFloat(b.population.replace(/,/g, "")));
            console.log(response);
            setCountries(response.data.data);

        } catch (e) {
            toggleError(true);
            console.error(e);
        }
    }

    return (
        <>
            <h1>World Regions</h1>
            <button type="button" onClick={fetchCountries}>Klik hier</button>
            <ul>{countries.map((country) => {
                return (
                    <li key={country.iso3}>
                        <p className={country.continent}>{country.name}</p>
                        <img src={country.href.flag}></img>
                        <p>Has a population of {country.population} people</p>
                    </li>
                )
            })}
            </ul>
            {error === true && <p>Error!</p>}

            <form onClick={searchCountry}>
                Enter country: <input type="text" name="text" onChange={(e) => setSearch(e.target.value)}/>
                <input type="button" value="Submit"/>
            </form>

            {resultFound === true && <div>
                <img src={searchedCountry.href.flag}/> <h2
                className={searchedCountry.continent}>{searchedCountry.name}</h2>
                <p>{searchedCountry.name} is situated in {searchedCountry.continent} and the capital
                    is {searchedCountry.capital}. It has a population of {convertToMillions(searchedCountry.population)} million people.
                    Their phone numbers start with {searchedCountry.phone_code}.</p>
            </div>}
        </>
    )
}

export default App;
