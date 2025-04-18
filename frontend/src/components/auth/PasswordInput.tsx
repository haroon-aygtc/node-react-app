import React, { useState, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";
import { FormControl } from "@/components/ui/form";
import { InputProps } from "@/components/ui/input";

interface PasswordInputProps extends Omit<InputProps, "type"> {
    inputClassName?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({
    placeholder = "••••••••",
    inputClassName = "pl-10 pr-10 input-theme",
    onChange,
    ...rest
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            <FormControl>
                <Input
                    ref={ref}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    className={inputClassName}
                    onChange={onChange}
                    {...rest}
                />
            </FormControl>
            <div className="absolute left-3 top-3 text-muted-color">
                <Lock size={16} />
            </div>
            <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-muted-color hover:text-primary focus:outline-none"
                tabIndex={-1}
            >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
