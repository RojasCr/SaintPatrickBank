const { app } = require("./server");
const router = require("../router/router");
require("dotenv").config();

const port = process.env.PORT || 3001;

router(app);

app.listen(port, () => {
    console.log(`Server on port: ${port}`)
})