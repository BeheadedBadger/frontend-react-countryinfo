import './App.css';
import axios from "axios";
import {useState} from "react";
import {convertToMillions} from "./helpers/convertToMillions.js"
import CountryCard from "./components/CountryCard.jsx";

function App() {

    const [error, toggleError] = useState(false);
    const [resultFound, toggleResultFound] = useState(false);
    const [resultNotFound, toggleResultNotFound] = useState(false);
    //If it's possible that an object is empty, or might take a while to load, set it to null so you can do a bool check
    const [countries, setCountries] = useState([]);
    const [searchedCountry, setSearchedCountry] = useState(null);
    const [search, setSearch] = useState({
        search: ""
    });
    const [searchTerm, setSearchTerm] = useState("");

    let form = document.getElementById("Form");
    if (form != null) {
    form.addEventListener('submit', handleForm);
    }

    function handleForm(event) {
        event.preventDefault();
    }

    async function searchCountry() {
        document.getElementById("Form").reset();
        toggleResultFound(false);
        toggleResultNotFound(false);

        const apiKeyRestfulCountries = "1006|ZTIQDdc5tdnjSPbcWn5KMVMDzD8AVx3gv48Yy5IJ";
        setSearchTerm({search}.search);

        try {
            const response = await axios.get("https://restfulcountries.com/api/v1/countries/" + searchTerm, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${apiKeyRestfulCountries}`
                }
            });
            console.log(response.data.data.name);
            setSearchedCountry(response.data.data);

            toggleResultNotFound(false);
            toggleResultFound(true);
        } catch (e) {
            console.log({search}.search);
            setSearchTerm({search}.search);
            toggleResultFound(false);
            toggleResultNotFound(true);
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
                if (country.continent === null) {
                    country.continent = "Not-specified";
                }
                return (
                    <li key={country.iso3}>
                        <CountryCard continent={country.continent.replace(/ /g, "")}
                                     flag={country.href.flag}
                                     name={country.name}
                                     funfacts={`Has a population of ${country.population}`}/>
                    </li>
                )
            })}
            </ul>
            {error === true && <p>Error! Could not retrieve countries.</p>}

            <form id="Form">
                Enter country:
                <input type="text" name="text" autoComplete="off"
                       onFocus={(e) => e.target.value = ""}
                       onSubmit={searchCountry}
                       onChange={(e) => setSearch(e.target.value)}/>
                <button type="button" onClick={searchCountry}>Search!</button>
            </form>

            {resultFound === true && <div>
                <CountryCard continent={searchedCountry.continent} flag={searchedCountry.href.flag} name={searchedCountry.name} funfacts={`${searchedCountry.name} is situated in ${searchedCountry.continent} and the capital
                    is ${searchedCountry.capital}. It has a population of ${convertToMillions(searchedCountry.population)} million people.
                    Their phone numbers start with ${searchedCountry.phone_code}.`}/>
            </div>}

            {resultNotFound === true && <p>Sorry, cannot find {searchTerm}!</p>}
        </>
    )
}

export default App;
