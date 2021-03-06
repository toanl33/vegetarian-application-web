import React, {useContext, useEffect, useRef, useState} from "react";
import {homeDisplayStrings} from "../../../resources/PublicDisplayStrings";
import {LocaleContext} from "../../../context/LocaleContext";
import {apiUrl} from "../../../helpers/Variables";
import ArticleTile from "../../commons/elements/containers/ArticleTile";
import {PanelLoader} from "../../commons/elements/loaders/Loader";
import {PanelEmp} from "../../commons/elements/loaders/AlertEmpty";
import {PanelErr} from "../../commons/elements/loaders/AlertError";
import HomeShortcuts from "./HomeShortcuts";


const HomeBanner = ({user, fetchData}) => {
    // Localizations
    homeDisplayStrings.setLanguage(useContext(LocaleContext));

    // Handles scroll button
    const scrollRef = useRef(null);
    const executeScroll = () => scrollRef.current.scrollIntoView({behavior: 'smooth'});

    // Data states, API endpoint & Fetches data on page load
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const api = `${apiUrl}/recipes/get5bestrecipes${user ? `?userID=${user.id}` : ``}`;
    useEffect(() => {
        fetchData(api, setData, setIsLoading, setIsError);
    }, [user]);

    // Randomizes banner background
    const [background, setBackground] = useState();
    const backgrounds = [
        "https://res.cloudinary.com/toanl33/image/upload/v1637988178/banner-background-1_merghi.png",
        "https://res.cloudinary.com/toanl33/image/upload/v1637988185/banner-background-2_edwvp2.png",
        "https://res.cloudinary.com/toanl33/image/upload/v1637988193/banner-background-3_rgdfem.png",
        "https://res.cloudinary.com/toanl33/image/upload/v1637988198/banner-background-4_ywmsyq.png",
    ];
    useEffect(() => {
        const min = Math.ceil(0);
        const max = Math.floor(backgrounds.length);
        setBackground(backgrounds[Math.floor(Math.random() * (max - min) + min)]);
    }, [])

    // Checks scroll offset to blur overlay and resize background image
    const [overlayStyles, setOverlayStyles] = useState();
    const [backgroundSize, setBackgroundSize] = useState(120);
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", () => {
                if (window.pageYOffset < 600) {
                    setOverlayStyles({
                        background: `linear-gradient(0deg,
                        rgba(254, 254, 254, 0.0) 0%,
                        rgba(254, 254, 254, ${100 - (window.pageYOffset / 10)}%) 100%,
                        rgba(254, 254, 254, 1) 100%)`,
                        backdropFilter: `blur(${4 + window.pageYOffset / 50}px)`
                    });
                    setBackgroundSize(120 - (window.pageYOffset / 40));
                }
            });
        }
    }, []);

    return (
        <div className="banner-container banner-home">
            {/*Best recipes showcase banner*/}
            <div className="banner">
                <section className="banner-section banner-showcase">
                    <header className="section-header">
                        <h1>{homeDisplayStrings.homeBannerHeader}</h1>
                    </header>
                    <div className="section-content">
                        <div className="banner-panel">
                            {!isLoading ? <>
                                {!isError ? <>
                                    {data && data.length > 0 ? <>
                                        {data.map((item, index) => (
                                            <ArticleTile
                                                className={`${index === 0 ? "tile-half" : "tile-eighth tile-eighth-" + index}`}
                                                key={item.recipe_id}
                                                id={item.recipe_id}
                                                type="recipe"
                                                title={item.recipe_title}
                                                thumbnail={item.recipe_thumbnail}
                                                userId={item.user_id}
                                                firstName={item.first_name}
                                                lastName={item.last_name}
                                                time={item.time_created}
                                                isFavorite={item.is_like}
                                                totalLikes={item.totalLike}/>))}
                                    </> : <PanelEmp style={{gridArea: "1 / 1 / 3 / 5"}}/>}
                                </> : <PanelErr style={{gridArea: "1 / 1 / 3 / 5"}}
                                                reload={() => fetchData(api, setData, setIsLoading, setIsError)}/>}
                            </> : <PanelLoader style={{gridArea: "1 / 1 / 3 / 5"}}/>}
                        </div>
                    </div>
                </section>
                {/*Arrow button for snap scrolling down*/}
                <button onClick={executeScroll} className="button-scroll"><span/></button>
                {/*Quick shortcuts section*/}
                <HomeShortcuts user={user} scrollRef={scrollRef}/>
            </div>
            {/*Blurred banner background*/}
            <div className={`banner-overlay`} style={overlayStyles}/>
            <div className="banner-background" style={{
                backgroundImage: `url(${background})`,
                backgroundSize: `${backgroundSize}%`,
            }}/>
        </div>
    )
}

export default HomeBanner