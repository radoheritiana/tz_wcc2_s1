import React, { useState, useEffect } from "react";
import Pays from "./Pays";
import Users from "./Users";
import Paginator from "./Paginator";


const Search = () => {
    const items_per_page = 10;
    const [isSearch, setIsSearch] = useState(false);
    const [pays, setPays] = useState([]);
    const [users, setUsers] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationConfig, setPaginationConfig] = useState({});
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        getPays();
        if (isSearch === false) {
            document.getElementById('username').disabled = true;
            document.getElementById('btn-search').disabled = true;
        }
        setTimeout(() => {
            document.getElementById('loader').classList = "loader-container d-none";
        }, 4000)
    }, []);

    const getPays = async () => {
        const requete = await fetch(
            'https://data.gouv.nc/api/records/1.0/search/?dataset=liste-des-pays-et-territoires-etrangers&q=&rows=10000&facet=cog'
        );
        const response = await requete.json();
        const array_pays = response.records;
        var array_sortned = []
        array_pays.map(obj => (
            array_sortned.push({ recordid: obj.recordid, libcog: obj.fields.libcog.toLowerCase() })
        ));

        setPays(array_sortned.sort(function (a, b) {
            return a.libcog.localeCompare(b.libcog);
        }));
    }

    const getUsers = async (current_page) => {
        document.getElementById('username').disabled = false;
        document.getElementById('btn-search').disabled = false;
        document.getElementById('loading').classList = "d-flex justify-content-center";
        setIsSearch(true);
        var location = document.getElementById('location').value;
        var username = document.getElementById('username').value;
        var query = '';
        if (window.sessionStorage.getItem("token")) {
            if (location !== undefined) {
                query = 'https://rhja.pythonanywhere.com/users?name=' + encodeURI(username) + '&page=' + current_page;
                if (username !== undefined) {
                    query = 'https://rhja.pythonanywhere.com/users?name=' + encodeURI(username) + '&country=' + encodeURI(location) + '&page=' + current_page;
                }
            }
        } else {
            if (location !== undefined) {
                query = 'https://api.github.com/search/users?q=' + encodeURI('location:' + location + '&sort=joined&per_page=' + items_per_page + '&page=' + current_page);
                if (username !== undefined) {
                    query = 'https://api.github.com/search/users?q=' + username + '+in:login+location:' + location + '&sort=joined&per_page=' + items_per_page + '&page=' + current_page;
                }
            }
        }
        const req = await fetch(
            query
        )
        const response = await req.json();
        if (window.sessionStorage.getItem('token')) {
            setUsers(response.users);
            var number_of_page = calculate_total_page(response.total_count, items_per_page);
            setTotalCount(response.total_count);
            if (number_of_page > 100) {
                number_of_page = 100;
            }
            setTotalPage(number_of_page);
            setPaginationConfig({
                totalPages: number_of_page,
                currentPage: current_page,
                showMax: 2,
                size: "sm",
                threeDots: true,
                prevNext: true,
                onClick: function (page) {
                    setCurrentPage(page);
                    getUsers(page);
                }
            });
        }
        else {
            setUsers(response.items);
            var number_of_page = calculate_total_page(response.total_count, items_per_page);
            setTotalCount(response.total_count);
            if (number_of_page > 100) {
                number_of_page = 100;
            }
            setTotalPage(number_of_page);
            setPaginationConfig({
                totalPages: number_of_page,
                currentPage: current_page,
                showMax: 2,
                size: "sm",
                threeDots: true,
                prevNext: true,
                onClick: function (page) {
                    setCurrentPage(page);
                    getUsers(page);
                }
            });
        }
        document.getElementById('loading').classList = "d-flex justify-content-center d-none";
    }

    const calculate_total_page = (total_items, items_per_page) => {
        var total;
        if (total_items % items_per_page === 0) {
            total = total_items / items_per_page;
        } else {
            total = Math.floor(total_items / items_per_page) + 1;
        }
        return total;
    }

    const handleChange = () => {
        getUsers(1);
    }

    const handleClick = () => {
        getUsers(1);
    }

    return (
        <div>
            <div className="loader-container" id="loader">
                <div className="spinner"></div>
            </div>
            <div className="container">
                <div className="row mt-5">
                    <p className="text-muted">status: {window.sessionStorage.getItem('token') ? "Authenticated" : "Not Authenticated"}</p>
                    <div className="col-md-6 mx-auto">
                        <div className="row">
                            <div className="col-md-4">
                                <select name="" id="location" className="form-select" onChange={handleChange}>
                                    <option>Country</option>
                                    {pays.map(p => (
                                        <Pays
                                            key={p.recordid}
                                            name={p.libcog}
                                        />
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-8">
                                <div className="input-group mb-3">
                                    <input type="text" name="" id="username" className="form-control" placeholder="Search by username" />
                                    <button className="btn btn-secondary" onClick={handleClick} id="btn-search">Search</button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="d-flex justify-content-center d-none" id="loading">
                                    <div className="spinner-border text-danger" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                                {
                                    users &&
                                    <Users
                                        isSearch={isSearch}
                                        users={users}
                                        total_count={totalCount}
                                    />
                                }
                                <div className="row" id="pagination">
                                    <div className="d-flex justify-content-center mt-3">
                                        <Paginator 
                                        total_page={totalPage}
                                        paginationConfig={paginationConfig} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;