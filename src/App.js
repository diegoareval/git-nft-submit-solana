import { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import {TEST_GIFS} from "./data/gif.js";

// Constants
const TWITTER_HANDLE = 'Diego2000areval';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
    const [term, setTerm] = useState('');
    const [gifList, setGifList] = useState([]);

    const onInputChange = (event) => {
        const { value } = event.target;
        setTerm(value);
    };

    const sendGif = async () => {
        if (term.length > 0) {
            console.log('Gif link:', term);
        } else {
            console.log('Empty input. Try again.');
        }
    };


    // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: false });
          console.log("aqui")
          console.log(
              'Connected with Public Key:',
              response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {};

  const renderNotConnectedContainer = () => (
      <button
          className="cta-button connect-wallet-button"
          onClick={connectWallet}
      >
        Connect to Wallet
      </button>
  );

  const renderConnectedContainer = () => (
      <div className="connected-container">
        <input type="text" placeholder="Enter gif link!"
               value={term}
               onChange={onInputChange}/>
        <button className="cta-button submit-gif-button" onClick={sendGif}>Submit</button>
        <div className="gif-grid">
          {gifList.map(gif => (
              <div className="gif-item" key={gif}>
                <img src={gif} alt={gif} />
              </div>
          ))}
        </div>
      </div>
  );

  // UseEffects
  useEffect(() => {
    window.addEventListener('load', async (event) => {
      await checkIfWalletIsConnected();
    });
  }, []);

    useEffect(() => {
        if (walletAddress) {
            console.log('Fetching GIF list...');

            // Call Solana program here.

            // Set state
            setGifList(TEST_GIFS);
        }
    }, [walletAddress]);

  return (
      <div className="App">
        {/* This was solely added for some styling fanciness */}
        <div className={walletAddress ? 'authed-container' : 'container'}>
          <div className="header-container">
            <p className="header">🖼 Metaverse NFT </p>
            <p className="sub-text">
             Check your metaverse NFT and pick whatever you like
            </p>
            {!walletAddress && renderNotConnectedContainer()}
            {walletAddress && renderConnectedContainer()}
          </div>
          <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a
                className="footer-text"
                href={TWITTER_LINK}
                target="_blank"
                rel="noreferrer"
            >{`built on @${TWITTER_HANDLE}`}</a>
          </div>
        </div>
      </div>
  );
};

export default App;