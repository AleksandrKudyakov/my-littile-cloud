import { format } from "date-fns";
import { useParams } from "react-router-dom";

import {
    Divider,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

import { useGetUserInfoQuery } from "../../common/api/commonApi";
import { FileUploader } from "../../common/components";
import { LinearIndeterminate } from "../../common/components/LinearIndeterminate";
import { humanFileSize } from "../../common/helpers/common";
import { useGetFilesForUserQuery } from "../api/filesApi";
import { FileActions } from "./FileActions";

export const FilesWorkspace = () => {
	const { id } = useParams();
	const {
		data: filesList,
		isLoading,
		refetch,
	} = useGetFilesForUserQuery(id as string);

	const { data: userInfo } = useGetUserInfoQuery();

	return (
		<>
			{isLoading && (
				<Stack alignItems={"center"}>
					<LinearIndeterminate />
				</Stack>
			)}
			{!isLoading && (
				<Stack
					direction={"row"}
					spacing={5}
					divider={<Divider orientation="vertical" flexItem />}
				>
					{userInfo?.id === Number(id) && (
						<Stack>
							<FileUploader />
						</Stack>
					)}
					<Stack width={"100%"}>
						<TableContainer>
							<Table aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell sx={{ width: "20%" }}>
											Имя
										</TableCell>
										<TableCell sx={{ width: "29%" }}>
											Комментарий
										</TableCell>
										<TableCell sx={{ width: "11%" }}>
											Размер
										</TableCell>
										<TableCell sx={{ width: "9%" }}>
											Дата загрузки
										</TableCell>
										<TableCell sx={{ width: "9%" }}>
											Последнее скачивание
										</TableCell>
										<TableCell sx={{ width: "22%" }}>
											Действия
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{filesList?.map((row, index) => (
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
											<TableCell>{row.comment}</TableCell>
											<TableCell>
												{humanFileSize(row.size)}
											</TableCell>
											<TableCell>
												{format(
													new Date(
														row.upload_date.slice(
															0,
															-1
														)
													),
													"dd.MM.yyyy HH:mm:ss"
												)}
											</TableCell>
											<TableCell>
												{!!row.download_date ? (
													<>
														{format(
															new Date(
																row.download_date.slice(
																	0,
																	-1
																)
															),
															"dd.MM.yyyy HH:mm:ss"
														)}
													</>
												) : (
													<>-</>
												)}
											</TableCell>
											<TableCell>
												<FileActions
													fileInfo={row}
													refetch={refetch}
												/>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Stack>
				</Stack>
			)}
		</>
	);
};
