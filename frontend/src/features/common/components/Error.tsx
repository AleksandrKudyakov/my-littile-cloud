import {
    Stack,
    Typography
} from "@mui/material";

export const Error = () => {
	return (
		<Stack
			alignItems="center"
			justifyContent="center"
			sx={{ height: "100vh" }}
		>
			<Typography>Возникла ошибка при обработке запроса</Typography>
		</Stack>
	);
};
