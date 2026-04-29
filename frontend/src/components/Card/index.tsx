import React from 'react';
import './styles.scss';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    header?: React.ReactNode;
}

export default function Card({ children, className = '', title, header }: CardProps) {
    return (
        <div className={`customcard ${className}`}>
            {(title || header) && (
                <div className="card-header">
                    {title && <div className="card-title h3">{title}</div>}
                    {header}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}