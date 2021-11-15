import React, {useContext} from "react";
import {AiFillEye, AiOutlineEyeInvisible, FaHeart, FaRegHeart, RiDeleteBin4Line, RiEditLine} from "react-icons/all";
import {UserContext} from "../../../../context/UserContext";
import {apiBase} from "../../../../helpers/Variables";
import {useHistory} from "react-router-dom";

const RecipeToolbar = ({id, location, data, reload, mainApi}) => {
    const history = useHistory();
    const user = useContext(UserContext);
    const token = JSON.parse(localStorage.getItem("accessToken"));
    // Article status message to display based on array index
    const statusText = [
        "Waiting for review.",
        "Approved and published.",
        "Rejected by administrator."
    ];
    // Matching class names for text colors
    const statusColor = [
        "text-neutral",
        "text-positive",
        "text-negative"
    ];
    // Generates request headers
    let headers = new Headers();
    if (token) headers.append("Authorization", `Bearer ${token.token}`);
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    // Handles like-unlike function
    const favoriteArticle = async (e) => {
        e.preventDefault();
        // Generates request body
        let body = JSON.stringify({
            "user_id": user.id,
            "recipe_id": data.recipe_id,
        });
        // Generates request
        let request = {
            method: 'POST',
            headers: headers,
            body: body,
        };
        // Executes fetch
        const api = `${apiBase}/recipes/like`;
        const response = await fetch(api, request);
        try {
            if (response.ok) {
                reload(mainApi);
            } else if (response.status === 401) {
                alert("You are not authorized to complete the request.")
            } else {
                alert("Error: " + response.status);
            }
        } catch (error) {
            alert("A network error has occurred. " + error);
        }
    }
    // Handle public/private visibility switch
    const publishArticle = async (e) => {
        e.preventDefault();
        let message = "";
        if (data.is_private && data.status === 1)
            message = "Submit your article for review?\nIt will be visible to others once approved by a moderator."
        if (data.is_private && data.status === 2)
            message = "Republish your article?\nIt will be visible to everyone else."
        else if (!data.is_private)
            message = "Set your article to private and save as draft?\nIt will no longer be visible to others.";
        const isConfirmed = window.confirm(message);
        if (isConfirmed) {
            // Generates request
            let request = {
                method: 'PUT',
                headers: headers,
            };
            // Executes fetch
            const api = `${apiBase}/recipes/edit/private/${id}`;
            const response = await fetch(api, request);
            try {
                if (response.ok) {
                    if (data.is_private && data.status === 1)
                        alert("Your post will now be visible to others when approved by an admin.")
                    else if (data.is_private && data.status === 2)
                        alert("Your post is now public and visible to others.");
                    else alert("Your post is now private.")
                    reload(mainApi);
                } else if (response.status === 401) {
                    alert("You are not authorized to do that.")
                } else {
                    alert("Unexpected error with code: " + response.status);
                }
            } catch (error) {
                alert("A network error has occurred. " + error);
            }
        }
    }
    // Handles edit article - sends user to edit form
    const editArticle = () => {
        history.push(`/view/recipe/${id}/edit`)
    }
    // Handle delete article - sends user to previous page upon completion
    const deleteArticle = async (e) => {
        e.preventDefault();
        const isConfirmed = window.confirm("Are you sure you wish to delete this recipe? This is irreversible.");
        if (isConfirmed) {
            // Generates request
            let request = {
                method: 'DELETE',
                headers: headers,
            };
            // Executes fetch
            const api = `${apiBase}/recipes/delete/${data.recipe_id}`;
            const response = await fetch(api, request);
            try {
                if (response.ok) {
                    alert("Your recipe has been deleted.");
                    history.goBack();
                } else if (response.status === 401) {
                    alert("You are not authorized to complete the request.")
                } else {
                    alert("Error: " + response.status);
                }
            } catch (error) {
                alert("A network error has occurred. " + error);
            }
        }
    }

    return (
        <section className="article-toolbar">
            {data && user && user.id === data.user_id &&
            <div className="article-status">
                {data.is_private ? <p>***PRIVATE DRAFT***</p>
                    : <p className={statusColor[data.status - 1]}>{statusText[data.status - 1]}</p>}
            </div>}
            {data && user && user.role !== "admin" ?
                <div className="article-controls">
                    {/*If user is logged in, show toolbar*/}
                    <button title="Add to favorites" onClick={favoriteArticle}
                            className={`article-button article-button-with-text ${data.is_like && "button-favorite"}`}>
                        {data.is_like ?
                            <FaHeart/> : <FaRegHeart/>} {data.totalLike}
                    </button>
                    {/*If user is the author of the article, allow modify*/}
                    {user.id === data.user_id && <>
                        <button title="Article visibility" className="article-button article-button-with-text"
                                onClick={publishArticle}>
                            {data.is_private ?
                                <><AiOutlineEyeInvisible/> Private</>
                                : <><AiFillEye/> Public</>}
                        </button>
                        <button title="Edit article" className="article-button article-button-no-text"
                                onClick={editArticle}>
                            <RiEditLine/>
                        </button>
                        <button title="Delete article" className="article-button article-button-no-text"
                                onClick={deleteArticle}>
                            <RiDeleteBin4Line/>
                        </button>
                    </>}
                </div>
                : <div className="article-controls">
                    {/*If not logged in, the favorite button directs to login form*/}
                    <button className={`article-button article-button-with-text ${data.is_like && "button-favorite"}`}
                            onClick={() => history.push({
                                pathname: "/login",
                                state: {background: location}
                            })}>
                        <FaRegHeart/> {data.totalLike}
                    </button>
                </div>}
        </section>
    )
}

export default RecipeToolbar;