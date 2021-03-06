import React, {useContext, useEffect} from "react";
import {favoritesDisplayStrings} from "../../../resources/UserDisplayStrings";
import {LocaleContext} from "../../../context/LocaleContext";
import Panel from "../../commons/elements/containers/Panel";
import ArticleCard from "../../commons/elements/containers/ArticleCard";
import {PanelLoader} from "../../commons/elements/loaders/Loader";
import {PanelEmp} from "../../commons/elements/loaders/AlertEmpty";
import {PanelErr} from "../../commons/elements/loaders/AlertError";

const FavoriteRecipes = ({location, data, isLoading, isError, fetchData}) => {
    // Localizations
    favoritesDisplayStrings.setLanguage(useContext(LocaleContext));

    useEffect(() => {
        fetchData();
    }, [location]);

    return (
        <section>
            <div className="section-content">
                <h1>{favoritesDisplayStrings.favoriteRecipesHeader}</h1>
                <p>{favoritesDisplayStrings.favoriteRecipesSubheader}</p>
                <Panel filler="card--narrow">
                    {!isLoading ? <>
                        {!isError ? <>
                            {data && data.length > 0 ? <>
                                {data.map(item => (
                                    <ArticleCard className="card--narrow"
                                                 key={item.recipe_id}
                                                 id={item.recipe_id}
                                                 type="recipe"
                                                 title={item.recipe_title}
                                                 thumbnail={item.recipe_thumbnail}
                                                 userId={item.user_id}
                                                 firstName={item.first_name}
                                                 lastName={item.last_name}
                                                 time={item.time_created}/>))}
                            </> : <PanelEmp/>}
                        </> : <PanelErr reload={fetchData}/>}
                    </> : <PanelLoader/>}
                </Panel>
            </div>
        </section>
    )
}

export default FavoriteRecipes;