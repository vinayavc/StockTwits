import React from 'react';
import axios from 'axios';
import './App.css';
import closeTag from './close-tag.png'


class Box extends React.Component {
	render() {
		return (

            <div className="row">
               <div className="col-md-4" align="center"></div>
               <div className="container">
                  <div className="col-md-4 displaycolumn">
                     <div className="panel panel-danger">
                        <div className="panel-heading">
                           <h4 className="panel-title">
                              {this.props.data.user.name} : <span>{this.props.data.user.username}</span>
                           </h4>
                        </div>
                        <div className="panel-body">
                           <div className="twitter-timeline" data-width="100%" >{this.props.data.body}</div> 
                        </div>
                     </div>
                  </div>
               </div>
               <div className="col-md-4">
               </div>
            </div>

				
			)
	}
}

// class TweetCountBox extends React.Component {
// 	render() {
// 		return (
// 			<div className="row">
// 				<div className="tweetcountDisplay" data-width="100%"> {this.props.data.tweetCount} </div>
// 			</div>
// 		)
// 	}
// }

export default class App extends React.Component{
	constructor(props) {
	    super(props);

	    this.state = {
			tweetmsg: [],
			stockName: '',
			stockSymbols: [],
			timeInterval: null,
	    }
	}
	  

	componentDidMount() {

		// axios.get('https://api.stocktwits.com/api/2/streams/symbol/MSFT.json')
	    // .then(response => {
	    //   this.setState({ tweetmsg: response.data.messages });
		//   console.log(response);
	    // })
	    // .catch(error => {
	    //   console.log(error);
	    // });
	}

	/**
   * updates the list of symbols entered
   * @param {string} symbol
   */
	updateSymbols = (symbol) => {
		symbol=symbol.toUpperCase();
		// let stockSymbolList = this.state.stockSymbols;
		// let symbolCount = this.getTweetCount();
		// console.log(symbolCount);
		// stockSymbolList[symbol] = symbolCount;
		this.state.stockSymbols.push(symbol);
		console.log(this.state.stockSymbols);
	};

	// getTweetCount = (symbol) => {
	// 	let symbolList = this.state.tweetmsg.symbols;
	// 	count=0;
	// 	if(symbolList.foreach(contains(symbol))){
	// 		count+=1;
	// 	}
	// 	return count;
	// };
	/**
	 * delete a symbol
	 * @param {string} symbol
	 */
	deleteSymbol = (symbol) => {
		symbol = symbol.toUpperCase();
		let stockNames = this.state.stockSymbols.filter((item,j) => symbol!==item);
		this.setState(state => {
			return state.stockSymbols= stockNames;
		});
		this.updatedSearch(stockNames);
	};

	

	/**
	 * updates the search results with new symbol list
	 * @param {string} symbol
	 */
	updatedSearch = (symbol) => {
		if (this.timeInterval !== null) {
			clearInterval(this.timeInterval);
		}
		if (symbol === []) {
			console.log(symbol);
			this.setState({tweetmsg: []});
		}
		else{
		axios.get(`http://localhost:8080/${symbol}`)
	    .then(response => {
			console.log(response);
	      	this.setState({ tweetmsg: response.data.messages });
	    })
	    .catch(error => {
			this.setState({tweetmsg: []});
	      	console.log(error);
		});
	}
	};

	onEnterPress = (e) =>{
        let { stockName } = this.state;
		e.preventDefault();
		
		// update symbol list
		this.updateSymbols(stockName);

		
		// call api to fetch new data with new symbol list
		this.updatedSearch(this.state.stockSymbols);
		
		//reset the text field
		this.setState({ stockName: '' });
	};

	render() {
	    const boxList = this.state.tweetmsg.map((data, i) => {
	    	return (
	    		<Box key={i} data={data}/>
	    		)
		});
		
		const symbolList = this.state.stockSymbols.map((item, i) => {
			return (
			  <div className="new-tag" key={i}>{item}
				<img alt="" className="remove-filter delete" src={closeTag} onClick={() => this.deleteSymbol(item)}></img>
			  </div>
			)
		});
	    return (
			<div>
				<div>
					<form onSubmit={this.onEnterPress} >
						<div className="wrapper">
							<input className="input" 
							type="text" 
							placeholder="Enter Stock Symbol"
							value={this.state.stockName}
							onChange={(e) => this.setState({stockName : e.target.value})}/>
							<i className="fas fa-search"></i>
						</div>
					</form>
				</div>
				<div className="current-showing">
					{symbolList}
				</div>
				{ this.state.tweetmsg !==0 ?
				<div>
					{boxList}
				</div> : <div></div>}
				
			</div>
	    )
	  }
	};