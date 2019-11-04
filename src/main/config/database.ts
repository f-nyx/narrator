import DataSourceConfig from "./DataSourceConfig"

export const database = new DataSourceConfig(
    "mongodb://localhost/admin",
    "root",
    "example"
)
