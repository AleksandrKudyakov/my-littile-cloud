import * as React from "react";

import {
    FormProvider,
    SubmitHandler,
    useController,
    useForm
} from "react-hook-form";

import {
    Button,
    Grid,
    Stack,
    TextField
} from "@mui/material";

import { useLoginUserMutation } from "../api/commonApi";
import { ICloudUserLoginData } from "../models/ICloudUserLoginData";

export const LoginForm = () => {
	const formMethods = useForm<ICloudUserLoginData>({
		defaultValues: {
			login: "",
			password: "",
		},
		//resolver: yupResolver(RegistrationValidationSchema),
		mode: "onBlur",
	});

	const {
		formState: { errors },
		control,
		handleSubmit,
	} = formMethods;

	const { field: login } = useController({ name: "login", control });
	const { field: password } = useController({ name: "password", control });

	const [loginUser, { data, isSuccess }] = useLoginUserMutation();
	const handleLogin: SubmitHandler<ICloudUserLoginData> = React.useCallback(
		(data: ICloudUserLoginData) => {
			loginUser(data);
		},
		[loginUser]
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
							{...login}
							label="Логин"
							fullWidth
							error={!!errors.login}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<TextField
							{...password}
							label="Пароль"
							error={!!errors.password}
							fullWidth
							required
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<Button
							variant="contained"
							type="submit"
							onClick={handleSubmit(handleLogin)}
							fullWidth
						>
							Войти
						</Button>
					</Grid>
				</Grid>
			</FormProvider>
		</Stack>
	);
};
