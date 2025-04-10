import React, { createContext, useState, useContext } from 'react';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
    const [popup, setPopup] = useState({
        message: '',
        type: 'success',
        visible: false,
        duration: 3000
    });

    const showPopup = (message, type = 'success', duration = 10000) => {
        console.log('contextPop')
        setPopup({ message, type, visible: true, duration });
    };

    const hidePopup = () => {
        console.log('sumiu')
        setPopup(prev => ({ ...prev, visible: false }));
    };

    return (
        <PopupContext.Provider value={{ popup, showPopup, hidePopup }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => useContext(PopupContext);