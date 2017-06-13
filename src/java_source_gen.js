
const {NameConverter, TypeConverter} = require("./utils");

class Class {
    constructor(name = "clazz", packagee = "a.b.c", extendz = null, access = "public") {
        this.name = name;
        this.package = packagee;
        this.extends = extendz;
        this.access = access;
        this.annotations = [];
        this.implements = [];
        this.fields = [];
        this.methods = [];
        this.imports = [];
    }
    addField(field) {
        this.fields.push(field);
        return this;
    }
    addFields(fields) {
        fields.forEach(field => {
            this.fields.push(field);
        });
        return this;
    }
    addMethod(method) {
        this.methods.push(method);
        return this;
    }
    addImplement(implementz) {
        this.implements.push(implementz);
        return this;
    }
    addAnnotation(annotation) {
        this.annotations.push(annotation);
        return this;
    }
    addImport(import_) {
        this.imports.push(import_);
        return this;
    }
    setExtends(extendz) {
        this.extends = extendz;
        return this;
    }
    toString() {
        let code = "package " + this.package + ";\n\n";

        for (let i in this.imports) {
            code += this.imports[i].toString() + "\n"
        }
        code += "\n";

        for (let i in this.annotations) {
            code += this.annotations[i].toString() + "\n";
        }
        code += this.access + " class " + this.name;
        code += this.extends != null ? " extends " + this.extends : "";

        if (this.implements.length != 0) {
            code += " implements ";
            for (let i in this.implements) {
                code += this.implements[i];
                code += i != this.implements.length - 1 ? ", " : "";
            }
        }
        code += " {\n\n";
        this.fields.forEach(field => {
            code += field.toString() + "\n";
        });
        for (let i in this.methods) {
            code += this.methods[i].toString() + "\n";
        }
        code += "}";
        return code;
    }
}

class Import {
    constructor(name = "") {
        this.name = name;
    }
    toString() {
        return "import " + this.name + ";";
    }
}

class Field {
    constructor(name = "field", type = "String", access = "private") {
        this.name = name;
        this.access = access;
        this.type = type;
        this.annotations = [];
    }
    addAnnotation(annotation) {
        this.annotations.push(annotation);
        return this;
    }
    toString() {
        let code = "";
        for (let i in this.annotations) {
            code += "    " + this.annotations[i].toString() + "\n";
        }
        code += "    " + (this.access == "" ? "" : this.access + " ") + this.type + " " + this.name + ";\n";
        return code;
    }
}

class Method {
    constructor(name = "method", returnType = "void", content = "", access = "public") {
        this.name = name;
        this.returnType = returnType;
        this.content = content;
        this.access = access;
        this.parameters = [];
        this.annotations = [];
    }
    addParameter(parameter) {
        this.parameters.push(parameter);
        return this;
    }
    addAnnotation(annotation) {
        this.annotations.push(annotation);
        return this;
    }
    toString() {
        let code = "";
        for (let i in this.annotations) {
            code += "    " + this.annotations[i].toString() + "\n";
        }
        code += "    " + this.access + " " + this.returnType + " " + this.name + "(";
        for (let i in this.parameters) {
            code += this.parameters[i].toString();
            code += i != this.parameters.length - 1 ? ", " : "";
        }
        code += ") {\n";
        code += "        " + this.content + "\n";
        code += "    }\n";
        return code;
    }
}

class Annotation {
    constructor(name = "annotation") {
        this.name = name;
        this.parameters = [];
    }
    addParameter(parameter) {
        this.parameters.push(parameter);
        return this;
    }
    toString() {
        let code = "@" + this.name;
        code += this.parameters.length != 0 ? "(" : "";
        if (this.parameters.length == 1 && this.parameters[0].name == "value") {
            code += this.parameters[0].toSimpleString();
        } else {
            for (let i in this.parameters) {
                code += this.parameters[i].toString();
                code += i != this.parameters.length - 1 ? ", " : "";
            }
        }
        code += this.parameters.length != 0 ? ")" : "";
        return code;
    }
}

class MethodParameter {
    constructor(name = "args", type = "String") {
        this.name = name;
        this.type = type;
    }
    toString() {
        return this.type + " " + this.name;
    }
}

class AnnotationParameter {
    constructor(name = "value", value = "", isString = true) {
        this.name = name;
        this.value = value;
        this.isString = isString;
        if (isString == null) {
            if (value instanceof Number) {
                isString = false;
            } else {
                isString = true;
            }
        }
    }
    toString() {
        return this.name + " = " + (this.isString ? '"' + this.value + '"' : this.value);
    }
    toSimpleString() {
        return this.value;
    }
}

