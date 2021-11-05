import React, {useCallback, useContext, useEffect, useState} from "react";
import {Redirect, Route, Switch, useLocation, useParams} from "react-router-dom";
import RecipeSteps from "./recipe/RecipeSteps";
import RecipeComments from "./recipe/RecipeComments";
import RecipeNutrients from "./recipe/RecipeNutrients";
import {SectionLoader} from "../../commons/elements/loaders/Loader";
import {apiBase} from "../../../helpers/Helpers";
import RecipeHeader from "./recipe/RecipeHeader";
import RecipeIngredients from "./recipe/RecipeIngredients";
import RecipeEstimations from "./recipe/RecipeEstimations";
import RecipeToolbar from "./recipe/RecipeToolbar";
import EditRecipe from "../../user/edit/EditRecipe";
import {UserContext} from "../../../context/UserContext";

const ViewRecipe = () => {
    let {id} = useParams();
    const user = useContext(UserContext);
    const location = useLocation();
    const [data, setData] = useState();
    const [isError, setIsError] = useState(false);

    const fetchData = async () => {
        const api = `${apiBase}/recipes/getrecipeby/${id}`;
        const response = await fetch(api);
        if (response.ok) {
            const result = await response.json();
            setData(result);
        } else if (response.status >= 400 && response.status < 600) {
            setIsError(true);
        }
    }
    // Executes fetch once on page load
    useEffect(() => {
        fetchData().catch(error => {
            console.error(error);
        });
    }, [location]);

    return (
        <section>
            <Switch>
                {/*Edit mode*/}
                {user && data && user.id === data.user_id &&
                <Route exact path={`/view/recipe/:id/edit`}>
                    <EditRecipe id={id} data={data}/>
                </Route>}
                {/*View mode*/}
                {!isError &&
                <Route exact path={`/view/recipe/:id/`}>
                    {data ?
                        <div className="section-content">
                            {/*Recipe article container*/}
                            <article>
                                {data.recipe_thumbnail &&
                                <picture className="article-thumbnail">
                                    <source srcSet={data.recipe_thumbnail}/>
                                    <img src="" alt=""/>
                                </picture>}
                                {/*Recipe title*/}
                                <RecipeHeader data={data}/>
                                <RecipeToolbar id={id} data={data} reload={fetchData}/>
                                {/*Recipe portion and ingredient list*/}
                                <RecipeIngredients data={data}/>
                                {/*Recipe estimates*/}
                                <RecipeEstimations data={data}/>
                                {/*Recipe nutrients*/}
                                <RecipeNutrients portion={data.portion_size}
                                                 nutrients={data.nutrition}/>
                                {/*Recipe instructions*/}
                                <RecipeSteps steps={data.steps}/>
                                <RecipeComments data={data}/>
                            </article>
                        </div>
                        :
                        <SectionLoader/>
                    }
                </Route>}
                <Redirect to="/not-found"/>
            </Switch>
        </section>
    )
}

export default ViewRecipe;