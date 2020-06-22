/**
 * @Author: 元实
 * @Date:   2020-06-11
 * @Description: Spreadsheet组件的表格组件
 */

/**
 * 把列或者行范围分成开始列（行）和结束列（行）
 * @param {string} range 列(行)范围
 * @return {Array} 包括开始列（行）和结束列的数组
 */
export function parseRange(range) {
    const splitRange = range.split(':');

    return splitRange;
}