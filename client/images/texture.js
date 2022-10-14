import {  useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { RepeatWrapping } from 'three';
import React, { useState, useEffect } from 'react';

export const groundTexture = () => {
    const [test, setTest] = useState(null);
    useEffect(()=> {
        const groundTexture = useLoader(TextureLoader, './images/grass.jpg');
        groundTexture.wrapS = RepeatWrapping
        groundTexture.wrapT = RepeatWrapping
        groundTexture.repeat.set(100,100);
    })
    return test
}