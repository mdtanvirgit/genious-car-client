import React from 'react';
import { useParams } from 'react-router-dom';

export const ProductDetails = () => {
    const { id } = useParams();
    console.log(id);
    return (
        <div>ProductDetails</div>
    )
}
