import {dataSource} from "./config/ApplicationContext"

async function main() {
    await dataSource.initialize()
}

main()
    .then(() => dataSource.destroy())
    .catch(err => {
        console.error(err);
    });
