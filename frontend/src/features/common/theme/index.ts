import { createTheme } from "@mui/material";

const defaultTheme = createTheme();

export const theme = createTheme({
	palette: {
		primary: {
			main: "#404b62",
		},
		// secondary: {},
		// info: {},
		// success: {},
	},
    components: {
        MuiTextField: {
            defaultProps:{
                variant: "filled"
            },
            styleOverrides: {
                root: {
                    '.MuiOutlinedInput-root': {
                        borderRadius: 10,
                    },
                    '.MuiFilledInput-root': {
                        "background-color": "transparent"
                    }
                }
            }
        },
        // MuiButton: {
        //     styleOverrides: {
        //         root: {
        //             '.MuiButton-outlined': {
        //                 bgcolor: "#404B62",
        //                 color: "white"
        //             },
        //         }
        //     }
        // }
    }
});
