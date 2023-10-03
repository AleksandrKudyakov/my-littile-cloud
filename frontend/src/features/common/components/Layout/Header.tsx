import {
    Stack,
    Typography
} from "@mui/material";

import { useGetUserInfoQuery } from "../../api/commonApi";

export const Header = () => {
	const { data: userInfo } = useGetUserInfoQuery();

	return (
		<Stack
			direction={"row"}
			justifyContent={"space-between"}
			sx={{ height: "80px", py: 2.5, px: 5, bgcolor: "#F4F7FB" }}
		>
			<Stack>
				<Typography variant="h4">My Little Cloud</Typography>
			</Stack>
			<Stack>
			<Typography variant="subtitle2">{userInfo?.name}</Typography>
			<Typography variant="subtitle2">{userInfo?.email}</Typography>
			</Stack>
		</Stack>
	);
};
