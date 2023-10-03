import * as React from "react";

import {
    FormProvider,
    SubmitHandler,
    useController,
    useForm
} from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import {
    Button,
    Grid,
    Stack,
    TextField
} from "@mui/material";

import { useRegisterUserMutation } from "../../api/commonApi";
import { ICloudUserRegistrationInfo } from "../../models/ICloudUserRegistrationInfo";
import { Status } from "../Status";
import { RegistrationValidationSchema } from "./RegistrationValidationSchema";

export const RegistrationForm = () => {
	const formMethods = useForm<ICloudUserRegistrationInfo>({
		defaultValues: {
			name: "",
			login: "",
			email: "",
			password: ""
		},
		resolver: yupResolver(RegistrationValidationSchema),
		mode: "onBlur",
	});

	const {
		formState: { errors },
		control,
		handleSubmit,
	} = formMethods;

	const { field: name } = useController({ name: "name", control });
	const { field: login } = useController({ name: "login", control });
	const { field: email } = useController({ name: "email", control });
	const { field: password } = useController({ name: "password", control });

	const [register, { data, isSuccess, isError }] = useRegisterUserMutation();

	const handleSave: SubmitHandler<ICloudUserRegistrationInfo> = React.useCallback(
		(data: ICloudUserRegistrationInfo) => {
			register(data);
		},
		[register]
	);

	React.useEffect(() => {
		if (isSuccess){
			window.location.href = `/files/${data}`
		}
	}, [isSuccess, data]);

	return (
		<Stack width={500}>
			<FormProvider {...formMethods}>
				<Grid container spacing={4}>
					<Grid item xs={12} sm={12}>
						<TextField
							{...name}
							label="Имя пользователя"
							fullWidth
							error={!!errors.name}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<TextField
							{...login}
							label="Логин"
							error={!!errors.login}
							fullWidth
							required
							helperText={errors.login?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<TextField
							{...email}
							label="E-mail"
							fullWidth
							required
							error={!!errors.email}
							helperText={errors.email?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<TextField
							{...password}
							label="Пароль"
							fullWidth
							required
							error={!!errors.password}
							helperText={errors.password?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<Button
							variant="contained"
							type="submit"
							onClick={handleSubmit(handleSave)}
							fullWidth
						>
							Зарегистрироваться
						</Button>
					</Grid>
				</Grid>
				<Status
					initialState={ isSuccess || isError }
					isError={isError}
				/>
			</FormProvider>
		</Stack>
	);
};
