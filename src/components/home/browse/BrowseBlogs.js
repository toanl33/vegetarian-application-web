import React, {useEffect, useState} from "react";
import Card from "../../commons/elements/containers/Card";
import {apiBase} from "../../../helpers/Helpers";
import {SectionLoader} from "../../commons/elements/loaders/Loader";
import Panel from "../../commons/elements/containers/Panel";

const BrowseBlogs = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const api = `${apiBase}/blogs/getall?page=1&limit=100`;
        const response = await fetch(api);
        const result = await response.json();
        setData(result.listResult);
    }
    // Executes fetch once on page load
    useEffect(() => {
        fetchData().catch(error => {
            console.error(error);
        });
    }, []);

    return (
        <section>
            <div className="section-content">
                <h1>Blogs</h1>
                <i>Stories, thoughts, discussions and more.</i>
                <Panel filler="card-full">
                    {data.length > 0 ?
                        data.map(blog => (
                            <Card className="card-full"
                                  key={blog.blog_id}
                                  id={blog.blog_id}
                                  type="blog"
                                  title={blog.blog_title}
                                  thumbnail={blog.blog_thumbnail}
                                  subtitle={blog.blog_subtitle}
                                  firstName={blog.first_name}
                                  lastName={blog.last_name}
                                  time={blog.time_created}
                                  totalLikes={blog.totalLike}/>
                        ))
                        :
                        <SectionLoader/>
                    }
                </Panel>
            </div>
        </section>
    )
}

export default BrowseBlogs;