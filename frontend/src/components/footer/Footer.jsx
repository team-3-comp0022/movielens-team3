import React from 'react';

import './footer.scss';

import { Link } from 'react-router-dom';

import bg from '../../assets/footer-bg.jpg';
import logo from '../../assets/movie.jpg';

const Footer = () => {
    return (
        <div className="footer" style={{backgroundImage: `url(${bg})`}}>
            <div className="footer__content container">
                <div className="footer__content__logo">
                    <div className="logo">
                        <img src={logo} style={{borderRadius: 50 }} alt="" />
                        <Link to="/">Movie Hub</Link>
                    </div>
                </div>
                <div className="footer__content__menus">
                    <div className="footer__content__menu">
                        <Link to="/">Home</Link>
                        
                    </div>
                    <div className="footer__content__menu">
                        <Link to="/">Movies by Genres</Link>
                        <Link to="/">Movies by Cast</Link>
                        <Link to="/">Movies by Directors</Link>
                        
                    </div>
                    <div className="footer__content__menu">
                        <Link to="/">Top rated</Link>
                        <Link to="/">Recent releases</Link>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
