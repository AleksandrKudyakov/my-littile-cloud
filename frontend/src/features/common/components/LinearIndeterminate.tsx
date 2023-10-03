import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export const LinearIndeterminate = () => {
    return (
        <Box sx={{ width: "300px", height: "10px" }}>
            <LinearProgress />
        </Box>
    );
};
