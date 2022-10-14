import React, { useRef, useState, useEffect } from 'react';
import {usePlane} from '@react-three/cannon'
import {  useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { RepeatWrapping } from 'three';

export const Ground = () => {
    const [load, setLoad] = useState(false);
    const [ref] = usePlane(()=> ({
        ratation : [0,0,0],
        position: [0,0,0]
    }));
    const groundTexture = useLoader(TextureLoader, './images/grass.jpg');
    groundTexture.wrapS = RepeatWrapping
    groundTexture.wrapT = RepeatWrapping
    groundTexture.repeat.set(100,100);
    return (
        <mesh ref={ref}>
            <planeBufferGeometry attach="geometry" args={[100, 100]} />
            <meshStandardMaterial attach="material" map={groundTexture} />
        </mesh>
    )
    
}