import "./App.css";

import {
    Route,
    Routes
} from "react-router-dom";

import { UsersList } from "./features/adminWorkspace/components";
import {
    Error,
    Layout,
	Main
} from "./features/common/components";
import {
    FileDownload,
    FilesWorkspace
} from "./features/filesWorkspace/components";

export const App = () => {
	return (
			<Routes>
				<Route path="/" element={<Main />} />
				<Route element={<Layout />}>
					<Route path="/admin" element={<UsersList />} />
					<Route path="/files/:id" element={<FilesWorkspace />} />
				</Route>
				<Route path="/file/:id" element={<FileDownload />} />
				<Route path="/error" element={<Error />} />
                <Route path="*" element={<Error />} />
			</Routes>
	);
};

export default App;
