import React, {useEffect, useState} from "react";
import "./SearchBar.css";
import {FaSistrix} from "react-icons/all";
import {useHistory} from "react-router-dom";
import {apiBase} from "../../../helpers/Helpers";

const SearchBar = (props) => {
    const [query, setQuery] = useState();
    const history = useHistory();

    const submitQuery = async (e) => {
        e.preventDefault();
        const api = `${apiBase}/home/find?search=${query}&type=all`;
        history.push({
            pathname: "/search/recipes",
            search: `search=${query}&type=all`,
            state: {query: query},
        })
    }

    return (
        <form className="form-search" onSubmit={submitQuery}>
            <label>
                <FaSistrix/>
                <input aria-label="search" type="text"
                       value={query} onChange={e => setQuery(e.target.value)}
                       placeholder={props.placeholder}/>
            </label>
        </form>
    )
}

export default SearchBar;