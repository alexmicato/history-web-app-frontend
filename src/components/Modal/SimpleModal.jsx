import React from 'react';
import './SimpleModal.css'; // Ensure you create appropriate CSS for overlay and modal box

function SimpleModal({ isOpen, onClose, children }) {
    
    
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-body">
                    {children}
                </div>
                <button className="modal-close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default SimpleModal;