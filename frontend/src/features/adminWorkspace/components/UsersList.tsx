import * as React from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import {
    Box,
    Checkbox,
    IconButton,
    Link,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

import { LinearIndeterminate } from "../../common/components/LinearIndeterminate";
import { humanFileSize } from "../../common/helpers/common";
import {
    useChangeIsAdmimMutation,
    useDeleteUserMutation,
    useGetUsersListQuery
} from "../api/adminPanelApi";

export const UsersList = () => {
	const { data: usersList, isLoading } = useGetUsersListQuery();

	const [deleteUser] = useDeleteUserMutation();
	const handleDeleteClick = (userId: number) => {
		deleteUser({ id: userId });
	};

	const [changeAdmin] = useChangeIsAdmimMutation();
	const handleCheckboxClick = (user_id: number, value: boolean) => {
		changeAdmin({ user_id: user_id, is_admin: value });
	};

	return (
		<Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
			{isLoading && <LinearIndeterminate />}
			{
				<Stack direction={"row"} spacing={5} sx={{ width: "100%" }}>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Имя</TableCell>
									<TableCell>Логин</TableCell>
									<TableCell>Email</TableCell>
									<TableCell>Администратор</TableCell>
									<TableCell>Файлы</TableCell>
									<TableCell>Удалить</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{usersList?.map((row, index) => (
									<TableRow
										key={index}
										sx={{
											"&:last-child td, &:last-child th":
												{
													border: 0,
												},
										}}
									>
										<TableCell>{row.name}</TableCell>
										<TableCell>{row.login}</TableCell>
										<TableCell>{row.email}</TableCell>
										<TableCell>
											<Checkbox
												checked={row.is_admin}
												onChange={(e, checked) =>
													handleCheckboxClick(
														row.id,
														checked
													)
												}
											/>
										</TableCell>
										<TableCell>
											<>
												<Typography variant="body2">
													Файлов:{" "}
													{row.files_info.files_count}
												</Typography>
												{!!row.files_info
													.files_count && (
													<Typography variant="body2">
														Размер:{" "}
														{humanFileSize(
															row.files_info
																.files_size
														)}
													</Typography>
												)}

												<Link
													href={`/files/${row.id}`}
													target="_blank"
												>
													Хранилище
												</Link>
											</>
										</TableCell>
										<TableCell>
											<IconButton
												color="error"
												onClick={() =>
													handleDeleteClick(row.id)
												}
											>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Stack>
			}
		</Box>
	);
};
