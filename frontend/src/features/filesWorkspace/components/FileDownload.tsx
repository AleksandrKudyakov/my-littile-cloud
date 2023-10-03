import * as React from "react";

import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import {
    Button,
    Stack,
    Typography
} from "@mui/material";

import {
    api,
    TagTypes
} from "../../../app/api";
import { downloadFile } from "../../common/helpers/download-file-helper";
import { routes } from "../api/routes";

export const FileDownload = () => {
	const [fileDownloaded, setFileDownloaded] = React.useState(false);

	const { id } = useParams();

	const dispatch = useDispatch();

	React.useEffect(() => {
		downloadFile(
			`${process.env.REACT_APP_API_URL}${routes.fileDownloadExternal}/${id}`
		).then(() => {
			setFileDownloaded(true);
			dispatch(api.util.invalidateTags([TagTypes.GetUserFiles]));
		});
	}, [id, setFileDownloaded, dispatch]);

	const handleDownloadClick = async () => {
		await downloadFile(
			`${process.env.REACT_APP_API_URL}${routes.fileDownloadExternal}/${id}`
		);
		setFileDownloaded(true);
	};

	return (
		<Stack
			alignItems="center"
			justifyContent="center"
			sx={{ height: "100vh" }}
		>
			<Stack spacing={2}>
				{fileDownloaded && <Typography>Файл успешно скачан</Typography>}
				<Typography>
					Если файл не скачался автоматически, нажмите кнопку
					"Скачать"
				</Typography>
				<Button variant="contained" onClick={handleDownloadClick}>
					Скачать
				</Button>
			</Stack>
		</Stack>
	);
};
