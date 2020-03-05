import React, { MouseEvent } from 'react';
import { NewsState } from '../../../../types';
import { NEWS_POPUP_IMAGES } from '../styleConstants';

const newsPopupStyle: any = {
    backgroundColor: 'white',
    width: '50%',
    height: '50%',
    top: '25%',
    right: '25%',
    position: 'absolute'
};

const newsPopupMinimizeStyle: any = {
    position: 'absolute',
    display: 'block',
    width: '7%',
    height: '12%',
    top: '0%',
    left: '-8%',
    backgroundColor: 'white',
    border: '2px solid black',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
};

const isMinimizedStyle: any = {
    border: '2px solid red',
    top: '45%',
    margin: '2%'
};

const invisibleStyle: any = {
    display: 'none'
};

const popupTitleStyle: any = {
    textAlign: 'center',
    fontSize: '200%'
};

const newsTitleStyle: any = {
    textAlign: 'center',
    fontSize: '150%'
};

const newsInfoStyle: any = {
    textAlign: 'left',
    fontSize: '100%',
    margin: '1%',
    padding: '2%'
};

interface Props {
    news: NewsState;
    newsPopupMinimizeToggle: any;
}

export const NewsPopup = ({ news, newsPopupMinimizeToggle }: Props) => {
    if (!news.isActive) {
        return null;
    }

    const minimizeClick = (event: MouseEvent) => {
        event.preventDefault();
        newsPopupMinimizeToggle();
        event.stopPropagation();
    };

    const standardOnClick = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        // Overall Component
        <div onClick={standardOnClick}>
            {/* Popup */}
            <div style={!news.isMinimized ? newsPopupStyle : invisibleStyle}>
                <div style={popupTitleStyle}>NEWS ALERT!</div>
                <br />
                <h1 style={newsTitleStyle}>{news.newsTitle}</h1>
                <br />
                <div style={newsInfoStyle}>{news.newsInfo}</div>
                <div onClick={minimizeClick} style={{ ...newsPopupMinimizeStyle, ...NEWS_POPUP_IMAGES.minIcon }} />
            </div>

            {/* Minimize Button on the Left */}
            <div
                style={{ ...(news.isMinimized ? newsPopupMinimizeStyle : invisibleStyle), ...NEWS_POPUP_IMAGES.minIcon, ...isMinimizedStyle }}
                onClick={minimizeClick}
            />
        </div>
    );
};
