import * as React from "react";

import {
    FormProvider,
    SubmitHandler,
    useController,
    useForm
} from "react-hook-form";

import {
    Box,
    Button,
    Grid,
    Stack,
    TextField
} from "@mui/material";

import { useEditFileInfoMutation } from "../api/filesApi";
import { IFileEditInfo } from "../models/IFileEditInfo";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	border: "2px solid gray.50",
	boxShadow: 24,
	p: 4,
};

interface IProps {
	info: IFileEditInfo;
    closeModal: () => void;
}

export const FileEdit = ({ info, closeModal }: IProps) => {
	const formMethods = useForm<IFileEditInfo>({
		defaultValues: {
			id: info.id,
			name: info.name,
			comment: info.comment,
		},
		mode: "onBlur",
	});

	const {
		formState: { errors },
		control,
		handleSubmit,
	} = formMethods;

	const { field: name } = useController({ name: "name", control });
	const { field: comment } = useController({ name: "comment", control });

	const [editFile, status] = useEditFileInfoMutation();
	const handleLogin: SubmitHandler<IFileEditInfo> = React.useCallback(
		(data: IFileEditInfo) => {
			editFile(data);
		},
		[editFile]
	);

	React.useEffect(() => {
		if (status.isSuccess){
			closeModal();
		}
	}, [status, closeModal]);

	return (
		<Box sx={style}>
			<Stack width={500}>
				<FormProvider {...formMethods}>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={12}>
							<TextField
								{...name}
								label="Имя файла"
								fullWidth
								error={!!errors.name}
								required
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								{...comment}
								label="Комментарий"
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<Button
								variant="contained"
								type="submit"
								onClick={handleSubmit(handleLogin)}
								fullWidth
							>
								Сохранить
							</Button>
						</Grid>
					</Grid>
				</FormProvider>
			</Stack>
		</Box>
	);
};
