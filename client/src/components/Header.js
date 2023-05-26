import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
    reloadWebsite,
    changeUserInfoId,
    changeUserInfoUsername,
    changeUserInfoEmail,
    emptyFavDataFromDB
} from ".././actions/ebayAppActions";
import { Link } from 'react-router-dom'

class Header extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if ((this.props.match.path !== nextProps.match.path) ||
            (this.props.ebayAppStore.userInfo.id !== nextProps.ebayAppStore.userInfo.id)) {
            return true;
        }
        return false;
    }

    handleHomeButton = () => {
        this.props.dispatch(reloadWebsite());
    }

    handleLogOut = () => {
        fetch('https://ebay-favorite-search.onrender.com/auth/logout', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
            .then((response) => {
                this.props.dispatch(changeUserInfoUsername(null));
                this.props.dispatch(changeUserInfoEmail(null));
                this.props.dispatch(changeUserInfoId(null));
                this.props.dispatch(emptyFavDataFromDB(null));
                this.props.history.push(`/login`);
            })
    }

    renderLogoutLink = () => {
        if (this.props.ebayAppStore.userInfo.id !== null) {
            return (
                <li><a onClick={this.handleLogOut}>Logout</a>  </li>
            )
        }
    }

    renderRegisterLink = () => {
        if (this.props.ebayAppStore.userInfo.id === null) {
            return (
                <li className={((this.props.match.path === "/register") ? "current-page" : "")}><Link to="/register">Register</Link></li>
            )
        }
    }
 
    renderLoginLink = () => {
        if (this.props.ebayAppStore.userInfo.id === null) {
            return (
                <li className={((this.props.match.path === "/login") ? "current-page" : "")}><Link to="/login">Login</Link></li>
            )
        }
    }

    render() {
        return (
            <div className="header">
                <div className="container">
                    <h1 className="title">eBay Favorite Search</h1>
                    <nav>
                        <ul>
                            <li className={((this.props.match.path === "/" || this.props.match.path.substr(0, 7) === "/Search") ? "current-page" : "")}
                                onClick={this.handleHomeButton}
                            >
                                <Link to="/">Home</Link>
                            </li>
                            <li
                                className={"drop-down-menu " + ((this.props.match.path === "/login" || this.props.match.path === "/register" || this.props.match.path === "/profile") ? "current-page" : "")}
                            >
                                <a >User</a>
                                <ul >
                                    <li className={((this.props.match.path === "/profile") ? "current-page" : "")}><Link to="/profile">My Profile</Link></li>
                                    {this.renderRegisterLink()}
                                    {this.renderLoginLink()}
                                    {this.renderLogoutLink()}
                                </ul>
                            </li>
                            <li onClick={() => window.open("https://musmanrao1994.github.io/")} >
                                Portfolio
                            </li>
                        </ul>
                    </nav>
                </div>
            </div >
        );
    }
}

function mapStateToProps({ ebayAppStore }) {
    return { ebayAppStore };
}

export default withRouter(connect(mapStateToProps)(Header));