class JavaSourceGen {
    
    static genAndroidActivity(packageName, fileName, fields) {
        fileName = fileName.substr(0, fileName.lastIndexOf("."))
        let fileNameCamel = NameConverter.name2Camel(fileName.substr(fileName.indexOf("_") + 1));
        let content = 
        "super.onCreate(savedInstanceState);\n" + 
        "        setContentView(R.layout." + fileName + ");\n" + 
        "        ButterKnife.bind(this);";
        let method = new Method("onCreate", "void", content, "protected");
        method.addAnnotation(new Annotation("Override"));
        let clazz = new Class(fileNameCamel, packageName)
            .setExtends("BaseActivity")
            .addMethod(method)
            .addFields(fields);
        return clazz;
    }

    static genJPAEntity(packageName, tableName, columns) {

        let entityAnn = new Annotation("Entity");
        let tableAnn = new Annotation("Table")
            .addParameter(new AnnotationParameter("name", tableName));
        
        let clazz = new Class(NameConverter.name2Camel(tableName), packageName)
            .addImplement("IEntity")
            .addAnnotation(tableAnn)
            .addAnnotation(entityAnn)
            .addImport(new Import("javax.persistence.*"))
            .addImport(new Import("java.util.Date"));
        
        JavaSourceGen.genJpaEntityFields(clazz, tableName, columns);
        JavaSourceGen.genJpaEntityMethods(clazz, tableName);

        return clazz;
    }
    
    static genJpaEntityFields(clazz, tableName, columns) {
        for (let i in columns) {
            let column = columns[i];
            let field = new Field(NameConverter.name2camel(column.name), TypeConverter.pg2Java(column.datatype));
            if (column.name == "id") {
                let idAnn = new Annotation("Id");
                let sequenceGeneratorAnn = new Annotation("SequenceGenerator")
                    .addParameter(new AnnotationParameter("name", tableName.toUpperCase() + "_ID_GENERATOR"))
                    .addParameter(new AnnotationParameter("sequenceName", "SEQ_" + tableName.toUpperCase() + "_ID"))
                    .addParameter(new AnnotationParameter("allocationSize", 1, false));
                let generatedValueAnn = new Annotation("GeneratedValue")
                    .addParameter(new AnnotationParameter("strategy", "GenerationType.SEQUENCE", false))
                    .addParameter(new AnnotationParameter("generator", tableName.toUpperCase() + "_ID_GENERATOR"));
                field.addAnnotation(idAnn);
                field.addAnnotation(sequenceGeneratorAnn);
                field.addAnnotation(generatedValueAnn);
            } else if (column.name != "creator_id" && column.name != "modifier_id" && column.name.endsWith("_id")) {
                let nameExcludeId = column.name.substr(0, column.name.lastIndexOf("_") + 1);
                field.type = NameConverter.name2Camel(nameExcludeId);
                field.name = NameConverter.name2camel(nameExcludeId);
                let joinColumnAnn = new Annotation("JoinColumn")
                    .addParameter(new AnnotationParameter("name", column.name));
                let manyToOneAnn = new Annotation("ManyToOne")
                    .addParameter(new AnnotationParameter("fetch", "FetchType.LAZY", false));
                field.addAnnotation(joinColumnAnn);
                field.addAnnotation(manyToOneAnn);
            } else if (column.name.indexOf("_") != -1) {
                let columnAnn = new Annotation("Column")
                    .addParameter(new AnnotationParameter("name", column.name));
                field.addAnnotation(columnAnn);
            }
            if (column.datatype.indexOf("timestamp") != -1) {
                let temporalAnn = new Annotation("Temporal")
                    .addParameter(new AnnotationParameter("value", "TemporalType.TIMESTAMP", false));
                field.addAnnotation(temporalAnn);
            }
            clazz.addField(field);
        }
    }

    static genJpaEntityMethods(clazz, tableName) {
        for (let i in clazz.fields) {
            let field = clazz.fields[i];
            let getMethod = new Method("get" + NameConverter.camel2Camel(field.name), field.type, "return this." + field.name + ";");
            let setMethod = new Method("set" + NameConverter.camel2Camel(field.name), "void", "this." + field.name + " = " + field.name + ";")
                .addParameter(new MethodParameter(NameConverter.name2camel(field.name), field.type));
            clazz.addMethod(getMethod);
            clazz.addMethod(setMethod);
        }
    }
}

module.exports = {Class, Field, Method, Annotation, MethodParameter, AnnotationParameter, JavaSourceGen}
