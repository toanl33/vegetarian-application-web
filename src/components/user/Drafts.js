import React, {useContext, useState} from "react";
import DashboardSidebar from "./DashboardSidebar";
import Navbar from "../commons/elements/bars/Navbar";
import {NavLink, Redirect, Route, Switch, useLocation} from "react-router-dom";
import {UserContext} from "../../context/UserContext";
import {apiUrl} from "../../helpers/Variables";
import DraftRecipes from "./drafts/DraftRecipes";
import DraftVideos from "./drafts/DraftVideos";
import DraftBlogs from "./drafts/DraftBlogs";
import LocalizedStrings from "react-localization";
import {draftDisplayStrings} from "../../resources/UserDisplayStrings";
import {LocaleContext} from "../../context/LocaleContext";

const Drafts = () => {
    const location = useLocation();

    // Localizations
    draftDisplayStrings.setLanguage(useContext(LocaleContext));

    // Gets user info
    const user = useContext(UserContext);
    const token = JSON.parse(localStorage.getItem("accessToken"));

    // URL variables
    const urlRecipes = "/drafts/recipes";
    const urlVideos = "/drafts/videos";
    const urlBlogs = "/drafts/blogs";

    // Generates request headers
    let headers = new Headers();
    if (token) headers.append("Authorization", `Bearer ${token.token}`);
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    // Fetches data
    const [recipes, setRecipes] = useState([]);
    const [videos, setVideos] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const fetchData = async () => {
        // Generates request
        let request = {
            method: 'GET',
            headers: headers,
        };
        const api = `${apiUrl}/user/draft/${user.id}`;
        try {
            const response = await fetch(api, request);
            if (response.ok) {
                const result = await response.json();
                setRecipes(result.listRecipe);
                setVideos(result.listVideo);
                setBlogs(result.listBlog);
                setIsLoading(false);
            } else if (response.status >= 400 && response.status < 600) {
                setIsError(true);
                setIsLoading(false);
            }
        } catch (error) {
            setIsError(true);
        }
    }

    return (
        <div className="page-container">
            <div className="grid-container">
                <main>
                    <section className="page-navbar">
                        <Navbar>
                            <NavLink to={urlRecipes}>{draftDisplayStrings.draftTabsRecipes}</NavLink>
                            <NavLink to={urlVideos}>{draftDisplayStrings.draftTabsVideos}</NavLink>
                            <NavLink to={urlBlogs}>{draftDisplayStrings.draftTabBlogs}</NavLink>
                        </Navbar>
                    </section>
                    <Switch>
                        <Route exact path="/drafts"><Redirect to={urlRecipes}/></Route>
                        <Route exact path={urlRecipes}>
                            <DraftRecipes user={user} location={location} data={recipes}
                                          isLoading={isLoading} isError={isError}
                                          fetchData={fetchData}/></Route>
                        <Route exact path={urlVideos}>
                            <DraftVideos user={user} location={location} data={videos}
                                         isLoading={isLoading} isError={isError}
                                         fetchData={fetchData}/></Route>
                        <Route exact path={urlBlogs}>
                            <DraftBlogs user={user} location={location} data={blogs}
                                        isLoading={isLoading} isError={isError}
                                        fetchData={fetchData}/></Route>
                        <Route><Redirect to="/not-found"/></Route>
                    </Switch>
                </main>
                <DashboardSidebar/>
            </div>
        </div>
    )
}

export default Drafts;