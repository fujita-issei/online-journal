import app from "./app.js"

const PORT = process.env.PORT || 8080

app.listen(PORT, function() {
    console.log(`Server start: http://localhost:${PORT}`)
})