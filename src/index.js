import app from "./app.js"

const main = () => {
    app.listen(app.get("port"))
    console.log("Server is running on localhost:"+ app.get("port"))
}

main();