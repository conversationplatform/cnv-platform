module.exports = {
    parseJson: (data) => {
        let json = null;
        try {
            json = JSON.parse(data);
        } catch (e) { }
        return json;
    },
}

