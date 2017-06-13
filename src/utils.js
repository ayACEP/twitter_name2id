
class Utils {
    static null2EmptyString(value) {
        return value == null ? "" : value;
    }
    static null2Zero() {
        return value == null ? 0 : value;
    }
    static null2NewObject(value) {
        return value == null ? {} : value;
    }
}

class NameConverter {
    static name2Camel(name) {
        let words = name.split("_");
        return NameConverter.words2Camel(words);
    }
    static name2camel(name) {
        let words = name.split("_");
        return NameConverter.words2camel(words);
    }
    static camel2Camel(camel) {
        return camel.charAt(0).toUpperCase() + camel.slice(1, camel.length)
    }
    static words2Camel(words) {
        let result = "";
        for (let i in words) {
            if (words[i].length == 0) {
                continue;
            }
            let head = words[i].charAt(0).toUpperCase();
            result += head + words[i].substr(1);
        }
        return result;
    }
    static words2camel(words) {
        let result = "";
        for (let i in words) {
            if (words[i].length == 0) {
                continue;
            }
            if (i == 0) {
                let head = words[i].charAt(0).toLowerCase();
                result += head + words[i].substr(1);
            } else {
                let head = words[i].charAt(0).toUpperCase();
                result += head + words[i].substr(1);
            }
        }
        return result;
    }
}

class TypeConverter {
    static pg2Java(pgType) {
        switch (pgType) {
        case "bigint":
            return "Long";
        case "integer":
            return "Integer";
        case "character varying":
        case "text":
            return "String";
        case "timestamp without time zone":
            return "Date";
        }
    }
}

module.exports = {Utils, NameConverter, TypeConverter};
