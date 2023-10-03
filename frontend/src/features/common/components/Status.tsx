import * as React from "react";

import {
    Alert,
    Snackbar
} from "@mui/material";

export interface IProps {
	initialState: boolean;
    isError: boolean;
}

export const Status = ({ initialState,  isError}: IProps) => {
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		setOpen(initialState);
	}, [initialState]);

	const handleClose = React.useCallback(() => {
		setOpen(false);
	},[setOpen]);

	return (
		<Snackbar
			open={open}
			autoHideDuration={3000}
			onClose={handleClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
		>
			<Alert severity={isError ? "error" : "success"} sx={{ width: "100%" }}>
				{isError ? (
                    <>Возникла ошибка при обновлении данных</>
                )
                :(
                    <>Данные успешно сохранены</>
                )}
                                
			</Alert>
		</Snackbar>
	);
};
