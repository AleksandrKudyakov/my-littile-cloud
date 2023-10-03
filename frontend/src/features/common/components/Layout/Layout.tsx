import { Outlet } from "react-router-dom";

import {
    Paper,
    Stack
} from "@mui/material";

import { Header } from "./Header";
import { Navigation } from "./Navigation";

export const Layout = () => {
	return (
		<Stack
			sx={{
				background: "#F4F7FB",
			}}
		>
			<Header />
			<Navigation />
			<Stack
				sx={{
					minHeight: "calc(100vh - 290px)",
					p: 5
				}}
			>
				<Paper variant="outlined" sx={{ p: 5, borderRadius: 1, mb: 3 }}>
					<Outlet />
				</Paper>
			</Stack>
		</Stack>
	);
};
