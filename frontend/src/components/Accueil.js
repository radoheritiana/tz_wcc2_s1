import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Accueil extends Component {


    render() {

        return (
            <div className="container mt-2">
                <h3 className="text-center">Github users Search</h3>
                <div className="col-md-10 mx-auto mt-5">
                    <div className="row">
                        <div className="col text-center">
                            <h4>If you have a github acount</h4>
                            <a className="btn btn-warning mt-3 mb-3" 
                            href="https://github.com/login/oauth/authorize?client_id=Iv1.3557116d6bcf2043"
                            disabled=true>
                                Click here
                            </a>
                            <p><b>Advantage: </b>limit of requests per minute : 30</p>
                        </div>
                        <div className="col text-center">
                            <h4>Else</h4>
                            <Link to="/search" className="btn btn-warning mt-3 mb-3">Click here</Link>
                            <p><b>NB: </b>Limit of requests per minute : 10</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
