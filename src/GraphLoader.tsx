import { MuiFileInput } from "mui-file-input";
import { Stack } from "@mui/material";
import React from "react";
import { Graph } from "./Graph";

interface GraphLoaderProps {
    onGraphChange: (graph: Graph) => void;
}

function GraphLoader({ onGraphChange }: GraphLoaderProps) {
    const [value, setValue] = React.useState<File | null>(null);

    const handleChange = (newValue: File | null) => {
        setValue(newValue);
        if (newValue) {
            newValue.text().then((text) => {
                const g = new Graph(text);
                onGraphChange(g);
                // Blur (remove focus from) the file input
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
            });
        }

    }

    return (
        <Stack direction="column" spacing={2} >
            <h1>Map</h1>
            <MuiFileInput 
                value={value} 
                onChange={handleChange} 
                placeholder="Select a map file"
                sx={{width: '100%'}}
            />
        </Stack>
    );
}

export default GraphLoader;