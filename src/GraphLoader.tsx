import { MuiFileInput } from "mui-file-input";
import { Box } from "@mui/material";
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
                let g = new Graph(text);
                onGraphChange(g);
            });
        }

    }

    return (
        <Box>
            <h1>Map</h1>
            <MuiFileInput 
                value={value} 
                onChange={handleChange} 
                placeholder="Select a map file"
            />
        </Box>
    );
}

export default GraphLoader;