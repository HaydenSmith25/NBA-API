import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: null,
      playerStats: {},
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.getPlayerId();
    console.log(this.state.playerName);
  };

  handleChange = (e) => {
    const replace = e.target.value.split(" ").join("_");
    if (replace.length > 0) {
      this.setState({ playerName: replace });
    } else {
      alert("Please enter a valid player name");
    }
  };

  getPlayerId = () => {
    axios
      .get(
        `https://www.balldontlie.io/api/v1/players?search=${this.state.playerName}`
      )
      .then(async (res) => {
        // console.log(res.data.data);
        if (res.data.data[0] === undefined) {
          alert("This player is either injured or hasn't played yet");
        } else if (res.data.data.length > 1) {
          alert("Please specify the full name of the player");
        } else {
          await this.getPlayerStat(res.data.data[0].id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getPlayerStat = (playerId) => {
    axios
      .get(
        `https://www.balldontlie.io/api/v1/season_averages?season=2022&player_ids[]=${playerId}`
      )
      .then(async (res) => {
        console.log(res.data.data);
        this.setState({ playerStat: res.data.data[0] });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getPlayerId();
    this.getPlayerStat();
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
              placeholder="please enter player name"
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        Games played: {this.state.playerStats["games_played"]}
        <br />
        Points averaged: {this.state.playerStats["pts"]}
        <br />
        Rebounds averaged: {this.state.playerStats["reb"]}
        <br />
        Assists averaged: {this.state.playerStats["ast"]}
      </div>
    );
  }
}

export default App;
