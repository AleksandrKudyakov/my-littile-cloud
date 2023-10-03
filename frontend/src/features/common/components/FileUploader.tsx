import * as React from "react";

import { MuiFileInput } from "mui-file-input";
import { useParams } from "react-router-dom";

import {
    Button,
    Stack,
    TextField
} from "@mui/material";

import { useUploadFileMutation } from "../../filesWorkspace/api/filesApi";

export const FileUploader = () => {
	const { id } = useParams();

	const [file, setFile] = React.useState<File | null>(null);
	const [fileComment, setFileCommnet] = React.useState<string>("");

	const handleChange = (newFile: any) => {
		if (!!newFile) {
			setFile(newFile);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFileCommnet(e.target.value);
	};

	const [upload, isSuccess] = useUploadFileMutation();
	const handleUploadClick = () => {
		const form = new FormData();
		form.append("file", file as File);
		form.append("userId", id as string);
		form.append("fileComment", fileComment);
		upload(form);
	};

	React.useEffect(() => {
		if (isSuccess) {
			setFile(null);
			setFileCommnet("");
		}
	}, [isSuccess, setFile, setFileCommnet]);

	return (
		<Stack spacing={3} sx={{ width: 300 }}>
			<MuiFileInput
				label={"Выберите файл"}
				value={file}
				onChange={handleChange}
			/>
			<TextField
				label="Комментарий"
				multiline
				onChange={handleInputChange}
				value={fileComment}
			/>
			<Button variant="contained" onClick={handleUploadClick}>
				Загрузить
			</Button>
		</Stack>
	);
};
