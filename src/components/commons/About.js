import React from "react";
import Navbar from "./elements/bars/Navbar";
import {NavLink} from "react-router-dom";
import {FaAngleRight} from "react-icons/fa";
import Sidebar from "./elements/Sidebar";

const About = () => {
    return (
        <div className="page-container">
            <div className="grid-container">
                <main>
                    <section>
                        <header className="section-header">
                            <h1>About us</h1>
                        </header>
                    </section>
                </main>
                <aside>
                    <Sidebar>
                        <section className="sidebar-widget">
                            <h1>About us</h1>
                            <Navbar>
                                <NavLink to="/about"><FaAngleRight/>About this site</NavLink>
                                <NavLink to="/about/team"><FaAngleRight/>Our team</NavLink>
                                <NavLink to="/about/technologies"><FaAngleRight/>Our technologies</NavLink>
                                <NavLink to="/about/contact"><FaAngleRight/>Contact us</NavLink>
                            </Navbar>
                        </section>
                    </Sidebar>
                </aside>
            </div>
        </div>
    )
}

export default About;