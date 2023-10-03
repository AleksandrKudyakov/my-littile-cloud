import * as React from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import {
    IconButton,
    Modal,
    Snackbar,
    Stack
} from "@mui/material";

import { downloadFile } from "../../common/helpers/download-file-helper";
import { useDeleteFileMutation } from "../api/filesApi";
import { routes } from "../api/routes";
import { IFileEditInfo } from "../models/IFileEditInfo";
import { IFileInfo } from "../models/IFileInfo";
import { FileEdit } from "./FileEdit";

interface IProps {
	fileInfo: IFileInfo;
	refetch: () => void;
}

export const FileActions = ({ fileInfo, refetch }: IProps) => {
	const [deleteFile] = useDeleteFileMutation();
	const handleDeleteClick = (id: number) => {
		deleteFile({ file_id: id });
	};

	const handleDownloadClick = async (fileId: number, fileName: string) => {
		await downloadFile(
			`${process.env.REACT_APP_API_URL}${routes.fileDownload}/${fileId}`,
			fileName
		);

		refetch();
	};

	const [openCopied, setOpenCopied] = React.useState(false);
	const [linkForCopy, setLinkForCopy] = React.useState("");
	const handleShareClick = (e: React.MouseEvent, download_link: string) => {
		setLinkForCopy(`${process.env.REACT_APP_API_URL}/file/${download_link}`)
		setOpenCopied(true);
	};

	const [fileEditInfo, setFileEditInfo] = React.useState<IFileEditInfo>();
	const [openEditModal, setOpenEditModal] = React.useState(false);

	const handleOpenModal = (id: number, name: string, comment: string) => {
		setOpenEditModal(true);
		setFileEditInfo({ id: id, name: name, comment: comment });
	};
	const handleCloseModal = () => setOpenEditModal(false);
	return (
		<>
			<Stack direction="row">
				<Stack>
					<IconButton
						onClick={() =>
							handleOpenModal(
								fileInfo.id,
								fileInfo.name,
								fileInfo.comment
							)
						}
					>
						<EditIcon />
					</IconButton>
				</Stack>
				<Stack>
					<IconButton
						onClick={() =>
							handleDownloadClick(fileInfo.id, fileInfo.name)
						}
					>
						<DownloadIcon />
					</IconButton>
				</Stack>
				<Stack>
					<IconButton
						onClick={(e) =>
							handleShareClick(e, fileInfo.download_link)
						}
					>
						<ShareIcon />
					</IconButton>
					<Snackbar
						message={`Ссылка - ${linkForCopy}`}
						anchorOrigin={{
							vertical: "top",
							horizontal: "center",
						}}
						autoHideDuration={60000}
						onClose={() => setOpenCopied(false)}
						open={openCopied}
					/>
				</Stack>
				<Stack>
					<IconButton
						color="error"
						onClick={() => handleDeleteClick(fileInfo.id)}
					>
						<DeleteIcon />
					</IconButton>
				</Stack>
			</Stack>
			<Modal open={openEditModal} onClose={handleCloseModal}>
				<div>
					<FileEdit
						info={fileEditInfo as IFileEditInfo}
						closeModal={handleCloseModal}
					/>
				</div>
			</Modal>
		</>
	);
};
