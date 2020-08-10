module.exports = function forbidden() {
    return this.res.status(403).json({ message: "Forbidden" });
};
