import React, { useState, createContext } from "react";

export const ModalContext = createContext();
export default function ModalProvider({ children }) {
    const [showModal, setShowModal] = useState(false);

    const [editModalVisible, setEditModalVisible] = useState(false);

    return (
        <ModalContext.Provider
            value={{
                showModal,
                setShowModal,
                editModalVisible,
                setEditModalVisible,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
}
