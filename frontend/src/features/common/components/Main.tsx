import * as React from "react";

import {
    Box,
    Divider,
    Stack,
    Tab,
    Tabs,
    Typography
} from "@mui/material";

import { LoginForm } from "./LoginFrom";
import { RegistrationForm } from "./Registration/RegistrationForm";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

const TabPanel = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Stack>{children}</Stack>
				</Box>
			)}
		</div>
	);
};

const a11yProps = (index: number) => {
	return {
		id: `horizontal-tab-${index}`,
		"aria-controls": `horizontal-tabpanel-${index}`,
	};
};

export const Main = () => {
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Stack
			alignItems={"center"}
			justifyContent={"center"}
			sx={{ minHeight: "100vh", "background": "linear-gradient(150deg, #f4f7fb,#cadaf2,#8a95b1)" }}
		>
			<Stack
				direction={"row"}
				alignItems={"center"}
				spacing={4}
				divider={<Divider orientation="vertical" flexItem />}
			>
				<Stack direction={"column"} alignItems={"center"}>
					<Stack>
						<img
							src="/static/front/img/logo.png"
							width="200px"
						></img>
					</Stack>
					<Stack>
						<Typography variant="h5">
							My Little Cloud MLC
						</Typography>
					</Stack>
				</Stack>
				<Stack
					sx={{
						width: "500px",
						flexGrow: 1,
						display: "flex",
					}}
				>
					<Tabs value={value} onChange={handleChange} sx={{ pl: 3 }}>
						<Tab
							label="Регистрация"
							{...a11yProps(0)}
							aria-selected={true}
						/>
						<Tab label="Войти" {...a11yProps(1)} />
					</Tabs>
					<TabPanel value={value} index={0}>
						<RegistrationForm />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<LoginForm />
					</TabPanel>
				</Stack>
			</Stack>
		</Stack>
	);
};
