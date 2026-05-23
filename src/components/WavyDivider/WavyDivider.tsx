'use client';

import { motion } from 'framer-motion';

interface WavyDividerProps {
    color: string;
    position: 'top' | 'bottom';
    invert?: boolean;
}

export default function WavyDivider({ color, position, invert = false }: WavyDividerProps) {
    // SVG path for a smooth wave
    const wavePath = "M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,112C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

    return (
        <div className={`liquid-wave ${position === 'top' ? 'wave-top' : 'wave-bottom'}`} style={{
            transform: position === 'top' ? 'rotate(180deg)' : 'none',
            filter: invert ? 'scaleY(-1)' : 'none',
            marginTop: position === 'top' ? '-1px' : '0',
            marginBottom: position === 'bottom' ? '-1px' : '0'
        }}>
            <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '120px' }}>
                <motion.path
                    initial={{ d: wavePath }}
                    animate={{
                        d: [
                            wavePath,
                            "M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                            wavePath
                        ]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    fill={color}
                />
            </svg>
        </div>
    );
}
