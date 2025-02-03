import { Solution, parseSolution } from "./Solution";
import { MuiFileInput } from "mui-file-input";
import { Box } from "@mui/material";
import React from "react";

interface SolutionLoaderProps {
    onSolutionChange: (solution: Solution) => void;
}

function SolutionLoader({ onSolutionChange }: SolutionLoaderProps) {
    const [value, setValue] = React.useState<File | null>(null);

    const handleChange = (newValue: File | null) => {
        setValue(newValue);
        if (newValue) {
            newValue.text().then((text) => {
                onSolutionChange(parseSolution(text));
                // Blur (remove focus from) the file input
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
            });
        }
    }

    return (
        <Box>
            <h1>Solution</h1>
            <MuiFileInput 
                value={value} 
                onChange={handleChange} 
                placeholder="Select a solution file"
            />
        </Box>
    );
}

export default SolutionLoader;