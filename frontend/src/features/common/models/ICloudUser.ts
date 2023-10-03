export interface ICloudUser {
    id: number;
    name: string;
    login: string;
    email: string;
    password: string;
    is_admin: boolean;
    storage_path: string;
    files_info: IFilesSizes; 
}

export interface IFilesSizes {
    files_count: number;
    files_size: number;
}

