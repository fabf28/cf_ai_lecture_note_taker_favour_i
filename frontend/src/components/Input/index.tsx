import type { ChangeEvent } from "react";

type InputProps = {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    icon: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
};

export default function Input({
    id,
    label,
    type,
    placeholder,
    value,
    onChange,
    icon,
    disabled = false,
    required = false,
    className = "mb-3",
}: InputProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={`form-group ${className}`}>
            <label className="form-label text-small uppercase font-weight-bold" htmlFor={id}>
                {label}
            </label>
            <div className="has-icon-left">
                <input
                    type={type}
                    id={id}
                    className="form-input custom-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    required={required}
                />
                <i className={`form-icon icon icon-${icon}`}></i>
            </div>
        </div>
    );
}
