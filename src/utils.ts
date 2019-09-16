var snakeCase = require('lodash.snakecase')
var camelCase = require('lodash.camelcase')

export function toDB(camelCaseObject) {
    if (Array.isArray(camelCaseObject)) {
        return camelCaseObject.map(toDB)
    }
    const snakeCaseObject = {}
    Object.keys(camelCaseObject).forEach(key => {
        snakeCaseObject[snakeCase(key)] = camelCaseObject[key]
    })
    return snakeCaseObject
}

export function fromDB(snakeCaseObject: any) {
    if (Array.isArray(snakeCaseObject)) {
        return snakeCaseObject.map(fromDB)
    }
    const camelCaseObject = {}
    Object.keys(snakeCaseObject).forEach(key => {
        camelCaseObject[camelCase(key)] = snakeCaseObject[key]
    })
    return camelCaseObject
}
