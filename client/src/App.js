import React, { Component } from "react";
import Main from "./components/Main";
import {
  withRouter, Route, Switch, browserHistory, Redirect, BrowserRouter as Router, HashRouter,
} from "react-router-dom";
import { connect } from "react-redux";
import {
  fetchEbayApiDataFromBackend,
  changeUserInputSearchBoxValue,
  changeUserInputNameOrFoodPairValue,
  changeUserInputSortBy,
  changeUserInputMaxResults,
  changeUserInputebayDataAfterOrBefore,
  changeUserInputlistingEndTime,
  changeUserInfoId,
  changeUserInfoUsername,
  changeUserInfoEmail,
  fetchFavDataFromDatabase,
  transferDataFromLocalStorageToDB,
} from "./actions/ebayAppActions";

const baseURL = `/eBay-Favorite-Search`;

class App extends Component {
  constructor(props) {
    super(props);
  }

  removeStringFromNull = obj => {
    for (let key in obj) {
      if (obj[key] === "null") {
        obj[key] = null;
      }
    }
  }

  changeInputValues = match => {
    this.removeStringFromNull(match.params)
    this.props.dispatch(changeUserInputNameOrFoodPairValue(match.params.listingType))
    this.props.dispatch(changeUserInputSearchBoxValue(match.params.searchBoxValue));
    this.props.dispatch(changeUserInputSortBy(match.params.sortBy));
    this.props.dispatch(changeUserInputMaxResults(match.params.maxResults));
    this.props.dispatch(changeUserInputMaxResults(match.params.maxResults));
    this.props.dispatch(changeUserInputebayDataAfterOrBefore(match.params.ebayDataAfterOrBefore));
    this.props.dispatch(changeUserInputlistingEndTime(match.params.listingEndTime));
  }

  fetch = match => {
    // console.log(`match.url =>`, match.url);
    this.props.dispatch(fetchEbayApiDataFromBackend(match.params.searchBoxValue, match.params.listingType, match.params.maxResults, match.params.ebayDataAfterOrBefore, match.params.listingEndTime, match.params.sortBy, match.url));
  };

  startBackEndServer = () => {
      fetch('https://ebay-favorite-search.onrender.com/api/test');
  }

  updateUserData = () => {
    fetch('https://ebay-favorite-search.onrender.com/api/user', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((response) => {
        return response.json()
      })
      .then((responseJson) => {
        if (responseJson.userInfo && responseJson.userInfo.id !== null) {
          this.props.dispatch(changeUserInfoId(responseJson.userInfo.id));
          this.props.dispatch(changeUserInfoEmail(responseJson.userInfo.email));
          this.props.dispatch(changeUserInfoUsername(responseJson.userInfo.username));
          (JSON.parse(localStorage.getItem("savedItemsObj")) !== undefined) && (this.props.dispatch(transferDataFromLocalStorageToDB(responseJson.userInfo.id)));
          this.props.dispatch(fetchFavDataFromDatabase(responseJson.userInfo.id));
        } else {
          this.props.dispatch(changeUserInfoId(null));
          this.props.dispatch(changeUserInfoEmail(null));
          this.props.dispatch(changeUserInfoUsername(null));
        }
      })
  }

  shouldComponentUpdate(newProps, newState) {
    return false;
  }

  componentDidMount() {
    this.updateUserData();
    this.startBackEndServer();
  }

  render() {
    return (
        <HashRouter>
      {/* <Router basename={baseURL}> */}
        <Switch>
          <Route
            path="/Search=:searchBoxValue&listingType=:listingType&sortBy=:sortBy&maxResults=:maxResults&ebayDataAfterOrBefore=:ebayDataAfterOrBefore&listingEndTime=:listingEndTime"
            render={({ match }) => {
              if (!this.props.ebayAppStore.comingFromInput && this.props.ebayAppStore.shouldFetch) {
                this.changeInputValues(match);
                this.fetch(match);
              };
              return <Main />;
            }}
          />
          <Route
            exact path="/"
            render={({ match }) => {
              return <Main />;
            }}
          />

          <Route
            exact path="/register"
            render={({ match }) => {
              return <Main />;
            }}
          />
          <Route
            exact path="/profile"
            render={({ match }) =>
              ((this.props.ebayAppStore.userInfo.id === null) ? <Redirect to='/login' /> : <Main />)
            }
          />

          <Route
            exact path="/login"
            render={({ match }) => {
              return ((this.props.ebayAppStore.userInfo.id !== null) ? <Redirect to='/profile' /> : <Main />)
            }
            }
          />

          <Redirect to="/" />
        </Switch>
      {/* </Router> */}
        </HashRouter>
    );
  }
}

function mapStateToProps({ ebayAppStore }) {
  return { ebayAppStore };
}

export default withRouter(connect(mapStateToProps)(App));
