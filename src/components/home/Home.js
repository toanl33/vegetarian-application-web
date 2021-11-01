import React from "react";
import "./Home.css";
import HomeBanner from "./home/HomeBanner";
import HomeRecipes from "./home/HomeRecipes";
import HomeSidebar from "./HomeSidebar";
import HomeBlogs from "./home/HomeBlogs";
import HomeVideos from "./home/HomeVideos";

const Home = () => {

    return (
        <div className="page-container">
            <HomeBanner/>
            <div className="grid-container">
                {/*Main content*/}
                <main>
                    {/*Recipe slider*/}
                    <HomeRecipes/>
                    {/*Video showcase*/}
                    <HomeVideos/>
                    {/*Story feed*/}
                    <HomeBlogs/>
                </main>
                {/*Right sidebar*/}
                <HomeSidebar/>
            </div>
        </div>
    )
}

export default Home;