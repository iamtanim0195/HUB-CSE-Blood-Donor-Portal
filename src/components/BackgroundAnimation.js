'use client';
import { useEffect, useState } from 'react';

export default function BackgroundAnimation() {
    const [drops, setDrops] = useState([]);

    useEffect(() => {
        const newDrops = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 10,
            size: Math.random() * 20 + 10,
        }));
        setDrops(newDrops);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {drops.map((drop) => (
                <div
                    key={drop.id}
                    className="absolute blood-drop rounded-full bg-red-200 opacity-20"
                    style={{
                        left: `${drop.left}%`,
                        width: `${drop.size}px`,
                        height: `${drop.size}px`,
                        top: '-50px',
                        animationDelay: `${drop.delay}s`,
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50" />
        </div>
    );
}