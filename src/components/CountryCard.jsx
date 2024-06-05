import "./CountryCards.css"

// eslint-disable-next-line react/prop-types
function CountryCard({ continent, flag, name, funfacts }) {
    return (
        <article className={continent}>
            <div className="Title"><h2>{name}</h2></div>
            <img src={flag} alt={name}/>
            <p>{funfacts}</p>
        </article>
    );
}

export default CountryCard;