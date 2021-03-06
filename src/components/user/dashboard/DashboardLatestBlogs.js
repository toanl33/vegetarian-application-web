import React, {useContext, useEffect, useState} from "react";
import {dashboardDisplayStrings} from "../../../resources/UserDisplayStrings";
import {LocaleContext} from "../../../context/LocaleContext";
import {apiUrl} from "../../../helpers/Variables";
import {Link} from "react-router-dom";
import Panel from "../../commons/elements/containers/Panel";
import ArticleCard from "../../commons/elements/containers/ArticleCard";
import {PanelLoader} from "../../commons/elements/loaders/Loader";
import {PanelEmp} from "../../commons/elements/loaders/AlertEmpty";
import {PanelErr} from "../../commons/elements/loaders/AlertError";
import {FaAngleRight} from "react-icons/fa";

const DashboardLatestBlogs = ({user, token}) => {
    // Localizations
    dashboardDisplayStrings.setLanguage(useContext(LocaleContext));

    // Generates request headers
    let headers = new Headers();
    if (token) headers.append("Authorization", `Bearer ${token.token}`);
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    // Fetches data
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const fetchData = async () => {
        setIsLoading(true);
        // Generate request
        let request = {
            method: 'GET',
            headers: headers,
        };
        // Execute fetch
        const api = `${apiUrl}/blogs/get10blogbyuser/${user.id}`;
        const response = await fetch(api, request);
        try {
            if (response.ok) {
                const result = await response.json();
                setData(result.listResult);
                setIsLoading(false);
            } else if (response.status >= 400 && response.status < 600) {
                setIsError(true);
                setIsLoading(false);
            }
        } catch (error) {
            setIsError(true);
        }
    }
    useEffect(() => {
        fetchData();
    }, [user]);

    return (
        <section>
            <header className="section-header linked-header">
                <h1>{dashboardDisplayStrings.dashboardBlogs}</h1>
                <Link to="/history/blogs"><FaAngleRight/>{dashboardDisplayStrings.dashboardViewAll}</Link>
            </header>
            <div className="section-content">
                <Panel filler="card--medium">
                    {!isLoading ? <>
                        {!isError ? <>
                            {data && data.length > 0 ? <>
                                {data.map(item => (
                                    <ArticleCard className="card--medium"
                                                 id={item.blog_id}
                                                 type="blog"
                                                 title={item.blog_title}
                                                 thumbnail={item.blog_thumbnail}
                                                 subtitle={item.blog_subtitle}
                                                 userId={item.user_id}
                                                 firstName={item.first_name}
                                                 lastName={item.last_name}
                                                 time={item.time_created}
                                                 totalLikes={item.totalLike}
                                                 isFavorite={item.is_like}
                                                 status={item.status}/>))}
                            </> : <PanelEmp message={dashboardDisplayStrings.dashboardBlogsEmpty}/>}
                        </> : <PanelErr reload={fetchData}/>}
                    </> : <PanelLoader/>}
                </Panel>
            </div>
        </section>
    )
}

export default DashboardLatestBlogs;