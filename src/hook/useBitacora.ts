// src/hook/useBitacora.ts
import { useContext } from 'react';
import { BitacoraContext } from '../context/BitacoraContext';

export const useBitacora = () => {
    const context = useContext(BitacoraContext);

    if (context === undefined) {
        throw new Error('useBitacora debe ser usado dentro de un BitacoraProvider');
    }

    return context;
};