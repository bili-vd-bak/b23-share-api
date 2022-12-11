"use strict";
exports.id = 203;
exports.ids = [203];
exports.modules = {

/***/ 2203:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "addResolversToSchema": () => (/* reexport */ addResolversToSchema),
  "assertResolversPresent": () => (/* reexport */ assertResolversPresent),
  "chainResolvers": () => (/* reexport */ chainResolvers),
  "checkForResolveTypeResolver": () => (/* reexport */ checkForResolveTypeResolver),
  "extendResolversFromInterfaces": () => (/* reexport */ extendResolversFromInterfaces),
  "makeExecutableSchema": () => (/* reexport */ makeExecutableSchema),
  "mergeSchemas": () => (/* reexport */ mergeSchemas)
});

// EXTERNAL MODULE: ./node_modules/.pnpm/graphql@16.6.0/node_modules/graphql/index.js
var graphql = __webpack_require__(9398);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/forEachField.js

function forEachField(schema, fn) {
    const typeMap = schema.getTypeMap();
    for (const typeName in typeMap) {
        const type = typeMap[typeName];
        // TODO: maybe have an option to include these?
        if (!(0,graphql/* getNamedType */.xCR)(type).name.startsWith('__') && (0,graphql/* isObjectType */.lpB)(type)) {
            const fields = type.getFields();
            for (const fieldName in fields) {
                const field = fields[fieldName];
                fn(field, typeName, fieldName);
            }
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+schema@8.5.1_graphql@16.6.0/node_modules/@graphql-tools/schema/esm/assertResolversPresent.js


function assertResolversPresent(schema, resolverValidationOptions = {}) {
    const { requireResolversForArgs, requireResolversForNonScalar, requireResolversForAllFields } = resolverValidationOptions;
    if (requireResolversForAllFields && (requireResolversForArgs || requireResolversForNonScalar)) {
        throw new TypeError('requireResolversForAllFields takes precedence over the more specific assertions. ' +
            'Please configure either requireResolversForAllFields or requireResolversForArgs / ' +
            'requireResolversForNonScalar, but not a combination of them.');
    }
    forEachField(schema, (field, typeName, fieldName) => {
        // requires a resolver for *every* field.
        if (requireResolversForAllFields) {
            expectResolver('requireResolversForAllFields', requireResolversForAllFields, field, typeName, fieldName);
        }
        // requires a resolver on every field that has arguments
        if (requireResolversForArgs && field.args.length > 0) {
            expectResolver('requireResolversForArgs', requireResolversForArgs, field, typeName, fieldName);
        }
        // requires a resolver on every field that returns a non-scalar type
        if (requireResolversForNonScalar !== 'ignore' && !(0,graphql/* isScalarType */.KAw)((0,graphql/* getNamedType */.xCR)(field.type))) {
            expectResolver('requireResolversForNonScalar', requireResolversForNonScalar, field, typeName, fieldName);
        }
    });
}
function expectResolver(validator, behavior, field, typeName, fieldName) {
    if (!field.resolve) {
        const message = `Resolver missing for "${typeName}.${fieldName}".
To disable this validator, use:
  resolverValidationOptions: {
    ${validator}: 'ignore'
  }`;
        if (behavior === 'error') {
            throw new Error(message);
        }
        if (behavior === 'warn') {
            console.warn(message);
        }
        return;
    }
    if (typeof field.resolve !== 'function') {
        throw new Error(`Resolver "${typeName}.${fieldName}" must be a function`);
    }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+schema@8.5.1_graphql@16.6.0/node_modules/@graphql-tools/schema/esm/chainResolvers.js

function chainResolvers(resolvers) {
    return (root, args, ctx, info) => resolvers.reduce((prev, curResolver) => {
        if (curResolver != null) {
            return curResolver(prev, args, ctx, info);
        }
        return (0,graphql/* defaultFieldResolver */.ElQ)(prev, args, ctx, info);
    }, root);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/forEachDefaultValue.js

function forEachDefaultValue(schema, fn) {
    const typeMap = schema.getTypeMap();
    for (const typeName in typeMap) {
        const type = typeMap[typeName];
        if (!(0,graphql/* getNamedType */.xCR)(type).name.startsWith('__')) {
            if ((0,graphql/* isObjectType */.lpB)(type)) {
                const fields = type.getFields();
                for (const fieldName in fields) {
                    const field = fields[fieldName];
                    for (const arg of field.args) {
                        arg.defaultValue = fn(arg.type, arg.defaultValue);
                    }
                }
            }
            else if ((0,graphql/* isInputObjectType */.hLV)(type)) {
                const fields = type.getFields();
                for (const fieldName in fields) {
                    const field = fields[fieldName];
                    field.defaultValue = fn(field.type, field.defaultValue);
                }
            }
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/transformInputValue.js

function transformInputValue(type, value, inputLeafValueTransformer = null, inputObjectValueTransformer = null) {
    if (value == null) {
        return value;
    }
    const nullableType = (0,graphql/* getNullableType */.tfS)(type);
    if ((0,graphql/* isLeafType */.UTg)(nullableType)) {
        return inputLeafValueTransformer != null ? inputLeafValueTransformer(nullableType, value) : value;
    }
    else if ((0,graphql/* isListType */.HGy)(nullableType)) {
        return value.map((listMember) => transformInputValue(nullableType.ofType, listMember, inputLeafValueTransformer, inputObjectValueTransformer));
    }
    else if ((0,graphql/* isInputObjectType */.hLV)(nullableType)) {
        const fields = nullableType.getFields();
        const newValue = {};
        for (const key in value) {
            const field = fields[key];
            if (field != null) {
                newValue[key] = transformInputValue(field.type, value[key], inputLeafValueTransformer, inputObjectValueTransformer);
            }
        }
        return inputObjectValueTransformer != null ? inputObjectValueTransformer(nullableType, newValue) : newValue;
    }
    // unreachable, no other possible return value
}
function serializeInputValue(type, value) {
    return transformInputValue(type, value, (t, v) => {
        try {
            return t.serialize(v);
        }
        catch (_a) {
            return v;
        }
    });
}
function parseInputValue(type, value) {
    return transformInputValue(type, value, (t, v) => {
        try {
            return t.parseValue(v);
        }
        catch (_a) {
            return v;
        }
    });
}
function parseInputValueLiteral(type, value) {
    return transformInputValue(type, value, (t, v) => t.parseLiteral(v, {}));
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/heal.js

// Update any references to named schema types that disagree with the named
// types found in schema.getTypeMap().
//
// healSchema and its callers (visitSchema/visitSchemaDirectives) all modify the schema in place.
// Therefore, private variables (such as the stored implementation map and the proper root types)
// are not updated.
//
// If this causes issues, the schema could be more aggressively healed as follows:
//
// healSchema(schema);
// const config = schema.toConfig()
// const healedSchema = new GraphQLSchema({
//   ...config,
//   query: schema.getType('<desired new root query type name>'),
//   mutation: schema.getType('<desired new root mutation type name>'),
//   subscription: schema.getType('<desired new root subscription type name>'),
// });
//
// One can then also -- if necessary --  assign the correct private variables to the initial schema
// as follows:
// Object.assign(schema, healedSchema);
//
// These steps are not taken automatically to preserve backwards compatibility with graphql-tools v4.
// See https://github.com/ardatan/graphql-tools/issues/1462
//
// They were briefly taken in v5, but can now be phased out as they were only required when other
// areas of the codebase were using healSchema and visitSchema more extensively.
//
function healSchema(schema) {
    healTypes(schema.getTypeMap(), schema.getDirectives());
    return schema;
}
function healTypes(originalTypeMap, directives) {
    const actualNamedTypeMap = Object.create(null);
    // If any of the .name properties of the GraphQLNamedType objects in
    // schema.getTypeMap() have changed, the keys of the type map need to
    // be updated accordingly.
    for (const typeName in originalTypeMap) {
        const namedType = originalTypeMap[typeName];
        if (namedType == null || typeName.startsWith('__')) {
            continue;
        }
        const actualName = namedType.name;
        if (actualName.startsWith('__')) {
            continue;
        }
        if (actualName in actualNamedTypeMap) {
            throw new Error(`Duplicate schema type name ${actualName}`);
        }
        actualNamedTypeMap[actualName] = namedType;
        // Note: we are deliberately leaving namedType in the schema by its
        // original name (which might be different from actualName), so that
        // references by that name can be healed.
    }
    // Now add back every named type by its actual name.
    for (const typeName in actualNamedTypeMap) {
        const namedType = actualNamedTypeMap[typeName];
        originalTypeMap[typeName] = namedType;
    }
    // Directive declaration argument types can refer to named types.
    for (const decl of directives) {
        decl.args = decl.args.filter(arg => {
            arg.type = healType(arg.type);
            return arg.type !== null;
        });
    }
    for (const typeName in originalTypeMap) {
        const namedType = originalTypeMap[typeName];
        // Heal all named types, except for dangling references, kept only to redirect.
        if (!typeName.startsWith('__') && typeName in actualNamedTypeMap) {
            if (namedType != null) {
                healNamedType(namedType);
            }
        }
    }
    for (const typeName in originalTypeMap) {
        if (!typeName.startsWith('__') && !(typeName in actualNamedTypeMap)) {
            delete originalTypeMap[typeName];
        }
    }
    function healNamedType(type) {
        if ((0,graphql/* isObjectType */.lpB)(type)) {
            healFields(type);
            healInterfaces(type);
            return;
        }
        else if ((0,graphql/* isInterfaceType */.oTV)(type)) {
            healFields(type);
            if ('getInterfaces' in type) {
                healInterfaces(type);
            }
            return;
        }
        else if ((0,graphql/* isUnionType */.EN0)(type)) {
            healUnderlyingTypes(type);
            return;
        }
        else if ((0,graphql/* isInputObjectType */.hLV)(type)) {
            healInputFields(type);
            return;
        }
        else if ((0,graphql/* isLeafType */.UTg)(type)) {
            return;
        }
        throw new Error(`Unexpected schema type: ${type}`);
    }
    function healFields(type) {
        const fieldMap = type.getFields();
        for (const [key, field] of Object.entries(fieldMap)) {
            field.args
                .map(arg => {
                arg.type = healType(arg.type);
                return arg.type === null ? null : arg;
            })
                .filter(Boolean);
            field.type = healType(field.type);
            if (field.type === null) {
                delete fieldMap[key];
            }
        }
    }
    function healInterfaces(type) {
        if ('getInterfaces' in type) {
            const interfaces = type.getInterfaces();
            interfaces.push(...interfaces
                .splice(0)
                .map(iface => healType(iface))
                .filter(Boolean));
        }
    }
    function healInputFields(type) {
        const fieldMap = type.getFields();
        for (const [key, field] of Object.entries(fieldMap)) {
            field.type = healType(field.type);
            if (field.type === null) {
                delete fieldMap[key];
            }
        }
    }
    function healUnderlyingTypes(type) {
        const types = type.getTypes();
        types.push(...types
            .splice(0)
            .map(t => healType(t))
            .filter(Boolean));
    }
    function healType(type) {
        // Unwrap the two known wrapper types
        if ((0,graphql/* isListType */.HGy)(type)) {
            const healedType = healType(type.ofType);
            return healedType != null ? new graphql/* GraphQLList */.p2_(healedType) : null;
        }
        else if ((0,graphql/* isNonNullType */.zMb)(type)) {
            const healedType = healType(type.ofType);
            return healedType != null ? new graphql/* GraphQLNonNull */.bMz(healedType) : null;
        }
        else if ((0,graphql/* isNamedType */.Zsq)(type)) {
            // If a type annotation on a field or an argument or a union member is
            // any `GraphQLNamedType` with a `name`, then it must end up identical
            // to `schema.getType(name)`, since `schema.getTypeMap()` is the source
            // of truth for all named schema types.
            // Note that new types can still be simply added by adding a field, as
            // the official type will be undefined, not null.
            const officialType = originalTypeMap[type.name];
            if (officialType && type !== officialType) {
                return officialType;
            }
        }
        return type;
    }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/getObjectTypeFromTypeMap.js

function getObjectTypeFromTypeMap(typeMap, type) {
    if (type) {
        const maybeObjectType = typeMap[type.name];
        if ((0,graphql/* isObjectType */.lpB)(maybeObjectType)) {
            return maybeObjectType;
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/Interfaces.js
var MapperKind;
(function (MapperKind) {
    MapperKind["TYPE"] = "MapperKind.TYPE";
    MapperKind["SCALAR_TYPE"] = "MapperKind.SCALAR_TYPE";
    MapperKind["ENUM_TYPE"] = "MapperKind.ENUM_TYPE";
    MapperKind["COMPOSITE_TYPE"] = "MapperKind.COMPOSITE_TYPE";
    MapperKind["OBJECT_TYPE"] = "MapperKind.OBJECT_TYPE";
    MapperKind["INPUT_OBJECT_TYPE"] = "MapperKind.INPUT_OBJECT_TYPE";
    MapperKind["ABSTRACT_TYPE"] = "MapperKind.ABSTRACT_TYPE";
    MapperKind["UNION_TYPE"] = "MapperKind.UNION_TYPE";
    MapperKind["INTERFACE_TYPE"] = "MapperKind.INTERFACE_TYPE";
    MapperKind["ROOT_OBJECT"] = "MapperKind.ROOT_OBJECT";
    MapperKind["QUERY"] = "MapperKind.QUERY";
    MapperKind["MUTATION"] = "MapperKind.MUTATION";
    MapperKind["SUBSCRIPTION"] = "MapperKind.SUBSCRIPTION";
    MapperKind["DIRECTIVE"] = "MapperKind.DIRECTIVE";
    MapperKind["FIELD"] = "MapperKind.FIELD";
    MapperKind["COMPOSITE_FIELD"] = "MapperKind.COMPOSITE_FIELD";
    MapperKind["OBJECT_FIELD"] = "MapperKind.OBJECT_FIELD";
    MapperKind["ROOT_FIELD"] = "MapperKind.ROOT_FIELD";
    MapperKind["QUERY_ROOT_FIELD"] = "MapperKind.QUERY_ROOT_FIELD";
    MapperKind["MUTATION_ROOT_FIELD"] = "MapperKind.MUTATION_ROOT_FIELD";
    MapperKind["SUBSCRIPTION_ROOT_FIELD"] = "MapperKind.SUBSCRIPTION_ROOT_FIELD";
    MapperKind["INTERFACE_FIELD"] = "MapperKind.INTERFACE_FIELD";
    MapperKind["INPUT_OBJECT_FIELD"] = "MapperKind.INPUT_OBJECT_FIELD";
    MapperKind["ARGUMENT"] = "MapperKind.ARGUMENT";
    MapperKind["ENUM_VALUE"] = "MapperKind.ENUM_VALUE";
})(MapperKind || (MapperKind = {}));

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/stub.js

function createNamedStub(name, type) {
    let constructor;
    if (type === 'object') {
        constructor = GraphQLObjectType;
    }
    else if (type === 'interface') {
        constructor = GraphQLInterfaceType;
    }
    else {
        constructor = GraphQLInputObjectType;
    }
    return new constructor({
        name,
        fields: {
            _fake: {
                type: GraphQLString,
            },
        },
    });
}
function createStub(node, type) {
    switch (node.kind) {
        case Kind.LIST_TYPE:
            return new GraphQLList(createStub(node.type, type));
        case Kind.NON_NULL_TYPE:
            return new GraphQLNonNull(createStub(node.type, type));
        default:
            if (type === 'output') {
                return createNamedStub(node.name.value, 'object');
            }
            return createNamedStub(node.name.value, 'input');
    }
}
function isNamedStub(type) {
    if ('getFields' in type) {
        const fields = type.getFields();
        // eslint-disable-next-line no-unreachable-loop
        for (const fieldName in fields) {
            const field = fields[fieldName];
            return field.name === '_fake';
        }
    }
    return false;
}
function getBuiltInForStub(type) {
    switch (type.name) {
        case graphql/* GraphQLInt.name */._o2.name:
            return graphql/* GraphQLInt */._o2;
        case graphql/* GraphQLFloat.name */.av8.name:
            return graphql/* GraphQLFloat */.av8;
        case graphql/* GraphQLString.name */.kHH.name:
            return graphql/* GraphQLString */.kHH;
        case graphql/* GraphQLBoolean.name */.EZe.name:
            return graphql/* GraphQLBoolean */.EZe;
        case graphql/* GraphQLID.name */.kmF.name:
            return graphql/* GraphQLID */.kmF;
        default:
            return type;
    }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/rewire.js


function rewireTypes(originalTypeMap, directives) {
    const referenceTypeMap = Object.create(null);
    for (const typeName in originalTypeMap) {
        referenceTypeMap[typeName] = originalTypeMap[typeName];
    }
    const newTypeMap = Object.create(null);
    for (const typeName in referenceTypeMap) {
        const namedType = referenceTypeMap[typeName];
        if (namedType == null || typeName.startsWith('__')) {
            continue;
        }
        const newName = namedType.name;
        if (newName.startsWith('__')) {
            continue;
        }
        if (newTypeMap[newName] != null) {
            throw new Error(`Duplicate schema type name ${newName}`);
        }
        newTypeMap[newName] = namedType;
    }
    for (const typeName in newTypeMap) {
        newTypeMap[typeName] = rewireNamedType(newTypeMap[typeName]);
    }
    const newDirectives = directives.map(directive => rewireDirective(directive));
    return {
        typeMap: newTypeMap,
        directives: newDirectives,
    };
    function rewireDirective(directive) {
        if ((0,graphql/* isSpecifiedDirective */.xgT)(directive)) {
            return directive;
        }
        const directiveConfig = directive.toConfig();
        directiveConfig.args = rewireArgs(directiveConfig.args);
        return new graphql/* GraphQLDirective */.NZN(directiveConfig);
    }
    function rewireArgs(args) {
        const rewiredArgs = {};
        for (const argName in args) {
            const arg = args[argName];
            const rewiredArgType = rewireType(arg.type);
            if (rewiredArgType != null) {
                arg.type = rewiredArgType;
                rewiredArgs[argName] = arg;
            }
        }
        return rewiredArgs;
    }
    function rewireNamedType(type) {
        if ((0,graphql/* isObjectType */.lpB)(type)) {
            const config = type.toConfig();
            const newConfig = {
                ...config,
                fields: () => rewireFields(config.fields),
                interfaces: () => rewireNamedTypes(config.interfaces),
            };
            return new graphql/* GraphQLObjectType */.h66(newConfig);
        }
        else if ((0,graphql/* isInterfaceType */.oTV)(type)) {
            const config = type.toConfig();
            const newConfig = {
                ...config,
                fields: () => rewireFields(config.fields),
            };
            if ('interfaces' in newConfig) {
                newConfig.interfaces = () => rewireNamedTypes(config.interfaces);
            }
            return new graphql/* GraphQLInterfaceType */.oWK(newConfig);
        }
        else if ((0,graphql/* isUnionType */.EN0)(type)) {
            const config = type.toConfig();
            const newConfig = {
                ...config,
                types: () => rewireNamedTypes(config.types),
            };
            return new graphql/* GraphQLUnionType */.GpJ(newConfig);
        }
        else if ((0,graphql/* isInputObjectType */.hLV)(type)) {
            const config = type.toConfig();
            const newConfig = {
                ...config,
                fields: () => rewireInputFields(config.fields),
            };
            return new graphql/* GraphQLInputObjectType */.sRo(newConfig);
        }
        else if ((0,graphql/* isEnumType */.EMj)(type)) {
            const enumConfig = type.toConfig();
            return new graphql/* GraphQLEnumType */.mRp(enumConfig);
        }
        else if ((0,graphql/* isScalarType */.KAw)(type)) {
            if ((0,graphql/* isSpecifiedScalarType */.u1m)(type)) {
                return type;
            }
            const scalarConfig = type.toConfig();
            return new graphql/* GraphQLScalarType */.n2R(scalarConfig);
        }
        throw new Error(`Unexpected schema type: ${type}`);
    }
    function rewireFields(fields) {
        const rewiredFields = {};
        for (const fieldName in fields) {
            const field = fields[fieldName];
            const rewiredFieldType = rewireType(field.type);
            if (rewiredFieldType != null && field.args) {
                field.type = rewiredFieldType;
                field.args = rewireArgs(field.args);
                rewiredFields[fieldName] = field;
            }
        }
        return rewiredFields;
    }
    function rewireInputFields(fields) {
        const rewiredFields = {};
        for (const fieldName in fields) {
            const field = fields[fieldName];
            const rewiredFieldType = rewireType(field.type);
            if (rewiredFieldType != null) {
                field.type = rewiredFieldType;
                rewiredFields[fieldName] = field;
            }
        }
        return rewiredFields;
    }
    function rewireNamedTypes(namedTypes) {
        const rewiredTypes = [];
        for (const namedType of namedTypes) {
            const rewiredType = rewireType(namedType);
            if (rewiredType != null) {
                rewiredTypes.push(rewiredType);
            }
        }
        return rewiredTypes;
    }
    function rewireType(type) {
        if ((0,graphql/* isListType */.HGy)(type)) {
            const rewiredType = rewireType(type.ofType);
            return rewiredType != null ? new graphql/* GraphQLList */.p2_(rewiredType) : null;
        }
        else if ((0,graphql/* isNonNullType */.zMb)(type)) {
            const rewiredType = rewireType(type.ofType);
            return rewiredType != null ? new graphql/* GraphQLNonNull */.bMz(rewiredType) : null;
        }
        else if ((0,graphql/* isNamedType */.Zsq)(type)) {
            let rewiredType = referenceTypeMap[type.name];
            if (rewiredType === undefined) {
                rewiredType = isNamedStub(type) ? getBuiltInForStub(type) : rewireNamedType(type);
                newTypeMap[rewiredType.name] = referenceTypeMap[type.name] = rewiredType;
            }
            return rewiredType != null ? newTypeMap[rewiredType.name] : null;
        }
        return null;
    }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/mapSchema.js





function mapSchema(schema, schemaMapper = {}) {
    const newTypeMap = mapArguments(mapFields(mapTypes(mapDefaultValues(mapEnumValues(mapTypes(mapDefaultValues(schema.getTypeMap(), schema, serializeInputValue), schema, schemaMapper, type => (0,graphql/* isLeafType */.UTg)(type)), schema, schemaMapper), schema, parseInputValue), schema, schemaMapper, type => !(0,graphql/* isLeafType */.UTg)(type)), schema, schemaMapper), schema, schemaMapper);
    const originalDirectives = schema.getDirectives();
    const newDirectives = mapDirectives(originalDirectives, schema, schemaMapper);
    const { typeMap, directives } = rewireTypes(newTypeMap, newDirectives);
    return new graphql/* GraphQLSchema */.XO9({
        ...schema.toConfig(),
        query: getObjectTypeFromTypeMap(typeMap, getObjectTypeFromTypeMap(newTypeMap, schema.getQueryType())),
        mutation: getObjectTypeFromTypeMap(typeMap, getObjectTypeFromTypeMap(newTypeMap, schema.getMutationType())),
        subscription: getObjectTypeFromTypeMap(typeMap, getObjectTypeFromTypeMap(newTypeMap, schema.getSubscriptionType())),
        types: Object.values(typeMap),
        directives,
    });
}
function mapTypes(originalTypeMap, schema, schemaMapper, testFn = () => true) {
    const newTypeMap = {};
    for (const typeName in originalTypeMap) {
        if (!typeName.startsWith('__')) {
            const originalType = originalTypeMap[typeName];
            if (originalType == null || !testFn(originalType)) {
                newTypeMap[typeName] = originalType;
                continue;
            }
            const typeMapper = getTypeMapper(schema, schemaMapper, typeName);
            if (typeMapper == null) {
                newTypeMap[typeName] = originalType;
                continue;
            }
            const maybeNewType = typeMapper(originalType, schema);
            if (maybeNewType === undefined) {
                newTypeMap[typeName] = originalType;
                continue;
            }
            newTypeMap[typeName] = maybeNewType;
        }
    }
    return newTypeMap;
}
function mapEnumValues(originalTypeMap, schema, schemaMapper) {
    const enumValueMapper = getEnumValueMapper(schemaMapper);
    if (!enumValueMapper) {
        return originalTypeMap;
    }
    return mapTypes(originalTypeMap, schema, {
        [MapperKind.ENUM_TYPE]: type => {
            const config = type.toConfig();
            const originalEnumValueConfigMap = config.values;
            const newEnumValueConfigMap = {};
            for (const externalValue in originalEnumValueConfigMap) {
                const originalEnumValueConfig = originalEnumValueConfigMap[externalValue];
                const mappedEnumValue = enumValueMapper(originalEnumValueConfig, type.name, schema, externalValue);
                if (mappedEnumValue === undefined) {
                    newEnumValueConfigMap[externalValue] = originalEnumValueConfig;
                }
                else if (Array.isArray(mappedEnumValue)) {
                    const [newExternalValue, newEnumValueConfig] = mappedEnumValue;
                    newEnumValueConfigMap[newExternalValue] =
                        newEnumValueConfig === undefined ? originalEnumValueConfig : newEnumValueConfig;
                }
                else if (mappedEnumValue !== null) {
                    newEnumValueConfigMap[externalValue] = mappedEnumValue;
                }
            }
            return correctASTNodes(new graphql/* GraphQLEnumType */.mRp({
                ...config,
                values: newEnumValueConfigMap,
            }));
        },
    }, type => (0,graphql/* isEnumType */.EMj)(type));
}
function mapDefaultValues(originalTypeMap, schema, fn) {
    const newTypeMap = mapArguments(originalTypeMap, schema, {
        [MapperKind.ARGUMENT]: argumentConfig => {
            if (argumentConfig.defaultValue === undefined) {
                return argumentConfig;
            }
            const maybeNewType = getNewType(originalTypeMap, argumentConfig.type);
            if (maybeNewType != null) {
                return {
                    ...argumentConfig,
                    defaultValue: fn(maybeNewType, argumentConfig.defaultValue),
                };
            }
        },
    });
    return mapFields(newTypeMap, schema, {
        [MapperKind.INPUT_OBJECT_FIELD]: inputFieldConfig => {
            if (inputFieldConfig.defaultValue === undefined) {
                return inputFieldConfig;
            }
            const maybeNewType = getNewType(newTypeMap, inputFieldConfig.type);
            if (maybeNewType != null) {
                return {
                    ...inputFieldConfig,
                    defaultValue: fn(maybeNewType, inputFieldConfig.defaultValue),
                };
            }
        },
    });
}
function getNewType(newTypeMap, type) {
    if ((0,graphql/* isListType */.HGy)(type)) {
        const newType = getNewType(newTypeMap, type.ofType);
        return newType != null ? new graphql/* GraphQLList */.p2_(newType) : null;
    }
    else if ((0,graphql/* isNonNullType */.zMb)(type)) {
        const newType = getNewType(newTypeMap, type.ofType);
        return newType != null ? new graphql/* GraphQLNonNull */.bMz(newType) : null;
    }
    else if ((0,graphql/* isNamedType */.Zsq)(type)) {
        const newType = newTypeMap[type.name];
        return newType != null ? newType : null;
    }
    return null;
}
function mapFields(originalTypeMap, schema, schemaMapper) {
    const newTypeMap = {};
    for (const typeName in originalTypeMap) {
        if (!typeName.startsWith('__')) {
            const originalType = originalTypeMap[typeName];
            if (!(0,graphql/* isObjectType */.lpB)(originalType) && !(0,graphql/* isInterfaceType */.oTV)(originalType) && !(0,graphql/* isInputObjectType */.hLV)(originalType)) {
                newTypeMap[typeName] = originalType;
                continue;
            }
            const fieldMapper = getFieldMapper(schema, schemaMapper, typeName);
            if (fieldMapper == null) {
                newTypeMap[typeName] = originalType;
                continue;
            }
            const config = originalType.toConfig();
            const originalFieldConfigMap = config.fields;
            const newFieldConfigMap = {};
            for (const fieldName in originalFieldConfigMap) {
                const originalFieldConfig = originalFieldConfigMap[fieldName];
                const mappedField = fieldMapper(originalFieldConfig, fieldName, typeName, schema);
                if (mappedField === undefined) {
                    newFieldConfigMap[fieldName] = originalFieldConfig;
                }
                else if (Array.isArray(mappedField)) {
                    const [newFieldName, newFieldConfig] = mappedField;
                    if (newFieldConfig.astNode != null) {
                        newFieldConfig.astNode = {
                            ...newFieldConfig.astNode,
                            name: {
                                ...newFieldConfig.astNode.name,
                                value: newFieldName,
                            },
                        };
                    }
                    newFieldConfigMap[newFieldName] = newFieldConfig === undefined ? originalFieldConfig : newFieldConfig;
                }
                else if (mappedField !== null) {
                    newFieldConfigMap[fieldName] = mappedField;
                }
            }
            if ((0,graphql/* isObjectType */.lpB)(originalType)) {
                newTypeMap[typeName] = correctASTNodes(new graphql/* GraphQLObjectType */.h66({
                    ...config,
                    fields: newFieldConfigMap,
                }));
            }
            else if ((0,graphql/* isInterfaceType */.oTV)(originalType)) {
                newTypeMap[typeName] = correctASTNodes(new graphql/* GraphQLInterfaceType */.oWK({
                    ...config,
                    fields: newFieldConfigMap,
                }));
            }
            else {
                newTypeMap[typeName] = correctASTNodes(new graphql/* GraphQLInputObjectType */.sRo({
                    ...config,
                    fields: newFieldConfigMap,
                }));
            }
        }
    }
    return newTypeMap;
}
function mapArguments(originalTypeMap, schema, schemaMapper) {
    const newTypeMap = {};
    for (const typeName in originalTypeMap) {
        if (!typeName.startsWith('__')) {
            const originalType = originalTypeMap[typeName];
            if (!(0,graphql/* isObjectType */.lpB)(originalType) && !(0,graphql/* isInterfaceType */.oTV)(originalType)) {
                newTypeMap[typeName] = originalType;
                continue;
            }
            const argumentMapper = getArgumentMapper(schemaMapper);
            if (argumentMapper == null) {
                newTypeMap[typeName] = originalType;
                continue;
            }
            const config = originalType.toConfig();
            const originalFieldConfigMap = config.fields;
            const newFieldConfigMap = {};
            for (const fieldName in originalFieldConfigMap) {
                const originalFieldConfig = originalFieldConfigMap[fieldName];
                const originalArgumentConfigMap = originalFieldConfig.args;
                if (originalArgumentConfigMap == null) {
                    newFieldConfigMap[fieldName] = originalFieldConfig;
                    continue;
                }
                const argumentNames = Object.keys(originalArgumentConfigMap);
                if (!argumentNames.length) {
                    newFieldConfigMap[fieldName] = originalFieldConfig;
                    continue;
                }
                const newArgumentConfigMap = {};
                for (const argumentName of argumentNames) {
                    const originalArgumentConfig = originalArgumentConfigMap[argumentName];
                    const mappedArgument = argumentMapper(originalArgumentConfig, fieldName, typeName, schema);
                    if (mappedArgument === undefined) {
                        newArgumentConfigMap[argumentName] = originalArgumentConfig;
                    }
                    else if (Array.isArray(mappedArgument)) {
                        const [newArgumentName, newArgumentConfig] = mappedArgument;
                        newArgumentConfigMap[newArgumentName] = newArgumentConfig;
                    }
                    else if (mappedArgument !== null) {
                        newArgumentConfigMap[argumentName] = mappedArgument;
                    }
                }
                newFieldConfigMap[fieldName] = {
                    ...originalFieldConfig,
                    args: newArgumentConfigMap,
                };
            }
            if ((0,graphql/* isObjectType */.lpB)(originalType)) {
                newTypeMap[typeName] = new graphql/* GraphQLObjectType */.h66({
                    ...config,
                    fields: newFieldConfigMap,
                });
            }
            else if ((0,graphql/* isInterfaceType */.oTV)(originalType)) {
                newTypeMap[typeName] = new graphql/* GraphQLInterfaceType */.oWK({
                    ...config,
                    fields: newFieldConfigMap,
                });
            }
            else {
                newTypeMap[typeName] = new graphql/* GraphQLInputObjectType */.sRo({
                    ...config,
                    fields: newFieldConfigMap,
                });
            }
        }
    }
    return newTypeMap;
}
function mapDirectives(originalDirectives, schema, schemaMapper) {
    const directiveMapper = getDirectiveMapper(schemaMapper);
    if (directiveMapper == null) {
        return originalDirectives.slice();
    }
    const newDirectives = [];
    for (const directive of originalDirectives) {
        const mappedDirective = directiveMapper(directive, schema);
        if (mappedDirective === undefined) {
            newDirectives.push(directive);
        }
        else if (mappedDirective !== null) {
            newDirectives.push(mappedDirective);
        }
    }
    return newDirectives;
}
function getTypeSpecifiers(schema, typeName) {
    var _a, _b, _c;
    const type = schema.getType(typeName);
    const specifiers = [MapperKind.TYPE];
    if ((0,graphql/* isObjectType */.lpB)(type)) {
        specifiers.push(MapperKind.COMPOSITE_TYPE, MapperKind.OBJECT_TYPE);
        if (typeName === ((_a = schema.getQueryType()) === null || _a === void 0 ? void 0 : _a.name)) {
            specifiers.push(MapperKind.ROOT_OBJECT, MapperKind.QUERY);
        }
        else if (typeName === ((_b = schema.getMutationType()) === null || _b === void 0 ? void 0 : _b.name)) {
            specifiers.push(MapperKind.ROOT_OBJECT, MapperKind.MUTATION);
        }
        else if (typeName === ((_c = schema.getSubscriptionType()) === null || _c === void 0 ? void 0 : _c.name)) {
            specifiers.push(MapperKind.ROOT_OBJECT, MapperKind.SUBSCRIPTION);
        }
    }
    else if ((0,graphql/* isInputObjectType */.hLV)(type)) {
        specifiers.push(MapperKind.INPUT_OBJECT_TYPE);
    }
    else if ((0,graphql/* isInterfaceType */.oTV)(type)) {
        specifiers.push(MapperKind.COMPOSITE_TYPE, MapperKind.ABSTRACT_TYPE, MapperKind.INTERFACE_TYPE);
    }
    else if ((0,graphql/* isUnionType */.EN0)(type)) {
        specifiers.push(MapperKind.COMPOSITE_TYPE, MapperKind.ABSTRACT_TYPE, MapperKind.UNION_TYPE);
    }
    else if ((0,graphql/* isEnumType */.EMj)(type)) {
        specifiers.push(MapperKind.ENUM_TYPE);
    }
    else if ((0,graphql/* isScalarType */.KAw)(type)) {
        specifiers.push(MapperKind.SCALAR_TYPE);
    }
    return specifiers;
}
function getTypeMapper(schema, schemaMapper, typeName) {
    const specifiers = getTypeSpecifiers(schema, typeName);
    let typeMapper;
    const stack = [...specifiers];
    while (!typeMapper && stack.length > 0) {
        // It is safe to use the ! operator here as we check the length.
        const next = stack.pop();
        typeMapper = schemaMapper[next];
    }
    return typeMapper != null ? typeMapper : null;
}
function getFieldSpecifiers(schema, typeName) {
    var _a, _b, _c;
    const type = schema.getType(typeName);
    const specifiers = [MapperKind.FIELD];
    if ((0,graphql/* isObjectType */.lpB)(type)) {
        specifiers.push(MapperKind.COMPOSITE_FIELD, MapperKind.OBJECT_FIELD);
        if (typeName === ((_a = schema.getQueryType()) === null || _a === void 0 ? void 0 : _a.name)) {
            specifiers.push(MapperKind.ROOT_FIELD, MapperKind.QUERY_ROOT_FIELD);
        }
        else if (typeName === ((_b = schema.getMutationType()) === null || _b === void 0 ? void 0 : _b.name)) {
            specifiers.push(MapperKind.ROOT_FIELD, MapperKind.MUTATION_ROOT_FIELD);
        }
        else if (typeName === ((_c = schema.getSubscriptionType()) === null || _c === void 0 ? void 0 : _c.name)) {
            specifiers.push(MapperKind.ROOT_FIELD, MapperKind.SUBSCRIPTION_ROOT_FIELD);
        }
    }
    else if ((0,graphql/* isInterfaceType */.oTV)(type)) {
        specifiers.push(MapperKind.COMPOSITE_FIELD, MapperKind.INTERFACE_FIELD);
    }
    else if ((0,graphql/* isInputObjectType */.hLV)(type)) {
        specifiers.push(MapperKind.INPUT_OBJECT_FIELD);
    }
    return specifiers;
}
function getFieldMapper(schema, schemaMapper, typeName) {
    const specifiers = getFieldSpecifiers(schema, typeName);
    let fieldMapper;
    const stack = [...specifiers];
    while (!fieldMapper && stack.length > 0) {
        // It is safe to use the ! operator here as we check the length.
        const next = stack.pop();
        // TODO: fix this as unknown cast
        fieldMapper = schemaMapper[next];
    }
    return fieldMapper !== null && fieldMapper !== void 0 ? fieldMapper : null;
}
function getArgumentMapper(schemaMapper) {
    const argumentMapper = schemaMapper[MapperKind.ARGUMENT];
    return argumentMapper != null ? argumentMapper : null;
}
function getDirectiveMapper(schemaMapper) {
    const directiveMapper = schemaMapper[MapperKind.DIRECTIVE];
    return directiveMapper != null ? directiveMapper : null;
}
function getEnumValueMapper(schemaMapper) {
    const enumValueMapper = schemaMapper[MapperKind.ENUM_VALUE];
    return enumValueMapper != null ? enumValueMapper : null;
}
function correctASTNodes(type) {
    if ((0,graphql/* isObjectType */.lpB)(type)) {
        const config = type.toConfig();
        if (config.astNode != null) {
            const fields = [];
            for (const fieldName in config.fields) {
                const fieldConfig = config.fields[fieldName];
                if (fieldConfig.astNode != null) {
                    fields.push(fieldConfig.astNode);
                }
            }
            config.astNode = {
                ...config.astNode,
                kind: graphql/* Kind.OBJECT_TYPE_DEFINITION */.hYY.OBJECT_TYPE_DEFINITION,
                fields,
            };
        }
        if (config.extensionASTNodes != null) {
            config.extensionASTNodes = config.extensionASTNodes.map(node => ({
                ...node,
                kind: graphql/* Kind.OBJECT_TYPE_EXTENSION */.hYY.OBJECT_TYPE_EXTENSION,
                fields: undefined,
            }));
        }
        return new graphql/* GraphQLObjectType */.h66(config);
    }
    else if ((0,graphql/* isInterfaceType */.oTV)(type)) {
        const config = type.toConfig();
        if (config.astNode != null) {
            const fields = [];
            for (const fieldName in config.fields) {
                const fieldConfig = config.fields[fieldName];
                if (fieldConfig.astNode != null) {
                    fields.push(fieldConfig.astNode);
                }
            }
            config.astNode = {
                ...config.astNode,
                kind: graphql/* Kind.INTERFACE_TYPE_DEFINITION */.hYY.INTERFACE_TYPE_DEFINITION,
                fields,
            };
        }
        if (config.extensionASTNodes != null) {
            config.extensionASTNodes = config.extensionASTNodes.map(node => ({
                ...node,
                kind: graphql/* Kind.INTERFACE_TYPE_EXTENSION */.hYY.INTERFACE_TYPE_EXTENSION,
                fields: undefined,
            }));
        }
        return new graphql/* GraphQLInterfaceType */.oWK(config);
    }
    else if ((0,graphql/* isInputObjectType */.hLV)(type)) {
        const config = type.toConfig();
        if (config.astNode != null) {
            const fields = [];
            for (const fieldName in config.fields) {
                const fieldConfig = config.fields[fieldName];
                if (fieldConfig.astNode != null) {
                    fields.push(fieldConfig.astNode);
                }
            }
            config.astNode = {
                ...config.astNode,
                kind: graphql/* Kind.INPUT_OBJECT_TYPE_DEFINITION */.hYY.INPUT_OBJECT_TYPE_DEFINITION,
                fields,
            };
        }
        if (config.extensionASTNodes != null) {
            config.extensionASTNodes = config.extensionASTNodes.map(node => ({
                ...node,
                kind: graphql/* Kind.INPUT_OBJECT_TYPE_EXTENSION */.hYY.INPUT_OBJECT_TYPE_EXTENSION,
                fields: undefined,
            }));
        }
        return new graphql/* GraphQLInputObjectType */.sRo(config);
    }
    else if ((0,graphql/* isEnumType */.EMj)(type)) {
        const config = type.toConfig();
        if (config.astNode != null) {
            const values = [];
            for (const enumKey in config.values) {
                const enumValueConfig = config.values[enumKey];
                if (enumValueConfig.astNode != null) {
                    values.push(enumValueConfig.astNode);
                }
            }
            config.astNode = {
                ...config.astNode,
                values,
            };
        }
        if (config.extensionASTNodes != null) {
            config.extensionASTNodes = config.extensionASTNodes.map(node => ({
                ...node,
                values: undefined,
            }));
        }
        return new graphql/* GraphQLEnumType */.mRp(config);
    }
    else {
        return type;
    }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+schema@8.5.1_graphql@16.6.0/node_modules/@graphql-tools/schema/esm/checkForResolveTypeResolver.js

// If we have any union or interface types throw if no there is no resolveType resolver
function checkForResolveTypeResolver(schema, requireResolversForResolveType) {
    mapSchema(schema, {
        [MapperKind.ABSTRACT_TYPE]: type => {
            if (!type.resolveType) {
                const message = `Type "${type.name}" is missing a "__resolveType" resolver. Pass 'ignore' into ` +
                    '"resolverValidationOptions.requireResolversForResolveType" to disable this error.';
                if (requireResolversForResolveType === 'error') {
                    throw new Error(message);
                }
                if (requireResolversForResolveType === 'warn') {
                    console.warn(message);
                }
            }
            return undefined;
        },
    });
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+schema@8.5.1_graphql@16.6.0/node_modules/@graphql-tools/schema/esm/extendResolversFromInterfaces.js
function extendResolversFromInterfaces(schema, resolvers) {
    const extendedResolvers = {};
    const typeMap = schema.getTypeMap();
    for (const typeName in typeMap) {
        const type = typeMap[typeName];
        if ('getInterfaces' in type) {
            extendedResolvers[typeName] = {};
            for (const iFace of type.getInterfaces()) {
                if (resolvers[iFace.name]) {
                    for (const fieldName in resolvers[iFace.name]) {
                        if (fieldName === '__isTypeOf' || !fieldName.startsWith('__')) {
                            extendedResolvers[typeName][fieldName] = resolvers[iFace.name][fieldName];
                        }
                    }
                }
            }
            const typeResolvers = resolvers[typeName];
            extendedResolvers[typeName] = {
                ...extendedResolvers[typeName],
                ...typeResolvers,
            };
        }
        else {
            const typeResolvers = resolvers[typeName];
            if (typeResolvers != null) {
                extendedResolvers[typeName] = typeResolvers;
            }
        }
    }
    return extendedResolvers;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+schema@8.5.1_graphql@16.6.0/node_modules/@graphql-tools/schema/esm/addResolversToSchema.js




function addResolversToSchema(schemaOrOptions, legacyInputResolvers, legacyInputValidationOptions) {
    const options = (0,graphql/* isSchema */.nN2)(schemaOrOptions)
        ? {
            schema: schemaOrOptions,
            resolvers: legacyInputResolvers !== null && legacyInputResolvers !== void 0 ? legacyInputResolvers : {},
            resolverValidationOptions: legacyInputValidationOptions,
        }
        : schemaOrOptions;
    let { schema, resolvers: inputResolvers, defaultFieldResolver, resolverValidationOptions = {}, inheritResolversFromInterfaces = false, updateResolversInPlace = false, } = options;
    const { requireResolversToMatchSchema = 'error', requireResolversForResolveType } = resolverValidationOptions;
    const resolvers = inheritResolversFromInterfaces
        ? extendResolversFromInterfaces(schema, inputResolvers)
        : inputResolvers;
    for (const typeName in resolvers) {
        const resolverValue = resolvers[typeName];
        const resolverType = typeof resolverValue;
        if (resolverType !== 'object') {
            throw new Error(`"${typeName}" defined in resolvers, but has invalid value "${resolverValue}". The resolver's value must be of type object.`);
        }
        const type = schema.getType(typeName);
        if (type == null) {
            if (requireResolversToMatchSchema === 'ignore') {
                continue;
            }
            throw new Error(`"${typeName}" defined in resolvers, but not in schema`);
        }
        else if ((0,graphql/* isSpecifiedScalarType */.u1m)(type)) {
            // allow -- without recommending -- overriding of specified scalar types
            for (const fieldName in resolverValue) {
                if (fieldName.startsWith('__')) {
                    type[fieldName.substring(2)] = resolverValue[fieldName];
                }
                else {
                    type[fieldName] = resolverValue[fieldName];
                }
            }
        }
        else if ((0,graphql/* isEnumType */.EMj)(type)) {
            const values = type.getValues();
            for (const fieldName in resolverValue) {
                if (!fieldName.startsWith('__') &&
                    !values.some(value => value.name === fieldName) &&
                    requireResolversToMatchSchema &&
                    requireResolversToMatchSchema !== 'ignore') {
                    throw new Error(`${type.name}.${fieldName} was defined in resolvers, but not present within ${type.name}`);
                }
            }
        }
        else if ((0,graphql/* isUnionType */.EN0)(type)) {
            for (const fieldName in resolverValue) {
                if (!fieldName.startsWith('__') &&
                    requireResolversToMatchSchema &&
                    requireResolversToMatchSchema !== 'ignore') {
                    throw new Error(`${type.name}.${fieldName} was defined in resolvers, but ${type.name} is not an object or interface type`);
                }
            }
        }
        else if ((0,graphql/* isObjectType */.lpB)(type) || (0,graphql/* isInterfaceType */.oTV)(type)) {
            for (const fieldName in resolverValue) {
                if (!fieldName.startsWith('__')) {
                    const fields = type.getFields();
                    const field = fields[fieldName];
                    if (field == null) {
                        // Field present in resolver but not in schema
                        if (requireResolversToMatchSchema && requireResolversToMatchSchema !== 'ignore') {
                            throw new Error(`${typeName}.${fieldName} defined in resolvers, but not in schema`);
                        }
                    }
                    else {
                        // Field present in both the resolver and schema
                        const fieldResolve = resolverValue[fieldName];
                        if (typeof fieldResolve !== 'function' && typeof fieldResolve !== 'object') {
                            throw new Error(`Resolver ${typeName}.${fieldName} must be object or function`);
                        }
                    }
                }
            }
        }
    }
    schema = updateResolversInPlace
        ? addResolversToExistingSchema(schema, resolvers, defaultFieldResolver)
        : createNewSchemaWithResolvers(schema, resolvers, defaultFieldResolver);
    if (requireResolversForResolveType && requireResolversForResolveType !== 'ignore') {
        checkForResolveTypeResolver(schema, requireResolversForResolveType);
    }
    return schema;
}
function addResolversToExistingSchema(schema, resolvers, defaultFieldResolver) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const typeMap = schema.getTypeMap();
    for (const typeName in resolvers) {
        const type = schema.getType(typeName);
        const resolverValue = resolvers[typeName];
        if ((0,graphql/* isScalarType */.KAw)(type)) {
            for (const fieldName in resolverValue) {
                if (fieldName.startsWith('__')) {
                    type[fieldName.substring(2)] = resolverValue[fieldName];
                }
                else if (fieldName === 'astNode' && type.astNode != null) {
                    type.astNode = {
                        ...type.astNode,
                        description: (_b = (_a = resolverValue === null || resolverValue === void 0 ? void 0 : resolverValue.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : type.astNode.description,
                        directives: ((_c = type.astNode.directives) !== null && _c !== void 0 ? _c : []).concat((_e = (_d = resolverValue === null || resolverValue === void 0 ? void 0 : resolverValue.astNode) === null || _d === void 0 ? void 0 : _d.directives) !== null && _e !== void 0 ? _e : []),
                    };
                }
                else if (fieldName === 'extensionASTNodes' && type.extensionASTNodes != null) {
                    type.extensionASTNodes = type.extensionASTNodes.concat((_f = resolverValue === null || resolverValue === void 0 ? void 0 : resolverValue.extensionASTNodes) !== null && _f !== void 0 ? _f : []);
                }
                else if (fieldName === 'extensions' &&
                    type.extensions != null &&
                    resolverValue.extensions != null) {
                    type.extensions = Object.assign(Object.create(null), type.extensions, resolverValue.extensions);
                }
                else {
                    type[fieldName] = resolverValue[fieldName];
                }
            }
        }
        else if ((0,graphql/* isEnumType */.EMj)(type)) {
            const config = type.toConfig();
            const enumValueConfigMap = config.values;
            for (const fieldName in resolverValue) {
                if (fieldName.startsWith('__')) {
                    config[fieldName.substring(2)] = resolverValue[fieldName];
                }
                else if (fieldName === 'astNode' && config.astNode != null) {
                    config.astNode = {
                        ...config.astNode,
                        description: (_h = (_g = resolverValue === null || resolverValue === void 0 ? void 0 : resolverValue.astNode) === null || _g === void 0 ? void 0 : _g.description) !== null && _h !== void 0 ? _h : config.astNode.description,
                        directives: ((_j = config.astNode.directives) !== null && _j !== void 0 ? _j : []).concat((_l = (_k = resolverValue === null || resolverValue === void 0 ? void 0 : resolverValue.astNode) === null || _k === void 0 ? void 0 : _k.directives) !== null && _l !== void 0 ? _l : []),
                    };
                }
                else if (fieldName === 'extensionASTNodes' && config.extensionASTNodes != null) {
                    config.extensionASTNodes = config.extensionASTNodes.concat((_m = resolverValue === null || resolverValue === void 0 ? void 0 : resolverValue.extensionASTNodes) !== null && _m !== void 0 ? _m : []);
                }
                else if (fieldName === 'extensions' &&
                    type.extensions != null &&
                    resolverValue.extensions != null) {
                    type.extensions = Object.assign(Object.create(null), type.extensions, resolverValue.extensions);
                }
                else if (enumValueConfigMap[fieldName]) {
                    enumValueConfigMap[fieldName].value = resolverValue[fieldName];
                }
            }
            typeMap[typeName] = new graphql/* GraphQLEnumType */.mRp(config);
        }
        else if ((0,graphql/* isUnionType */.EN0)(type)) {
            for (const fieldName in resolverValue) {
                if (fieldName.startsWith('__')) {
                    type[fieldName.substring(2)] = resolverValue[fieldName];
                }
            }
        }
        else if ((0,graphql/* isObjectType */.lpB)(type) || (0,graphql/* isInterfaceType */.oTV)(type)) {
            for (const fieldName in resolverValue) {
                if (fieldName.startsWith('__')) {
                    // this is for isTypeOf and resolveType and all the other stuff.
                    type[fieldName.substring(2)] = resolverValue[fieldName];
                    continue;
                }
                const fields = type.getFields();
                const field = fields[fieldName];
                if (field != null) {
                    const fieldResolve = resolverValue[fieldName];
                    if (typeof fieldResolve === 'function') {
                        // for convenience. Allows shorter syntax in resolver definition file
                        field.resolve = fieldResolve.bind(resolverValue);
                    }
                    else {
                        setFieldProperties(field, fieldResolve);
                    }
                }
            }
        }
    }
    // serialize all default values prior to healing fields with new scalar/enum types.
    forEachDefaultValue(schema, serializeInputValue);
    // schema may have new scalar/enum types that require healing
    healSchema(schema);
    // reparse all default values with new parsing functions.
    forEachDefaultValue(schema, parseInputValue);
    if (defaultFieldResolver != null) {
        forEachField(schema, field => {
            if (!field.resolve) {
                field.resolve = defaultFieldResolver;
            }
        });
    }
    return schema;
}
function createNewSchemaWithResolvers(schema, resolvers, defaultFieldResolver) {
    schema = mapSchema(schema, {
        [MapperKind.SCALAR_TYPE]: type => {
            var _a, _b, _c, _d, _e, _f;
            const config = type.toConfig();
            const resolverValue = resolvers[type.name];
            if (!(0,graphql/* isSpecifiedScalarType */.u1m)(type) && resolverValue != null) {
                for (const fieldName in resolverValue) {
                    if (fieldName.startsWith('__')) {
                        config[fieldName.substring(2)] = resolverValue[fieldName];
                    }
                    else if (fieldName === 'astNode' && config.astNode != null) {
                        config.astNode = {
                            ...config.astNode,
                            description: (_b = (_a = resolverValue === null || resolverValue === void 0 ? void 0 : resolverValue.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : config.astNode.description,
                            directives: ((_c = config.astNode.directives) !== null && _c !== void 0 ? _c : []).concat((_e = (_d = resolverValue === null || resolverValue === void 0 ? void 0 : resolverValue.astNode) === null || _d === void 0 ? void 0 : _d.directives) !== null && _e !== void 0 ? _e : []),
                        };
                    }
                    else if (fieldName === 'extensionASTNodes' && config.extensionASTNodes != null) {
                        config.extensionASTNodes = config.extensionASTNodes.concat((_f = resolverValue === null || resolverValue === void 0 ? void 0 : resolverValue.extensionASTNodes) !== null && _f !== void 0 ? _f : []);
                    }
                    else if (fieldName === 'extensions' &&
                        config.extensions != null &&
                        resolverValue.extensions != null) {
                        config.extensions = Object.assign(Object.create(null), type.extensions, resolverValue.extensions);
                    }
                    else {
                        config[fieldName] = resolverValue[fieldName];
                    }
                }
                return new graphql/* GraphQLScalarType */.n2R(config);
            }
        },
        [MapperKind.ENUM_TYPE]: type => {
            var _a, _b, _c, _d, _e, _f;
            const resolverValue = resolvers[type.name];
            const config = type.toConfig();
            const enumValueConfigMap = config.values;
            if (resolverValue != null) {
                for (const fieldName in resolverValue) {
                    if (fieldName.startsWith('__')) {
                        config[fieldName.substring(2)] = resolverValue[fieldName];
                    }
                    else if (fieldName === 'astNode' && config.astNode != null) {
                        config.astNode = {
                            ...config.astNode,
                            description: (_b = (_a = resolverValue === null || resolverValue === void 0 ? void 0 : resolverValue.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : config.astNode.description,
                            directives: ((_c = config.astNode.directives) !== null && _c !== void 0 ? _c : []).concat((_e = (_d = resolverValue === null || resolverValue === void 0 ? void 0 : resolverValue.astNode) === null || _d === void 0 ? void 0 : _d.directives) !== null && _e !== void 0 ? _e : []),
                        };
                    }
                    else if (fieldName === 'extensionASTNodes' && config.extensionASTNodes != null) {
                        config.extensionASTNodes = config.extensionASTNodes.concat((_f = resolverValue === null || resolverValue === void 0 ? void 0 : resolverValue.extensionASTNodes) !== null && _f !== void 0 ? _f : []);
                    }
                    else if (fieldName === 'extensions' &&
                        config.extensions != null &&
                        resolverValue.extensions != null) {
                        config.extensions = Object.assign(Object.create(null), type.extensions, resolverValue.extensions);
                    }
                    else if (enumValueConfigMap[fieldName]) {
                        enumValueConfigMap[fieldName].value = resolverValue[fieldName];
                    }
                }
                return new graphql/* GraphQLEnumType */.mRp(config);
            }
        },
        [MapperKind.UNION_TYPE]: type => {
            const resolverValue = resolvers[type.name];
            if (resolverValue != null) {
                const config = type.toConfig();
                if (resolverValue['__resolveType']) {
                    config.resolveType = resolverValue['__resolveType'];
                }
                return new graphql/* GraphQLUnionType */.GpJ(config);
            }
        },
        [MapperKind.OBJECT_TYPE]: type => {
            const resolverValue = resolvers[type.name];
            if (resolverValue != null) {
                const config = type.toConfig();
                if (resolverValue['__isTypeOf']) {
                    config.isTypeOf = resolverValue['__isTypeOf'];
                }
                return new graphql/* GraphQLObjectType */.h66(config);
            }
        },
        [MapperKind.INTERFACE_TYPE]: type => {
            const resolverValue = resolvers[type.name];
            if (resolverValue != null) {
                const config = type.toConfig();
                if (resolverValue['__resolveType']) {
                    config.resolveType = resolverValue['__resolveType'];
                }
                return new graphql/* GraphQLInterfaceType */.oWK(config);
            }
        },
        [MapperKind.COMPOSITE_FIELD]: (fieldConfig, fieldName, typeName) => {
            const resolverValue = resolvers[typeName];
            if (resolverValue != null) {
                const fieldResolve = resolverValue[fieldName];
                if (fieldResolve != null) {
                    const newFieldConfig = { ...fieldConfig };
                    if (typeof fieldResolve === 'function') {
                        // for convenience. Allows shorter syntax in resolver definition file
                        newFieldConfig.resolve = fieldResolve.bind(resolverValue);
                    }
                    else {
                        setFieldProperties(newFieldConfig, fieldResolve);
                    }
                    return newFieldConfig;
                }
            }
        },
    });
    if (defaultFieldResolver != null) {
        schema = mapSchema(schema, {
            [MapperKind.OBJECT_FIELD]: fieldConfig => ({
                ...fieldConfig,
                resolve: fieldConfig.resolve != null ? fieldConfig.resolve : defaultFieldResolver,
            }),
        });
    }
    return schema;
}
function setFieldProperties(field, propertiesObj) {
    for (const propertyName in propertiesObj) {
        field[propertyName] = propertiesObj[propertyName];
    }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/memoize.js
function memoize1(fn) {
    const memoize1cache = new WeakMap();
    return function memoized(a1) {
        const cachedValue = memoize1cache.get(a1);
        if (cachedValue === undefined) {
            const newValue = fn(a1);
            memoize1cache.set(a1, newValue);
            return newValue;
        }
        return cachedValue;
    };
}
function memoize2(fn) {
    const memoize2cache = new WeakMap();
    return function memoized(a1, a2) {
        let cache2 = memoize2cache.get(a1);
        if (!cache2) {
            cache2 = new WeakMap();
            memoize2cache.set(a1, cache2);
            const newValue = fn(a1, a2);
            cache2.set(a2, newValue);
            return newValue;
        }
        const cachedValue = cache2.get(a2);
        if (cachedValue === undefined) {
            const newValue = fn(a1, a2);
            cache2.set(a2, newValue);
            return newValue;
        }
        return cachedValue;
    };
}
function memoize3(fn) {
    const memoize3Cache = new WeakMap();
    return function memoized(a1, a2, a3) {
        let cache2 = memoize3Cache.get(a1);
        if (!cache2) {
            cache2 = new WeakMap();
            memoize3Cache.set(a1, cache2);
            const cache3 = new WeakMap();
            cache2.set(a2, cache3);
            const newValue = fn(a1, a2, a3);
            cache3.set(a3, newValue);
            return newValue;
        }
        let cache3 = cache2.get(a2);
        if (!cache3) {
            cache3 = new WeakMap();
            cache2.set(a2, cache3);
            const newValue = fn(a1, a2, a3);
            cache3.set(a3, newValue);
            return newValue;
        }
        const cachedValue = cache3.get(a3);
        if (cachedValue === undefined) {
            const newValue = fn(a1, a2, a3);
            cache3.set(a3, newValue);
            return newValue;
        }
        return cachedValue;
    };
}
function memoize4(fn) {
    const memoize4Cache = new WeakMap();
    return function memoized(a1, a2, a3, a4) {
        let cache2 = memoize4Cache.get(a1);
        if (!cache2) {
            cache2 = new WeakMap();
            memoize4Cache.set(a1, cache2);
            const cache3 = new WeakMap();
            cache2.set(a2, cache3);
            const cache4 = new WeakMap();
            cache3.set(a3, cache4);
            const newValue = fn(a1, a2, a3, a4);
            cache4.set(a4, newValue);
            return newValue;
        }
        let cache3 = cache2.get(a2);
        if (!cache3) {
            cache3 = new WeakMap();
            cache2.set(a2, cache3);
            const cache4 = new WeakMap();
            cache3.set(a3, cache4);
            const newValue = fn(a1, a2, a3, a4);
            cache4.set(a4, newValue);
            return newValue;
        }
        const cache4 = cache3.get(a3);
        if (!cache4) {
            const cache4 = new WeakMap();
            cache3.set(a3, cache4);
            const newValue = fn(a1, a2, a3, a4);
            cache4.set(a4, newValue);
            return newValue;
        }
        const cachedValue = cache4.get(a4);
        if (cachedValue === undefined) {
            const newValue = fn(a1, a2, a3, a4);
            cache4.set(a4, newValue);
            return newValue;
        }
        return cachedValue;
    };
}
function memoize5(fn) {
    const memoize5Cache = new WeakMap();
    return function memoized(a1, a2, a3, a4, a5) {
        let cache2 = memoize5Cache.get(a1);
        if (!cache2) {
            cache2 = new WeakMap();
            memoize5Cache.set(a1, cache2);
            const cache3 = new WeakMap();
            cache2.set(a2, cache3);
            const cache4 = new WeakMap();
            cache3.set(a3, cache4);
            const cache5 = new WeakMap();
            cache4.set(a4, cache5);
            const newValue = fn(a1, a2, a3, a4, a5);
            cache5.set(a5, newValue);
            return newValue;
        }
        let cache3 = cache2.get(a2);
        if (!cache3) {
            cache3 = new WeakMap();
            cache2.set(a2, cache3);
            const cache4 = new WeakMap();
            cache3.set(a3, cache4);
            const cache5 = new WeakMap();
            cache4.set(a4, cache5);
            const newValue = fn(a1, a2, a3, a4, a5);
            cache5.set(a5, newValue);
            return newValue;
        }
        let cache4 = cache3.get(a3);
        if (!cache4) {
            cache4 = new WeakMap();
            cache3.set(a3, cache4);
            const cache5 = new WeakMap();
            cache4.set(a4, cache5);
            const newValue = fn(a1, a2, a3, a4, a5);
            cache5.set(a5, newValue);
            return newValue;
        }
        let cache5 = cache4.get(a4);
        if (!cache5) {
            cache5 = new WeakMap();
            cache4.set(a4, cache5);
            const newValue = fn(a1, a2, a3, a4, a5);
            cache5.set(a5, newValue);
            return newValue;
        }
        const cachedValue = cache5.get(a5);
        if (cachedValue === undefined) {
            const newValue = fn(a1, a2, a3, a4, a5);
            cache5.set(a5, newValue);
            return newValue;
        }
        return cachedValue;
    };
}
const memoize2of4cache = new WeakMap();
function memoize2of4(fn) {
    return function memoized(a1, a2, a3, a4) {
        let cache2 = memoize2of4cache.get(a1);
        if (!cache2) {
            cache2 = new WeakMap();
            memoize2of4cache.set(a1, cache2);
            const newValue = fn(a1, a2, a3, a4);
            cache2.set(a2, newValue);
            return newValue;
        }
        const cachedValue = cache2.get(a2);
        if (cachedValue === undefined) {
            const newValue = fn(a1, a2, a3, a4);
            cache2.set(a2, newValue);
            return newValue;
        }
        return cachedValue;
    };
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/rootTypes.js

function getDefinedRootType(schema, operation) {
    const rootTypeMap = getRootTypeMap(schema);
    const rootType = rootTypeMap.get(operation);
    if (rootType == null) {
        throw new Error(`Root type for operation "${operation}" not defined by the given schema.`);
    }
    return rootType;
}
const getRootTypeNames = memoize1(function getRootTypeNames(schema) {
    const rootTypes = getRootTypes(schema);
    return new Set([...rootTypes].map(type => type.name));
});
const getRootTypes = memoize1(function getRootTypes(schema) {
    const rootTypeMap = getRootTypeMap(schema);
    return new Set(rootTypeMap.values());
});
const getRootTypeMap = memoize1(function getRootTypeMap(schema) {
    const rootTypeMap = new Map();
    const queryType = schema.getQueryType();
    if (queryType) {
        rootTypeMap.set('query', queryType);
    }
    const mutationType = schema.getMutationType();
    if (mutationType) {
        rootTypeMap.set('mutation', mutationType);
    }
    const subscriptionType = schema.getSubscriptionType();
    if (subscriptionType) {
        rootTypeMap.set('subscription', subscriptionType);
    }
    return rootTypeMap;
});

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/get-implementing-types.js

function getImplementingTypes(interfaceName, schema) {
    const allTypesMap = schema.getTypeMap();
    const result = [];
    for (const graphqlTypeName in allTypesMap) {
        const graphqlType = allTypesMap[graphqlTypeName];
        if ((0,graphql/* isObjectType */.lpB)(graphqlType)) {
            const allInterfaces = graphqlType.getInterfaces();
            if (allInterfaces.find(int => int.name === interfaceName)) {
                result.push(graphqlType.name);
            }
        }
    }
    return result;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/prune.js





/**
 * Prunes the provided schema, removing unused and empty types
 * @param schema The schema to prune
 * @param options Additional options for removing unused types from the schema
 */
function pruneSchema(schema, options = {}) {
    const { skipEmptyCompositeTypePruning, skipEmptyUnionPruning, skipPruning, skipUnimplementedInterfacesPruning, skipUnusedTypesPruning, } = options;
    let prunedTypes = []; // Pruned types during mapping
    let prunedSchema = schema;
    do {
        let visited = visitSchema(prunedSchema);
        // Custom pruning  was defined, so we need to pre-emptively revisit the schema accounting for this
        if (skipPruning) {
            const revisit = [];
            for (const typeName in prunedSchema.getTypeMap()) {
                if (typeName.startsWith('__')) {
                    continue;
                }
                const type = prunedSchema.getType(typeName);
                // if we want to skip pruning for this type, add it to the list of types to revisit
                if (type && skipPruning(type)) {
                    revisit.push(typeName);
                }
            }
            visited = visitQueue(revisit, prunedSchema, visited); // visit again
        }
        prunedTypes = [];
        prunedSchema = mapSchema(prunedSchema, {
            [MapperKind.TYPE]: type => {
                if (!visited.has(type.name) && !(0,graphql/* isSpecifiedScalarType */.u1m)(type)) {
                    if ((0,graphql/* isUnionType */.EN0)(type) ||
                        (0,graphql/* isInputObjectType */.hLV)(type) ||
                        (0,graphql/* isInterfaceType */.oTV)(type) ||
                        (0,graphql/* isObjectType */.lpB)(type) ||
                        (0,graphql/* isScalarType */.KAw)(type)) {
                        // skipUnusedTypesPruning: skip pruning unused types
                        if (skipUnusedTypesPruning) {
                            return type;
                        }
                        // skipEmptyUnionPruning: skip pruning empty unions
                        if ((0,graphql/* isUnionType */.EN0)(type) && skipEmptyUnionPruning && !Object.keys(type.getTypes()).length) {
                            return type;
                        }
                        if ((0,graphql/* isInputObjectType */.hLV)(type) || (0,graphql/* isInterfaceType */.oTV)(type) || (0,graphql/* isObjectType */.lpB)(type)) {
                            // skipEmptyCompositeTypePruning: skip pruning object types or interfaces with no fields
                            if (skipEmptyCompositeTypePruning && !Object.keys(type.getFields()).length) {
                                return type;
                            }
                        }
                        // skipUnimplementedInterfacesPruning: skip pruning interfaces that are not implemented by any other types
                        if ((0,graphql/* isInterfaceType */.oTV)(type) && skipUnimplementedInterfacesPruning) {
                            return type;
                        }
                    }
                    prunedTypes.push(type.name);
                    visited.delete(type.name);
                    return null;
                }
                return type;
            },
        });
    } while (prunedTypes.length); // Might have empty types and need to prune again
    return prunedSchema;
}
function visitSchema(schema) {
    const queue = []; // queue of nodes to visit
    // Grab the root types and start there
    for (const type of getRootTypes(schema)) {
        queue.push(type.name);
    }
    return visitQueue(queue, schema);
}
function visitQueue(queue, schema, visited = new Set()) {
    // Interfaces encountered that are field return types need to be revisited to add their implementations
    const revisit = new Map();
    // Navigate all types starting with pre-queued types (root types)
    while (queue.length) {
        const typeName = queue.pop();
        // Skip types we already visited unless it is an interface type that needs revisiting
        if (visited.has(typeName) && revisit[typeName] !== true) {
            continue;
        }
        const type = schema.getType(typeName);
        if (type) {
            // Get types for union
            if ((0,graphql/* isUnionType */.EN0)(type)) {
                queue.push(...type.getTypes().map(type => type.name));
            }
            // If it is an interface and it is a returned type, grab all implementations so we can use proper __typename in fragments
            if ((0,graphql/* isInterfaceType */.oTV)(type) && revisit[typeName] === true) {
                queue.push(...getImplementingTypes(type.name, schema));
                // No need to revisit this interface again
                revisit[typeName] = false;
            }
            // Visit interfaces this type is implementing if they haven't been visited yet
            if ('getInterfaces' in type) {
                // Only pushes to queue to visit but not return types
                queue.push(...type.getInterfaces().map(iface => iface.name));
            }
            // If the type has files visit those field types
            if ('getFields' in type) {
                const fields = type.getFields();
                const entries = Object.entries(fields);
                if (!entries.length) {
                    continue;
                }
                for (const [, field] of entries) {
                    if ((0,graphql/* isObjectType */.lpB)(type)) {
                        // Visit arg types
                        queue.push(...field.args.map(arg => (0,graphql/* getNamedType */.xCR)(arg.type).name));
                    }
                    const namedType = (0,graphql/* getNamedType */.xCR)(field.type);
                    queue.push(namedType.name);
                    // Interfaces returned on fields need to be revisited to add their implementations
                    if ((0,graphql/* isInterfaceType */.oTV)(namedType) && !(namedType.name in revisit)) {
                        revisit[namedType.name] = true;
                    }
                }
            }
            visited.add(typeName); // Mark as visited (and therefore it is used and should be kept)
        }
    }
    return visited;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/helpers.js

const asArray = (fns) => (Array.isArray(fns) ? fns : fns ? [fns] : []);
const invalidDocRegex = /\.[a-z0-9]+$/i;
function isDocumentString(str) {
    if (typeof str !== 'string') {
        return false;
    }
    // XXX: is-valid-path or is-glob treat SDL as a valid path
    // (`scalar Date` for example)
    // this why checking the extension is fast enough
    // and prevent from parsing the string in order to find out
    // if the string is a SDL
    if (invalidDocRegex.test(str)) {
        return false;
    }
    try {
        parse(str);
        return true;
    }
    catch (e) { }
    return false;
}
const invalidPathRegex = /[‘“!%^<=>`]/;
function isValidPath(str) {
    return typeof str === 'string' && !invalidPathRegex.test(str);
}
function compareStrings(a, b) {
    if (String(a) < String(b)) {
        return -1;
    }
    if (String(a) > String(b)) {
        return 1;
    }
    return 0;
}
function nodeToString(a) {
    var _a, _b;
    let name;
    if ('alias' in a) {
        name = (_a = a.alias) === null || _a === void 0 ? void 0 : _a.value;
    }
    if (name == null && 'name' in a) {
        name = (_b = a.name) === null || _b === void 0 ? void 0 : _b.value;
    }
    if (name == null) {
        name = a.kind;
    }
    return name;
}
function compareNodes(a, b, customFn) {
    const aStr = nodeToString(a);
    const bStr = nodeToString(b);
    if (typeof customFn === 'function') {
        return customFn(aStr, bStr);
    }
    return compareStrings(aStr, bStr);
}
function isSome(input) {
    return input != null;
}
function assertSome(input, message = 'Value should be something') {
    if (input == null) {
        throw new Error(message);
    }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/utils.js

function isStringTypes(types) {
    return typeof types === 'string';
}
function isSourceTypes(types) {
    return types instanceof graphql/* Source */.Hw6;
}
function extractType(type) {
    let visitedType = type;
    while (visitedType.kind === graphql/* Kind.LIST_TYPE */.hYY.LIST_TYPE || visitedType.kind === 'NonNullType') {
        visitedType = visitedType.type;
    }
    return visitedType;
}
function isWrappingTypeNode(type) {
    return type.kind !== graphql/* Kind.NAMED_TYPE */.hYY.NAMED_TYPE;
}
function isListTypeNode(type) {
    return type.kind === graphql/* Kind.LIST_TYPE */.hYY.LIST_TYPE;
}
function isNonNullTypeNode(type) {
    return type.kind === graphql/* Kind.NON_NULL_TYPE */.hYY.NON_NULL_TYPE;
}
function printTypeNode(type) {
    if (isListTypeNode(type)) {
        return `[${printTypeNode(type.type)}]`;
    }
    if (isNonNullTypeNode(type)) {
        return `${printTypeNode(type.type)}!`;
    }
    return type.name.value;
}
var CompareVal;
(function (CompareVal) {
    CompareVal[CompareVal["A_SMALLER_THAN_B"] = -1] = "A_SMALLER_THAN_B";
    CompareVal[CompareVal["A_EQUALS_B"] = 0] = "A_EQUALS_B";
    CompareVal[CompareVal["A_GREATER_THAN_B"] = 1] = "A_GREATER_THAN_B";
})(CompareVal || (CompareVal = {}));
function defaultStringComparator(a, b) {
    if (a == null && b == null) {
        return CompareVal.A_EQUALS_B;
    }
    if (a == null) {
        return CompareVal.A_SMALLER_THAN_B;
    }
    if (b == null) {
        return CompareVal.A_GREATER_THAN_B;
    }
    if (a < b)
        return CompareVal.A_SMALLER_THAN_B;
    if (a > b)
        return CompareVal.A_GREATER_THAN_B;
    return CompareVal.A_EQUALS_B;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/directives.js


function directiveAlreadyExists(directivesArr, otherDirective) {
    return !!directivesArr.find(directive => directive.name.value === otherDirective.name.value);
}
function nameAlreadyExists(name, namesArr) {
    return namesArr.some(({ value }) => value === name.value);
}
function mergeArguments(a1, a2) {
    const result = [...a2];
    for (const argument of a1) {
        const existingIndex = result.findIndex(a => a.name.value === argument.name.value);
        if (existingIndex > -1) {
            const existingArg = result[existingIndex];
            if (existingArg.value.kind === 'ListValue') {
                const source = existingArg.value.values;
                const target = argument.value.values;
                // merge values of two lists
                existingArg.value.values = deduplicateLists(source, target, (targetVal, source) => {
                    const value = targetVal.value;
                    return !value || !source.some((sourceVal) => sourceVal.value === value);
                });
            }
            else {
                existingArg.value = argument.value;
            }
        }
        else {
            result.push(argument);
        }
    }
    return result;
}
function deduplicateDirectives(directives) {
    return directives
        .map((directive, i, all) => {
        const firstAt = all.findIndex(d => d.name.value === directive.name.value);
        if (firstAt !== i) {
            const dup = all[firstAt];
            directive.arguments = mergeArguments(directive.arguments, dup.arguments);
            return null;
        }
        return directive;
    })
        .filter(isSome);
}
function mergeDirectives(d1 = [], d2 = [], config) {
    const reverseOrder = config && config.reverseDirectives;
    const asNext = reverseOrder ? d1 : d2;
    const asFirst = reverseOrder ? d2 : d1;
    const result = deduplicateDirectives([...asNext]);
    for (const directive of asFirst) {
        if (directiveAlreadyExists(result, directive)) {
            const existingDirectiveIndex = result.findIndex(d => d.name.value === directive.name.value);
            const existingDirective = result[existingDirectiveIndex];
            result[existingDirectiveIndex].arguments = mergeArguments(directive.arguments || [], existingDirective.arguments || []);
        }
        else {
            result.push(directive);
        }
    }
    return result;
}
function validateInputs(node, existingNode) {
    const printedNode = (0,graphql/* print */.S0v)({
        ...node,
        description: undefined,
    });
    const printedExistingNode = (0,graphql/* print */.S0v)({
        ...existingNode,
        description: undefined,
    });
    // eslint-disable-next-line
    const leaveInputs = new RegExp('(directive @w*d*)|( on .*$)', 'g');
    const sameArguments = printedNode.replace(leaveInputs, '') === printedExistingNode.replace(leaveInputs, '');
    if (!sameArguments) {
        throw new Error(`Unable to merge GraphQL directive "${node.name.value}". \nExisting directive:  \n\t${printedExistingNode} \nReceived directive: \n\t${printedNode}`);
    }
}
function mergeDirective(node, existingNode) {
    if (existingNode) {
        validateInputs(node, existingNode);
        return {
            ...node,
            locations: [
                ...existingNode.locations,
                ...node.locations.filter(name => !nameAlreadyExists(name, existingNode.locations)),
            ],
        };
    }
    return node;
}
function deduplicateLists(source, target, filterFn) {
    return source.concat(target.filter(val => filterFn(val, source)));
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/arguments.js

function arguments_mergeArguments(args1, args2, config) {
    const result = deduplicateArguments([...args2, ...args1].filter(isSome));
    if (config && config.sort) {
        result.sort(compareNodes);
    }
    return result;
}
function deduplicateArguments(args) {
    return args.reduce((acc, current) => {
        const dup = acc.find(arg => arg.name.value === current.name.value);
        if (!dup) {
            return acc.concat([current]);
        }
        return acc;
    }, []);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/fields.js




function fieldAlreadyExists(fieldsArr, otherField, config) {
    const result = fieldsArr.find(field => field.name.value === otherField.name.value);
    if (result && !(config === null || config === void 0 ? void 0 : config.ignoreFieldConflicts)) {
        const t1 = extractType(result.type);
        const t2 = extractType(otherField.type);
        if (t1.name.value !== t2.name.value) {
            throw new Error(`Field "${otherField.name.value}" already defined with a different type. Declared as "${t1.name.value}", but you tried to override with "${t2.name.value}"`);
        }
    }
    return !!result;
}
function mergeFields(type, f1, f2, config) {
    const result = [];
    if (f2 != null) {
        result.push(...f2);
    }
    if (f1 != null) {
        for (const field of f1) {
            if (fieldAlreadyExists(result, field, config)) {
                const existing = result.find((f) => f.name.value === field.name.value);
                if (!(config === null || config === void 0 ? void 0 : config.ignoreFieldConflicts)) {
                    if (config === null || config === void 0 ? void 0 : config.throwOnConflict) {
                        preventConflicts(type, existing, field, false);
                    }
                    else {
                        preventConflicts(type, existing, field, true);
                    }
                    if (isNonNullTypeNode(field.type) && !isNonNullTypeNode(existing.type)) {
                        existing.type = field.type;
                    }
                }
                existing.arguments = arguments_mergeArguments(field['arguments'] || [], existing.arguments || [], config);
                existing.directives = mergeDirectives(field.directives, existing.directives, config);
                existing.description = field.description || existing.description;
            }
            else {
                result.push(field);
            }
        }
    }
    if (config && config.sort) {
        result.sort(compareNodes);
    }
    if (config && config.exclusions) {
        const exclusions = config.exclusions;
        return result.filter(field => !exclusions.includes(`${type.name.value}.${field.name.value}`));
    }
    return result;
}
function preventConflicts(type, a, b, ignoreNullability = false) {
    const aType = printTypeNode(a.type);
    const bType = printTypeNode(b.type);
    if (aType !== bType && !safeChangeForFieldType(a.type, b.type, ignoreNullability)) {
        throw new Error(`Field '${type.name.value}.${a.name.value}' changed type from '${aType}' to '${bType}'`);
    }
}
function safeChangeForFieldType(oldType, newType, ignoreNullability = false) {
    // both are named
    if (!isWrappingTypeNode(oldType) && !isWrappingTypeNode(newType)) {
        return oldType.toString() === newType.toString();
    }
    // new is non-null
    if (isNonNullTypeNode(newType)) {
        const ofType = isNonNullTypeNode(oldType) ? oldType.type : oldType;
        return safeChangeForFieldType(ofType, newType.type);
    }
    // old is non-null
    if (isNonNullTypeNode(oldType)) {
        return safeChangeForFieldType(newType, oldType, ignoreNullability);
    }
    // old is list
    if (isListTypeNode(oldType)) {
        return ((isListTypeNode(newType) && safeChangeForFieldType(oldType.type, newType.type)) ||
            (isNonNullTypeNode(newType) && safeChangeForFieldType(oldType, newType['type'])));
    }
    return false;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-named-type-array.js

function alreadyExists(arr, other) {
    return !!arr.find(i => i.name.value === other.name.value);
}
function mergeNamedTypeArray(first = [], second = [], config = {}) {
    const result = [...second, ...first.filter(d => !alreadyExists(second, d))];
    if (config && config.sort) {
        result.sort(compareNodes);
    }
    return result;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/type.js




function mergeType(node, existingNode, config) {
    if (existingNode) {
        try {
            return {
                name: node.name,
                description: node['description'] || existingNode['description'],
                kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) ||
                    node.kind === 'ObjectTypeDefinition' ||
                    existingNode.kind === 'ObjectTypeDefinition'
                    ? 'ObjectTypeDefinition'
                    : 'ObjectTypeExtension',
                loc: node.loc,
                fields: mergeFields(node, node.fields, existingNode.fields, config),
                directives: mergeDirectives(node.directives, existingNode.directives, config),
                interfaces: mergeNamedTypeArray(node.interfaces, existingNode.interfaces, config),
            };
        }
        catch (e) {
            throw new Error(`Unable to merge GraphQL type "${node.name.value}": ${e.message}`);
        }
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions)
        ? {
            ...node,
            kind: graphql/* Kind.OBJECT_TYPE_DEFINITION */.hYY.OBJECT_TYPE_DEFINITION,
        }
        : node;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/enum-values.js


function mergeEnumValues(first, second, config) {
    if (config === null || config === void 0 ? void 0 : config.consistentEnumMerge) {
        const reversed = [];
        if (first) {
            reversed.push(...first);
        }
        first = second;
        second = reversed;
    }
    const enumValueMap = new Map();
    if (first) {
        for (const firstValue of first) {
            enumValueMap.set(firstValue.name.value, firstValue);
        }
    }
    if (second) {
        for (const secondValue of second) {
            const enumValue = secondValue.name.value;
            if (enumValueMap.has(enumValue)) {
                const firstValue = enumValueMap.get(enumValue);
                firstValue.description = secondValue.description || firstValue.description;
                firstValue.directives = mergeDirectives(secondValue.directives, firstValue.directives);
            }
            else {
                enumValueMap.set(enumValue, secondValue);
            }
        }
    }
    const result = [...enumValueMap.values()];
    if (config && config.sort) {
        result.sort(compareNodes);
    }
    return result;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/enum.js



function mergeEnum(e1, e2, config) {
    if (e2) {
        return {
            name: e1.name,
            description: e1['description'] || e2['description'],
            kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || e1.kind === 'EnumTypeDefinition' || e2.kind === 'EnumTypeDefinition'
                ? 'EnumTypeDefinition'
                : 'EnumTypeExtension',
            loc: e1.loc,
            directives: mergeDirectives(e1.directives, e2.directives, config),
            values: mergeEnumValues(e1.values, e2.values, config),
        };
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions)
        ? {
            ...e1,
            kind: graphql/* Kind.ENUM_TYPE_DEFINITION */.hYY.ENUM_TYPE_DEFINITION,
        }
        : e1;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/scalar.js


function mergeScalar(node, existingNode, config) {
    if (existingNode) {
        return {
            name: node.name,
            description: node['description'] || existingNode['description'],
            kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) ||
                node.kind === 'ScalarTypeDefinition' ||
                existingNode.kind === 'ScalarTypeDefinition'
                ? 'ScalarTypeDefinition'
                : 'ScalarTypeExtension',
            loc: node.loc,
            directives: mergeDirectives(node.directives, existingNode.directives, config),
        };
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions)
        ? {
            ...node,
            kind: graphql/* Kind.SCALAR_TYPE_DEFINITION */.hYY.SCALAR_TYPE_DEFINITION,
        }
        : node;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/union.js



function mergeUnion(first, second, config) {
    if (second) {
        return {
            name: first.name,
            description: first['description'] || second['description'],
            // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
            directives: mergeDirectives(first.directives, second.directives, config),
            kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || first.kind === 'UnionTypeDefinition' || second.kind === 'UnionTypeDefinition'
                ? graphql/* Kind.UNION_TYPE_DEFINITION */.hYY.UNION_TYPE_DEFINITION
                : graphql/* Kind.UNION_TYPE_EXTENSION */.hYY.UNION_TYPE_EXTENSION,
            loc: first.loc,
            types: mergeNamedTypeArray(first.types, second.types, config),
        };
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions)
        ? {
            ...first,
            kind: graphql/* Kind.UNION_TYPE_DEFINITION */.hYY.UNION_TYPE_DEFINITION,
        }
        : first;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/input-type.js



function mergeInputType(node, existingNode, config) {
    if (existingNode) {
        try {
            return {
                name: node.name,
                description: node['description'] || existingNode['description'],
                kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) ||
                    node.kind === 'InputObjectTypeDefinition' ||
                    existingNode.kind === 'InputObjectTypeDefinition'
                    ? 'InputObjectTypeDefinition'
                    : 'InputObjectTypeExtension',
                loc: node.loc,
                fields: mergeFields(node, node.fields, existingNode.fields, config),
                directives: mergeDirectives(node.directives, existingNode.directives, config),
            };
        }
        catch (e) {
            throw new Error(`Unable to merge GraphQL input type "${node.name.value}": ${e.message}`);
        }
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions)
        ? {
            ...node,
            kind: graphql/* Kind.INPUT_OBJECT_TYPE_DEFINITION */.hYY.INPUT_OBJECT_TYPE_DEFINITION,
        }
        : node;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/interface.js




function mergeInterface(node, existingNode, config) {
    if (existingNode) {
        try {
            return {
                name: node.name,
                description: node['description'] || existingNode['description'],
                kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) ||
                    node.kind === 'InterfaceTypeDefinition' ||
                    existingNode.kind === 'InterfaceTypeDefinition'
                    ? 'InterfaceTypeDefinition'
                    : 'InterfaceTypeExtension',
                loc: node.loc,
                fields: mergeFields(node, node.fields, existingNode.fields, config),
                directives: mergeDirectives(node.directives, existingNode.directives, config),
                interfaces: node['interfaces']
                    ? mergeNamedTypeArray(node['interfaces'], existingNode['interfaces'], config)
                    : undefined,
            };
        }
        catch (e) {
            throw new Error(`Unable to merge GraphQL interface "${node.name.value}": ${e.message}`);
        }
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions)
        ? {
            ...node,
            kind: graphql/* Kind.INTERFACE_TYPE_DEFINITION */.hYY.INTERFACE_TYPE_DEFINITION,
        }
        : node;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/schema-def.js


const DEFAULT_OPERATION_TYPE_NAME_MAP = {
    query: 'Query',
    mutation: 'Mutation',
    subscription: 'Subscription',
};
function mergeOperationTypes(opNodeList = [], existingOpNodeList = []) {
    const finalOpNodeList = [];
    for (const opNodeType in DEFAULT_OPERATION_TYPE_NAME_MAP) {
        const opNode = opNodeList.find(n => n.operation === opNodeType) || existingOpNodeList.find(n => n.operation === opNodeType);
        if (opNode) {
            finalOpNodeList.push(opNode);
        }
    }
    return finalOpNodeList;
}
function mergeSchemaDefs(node, existingNode, config) {
    if (existingNode) {
        return {
            kind: node.kind === graphql/* Kind.SCHEMA_DEFINITION */.hYY.SCHEMA_DEFINITION || existingNode.kind === graphql/* Kind.SCHEMA_DEFINITION */.hYY.SCHEMA_DEFINITION
                ? graphql/* Kind.SCHEMA_DEFINITION */.hYY.SCHEMA_DEFINITION
                : graphql/* Kind.SCHEMA_EXTENSION */.hYY.SCHEMA_EXTENSION,
            description: node['description'] || existingNode['description'],
            directives: mergeDirectives(node.directives, existingNode.directives, config),
            operationTypes: mergeOperationTypes(node.operationTypes, existingNode.operationTypes),
        };
    }
    return ((config === null || config === void 0 ? void 0 : config.convertExtensions)
        ? {
            ...node,
            kind: graphql/* Kind.SCHEMA_DEFINITION */.hYY.SCHEMA_DEFINITION,
        }
        : node);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/comments.js

const MAX_LINE_LENGTH = 80;
let commentsRegistry = {};
function resetComments() {
    commentsRegistry = {};
}
function collectComment(node) {
    var _a;
    const entityName = (_a = node.name) === null || _a === void 0 ? void 0 : _a.value;
    if (entityName == null) {
        return;
    }
    pushComment(node, entityName);
    switch (node.kind) {
        case 'EnumTypeDefinition':
            if (node.values) {
                for (const value of node.values) {
                    pushComment(value, entityName, value.name.value);
                }
            }
            break;
        case 'ObjectTypeDefinition':
        case 'InputObjectTypeDefinition':
        case 'InterfaceTypeDefinition':
            if (node.fields) {
                for (const field of node.fields) {
                    pushComment(field, entityName, field.name.value);
                    if (isFieldDefinitionNode(field) && field.arguments) {
                        for (const arg of field.arguments) {
                            pushComment(arg, entityName, field.name.value, arg.name.value);
                        }
                    }
                }
            }
            break;
    }
}
function pushComment(node, entity, field, argument) {
    const comment = getComment(node);
    if (typeof comment !== 'string' || comment.length === 0) {
        return;
    }
    const keys = [entity];
    if (field) {
        keys.push(field);
        if (argument) {
            keys.push(argument);
        }
    }
    const path = keys.join('.');
    if (!commentsRegistry[path]) {
        commentsRegistry[path] = [];
    }
    commentsRegistry[path].push(comment);
}
function printComment(comment) {
    return '\n# ' + comment.replace(/\n/g, '\n# ');
}
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * NOTE: ==> This file has been modified just to add comments to the printed AST
 * This is a temp measure, we will move to using the original non modified printer.js ASAP.
 */
/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print all items together separated by separator if provided
 */
function join(maybeArray, separator) {
    return maybeArray ? maybeArray.filter(x => x).join(separator || '') : '';
}
function hasMultilineItems(maybeArray) {
    var _a;
    return (_a = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.some(str => str.includes('\n'))) !== null && _a !== void 0 ? _a : false;
}
function addDescription(cb) {
    return (node, _key, _parent, path, ancestors) => {
        var _a;
        const keys = [];
        const parent = path.reduce((prev, key) => {
            if (['fields', 'arguments', 'values'].includes(key) && prev.name) {
                keys.push(prev.name.value);
            }
            return prev[key];
        }, ancestors[0]);
        const key = [...keys, (_a = parent === null || parent === void 0 ? void 0 : parent.name) === null || _a === void 0 ? void 0 : _a.value].filter(Boolean).join('.');
        const items = [];
        if (node.kind.includes('Definition') && commentsRegistry[key]) {
            items.push(...commentsRegistry[key]);
        }
        return join([...items.map(printComment), node.description, cb(node, _key, _parent, path, ancestors)], '\n');
    };
}
function indent(maybeString) {
    return maybeString && `  ${maybeString.replace(/\n/g, '\n  ')}`;
}
/**
 * Given array, print each item on its own line, wrapped in an
 * indented "{ }" block.
 */
function block(array) {
    return array && array.length !== 0 ? `{\n${indent(join(array, '\n'))}\n}` : '';
}
/**
 * If maybeString is not null or empty, then wrap with start and end, otherwise
 * print an empty string.
 */
function wrap(start, maybeString, end) {
    return maybeString ? start + maybeString + (end || '') : '';
}
/**
 * Print a block string in the indented block form by adding a leading and
 * trailing blank line. However, if a block string starts with whitespace and is
 * a single-line, adding a leading blank line would strip that whitespace.
 */
function printBlockString(value, isDescription = false) {
    const escaped = value.replace(/"""/g, '\\"""');
    return (value[0] === ' ' || value[0] === '\t') && value.indexOf('\n') === -1
        ? `"""${escaped.replace(/"$/, '"\n')}"""`
        : `"""\n${isDescription ? escaped : indent(escaped)}\n"""`;
}
const printDocASTReducer = {
    Name: { leave: node => node.value },
    Variable: { leave: node => '$' + node.name },
    // Document
    Document: {
        leave: node => join(node.definitions, '\n\n'),
    },
    OperationDefinition: {
        leave: node => {
            const varDefs = wrap('(', join(node.variableDefinitions, ', '), ')');
            const prefix = join([node.operation, join([node.name, varDefs]), join(node.directives, ' ')], ' ');
            // the query short form.
            return prefix + ' ' + node.selectionSet;
        },
    },
    VariableDefinition: {
        leave: ({ variable, type, defaultValue, directives }) => variable + ': ' + type + wrap(' = ', defaultValue) + wrap(' ', join(directives, ' ')),
    },
    SelectionSet: { leave: ({ selections }) => block(selections) },
    Field: {
        leave({ alias, name, arguments: args, directives, selectionSet }) {
            const prefix = wrap('', alias, ': ') + name;
            let argsLine = prefix + wrap('(', join(args, ', '), ')');
            if (argsLine.length > MAX_LINE_LENGTH) {
                argsLine = prefix + wrap('(\n', indent(join(args, '\n')), '\n)');
            }
            return join([argsLine, join(directives, ' '), selectionSet], ' ');
        },
    },
    Argument: { leave: ({ name, value }) => name + ': ' + value },
    // Fragments
    FragmentSpread: {
        leave: ({ name, directives }) => '...' + name + wrap(' ', join(directives, ' ')),
    },
    InlineFragment: {
        leave: ({ typeCondition, directives, selectionSet }) => join(['...', wrap('on ', typeCondition), join(directives, ' '), selectionSet], ' '),
    },
    FragmentDefinition: {
        leave: ({ name, typeCondition, variableDefinitions, directives, selectionSet }) => 
        // Note: fragment variable definitions are experimental and may be changed
        // or removed in the future.
        `fragment ${name}${wrap('(', join(variableDefinitions, ', '), ')')} ` +
            `on ${typeCondition} ${wrap('', join(directives, ' '), ' ')}` +
            selectionSet,
    },
    // Value
    IntValue: { leave: ({ value }) => value },
    FloatValue: { leave: ({ value }) => value },
    StringValue: {
        leave: ({ value, block: isBlockString }) => {
            if (isBlockString) {
                return printBlockString(value);
            }
            return JSON.stringify(value);
        },
    },
    BooleanValue: { leave: ({ value }) => (value ? 'true' : 'false') },
    NullValue: { leave: () => 'null' },
    EnumValue: { leave: ({ value }) => value },
    ListValue: { leave: ({ values }) => '[' + join(values, ', ') + ']' },
    ObjectValue: { leave: ({ fields }) => '{' + join(fields, ', ') + '}' },
    ObjectField: { leave: ({ name, value }) => name + ': ' + value },
    // Directive
    Directive: {
        leave: ({ name, arguments: args }) => '@' + name + wrap('(', join(args, ', '), ')'),
    },
    // Type
    NamedType: { leave: ({ name }) => name },
    ListType: { leave: ({ type }) => '[' + type + ']' },
    NonNullType: { leave: ({ type }) => type + '!' },
    // Type System Definitions
    SchemaDefinition: {
        leave: ({ directives, operationTypes }) => join(['schema', join(directives, ' '), block(operationTypes)], ' '),
    },
    OperationTypeDefinition: {
        leave: ({ operation, type }) => operation + ': ' + type,
    },
    ScalarTypeDefinition: {
        leave: ({ name, directives }) => join(['scalar', name, join(directives, ' ')], ' '),
    },
    ObjectTypeDefinition: {
        leave: ({ name, interfaces, directives, fields }) => join(['type', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' '),
    },
    FieldDefinition: {
        leave: ({ name, arguments: args, type, directives }) => name +
            (hasMultilineItems(args)
                ? wrap('(\n', indent(join(args, '\n')), '\n)')
                : wrap('(', join(args, ', '), ')')) +
            ': ' +
            type +
            wrap(' ', join(directives, ' ')),
    },
    InputValueDefinition: {
        leave: ({ name, type, defaultValue, directives }) => join([name + ': ' + type, wrap('= ', defaultValue), join(directives, ' ')], ' '),
    },
    InterfaceTypeDefinition: {
        leave: ({ name, interfaces, directives, fields }) => join(['interface', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' '),
    },
    UnionTypeDefinition: {
        leave: ({ name, directives, types }) => join(['union', name, join(directives, ' '), wrap('= ', join(types, ' | '))], ' '),
    },
    EnumTypeDefinition: {
        leave: ({ name, directives, values }) => join(['enum', name, join(directives, ' '), block(values)], ' '),
    },
    EnumValueDefinition: {
        leave: ({ name, directives }) => join([name, join(directives, ' ')], ' '),
    },
    InputObjectTypeDefinition: {
        leave: ({ name, directives, fields }) => join(['input', name, join(directives, ' '), block(fields)], ' '),
    },
    DirectiveDefinition: {
        leave: ({ name, arguments: args, repeatable, locations }) => 'directive @' +
            name +
            (hasMultilineItems(args)
                ? wrap('(\n', indent(join(args, '\n')), '\n)')
                : wrap('(', join(args, ', '), ')')) +
            (repeatable ? ' repeatable' : '') +
            ' on ' +
            join(locations, ' | '),
    },
    SchemaExtension: {
        leave: ({ directives, operationTypes }) => join(['extend schema', join(directives, ' '), block(operationTypes)], ' '),
    },
    ScalarTypeExtension: {
        leave: ({ name, directives }) => join(['extend scalar', name, join(directives, ' ')], ' '),
    },
    ObjectTypeExtension: {
        leave: ({ name, interfaces, directives, fields }) => join(['extend type', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' '),
    },
    InterfaceTypeExtension: {
        leave: ({ name, interfaces, directives, fields }) => join(['extend interface', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' '),
    },
    UnionTypeExtension: {
        leave: ({ name, directives, types }) => join(['extend union', name, join(directives, ' '), wrap('= ', join(types, ' | '))], ' '),
    },
    EnumTypeExtension: {
        leave: ({ name, directives, values }) => join(['extend enum', name, join(directives, ' '), block(values)], ' '),
    },
    InputObjectTypeExtension: {
        leave: ({ name, directives, fields }) => join(['extend input', name, join(directives, ' '), block(fields)], ' '),
    },
};
const printDocASTReducerWithComments = Object.keys(printDocASTReducer).reduce((prev, key) => ({
    ...prev,
    [key]: {
        leave: addDescription(printDocASTReducer[key].leave),
    },
}), {});
/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */
function printWithComments(ast) {
    return (0,graphql/* visit */.Vn3)(ast, printDocASTReducerWithComments);
}
function isFieldDefinitionNode(node) {
    return node.kind === 'FieldDefinition';
}
// graphql < v13 and > v15 does not export getDescription
function getDescription(node, options) {
    if (node.description != null) {
        return node.description.value;
    }
    if (options === null || options === void 0 ? void 0 : options.commentDescriptions) {
        return getComment(node);
    }
}
function getComment(node) {
    const rawValue = getLeadingCommentBlock(node);
    if (rawValue !== undefined) {
        return dedentBlockStringValue(`\n${rawValue}`);
    }
}
function getLeadingCommentBlock(node) {
    const loc = node.loc;
    if (!loc) {
        return;
    }
    const comments = [];
    let token = loc.startToken.prev;
    while (token != null &&
        token.kind === graphql/* TokenKind.COMMENT */.T6V.COMMENT &&
        token.next != null &&
        token.prev != null &&
        token.line + 1 === token.next.line &&
        token.line !== token.prev.line) {
        const value = String(token.value);
        comments.push(value);
        token = token.prev;
    }
    return comments.length > 0 ? comments.reverse().join('\n') : undefined;
}
function dedentBlockStringValue(rawString) {
    // Expand a block string's raw value into independent lines.
    const lines = rawString.split(/\r\n|[\n\r]/g);
    // Remove common indentation from all lines but first.
    const commonIndent = getBlockStringIndentation(lines);
    if (commonIndent !== 0) {
        for (let i = 1; i < lines.length; i++) {
            lines[i] = lines[i].slice(commonIndent);
        }
    }
    // Remove leading and trailing blank lines.
    while (lines.length > 0 && isBlank(lines[0])) {
        lines.shift();
    }
    while (lines.length > 0 && isBlank(lines[lines.length - 1])) {
        lines.pop();
    }
    // Return a string of the lines joined with U+000A.
    return lines.join('\n');
}
/**
 * @internal
 */
function getBlockStringIndentation(lines) {
    let commonIndent = null;
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const indent = leadingWhitespace(line);
        if (indent === line.length) {
            continue; // skip empty lines
        }
        if (commonIndent === null || indent < commonIndent) {
            commonIndent = indent;
            if (commonIndent === 0) {
                break;
            }
        }
    }
    return commonIndent === null ? 0 : commonIndent;
}
function leadingWhitespace(str) {
    let i = 0;
    while (i < str.length && (str[i] === ' ' || str[i] === '\t')) {
        i++;
    }
    return i;
}
function isBlank(str) {
    return leadingWhitespace(str) === str.length;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-nodes.js










const schemaDefSymbol = 'SCHEMA_DEF_SYMBOL';
function isNamedDefinitionNode(definitionNode) {
    return 'name' in definitionNode;
}
function mergeGraphQLNodes(nodes, config) {
    var _a, _b, _c;
    const mergedResultMap = {};
    for (const nodeDefinition of nodes) {
        if (isNamedDefinitionNode(nodeDefinition)) {
            const name = (_a = nodeDefinition.name) === null || _a === void 0 ? void 0 : _a.value;
            if (config === null || config === void 0 ? void 0 : config.commentDescriptions) {
                collectComment(nodeDefinition);
            }
            if (name == null) {
                continue;
            }
            if (((_b = config === null || config === void 0 ? void 0 : config.exclusions) === null || _b === void 0 ? void 0 : _b.includes(name + '.*')) || ((_c = config === null || config === void 0 ? void 0 : config.exclusions) === null || _c === void 0 ? void 0 : _c.includes(name))) {
                delete mergedResultMap[name];
            }
            else {
                switch (nodeDefinition.kind) {
                    case graphql/* Kind.OBJECT_TYPE_DEFINITION */.hYY.OBJECT_TYPE_DEFINITION:
                    case graphql/* Kind.OBJECT_TYPE_EXTENSION */.hYY.OBJECT_TYPE_EXTENSION:
                        mergedResultMap[name] = mergeType(nodeDefinition, mergedResultMap[name], config);
                        break;
                    case graphql/* Kind.ENUM_TYPE_DEFINITION */.hYY.ENUM_TYPE_DEFINITION:
                    case graphql/* Kind.ENUM_TYPE_EXTENSION */.hYY.ENUM_TYPE_EXTENSION:
                        mergedResultMap[name] = mergeEnum(nodeDefinition, mergedResultMap[name], config);
                        break;
                    case graphql/* Kind.UNION_TYPE_DEFINITION */.hYY.UNION_TYPE_DEFINITION:
                    case graphql/* Kind.UNION_TYPE_EXTENSION */.hYY.UNION_TYPE_EXTENSION:
                        mergedResultMap[name] = mergeUnion(nodeDefinition, mergedResultMap[name], config);
                        break;
                    case graphql/* Kind.SCALAR_TYPE_DEFINITION */.hYY.SCALAR_TYPE_DEFINITION:
                    case graphql/* Kind.SCALAR_TYPE_EXTENSION */.hYY.SCALAR_TYPE_EXTENSION:
                        mergedResultMap[name] = mergeScalar(nodeDefinition, mergedResultMap[name], config);
                        break;
                    case graphql/* Kind.INPUT_OBJECT_TYPE_DEFINITION */.hYY.INPUT_OBJECT_TYPE_DEFINITION:
                    case graphql/* Kind.INPUT_OBJECT_TYPE_EXTENSION */.hYY.INPUT_OBJECT_TYPE_EXTENSION:
                        mergedResultMap[name] = mergeInputType(nodeDefinition, mergedResultMap[name], config);
                        break;
                    case graphql/* Kind.INTERFACE_TYPE_DEFINITION */.hYY.INTERFACE_TYPE_DEFINITION:
                    case graphql/* Kind.INTERFACE_TYPE_EXTENSION */.hYY.INTERFACE_TYPE_EXTENSION:
                        mergedResultMap[name] = mergeInterface(nodeDefinition, mergedResultMap[name], config);
                        break;
                    case graphql/* Kind.DIRECTIVE_DEFINITION */.hYY.DIRECTIVE_DEFINITION:
                        mergedResultMap[name] = mergeDirective(nodeDefinition, mergedResultMap[name]);
                        break;
                }
            }
        }
        else if (nodeDefinition.kind === graphql/* Kind.SCHEMA_DEFINITION */.hYY.SCHEMA_DEFINITION || nodeDefinition.kind === graphql/* Kind.SCHEMA_EXTENSION */.hYY.SCHEMA_EXTENSION) {
            mergedResultMap[schemaDefSymbol] = mergeSchemaDefs(nodeDefinition, mergedResultMap[schemaDefSymbol], config);
        }
    }
    return mergedResultMap;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/AggregateError.js
let AggregateErrorImpl;
if (typeof AggregateError === 'undefined') {
    class AggregateErrorClass extends Error {
        constructor(errors, message = '') {
            super(message);
            this.errors = errors;
            this.name = 'AggregateError';
            Error.captureStackTrace(this, AggregateErrorClass);
        }
    }
    AggregateErrorImpl = function (errors, message) {
        return new AggregateErrorClass(errors, message);
    };
}
else {
    AggregateErrorImpl = AggregateError;
}

function isAggregateError(error) {
    return 'errors' in error && Array.isArray(error['errors']);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/inspect.js
// Taken from graphql-js
// https://github.com/graphql/graphql-js/blob/main/src/jsutils/inspect.ts


const MAX_RECURSIVE_DEPTH = 3;
/**
 * Used to print values in error messages.
 */
function inspect(value) {
    return formatValue(value, []);
}
function formatValue(value, seenValues) {
    switch (typeof value) {
        case 'string':
            return JSON.stringify(value);
        case 'function':
            return value.name ? `[function ${value.name}]` : '[function]';
        case 'object':
            return formatObjectValue(value, seenValues);
        default:
            return String(value);
    }
}
function formatError(value) {
    if (value instanceof graphql/* GraphQLError */.__T) {
        return value.toString();
    }
    return `${value.name}: ${value.message};\n ${value.stack}`;
}
function formatObjectValue(value, previouslySeenValues) {
    if (value === null) {
        return 'null';
    }
    if (value instanceof Error) {
        if (isAggregateError(value)) {
            return formatError(value) + '\n' + formatArray(value.errors, previouslySeenValues);
        }
        return formatError(value);
    }
    if (previouslySeenValues.includes(value)) {
        return '[Circular]';
    }
    const seenValues = [...previouslySeenValues, value];
    if (isJSONable(value)) {
        const jsonValue = value.toJSON();
        // check for infinite recursion
        if (jsonValue !== value) {
            return typeof jsonValue === 'string' ? jsonValue : formatValue(jsonValue, seenValues);
        }
    }
    else if (Array.isArray(value)) {
        return formatArray(value, seenValues);
    }
    return formatObject(value, seenValues);
}
function isJSONable(value) {
    return typeof value.toJSON === 'function';
}
function formatObject(object, seenValues) {
    const entries = Object.entries(object);
    if (entries.length === 0) {
        return '{}';
    }
    if (seenValues.length > MAX_RECURSIVE_DEPTH) {
        return '[' + getObjectTag(object) + ']';
    }
    const properties = entries.map(([key, value]) => key + ': ' + formatValue(value, seenValues));
    return '{ ' + properties.join(', ') + ' }';
}
function formatArray(array, seenValues) {
    if (array.length === 0) {
        return '[]';
    }
    if (seenValues.length > MAX_RECURSIVE_DEPTH) {
        return '[Array]';
    }
    const len = array.length;
    const remaining = array.length;
    const items = [];
    for (let i = 0; i < len; ++i) {
        items.push(formatValue(array[i], seenValues));
    }
    if (remaining === 1) {
        items.push('... 1 more item');
    }
    else if (remaining > 1) {
        items.push(`... ${remaining} more items`);
    }
    return '[' + items.join(', ') + ']';
}
function getObjectTag(object) {
    const tag = Object.prototype.toString
        .call(object)
        .replace(/^\[object /, '')
        .replace(/]$/, '');
    if (tag === 'Object' && typeof object.constructor === 'function') {
        const name = object.constructor.name;
        if (typeof name === 'string' && name !== '') {
            return name;
        }
    }
    return tag;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/astFromType.js


function astFromType(type) {
    if ((0,graphql/* isNonNullType */.zMb)(type)) {
        const innerType = astFromType(type.ofType);
        if (innerType.kind === graphql/* Kind.NON_NULL_TYPE */.hYY.NON_NULL_TYPE) {
            throw new Error(`Invalid type node ${inspect(type)}. Inner type of non-null type cannot be a non-null type.`);
        }
        return {
            kind: graphql/* Kind.NON_NULL_TYPE */.hYY.NON_NULL_TYPE,
            type: innerType,
        };
    }
    else if ((0,graphql/* isListType */.HGy)(type)) {
        return {
            kind: graphql/* Kind.LIST_TYPE */.hYY.LIST_TYPE,
            type: astFromType(type.ofType),
        };
    }
    return {
        kind: graphql/* Kind.NAMED_TYPE */.hYY.NAMED_TYPE,
        name: {
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: type.name,
        },
    };
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/get-directives.js

function getDirectivesInExtensions(node, pathToDirectivesInExtensions = ['directives']) {
    return pathToDirectivesInExtensions.reduce((acc, pathSegment) => (acc == null ? acc : acc[pathSegment]), node === null || node === void 0 ? void 0 : node.extensions);
}
function _getDirectiveInExtensions(directivesInExtensions, directiveName) {
    const directiveInExtensions = directivesInExtensions.filter(directiveAnnotation => directiveAnnotation.name === directiveName);
    if (!directiveInExtensions.length) {
        return undefined;
    }
    return directiveInExtensions.map(directive => { var _a; return (_a = directive.args) !== null && _a !== void 0 ? _a : {}; });
}
function getDirectiveInExtensions(node, directiveName, pathToDirectivesInExtensions = ['directives']) {
    const directivesInExtensions = pathToDirectivesInExtensions.reduce((acc, pathSegment) => (acc == null ? acc : acc[pathSegment]), node === null || node === void 0 ? void 0 : node.extensions);
    if (directivesInExtensions === undefined) {
        return undefined;
    }
    if (Array.isArray(directivesInExtensions)) {
        return _getDirectiveInExtensions(directivesInExtensions, directiveName);
    }
    // Support condensed format by converting to longer format
    // The condensed format does not preserve ordering of directives when  repeatable directives are used.
    // See https://github.com/ardatan/graphql-tools/issues/2534
    const reformattedDirectivesInExtensions = [];
    for (const [name, argsOrArrayOfArgs] of Object.entries(directivesInExtensions)) {
        if (Array.isArray(argsOrArrayOfArgs)) {
            for (const args of argsOrArrayOfArgs) {
                reformattedDirectivesInExtensions.push({ name, args });
            }
        }
        else {
            reformattedDirectivesInExtensions.push({ name, args: argsOrArrayOfArgs });
        }
    }
    return _getDirectiveInExtensions(reformattedDirectivesInExtensions, directiveName);
}
function getDirectives(schema, node, pathToDirectivesInExtensions = ['directives']) {
    const directivesInExtensions = getDirectivesInExtensions(node, pathToDirectivesInExtensions);
    if (directivesInExtensions != null && directivesInExtensions.length > 0) {
        return directivesInExtensions;
    }
    const schemaDirectives = schema && schema.getDirectives ? schema.getDirectives() : [];
    const schemaDirectiveMap = schemaDirectives.reduce((schemaDirectiveMap, schemaDirective) => {
        schemaDirectiveMap[schemaDirective.name] = schemaDirective;
        return schemaDirectiveMap;
    }, {});
    let astNodes = [];
    if (node.astNode) {
        astNodes.push(node.astNode);
    }
    if ('extensionASTNodes' in node && node.extensionASTNodes) {
        astNodes = [...astNodes, ...node.extensionASTNodes];
    }
    const result = [];
    for (const astNode of astNodes) {
        if (astNode.directives) {
            for (const directiveNode of astNode.directives) {
                const schemaDirective = schemaDirectiveMap[directiveNode.name.value];
                if (schemaDirective) {
                    result.push({ name: directiveNode.name.value, args: getArgumentValues(schemaDirective, directiveNode) });
                }
            }
        }
    }
    return result;
}
function getDirective(schema, node, directiveName, pathToDirectivesInExtensions = ['directives']) {
    const directiveInExtensions = getDirectiveInExtensions(node, directiveName, pathToDirectivesInExtensions);
    if (directiveInExtensions != null) {
        return directiveInExtensions;
    }
    const schemaDirective = schema && schema.getDirective ? schema.getDirective(directiveName) : undefined;
    if (schemaDirective == null) {
        return undefined;
    }
    let astNodes = [];
    if (node.astNode) {
        astNodes.push(node.astNode);
    }
    if ('extensionASTNodes' in node && node.extensionASTNodes) {
        astNodes = [...astNodes, ...node.extensionASTNodes];
    }
    const result = [];
    for (const astNode of astNodes) {
        if (astNode.directives) {
            for (const directiveNode of astNode.directives) {
                if (directiveNode.name.value === directiveName) {
                    result.push(getArgumentValues(schemaDirective, directiveNode));
                }
            }
        }
    }
    if (!result.length) {
        return undefined;
    }
    return result;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/astFromValueUntyped.js

/**
 * Produces a GraphQL Value AST given a JavaScript object.
 * Function will match JavaScript/JSON values to GraphQL AST schema format
 * by using the following mapping.
 *
 * | JSON Value    | GraphQL Value        |
 * | ------------- | -------------------- |
 * | Object        | Input Object         |
 * | Array         | List                 |
 * | Boolean       | Boolean              |
 * | String        | String               |
 * | Number        | Int / Float          |
 * | null          | NullValue            |
 *
 */
function astFromValueUntyped(value) {
    // only explicit null, not undefined, NaN
    if (value === null) {
        return { kind: graphql/* Kind.NULL */.hYY.NULL };
    }
    // undefined
    if (value === undefined) {
        return null;
    }
    // Convert JavaScript array to GraphQL list. If the GraphQLType is a list, but
    // the value is not an array, convert the value using the list's item type.
    if (Array.isArray(value)) {
        const valuesNodes = [];
        for (const item of value) {
            const itemNode = astFromValueUntyped(item);
            if (itemNode != null) {
                valuesNodes.push(itemNode);
            }
        }
        return { kind: graphql/* Kind.LIST */.hYY.LIST, values: valuesNodes };
    }
    if (typeof value === 'object') {
        const fieldNodes = [];
        for (const fieldName in value) {
            const fieldValue = value[fieldName];
            const ast = astFromValueUntyped(fieldValue);
            if (ast) {
                fieldNodes.push({
                    kind: graphql/* Kind.OBJECT_FIELD */.hYY.OBJECT_FIELD,
                    name: { kind: graphql/* Kind.NAME */.hYY.NAME, value: fieldName },
                    value: ast,
                });
            }
        }
        return { kind: graphql/* Kind.OBJECT */.hYY.OBJECT, fields: fieldNodes };
    }
    // Others serialize based on their corresponding JavaScript scalar types.
    if (typeof value === 'boolean') {
        return { kind: graphql/* Kind.BOOLEAN */.hYY.BOOLEAN, value };
    }
    // JavaScript numbers can be Int or Float values.
    if (typeof value === 'number' && isFinite(value)) {
        const stringNum = String(value);
        return integerStringRegExp.test(stringNum)
            ? { kind: graphql/* Kind.INT */.hYY.INT, value: stringNum }
            : { kind: graphql/* Kind.FLOAT */.hYY.FLOAT, value: stringNum };
    }
    if (typeof value === 'string') {
        return { kind: graphql/* Kind.STRING */.hYY.STRING, value };
    }
    throw new TypeError(`Cannot convert value to AST: ${value}.`);
}
/**
 * IntValue:
 *   - NegativeSign? 0
 *   - NegativeSign? NonZeroDigit ( Digit+ )?
 */
const integerStringRegExp = /^-?(?:0|[1-9][0-9]*)$/;

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/print-schema-with-directives.js






function getDocumentNodeFromSchema(schema, options = {}) {
    const pathToDirectivesInExtensions = options.pathToDirectivesInExtensions;
    const typesMap = schema.getTypeMap();
    const schemaNode = astFromSchema(schema, pathToDirectivesInExtensions);
    const definitions = schemaNode != null ? [schemaNode] : [];
    const directives = schema.getDirectives();
    for (const directive of directives) {
        if ((0,graphql/* isSpecifiedDirective */.xgT)(directive)) {
            continue;
        }
        definitions.push(astFromDirective(directive, schema, pathToDirectivesInExtensions));
    }
    for (const typeName in typesMap) {
        const type = typesMap[typeName];
        const isPredefinedScalar = (0,graphql/* isSpecifiedScalarType */.u1m)(type);
        const isIntrospection = (0,graphql/* isIntrospectionType */.s9b)(type);
        if (isPredefinedScalar || isIntrospection) {
            continue;
        }
        if ((0,graphql/* isObjectType */.lpB)(type)) {
            definitions.push(astFromObjectType(type, schema, pathToDirectivesInExtensions));
        }
        else if ((0,graphql/* isInterfaceType */.oTV)(type)) {
            definitions.push(astFromInterfaceType(type, schema, pathToDirectivesInExtensions));
        }
        else if ((0,graphql/* isUnionType */.EN0)(type)) {
            definitions.push(astFromUnionType(type, schema, pathToDirectivesInExtensions));
        }
        else if ((0,graphql/* isInputObjectType */.hLV)(type)) {
            definitions.push(astFromInputObjectType(type, schema, pathToDirectivesInExtensions));
        }
        else if ((0,graphql/* isEnumType */.EMj)(type)) {
            definitions.push(astFromEnumType(type, schema, pathToDirectivesInExtensions));
        }
        else if ((0,graphql/* isScalarType */.KAw)(type)) {
            definitions.push(astFromScalarType(type, schema, pathToDirectivesInExtensions));
        }
        else {
            throw new Error(`Unknown type ${type}.`);
        }
    }
    return {
        kind: graphql/* Kind.DOCUMENT */.hYY.DOCUMENT,
        definitions,
    };
}
// this approach uses the default schema printer rather than a custom solution, so may be more backwards compatible
// currently does not allow customization of printSchema options having to do with comments.
function printSchemaWithDirectives(schema, options = {}) {
    const documentNode = getDocumentNodeFromSchema(schema, options);
    return print(documentNode);
}
function astFromSchema(schema, pathToDirectivesInExtensions) {
    var _a, _b;
    const operationTypeMap = new Map([
        ['query', undefined],
        ['mutation', undefined],
        ['subscription', undefined],
    ]);
    const nodes = [];
    if (schema.astNode != null) {
        nodes.push(schema.astNode);
    }
    if (schema.extensionASTNodes != null) {
        for (const extensionASTNode of schema.extensionASTNodes) {
            nodes.push(extensionASTNode);
        }
    }
    for (const node of nodes) {
        if (node.operationTypes) {
            for (const operationTypeDefinitionNode of node.operationTypes) {
                operationTypeMap.set(operationTypeDefinitionNode.operation, operationTypeDefinitionNode);
            }
        }
    }
    const rootTypeMap = getRootTypeMap(schema);
    for (const [operationTypeNode, operationTypeDefinitionNode] of operationTypeMap) {
        const rootType = rootTypeMap.get(operationTypeNode);
        if (rootType != null) {
            const rootTypeAST = astFromType(rootType);
            if (operationTypeDefinitionNode != null) {
                operationTypeDefinitionNode.type = rootTypeAST;
            }
            else {
                operationTypeMap.set(operationTypeNode, {
                    kind: graphql/* Kind.OPERATION_TYPE_DEFINITION */.hYY.OPERATION_TYPE_DEFINITION,
                    operation: operationTypeNode,
                    type: rootTypeAST,
                });
            }
        }
    }
    const operationTypes = [...operationTypeMap.values()].filter(isSome);
    const directives = getDirectiveNodes(schema, schema, pathToDirectivesInExtensions);
    if (!operationTypes.length && !directives.length) {
        return null;
    }
    const schemaNode = {
        kind: operationTypes != null ? graphql/* Kind.SCHEMA_DEFINITION */.hYY.SCHEMA_DEFINITION : graphql/* Kind.SCHEMA_EXTENSION */.hYY.SCHEMA_EXTENSION,
        operationTypes,
        // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
        directives: directives,
    };
    // This code is so weird because it needs to support GraphQL.js 14
    // In GraphQL.js 14 there is no `description` value on schemaNode
    schemaNode.description =
        ((_b = (_a = schema.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : schema.description != null)
            ? {
                kind: graphql/* Kind.STRING */.hYY.STRING,
                value: schema.description,
                block: true,
            }
            : undefined;
    return schemaNode;
}
function astFromDirective(directive, schema, pathToDirectivesInExtensions) {
    var _a, _b, _c, _d;
    return {
        kind: graphql/* Kind.DIRECTIVE_DEFINITION */.hYY.DIRECTIVE_DEFINITION,
        description: (_b = (_a = directive.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : (directive.description
            ? {
                kind: graphql/* Kind.STRING */.hYY.STRING,
                value: directive.description,
            }
            : undefined),
        name: {
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: directive.name,
        },
        arguments: (_c = directive.args) === null || _c === void 0 ? void 0 : _c.map(arg => astFromArg(arg, schema, pathToDirectivesInExtensions)),
        repeatable: directive.isRepeatable,
        locations: ((_d = directive.locations) === null || _d === void 0 ? void 0 : _d.map(location => ({
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: location,
        }))) || [],
    };
}
function getDirectiveNodes(entity, schema, pathToDirectivesInExtensions) {
    const directivesInExtensions = getDirectivesInExtensions(entity, pathToDirectivesInExtensions);
    let nodes = [];
    if (entity.astNode != null) {
        nodes.push(entity.astNode);
    }
    if ('extensionASTNodes' in entity && entity.extensionASTNodes != null) {
        nodes = nodes.concat(entity.extensionASTNodes);
    }
    let directives;
    if (directivesInExtensions != null) {
        directives = makeDirectiveNodes(schema, directivesInExtensions);
    }
    else {
        directives = [];
        for (const node of nodes) {
            if (node.directives) {
                directives.push(...node.directives);
            }
        }
    }
    return directives;
}
function getDeprecatableDirectiveNodes(entity, schema, pathToDirectivesInExtensions) {
    var _a, _b;
    let directiveNodesBesidesDeprecated = [];
    let deprecatedDirectiveNode = null;
    const directivesInExtensions = getDirectivesInExtensions(entity, pathToDirectivesInExtensions);
    let directives;
    if (directivesInExtensions != null) {
        directives = makeDirectiveNodes(schema, directivesInExtensions);
    }
    else {
        directives = (_a = entity.astNode) === null || _a === void 0 ? void 0 : _a.directives;
    }
    if (directives != null) {
        directiveNodesBesidesDeprecated = directives.filter(directive => directive.name.value !== 'deprecated');
        if (entity.deprecationReason != null) {
            deprecatedDirectiveNode = (_b = directives.filter(directive => directive.name.value === 'deprecated')) === null || _b === void 0 ? void 0 : _b[0];
        }
    }
    if (entity.deprecationReason != null &&
        deprecatedDirectiveNode == null) {
        deprecatedDirectiveNode = makeDeprecatedDirective(entity.deprecationReason);
    }
    return deprecatedDirectiveNode == null
        ? directiveNodesBesidesDeprecated
        : [deprecatedDirectiveNode].concat(directiveNodesBesidesDeprecated);
}
function astFromArg(arg, schema, pathToDirectivesInExtensions) {
    var _a, _b, _c;
    return {
        kind: graphql/* Kind.INPUT_VALUE_DEFINITION */.hYY.INPUT_VALUE_DEFINITION,
        description: (_b = (_a = arg.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : (arg.description
            ? {
                kind: graphql/* Kind.STRING */.hYY.STRING,
                value: arg.description,
                block: true,
            }
            : undefined),
        name: {
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: arg.name,
        },
        type: astFromType(arg.type),
        // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
        defaultValue: arg.defaultValue !== undefined ? (_c = (0,graphql/* astFromValue */.Jdw)(arg.defaultValue, arg.type)) !== null && _c !== void 0 ? _c : undefined : undefined,
        directives: getDeprecatableDirectiveNodes(arg, schema, pathToDirectivesInExtensions),
    };
}
function astFromObjectType(type, schema, pathToDirectivesInExtensions) {
    var _a, _b;
    return {
        kind: graphql/* Kind.OBJECT_TYPE_DEFINITION */.hYY.OBJECT_TYPE_DEFINITION,
        description: (_b = (_a = type.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : (type.description
            ? {
                kind: graphql/* Kind.STRING */.hYY.STRING,
                value: type.description,
                block: true,
            }
            : undefined),
        name: {
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: type.name,
        },
        fields: Object.values(type.getFields()).map(field => astFromField(field, schema, pathToDirectivesInExtensions)),
        interfaces: Object.values(type.getInterfaces()).map(iFace => astFromType(iFace)),
        directives: getDirectiveNodes(type, schema, pathToDirectivesInExtensions),
    };
}
function astFromInterfaceType(type, schema, pathToDirectivesInExtensions) {
    var _a, _b;
    const node = {
        kind: graphql/* Kind.INTERFACE_TYPE_DEFINITION */.hYY.INTERFACE_TYPE_DEFINITION,
        description: (_b = (_a = type.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : (type.description
            ? {
                kind: graphql/* Kind.STRING */.hYY.STRING,
                value: type.description,
                block: true,
            }
            : undefined),
        name: {
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: type.name,
        },
        fields: Object.values(type.getFields()).map(field => astFromField(field, schema, pathToDirectivesInExtensions)),
        directives: getDirectiveNodes(type, schema, pathToDirectivesInExtensions),
    };
    if ('getInterfaces' in type) {
        node.interfaces = Object.values(type.getInterfaces()).map(iFace => astFromType(iFace));
    }
    return node;
}
function astFromUnionType(type, schema, pathToDirectivesInExtensions) {
    var _a, _b;
    return {
        kind: graphql/* Kind.UNION_TYPE_DEFINITION */.hYY.UNION_TYPE_DEFINITION,
        description: (_b = (_a = type.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : (type.description
            ? {
                kind: graphql/* Kind.STRING */.hYY.STRING,
                value: type.description,
                block: true,
            }
            : undefined),
        name: {
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: type.name,
        },
        // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
        directives: getDirectiveNodes(type, schema, pathToDirectivesInExtensions),
        types: type.getTypes().map(type => astFromType(type)),
    };
}
function astFromInputObjectType(type, schema, pathToDirectivesInExtensions) {
    var _a, _b;
    return {
        kind: graphql/* Kind.INPUT_OBJECT_TYPE_DEFINITION */.hYY.INPUT_OBJECT_TYPE_DEFINITION,
        description: (_b = (_a = type.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : (type.description
            ? {
                kind: graphql/* Kind.STRING */.hYY.STRING,
                value: type.description,
                block: true,
            }
            : undefined),
        name: {
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: type.name,
        },
        fields: Object.values(type.getFields()).map(field => astFromInputField(field, schema, pathToDirectivesInExtensions)),
        // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
        directives: getDirectiveNodes(type, schema, pathToDirectivesInExtensions),
    };
}
function astFromEnumType(type, schema, pathToDirectivesInExtensions) {
    var _a, _b;
    return {
        kind: graphql/* Kind.ENUM_TYPE_DEFINITION */.hYY.ENUM_TYPE_DEFINITION,
        description: (_b = (_a = type.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : (type.description
            ? {
                kind: graphql/* Kind.STRING */.hYY.STRING,
                value: type.description,
                block: true,
            }
            : undefined),
        name: {
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: type.name,
        },
        values: Object.values(type.getValues()).map(value => astFromEnumValue(value, schema, pathToDirectivesInExtensions)),
        // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
        directives: getDirectiveNodes(type, schema, pathToDirectivesInExtensions),
    };
}
function astFromScalarType(type, schema, pathToDirectivesInExtensions) {
    var _a, _b, _c;
    const directivesInExtensions = getDirectivesInExtensions(type, pathToDirectivesInExtensions);
    const directives = directivesInExtensions
        ? makeDirectiveNodes(schema, directivesInExtensions)
        : ((_a = type.astNode) === null || _a === void 0 ? void 0 : _a.directives) || [];
    const specifiedByValue = (type['specifiedByUrl'] || type['specifiedByURL']);
    if (specifiedByValue && !directives.some(directiveNode => directiveNode.name.value === 'specifiedBy')) {
        const specifiedByArgs = {
            url: specifiedByValue,
        };
        directives.push(makeDirectiveNode('specifiedBy', specifiedByArgs));
    }
    return {
        kind: graphql/* Kind.SCALAR_TYPE_DEFINITION */.hYY.SCALAR_TYPE_DEFINITION,
        description: (_c = (_b = type.astNode) === null || _b === void 0 ? void 0 : _b.description) !== null && _c !== void 0 ? _c : (type.description
            ? {
                kind: graphql/* Kind.STRING */.hYY.STRING,
                value: type.description,
                block: true,
            }
            : undefined),
        name: {
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: type.name,
        },
        // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
        directives: directives,
    };
}
function astFromField(field, schema, pathToDirectivesInExtensions) {
    var _a, _b;
    return {
        kind: graphql/* Kind.FIELD_DEFINITION */.hYY.FIELD_DEFINITION,
        description: (_b = (_a = field.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : (field.description
            ? {
                kind: graphql/* Kind.STRING */.hYY.STRING,
                value: field.description,
                block: true,
            }
            : undefined),
        name: {
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: field.name,
        },
        arguments: field.args.map(arg => astFromArg(arg, schema, pathToDirectivesInExtensions)),
        type: astFromType(field.type),
        // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
        directives: getDeprecatableDirectiveNodes(field, schema, pathToDirectivesInExtensions),
    };
}
function astFromInputField(field, schema, pathToDirectivesInExtensions) {
    var _a, _b, _c;
    return {
        kind: graphql/* Kind.INPUT_VALUE_DEFINITION */.hYY.INPUT_VALUE_DEFINITION,
        description: (_b = (_a = field.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : (field.description
            ? {
                kind: graphql/* Kind.STRING */.hYY.STRING,
                value: field.description,
                block: true,
            }
            : undefined),
        name: {
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: field.name,
        },
        type: astFromType(field.type),
        // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
        directives: getDeprecatableDirectiveNodes(field, schema, pathToDirectivesInExtensions),
        defaultValue: (_c = (0,graphql/* astFromValue */.Jdw)(field.defaultValue, field.type)) !== null && _c !== void 0 ? _c : undefined,
    };
}
function astFromEnumValue(value, schema, pathToDirectivesInExtensions) {
    var _a, _b;
    return {
        kind: graphql/* Kind.ENUM_VALUE_DEFINITION */.hYY.ENUM_VALUE_DEFINITION,
        description: (_b = (_a = value.astNode) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : (value.description
            ? {
                kind: graphql/* Kind.STRING */.hYY.STRING,
                value: value.description,
                block: true,
            }
            : undefined),
        name: {
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: value.name,
        },
        // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
        directives: getDeprecatableDirectiveNodes(value, schema, pathToDirectivesInExtensions),
    };
}
function makeDeprecatedDirective(deprecationReason) {
    return makeDirectiveNode('deprecated', { reason: deprecationReason }, graphql/* GraphQLDeprecatedDirective */.fgm);
}
function makeDirectiveNode(name, args, directive) {
    const directiveArguments = [];
    if (directive != null) {
        for (const arg of directive.args) {
            const argName = arg.name;
            const argValue = args[argName];
            if (argValue !== undefined) {
                const value = (0,graphql/* astFromValue */.Jdw)(argValue, arg.type);
                if (value) {
                    directiveArguments.push({
                        kind: graphql/* Kind.ARGUMENT */.hYY.ARGUMENT,
                        name: {
                            kind: graphql/* Kind.NAME */.hYY.NAME,
                            value: argName,
                        },
                        value,
                    });
                }
            }
        }
    }
    else {
        for (const argName in args) {
            const argValue = args[argName];
            const value = astFromValueUntyped(argValue);
            if (value) {
                directiveArguments.push({
                    kind: graphql/* Kind.ARGUMENT */.hYY.ARGUMENT,
                    name: {
                        kind: graphql/* Kind.NAME */.hYY.NAME,
                        value: argName,
                    },
                    value,
                });
            }
        }
    }
    return {
        kind: graphql/* Kind.DIRECTIVE */.hYY.DIRECTIVE,
        name: {
            kind: graphql/* Kind.NAME */.hYY.NAME,
            value: name,
        },
        arguments: directiveArguments,
    };
}
function makeDirectiveNodes(schema, directiveValues) {
    const directiveNodes = [];
    for (const directiveName in directiveValues) {
        const arrayOrSingleValue = directiveValues[directiveName];
        const directive = schema === null || schema === void 0 ? void 0 : schema.getDirective(directiveName);
        if (Array.isArray(arrayOrSingleValue)) {
            for (const value of arrayOrSingleValue) {
                directiveNodes.push(makeDirectiveNode(directiveName, value, directive));
            }
        }
        else {
            directiveNodes.push(makeDirectiveNode(directiveName, arrayOrSingleValue, directive));
        }
    }
    return directiveNodes;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/isDocumentNode.js

function isDocumentNode(object) {
    return object && typeof object === 'object' && 'kind' in object && object.kind === graphql/* Kind.DOCUMENT */.hYY.DOCUMENT;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-typedefs.js





function mergeTypeDefs(typeSource, config) {
    resetComments();
    const doc = {
        kind: graphql/* Kind.DOCUMENT */.hYY.DOCUMENT,
        definitions: mergeGraphQLTypes(typeSource, {
            useSchemaDefinition: true,
            forceSchemaDefinition: false,
            throwOnConflict: false,
            commentDescriptions: false,
            ...config,
        }),
    };
    let result;
    if (config === null || config === void 0 ? void 0 : config.commentDescriptions) {
        result = printWithComments(doc);
    }
    else {
        result = doc;
    }
    resetComments();
    return result;
}
function visitTypeSources(typeSource, options, allNodes = [], visitedTypeSources = new Set()) {
    if (typeSource && !visitedTypeSources.has(typeSource)) {
        visitedTypeSources.add(typeSource);
        if (typeof typeSource === 'function') {
            visitTypeSources(typeSource(), options, allNodes, visitedTypeSources);
        }
        else if (Array.isArray(typeSource)) {
            for (const type of typeSource) {
                visitTypeSources(type, options, allNodes, visitedTypeSources);
            }
        }
        else if ((0,graphql/* isSchema */.nN2)(typeSource)) {
            const documentNode = getDocumentNodeFromSchema(typeSource, options);
            visitTypeSources(documentNode.definitions, options, allNodes, visitedTypeSources);
        }
        else if (isStringTypes(typeSource) || isSourceTypes(typeSource)) {
            const documentNode = (0,graphql/* parse */.Qc3)(typeSource, options);
            visitTypeSources(documentNode.definitions, options, allNodes, visitedTypeSources);
        }
        else if (typeof typeSource === 'object' && (0,graphql/* isDefinitionNode */.Irn)(typeSource)) {
            allNodes.push(typeSource);
        }
        else if (isDocumentNode(typeSource)) {
            visitTypeSources(typeSource.definitions, options, allNodes, visitedTypeSources);
        }
        else {
            throw new Error(`typeDefs must contain only strings, documents, schemas, or functions, got ${typeof typeSource}`);
        }
    }
    return allNodes;
}
function mergeGraphQLTypes(typeSource, config) {
    var _a, _b, _c;
    resetComments();
    const allNodes = visitTypeSources(typeSource, config);
    const mergedNodes = mergeGraphQLNodes(allNodes, config);
    if (config === null || config === void 0 ? void 0 : config.useSchemaDefinition) {
        // XXX: right now we don't handle multiple schema definitions
        const schemaDef = mergedNodes[schemaDefSymbol] || {
            kind: graphql/* Kind.SCHEMA_DEFINITION */.hYY.SCHEMA_DEFINITION,
            operationTypes: [],
        };
        const operationTypes = schemaDef.operationTypes;
        for (const opTypeDefNodeType in DEFAULT_OPERATION_TYPE_NAME_MAP) {
            const opTypeDefNode = operationTypes.find(operationType => operationType.operation === opTypeDefNodeType);
            if (!opTypeDefNode) {
                const possibleRootTypeName = DEFAULT_OPERATION_TYPE_NAME_MAP[opTypeDefNodeType];
                const existingPossibleRootType = mergedNodes[possibleRootTypeName];
                if (existingPossibleRootType != null && existingPossibleRootType.name != null) {
                    operationTypes.push({
                        kind: graphql/* Kind.OPERATION_TYPE_DEFINITION */.hYY.OPERATION_TYPE_DEFINITION,
                        type: {
                            kind: graphql/* Kind.NAMED_TYPE */.hYY.NAMED_TYPE,
                            name: existingPossibleRootType.name,
                        },
                        operation: opTypeDefNodeType,
                    });
                }
            }
        }
        if (((_a = schemaDef === null || schemaDef === void 0 ? void 0 : schemaDef.operationTypes) === null || _a === void 0 ? void 0 : _a.length) != null && schemaDef.operationTypes.length > 0) {
            mergedNodes[schemaDefSymbol] = schemaDef;
        }
    }
    if ((config === null || config === void 0 ? void 0 : config.forceSchemaDefinition) && !((_c = (_b = mergedNodes[schemaDefSymbol]) === null || _b === void 0 ? void 0 : _b.operationTypes) === null || _c === void 0 ? void 0 : _c.length)) {
        mergedNodes[schemaDefSymbol] = {
            kind: graphql/* Kind.SCHEMA_DEFINITION */.hYY.SCHEMA_DEFINITION,
            operationTypes: [
                {
                    kind: graphql/* Kind.OPERATION_TYPE_DEFINITION */.hYY.OPERATION_TYPE_DEFINITION,
                    operation: 'query',
                    type: {
                        kind: graphql/* Kind.NAMED_TYPE */.hYY.NAMED_TYPE,
                        name: {
                            kind: graphql/* Kind.NAME */.hYY.NAME,
                            value: 'Query',
                        },
                    },
                },
            ],
        };
    }
    const mergedNodeDefinitions = Object.values(mergedNodes);
    if (config === null || config === void 0 ? void 0 : config.sort) {
        const sortFn = typeof config.sort === 'function' ? config.sort : defaultStringComparator;
        mergedNodeDefinitions.sort((a, b) => { var _a, _b; return sortFn((_a = a.name) === null || _a === void 0 ? void 0 : _a.value, (_b = b.name) === null || _b === void 0 ? void 0 : _b.value); });
    }
    return mergedNodeDefinitions;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/mergeDeep.js

function mergeDeep(sources, respectPrototype = false) {
    const target = sources[0] || {};
    const output = {};
    if (respectPrototype) {
        Object.setPrototypeOf(output, Object.create(Object.getPrototypeOf(target)));
    }
    for (const source of sources) {
        if (isObject(target) && isObject(source)) {
            if (respectPrototype) {
                const outputPrototype = Object.getPrototypeOf(output);
                const sourcePrototype = Object.getPrototypeOf(source);
                if (sourcePrototype) {
                    for (const key of Object.getOwnPropertyNames(sourcePrototype)) {
                        const descriptor = Object.getOwnPropertyDescriptor(sourcePrototype, key);
                        if (isSome(descriptor)) {
                            Object.defineProperty(outputPrototype, key, descriptor);
                        }
                    }
                }
            }
            for (const key in source) {
                if (isObject(source[key])) {
                    if (!(key in output)) {
                        Object.assign(output, { [key]: source[key] });
                    }
                    else {
                        output[key] = mergeDeep([output[key], source[key]], respectPrototype);
                    }
                }
                else {
                    Object.assign(output, { [key]: source[key] });
                }
            }
        }
    }
    return output;
}
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/merge-resolvers.js

/**
 * Deep merges multiple resolver definition objects into a single definition.
 * @param resolversDefinitions Resolver definitions to be merged
 * @param options Additional options
 *
 * ```js
 * const { mergeResolvers } = require('@graphql-tools/merge');
 * const clientResolver = require('./clientResolver');
 * const productResolver = require('./productResolver');
 *
 * const resolvers = mergeResolvers([
 *  clientResolver,
 *  productResolver,
 * ]);
 * ```
 *
 * If you don't want to manually create the array of resolver objects, you can
 * also use this function along with loadFiles:
 *
 * ```js
 * const path = require('path');
 * const { mergeResolvers } = require('@graphql-tools/merge');
 * const { loadFilesSync } = require('@graphql-tools/load-files');
 *
 * const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'));
 *
 * const resolvers = mergeResolvers(resolversArray)
 * ```
 */
function mergeResolvers(resolversDefinitions, options) {
    if (!resolversDefinitions || (Array.isArray(resolversDefinitions) && resolversDefinitions.length === 0)) {
        return {};
    }
    if (!Array.isArray(resolversDefinitions)) {
        return resolversDefinitions;
    }
    if (resolversDefinitions.length === 1) {
        return resolversDefinitions[0] || {};
    }
    const resolvers = new Array();
    for (let resolversDefinition of resolversDefinitions) {
        if (Array.isArray(resolversDefinition)) {
            resolversDefinition = mergeResolvers(resolversDefinition);
        }
        if (typeof resolversDefinition === 'object' && resolversDefinition) {
            resolvers.push(resolversDefinition);
        }
    }
    const result = mergeDeep(resolvers, true);
    if (options === null || options === void 0 ? void 0 : options.exclusions) {
        for (const exclusion of options.exclusions) {
            const [typeName, fieldName] = exclusion.split('.');
            if (!fieldName || fieldName === '*') {
                delete result[typeName];
            }
            else if (result[typeName]) {
                delete result[typeName][fieldName];
            }
        }
    }
    return result;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+merge@8.3.1_graphql@16.6.0/node_modules/@graphql-tools/merge/esm/extensions.js


function travelSchemaPossibleExtensions(schema, hooks) {
    hooks.onSchema(schema);
    const typesMap = schema.getTypeMap();
    for (const [, type] of Object.entries(typesMap)) {
        const isPredefinedScalar = (0,graphql/* isScalarType */.KAw)(type) && (0,graphql/* isSpecifiedScalarType */.u1m)(type);
        const isIntrospection = (0,graphql/* isIntrospectionType */.s9b)(type);
        if (isPredefinedScalar || isIntrospection) {
            continue;
        }
        if ((0,graphql/* isObjectType */.lpB)(type)) {
            hooks.onObjectType(type);
            const fields = type.getFields();
            for (const [, field] of Object.entries(fields)) {
                hooks.onObjectField(type, field);
                const args = field.args || [];
                for (const arg of args) {
                    hooks.onObjectFieldArg(type, field, arg);
                }
            }
        }
        else if ((0,graphql/* isInterfaceType */.oTV)(type)) {
            hooks.onInterface(type);
            const fields = type.getFields();
            for (const [, field] of Object.entries(fields)) {
                hooks.onInterfaceField(type, field);
                const args = field.args || [];
                for (const arg of args) {
                    hooks.onInterfaceFieldArg(type, field, arg);
                }
            }
        }
        else if ((0,graphql/* isInputObjectType */.hLV)(type)) {
            hooks.onInputType(type);
            const fields = type.getFields();
            for (const [, field] of Object.entries(fields)) {
                hooks.onInputFieldType(type, field);
            }
        }
        else if ((0,graphql/* isUnionType */.EN0)(type)) {
            hooks.onUnion(type);
        }
        else if ((0,graphql/* isScalarType */.KAw)(type)) {
            hooks.onScalar(type);
        }
        else if ((0,graphql/* isEnumType */.EMj)(type)) {
            hooks.onEnum(type);
            for (const value of type.getValues()) {
                hooks.onEnumValue(type, value);
            }
        }
    }
}
function mergeExtensions(extensions) {
    return mergeDeep(extensions);
}
function applyExtensionObject(obj, extensions) {
    if (!obj) {
        return;
    }
    obj.extensions = mergeDeep([obj.extensions || {}, extensions || {}]);
}
function applyExtensions(schema, extensions) {
    applyExtensionObject(schema, extensions.schemaExtensions);
    for (const [typeName, data] of Object.entries(extensions.types || {})) {
        const type = schema.getType(typeName);
        if (type) {
            applyExtensionObject(type, data.extensions);
            if (data.type === 'object' || data.type === 'interface') {
                for (const [fieldName, fieldData] of Object.entries(data.fields)) {
                    const field = type.getFields()[fieldName];
                    if (field) {
                        applyExtensionObject(field, fieldData.extensions);
                        for (const [arg, argData] of Object.entries(fieldData.arguments)) {
                            applyExtensionObject(field.args.find(a => a.name === arg), argData);
                        }
                    }
                }
            }
            else if (data.type === 'input') {
                for (const [fieldName, fieldData] of Object.entries(data.fields)) {
                    const field = type.getFields()[fieldName];
                    applyExtensionObject(field, fieldData.extensions);
                }
            }
            else if (data.type === 'enum') {
                for (const [valueName, valueData] of Object.entries(data.values)) {
                    const value = type.getValue(valueName);
                    applyExtensionObject(value, valueData);
                }
            }
        }
    }
    return schema;
}
function extractExtensionsFromSchema(schema) {
    const result = {
        schemaExtensions: {},
        types: {},
    };
    travelSchemaPossibleExtensions(schema, {
        onSchema: schema => (result.schemaExtensions = schema.extensions || {}),
        onObjectType: type => (result.types[type.name] = { fields: {}, type: 'object', extensions: type.extensions || {} }),
        onObjectField: (type, field) => (result.types[type.name].fields[field.name] = {
            arguments: {},
            extensions: field.extensions || {},
        }),
        onObjectFieldArg: (type, field, arg) => (result.types[type.name].fields[field.name].arguments[arg.name] = arg.extensions || {}),
        onInterface: type => (result.types[type.name] = { fields: {}, type: 'interface', extensions: type.extensions || {} }),
        onInterfaceField: (type, field) => (result.types[type.name].fields[field.name] = {
            arguments: {},
            extensions: field.extensions || {},
        }),
        onInterfaceFieldArg: (type, field, arg) => (result.types[type.name].fields[field.name].arguments[arg.name] =
            arg.extensions || {}),
        onEnum: type => (result.types[type.name] = { values: {}, type: 'enum', extensions: type.extensions || {} }),
        onEnumValue: (type, value) => (result.types[type.name].values[value.name] = value.extensions || {}),
        onScalar: type => (result.types[type.name] = { type: 'scalar', extensions: type.extensions || {} }),
        onUnion: type => (result.types[type.name] = { type: 'union', extensions: type.extensions || {} }),
        onInputType: type => (result.types[type.name] = { fields: {}, type: 'input', extensions: type.extensions || {} }),
        onInputFieldType: (type, field) => (result.types[type.name].fields[field.name] = { extensions: field.extensions || {} }),
    });
    return result;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+schema@8.5.1_graphql@16.6.0/node_modules/@graphql-tools/schema/esm/makeExecutableSchema.js





/**
 * Builds a schema from the provided type definitions and resolvers.
 *
 * The type definitions are written using Schema Definition Language (SDL). They
 * can be provided as a string, a `DocumentNode`, a function, or an array of any
 * of these. If a function is provided, it will be passed no arguments and
 * should return an array of strings or `DocumentNode`s.
 *
 * Note: You can use `graphql-tag` to not only parse a string into a
 * `DocumentNode` but also to provide additional syntax highlighting in your
 * editor (with the appropriate editor plugin).
 *
 * ```js
 * const typeDefs = gql`
 *   type Query {
 *     posts: [Post]
 *     author(id: Int!): Author
 *   }
 * `;
 * ```
 *
 * The `resolvers` object should be a map of type names to nested object, which
 * themselves map the type's fields to their appropriate resolvers.
 * See the [Resolvers](/docs/resolvers) section of the documentation for more details.
 *
 * ```js
 * const resolvers = {
 *   Query: {
 *     posts: (obj, args, ctx, info) => getAllPosts(),
 *     author: (obj, args, ctx, info) => getAuthorById(args.id)
 *   }
 * };
 * ```
 *
 * Once you've defined both the `typeDefs` and `resolvers`, you can create your
 * schema:
 *
 * ```js
 * const schema = makeExecutableSchema({
 *   typeDefs,
 *   resolvers,
 * })
 * ```
 */
function makeExecutableSchema({ typeDefs, resolvers = {}, resolverValidationOptions = {}, parseOptions = {}, inheritResolversFromInterfaces = false, pruningOptions, updateResolversInPlace = false, schemaExtensions, }) {
    // Validate and clean up arguments
    if (typeof resolverValidationOptions !== 'object') {
        throw new Error('Expected `resolverValidationOptions` to be an object');
    }
    if (!typeDefs) {
        throw new Error('Must provide typeDefs');
    }
    let schema;
    if ((0,graphql/* isSchema */.nN2)(typeDefs)) {
        schema = typeDefs;
    }
    else if (parseOptions === null || parseOptions === void 0 ? void 0 : parseOptions.commentDescriptions) {
        const mergedTypeDefs = mergeTypeDefs(typeDefs, {
            ...parseOptions,
            commentDescriptions: true,
        });
        schema = (0,graphql/* buildSchema */.I6)(mergedTypeDefs, parseOptions);
    }
    else {
        const mergedTypeDefs = mergeTypeDefs(typeDefs, parseOptions);
        schema = (0,graphql/* buildASTSchema */.Mkb)(mergedTypeDefs, parseOptions);
    }
    if (pruningOptions) {
        schema = pruneSchema(schema);
    }
    // We allow passing in an array of resolver maps, in which case we merge them
    schema = addResolversToSchema({
        schema,
        resolvers: mergeResolvers(resolvers),
        resolverValidationOptions,
        inheritResolversFromInterfaces,
        updateResolversInPlace,
    });
    if (Object.keys(resolverValidationOptions).length > 0) {
        assertResolversPresent(schema, resolverValidationOptions);
    }
    if (schemaExtensions) {
        schemaExtensions = mergeExtensions(asArray(schemaExtensions));
        applyExtensions(schema, schemaExtensions);
    }
    return schema;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+utils@8.9.0_graphql@16.6.0/node_modules/@graphql-tools/utils/esm/getResolversFromSchema.js

function getResolversFromSchema(schema, 
// Include default merged resolvers
includeDefaultMergedResolver) {
    var _a, _b;
    const resolvers = Object.create(null);
    const typeMap = schema.getTypeMap();
    for (const typeName in typeMap) {
        if (!typeName.startsWith('__')) {
            const type = typeMap[typeName];
            if ((0,graphql/* isScalarType */.KAw)(type)) {
                if (!(0,graphql/* isSpecifiedScalarType */.u1m)(type)) {
                    const config = type.toConfig();
                    delete config.astNode; // avoid AST duplication elsewhere
                    resolvers[typeName] = new graphql/* GraphQLScalarType */.n2R(config);
                }
            }
            else if ((0,graphql/* isEnumType */.EMj)(type)) {
                resolvers[typeName] = {};
                const values = type.getValues();
                for (const value of values) {
                    resolvers[typeName][value.name] = value.value;
                }
            }
            else if ((0,graphql/* isInterfaceType */.oTV)(type)) {
                if (type.resolveType != null) {
                    resolvers[typeName] = {
                        __resolveType: type.resolveType,
                    };
                }
            }
            else if ((0,graphql/* isUnionType */.EN0)(type)) {
                if (type.resolveType != null) {
                    resolvers[typeName] = {
                        __resolveType: type.resolveType,
                    };
                }
            }
            else if ((0,graphql/* isObjectType */.lpB)(type)) {
                resolvers[typeName] = {};
                if (type.isTypeOf != null) {
                    resolvers[typeName].__isTypeOf = type.isTypeOf;
                }
                const fields = type.getFields();
                for (const fieldName in fields) {
                    const field = fields[fieldName];
                    if (field.subscribe != null) {
                        resolvers[typeName][fieldName] = resolvers[typeName][fieldName] || {};
                        resolvers[typeName][fieldName].subscribe = field.subscribe;
                    }
                    if (field.resolve != null && ((_a = field.resolve) === null || _a === void 0 ? void 0 : _a.name) !== 'defaultFieldResolver') {
                        switch ((_b = field.resolve) === null || _b === void 0 ? void 0 : _b.name) {
                            case 'defaultMergedResolver':
                                if (!includeDefaultMergedResolver) {
                                    continue;
                                }
                                break;
                            case 'defaultFieldResolver':
                                continue;
                        }
                        resolvers[typeName][fieldName] = resolvers[typeName][fieldName] || {};
                        resolvers[typeName][fieldName].resolve = field.resolve;
                    }
                }
            }
        }
    }
    return resolvers;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+schema@8.5.1_graphql@16.6.0/node_modules/@graphql-tools/schema/esm/merge-schemas.js



/**
 * Synchronously merges multiple schemas, typeDefinitions and/or resolvers into a single schema.
 * @param config Configuration object
 */
function mergeSchemas(config) {
    const extractedTypeDefs = asArray(config.typeDefs || []);
    const extractedResolvers = asArray(config.resolvers || []);
    const extractedSchemaExtensions = asArray(config.schemaExtensions || []);
    const schemas = config.schemas || [];
    for (const schema of schemas) {
        extractedTypeDefs.push(schema);
        extractedResolvers.push(getResolversFromSchema(schema, true));
        extractedSchemaExtensions.push(extractExtensionsFromSchema(schema));
    }
    return makeExecutableSchema({
        parseOptions: config,
        ...config,
        typeDefs: extractedTypeDefs,
        resolvers: extractedResolvers,
        schemaExtensions: extractedSchemaExtensions,
    });
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@graphql-tools+schema@8.5.1_graphql@16.6.0/node_modules/@graphql-tools/schema/esm/index.js










/***/ })

};
;