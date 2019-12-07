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
				  <article class="tweet">
					<img
						className="avatar"
						src={this.props.data.user.avatar_url}
						alt="Name"
					/>
					<div className="content">
						<div className="author-meta">
						<span className="name">{this.props.data.user.name} : </span>
						<span className="handle">{this.props.data.user.username}</span>
						<span className="time">{this.props.data.created_at}</span>
						</div>
						<p>
						{this.props.data.body}
						</p>
						
					</div>
					</article>
                  </div>
               </div>
               <div className="col-md-4">
               </div>
            </div>

				
			)
	}
}

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
	updatedSearch = async(symbol) => {
		if (this.timeInterval !== null) {
			clearInterval(this.timeInterval);
		}

		if (symbol === []) {
			console.log(symbol);
			this.setState({tweetmsg: []});
		} else{
			this.getTweetMessages(symbol);
			let interval = setInterval(async() => { this.getTweetMessages(symbol); }, 30000);
			console.log(interval);
			this.setState({ timeInterval: interval });
	}
	};

	getTweetMessages = (symbol) => {
		axios.get(`http://localhost:8080/${symbol}`)
	    .then(response => {
			console.log(response);
	      	this.setState({ tweetmsg: response.data.messages });
	    })
	    .catch(error => {
			this.setState({tweetmsg: []});
	      	console.log(error);
		});
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
					<div className="app-title">
						<p>Get latest tweets on your favourite stocks! 📈</p>
					</div>
				</div>
				<div>
					<form onSubmit={this.onEnterPress} >
						<div className="wrapper">
							<input className="input" 
							type="text" 
							placeholder="Stock Symbol here.. hit Enter to Search"
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