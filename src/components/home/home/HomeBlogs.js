import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FaAngleRight} from "react-icons/fa";
import Thread from "../../commons/elements/Thread";

const HomeBlogs = () => {
    const api = "http://14.161.47.36:8080/hiepphat-0.0.1-SNAPSHOT/api/blogs/get10blogs";
    const [data, setData] = useState([]);

    // Executes fetch once on page load
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(api);
            const result = await response.json();
            setData(result.listResult);
        }
        fetchData();
    }, []);

    return (
        <section className="home-feed">
            <header className="section-header linked-header">
                <h1>Newest stories around</h1>
                <Link to="/browse/blogs"><FaAngleRight/>See more</Link>
            </header>
            <div className="thread-list">
                {data && data.map(blog => (
                    <Thread key={blog.blog_id}
                            id={blog.blog_id}
                            type="blog"
                            title={blog.blog_title}
                            thumbnail={blog.blog_thumbnail}
                            subtitle={blog.blog_subtitle}
                            first_name={blog.first_name}
                            last_name={blog.last_name}/>
                ))}
            </div>
        </section>
    )
}

export default HomeBlogs;