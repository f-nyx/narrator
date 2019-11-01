import {dataSource, webApplication} from "./config/ApplicationContext"

async function main() {
    await dataSource.initialize()
    webApplication.configure()
    webApplication.start()
}

main()
    .then(() => dataSource.destroy())
    .catch(err => {
        console.error(err);
    });
