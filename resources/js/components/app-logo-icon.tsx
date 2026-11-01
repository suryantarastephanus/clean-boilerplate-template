import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <clipPath id="app-logo-squircle">
                    <rect width="512" height="512" rx="96" ry="96" />
                </clipPath>
            </defs>
            <g clipPath="url(#app-logo-squircle)">
                {/* Top-Left: Green */}
                <rect x="0" y="0" width="256" height="256" fill="#4CAF50" />
                {/* Top-Right: Amber / Gold */}
                <rect x="256" y="0" width="256" height="256" fill="#FFC107" />
                {/* Bottom-Left: Blue */}
                <rect x="0" y="256" width="256" height="256" fill="#2196F3" />
                {/* Bottom-Right: Dark Blue-Grey */}
                <rect x="256" y="256" width="256" height="256" fill="#455A64" />

                {/* Plus Symbol (+) */}
                <path
                    d="M74.5 138 H201.5 M138 74.5 V201.5"
                    stroke="#FFFFFF"
                    strokeWidth="21"
                    strokeLinecap="round"
                />

                {/* Minus Symbol (-) */}
                <path
                    d="M330 138 H437"
                    stroke="#FFFFFF"
                    strokeWidth="20"
                    strokeLinecap="round"
                />

                {/* Multiplication Symbol (X) */}
                <path
                    d="M96 332 L181 436 M181 332 L96 436"
                    stroke="#FFFFFF"
                    strokeWidth="21"
                    strokeLinecap="round"
                />

                {/* Slash Symbol (\) */}
                <path
                    d="M352 332 L416 436"
                    stroke="#FFFFFF"
                    strokeWidth="21"
                    strokeLinecap="round"
                />
            </g>
        </svg>
    );
}
