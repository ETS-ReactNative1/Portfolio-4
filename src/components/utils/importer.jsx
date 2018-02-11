export const importAllFrom = (require) => {
    var result = {};
    require.keys().map((item, index) => { result[item.replace('./', '')] = require(item); return true; });
    return result;
}
