exports.getCurrentDate = () => {
    process.env.TZ = "America/Curacao"
    return new Date()
}

