import { useLocation } from "react-router-dom";

import {
    Button,
    Link,
    Stack,
    Tab,
    Tabs
} from "@mui/material";

import {
    useGetUserInfoQuery,
    useLogoutUserMutation
} from "../../api/commonApi";

export const Navigation = () => {
	const { data: userInfo } = useGetUserInfoQuery();

	const tabs = [
		{
			path: `/files/${userInfo?.id}`,
			title: "Файловое хранилище",
		},
	];

	if (!!userInfo?.is_admin) {
		tabs.push({
			path: "/admin",
			title: "Административная панель",
		});
	}

	const location = useLocation();
	const currentTab = tabs.find(
		(t) => location.pathname.indexOf(t.path) !== -1
	)?.path;

	const [logout] = useLogoutUserMutation();
	const handleLogout = () => {
		logout();
		window.location.href = "/";
	};

	return (
		<Stack
			direction="row"
			justifyContent="space-between"
			alignItems="center"
			sx={{
				height: "70px",
				px: 5,
				pb: 1.5,
				border: "1px solid #8a95b1",
				bgcolor: "#BCC4D7"
			}}
		>
			<Tabs value={currentTab}>
				{tabs.map((tab, index) => (
					<Tab
						key={index}
						label={tab.title}
						value={tab.path}
						href={tab.path}
						component={Link}
						sx={{ px: 5, fontWeight: "bold" }}
					/>
				))}
			</Tabs>
			<Stack>
				<Button variant="outlined" onClick={handleLogout} sx={{ color: "white" }}>
					Выйти
				</Button>
			</Stack>
		</Stack>
	);
};
