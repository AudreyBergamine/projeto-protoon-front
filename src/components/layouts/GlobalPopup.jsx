// src/components/GlobalPopup.jsx
import React, { useState, useEffect } from 'react';
import styles from './GlobalPopup.module.css';

const GlobalPopup = ({ message, duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            console.log('GlobalPopup')
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                onClose && onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!visible || !message) return null;

    return (
        <div className={`${styles.popup} ${visible ? styles.show : ''}`}>
            <div className={styles.popupContent}>
                <span>{message}</span>
            </div>
        </div>
    );
};

export default GlobalPopup;