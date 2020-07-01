/**
* @Author: 元实
* @Date:   2020-06-11
* @Description: Spreadsheet组件的表格组件
*/

<template>
  <table class="spread-table" @keydown="moveSelection">
    <tbody>
      <Row
        v-for="(row, idx) in resultingLayout"
        :row="row"
        :key="`row${idx}`"
        :rowIdx="idx"
        :colsQnty="colsQnty"
        :selectedCell="cellPosition"
        @change-value="updateValue"
        @set-selected="handleCellSelected"
      ></Row>
    </tbody>
  </table>
</template>

<script>
import Row from "../Row";
import { parseRange } from "../utils.js";

export default {
  components: {
    Row
  },

  props: ["layout", "data"],

  data() {
    return {
      rowsQnty: 0, //行数
      colsQnty: 0, //列数
      prevRowNo: 0, //行的索引
      sortedLayout: [], //缺席的行是用空行补充的
      resultingLayout: [], //缺席的行是用空行补充的
      currIdx: 0, //单元格的索引

      //单元格座位
      cellPosition: {
        row: -1, //行
        col: -1 //列
      }
    };
  },

  mounted() {
    this.processLayoutData();
    this.insertAbsentCells();
    this.getRowsQnty();
    window.addEventListener("keydown", evt => this.moveSelection(evt));
  },

  methods: {
    /**
     * 处理布局数据
     */
    processLayoutData() {
      this.sortRows();
      this.addMissingRows();
      this.processEachRow();
    },

    /**
     * 排序列表里的行
     */
    sortRows() {
      this.layout.sort((rowOne, rowTwo) => {
        const rowOneNum = parseRange(rowOne[0].row).start;
        const rowTwoNum = parseRange(rowTwo[0].row).start;

        return rowOneNum - rowTwoNum;
      });
    },

    /**
     * 补充缺少的行
     */
    addMissingRows() {
      this.layout.forEach(row => {
        let curRowNo = parseRange(row[0].row).start;
        let delta = curRowNo - this.prevRowNo;

        if (delta > 1) {
          this.insertEmpryRows(delta);
        }
        this.prevRowNo = curRowNo;
        this.sortedLayout.push(row);
      });
    },

    /**
     * 加上空行
     * @param {number} rowQntyToInsert 要加上几行
     */
    insertEmpryRows(rowQntyToInsert) {
      for (let i = 0; i < rowQntyToInsert - 1; i++) {
        this.sortedLayout.push([]);
      }
    },

    /**
     * 处理每一行的数据
     */
    processEachRow() {
      this.sortedLayout.forEach(row => {
        this.sortCols(row);
        this.splitSpannedRows(row);
        if (row.length) {
          this.getColsQnty(row);
        }
      });
    },

    /**
     * 排序每一行里的单元格
     * @param {Array} row 行
     */
    sortCols(row) {
      row.sort((cellOne, cellTwo) => {
        const colOneNum = parseRange(cellOne.col).start;
        const colTwoNum = parseRange(cellTwo.col).start;

        return colOneNum - colTwoNum;
      });
    },

    /**
     * 切开占几行的单元格
     */
    splitSpannedRows(row) {
      row.forEach(cell => {
        const parsedRowNum = parseRange(cell.row);
        const startRow = parsedRowNum.start;
        const endRow = parsedRowNum.end;

        if (startRow < endRow) {
          for (let i = startRow; i < endRow; i++) {
            this.insertSplittedCellIntoRow(cell, i);
          }
        }
      });
    },

    /**
     * 插入切开的单元格
     */
    insertSplittedCellIntoRow(cell, idx) {
      const newCell = {
        row: `${idx + 1}:${idx + 1}`,
        col: cell.col,
        hidden: true
      };

      this.sortedLayout[idx].push(newCell);
    },

    /**
     * 获取列表的列数
     * @param {Array} row 列表的一行
     */
    getColsQnty(row) {
      const length = row.length;
      const maxColNum = parseRange(row[length - 1].col).end;

      if (maxColNum > this.colsQnty) {
        this.colsQnty = maxColNum;
      }
    },

    /**
     * 获取列表的行数
     */
    getRowsQnty() {
      const length = this.resultingLayout.length;

      this.rowsQnty = parseRange(this.resultingLayout[length - 1][0].row).start;
    },

    /**
     * 用空行补充列表
     */
    setFullRowsLayout() {
      const presentRowsQnty = this.sortedRowsLayout.length;
      const rowsQntyNum = this.rowsQnty;

      if (presentRowsQnty < rowsQntyNum) {
        for (let i = 0; i < rowsQntyNum; i++) {
          if (!this.isRowPresent(i + 1)) {
            this.insertEmptyRow(i);
          }
        }
      }
    },

    /**
     * 布局数组是不是有这一行
     * @param {number} num 第几行
     * @returns {boolean} true - 有, false - 没有
     */
    isRowPresent(num) {
      return (
        this.sortedRowsLayout.findIndex(row => {
          const rowNum = parseRange(row[0].row).start; //Number(row[0].row.match(/^(\d+)/)[1]);

          if (rowNum === num) {
            return true;
          }

          return false;
        }) !== -1
      );
    },

    /**
     * 插入空行
     * @param {number} idx 布局数组里的索引，指需要插入空行的地方
     */
    insertEmptyRow(idx) {
      this.sortedLayout.splice(idx, 0, []);
    },

    /**
     * 插入缺少的单元格
     */
    insertAbsentCells() {
      const maxCols = this.colsQnty;

      this.sortedLayout.forEach((row, idx) => {
        const rowLength = row.length;

        this.resultingLayout.push([...row]);
        for (let i = 1; i <= maxCols; i++) {
          if (!rowLength || !this.isCellPresent(i, row)) {
            this.resultingLayout[idx].splice(i - 1, 0, {
              row: `${idx + 1}:${idx + 1}`,
              col: `${i}:${i}`,
              selected: false
            });
          }
        }
        this.currIdx = 0;
      });
    },

    /**
     * 这一行是不是有这第几列的单元格
     * @param {number} colNo 第几列
     * @return {boolean} true - 有, false - 没有
     */
    isCellPresent(colNo, row) {
      let parsedColNo = parseRange(row[this.currIdx].col);
      let startColNo = parsedColNo.start;
      let endColNo = parsedColNo.end;

      if (startColNo <= colNo && colNo <= endColNo) {
        if (colNo === endColNo && this.currIdx + 1 !== row.length) {
          this.currIdx++;
        }
        return true;
      } else {
        return false;
      }
    },

    /**
     * 修改值的时候发出事件
     * @param {Object} cell 修改的单元格
     */
    updateValue(cell) {
      this.$emit("change-value", cell);
    },

    /**
     * 处理set-edit事件
     * @param {Object} cellPosition 单元格的座位(row行，col列)
     */
    handleCellSelected(cellPosition) {
      // if (position.row !== -1 && position.col !== -1) {
      //     this.rowsSet[position.row][position.col].selected = false;
      // }
      this.cellPosition = {
        row: cellPosition.rowIdx,
        col: cellPosition.colIdx
      };
    },

    /**
     * 移动选择框
     * @param {Object} evt 事件对象
     */
    moveSelection(evt) {
      switch (evt.key) {
        case "ArrowRight":
          this.moveSelectionInRow(1);
          break;
        case "ArrowLeft":
          this.moveSelectionInRow(2);
          break;
        case "ArrowDown":
          this.moveSelectionInColumn(1);
          break;
        case "ArrowUp":
          this.moveSelectionInColumn(2);
          break;
      }
    },

    /**
     * 横着移动选择框
     * @param {number} direction 1 - 往右，2 - 往左
     */
    moveSelectionInRow(direction) {
      if (direction === 1) {
        this.cellPosition = this.findNearestEditableCellRight();
      } else {
        this.cellPosition = this.findNearestEditableCellLeft();
      }
    },

    /**
     * 找到下一个可编辑的单元格
     */
    findNearestEditableCellRight() {
      const position = this.cellPosition;
      let col = this.cellPosition.col;
      let cellIdx = 0;
      const length = this.resultingLayout[position.row].length;

      if (col === length - 1) {
        col = 0;
      }

      for (let i = col + 1; i < length; i++) {
        let cell = this.resultingLayout[position.row][i];

        if (cell.editable) {
          cellIdx = i;
          break;
        }

        if (i === length - 1) {
          i = 0;
        }
      }

      return {
        col: cellIdx,
        row: position.row
      };
    },

    /**
     * 找到上一个可编辑的单元格
     */
    findNearestEditableCellLeft() {
      const position = this.cellPosition;
      let col = this.cellPosition.col;
      let cellIdx = 0;
      const length = this.resultingLayout[position.row].length;

      if (col === 0) {
        col = length - 1;
      }

      for (let i = col - 1; i >= 0; i--) {
        let cell = this.resultingLayout[position.row][i];

        if (cell.editable) {
          cellIdx = i;
          break;
        }

        if (i === 0) {
          i = length;
        }
      }

      return {
        col: cellIdx,
        row: position.row
      };
    },

    /**
     * 竖着移动选择框
     * @param {number} direction 1 - 往下，2 - 往上
     */
    moveSelectionInColumn(direction) {
      if (direction === 1) {
        this.cellPosition = this.findNearestEditableCellDown();
      } else {
        this.cellPosition = this.findNearestEditableCellUp();
      }
    },

    /**
     * 找到下一个可编辑的单元格
     */
    findNearestEditableCellDown() {
      const position = this.cellPosition;
      let row = this.cellPosition.row;
      let rowIdx = 0;
      const rowsQnty = this.rowsQnty;

      if (row === rowsQnty - 1) {
        row = 0;
      }

      for (let i = row + 1; i < rowsQnty; i++) {
        let col = this.getColNum(i, position.col);
        console.log("col--", col);
        let cell = this.resultingLayout[i][col];

        if (cell.editable) {
          rowIdx = i;
          break;
        }

        if (i === rowsQnty - 1) {
          i = 0;
        }
      }

      return {
        col: position.col,
        row: rowIdx
      };
    },

    /**
     * 竖着移动的时候获取单元格的列号
     */
    getColNum(rowNo, colNo) {
      const row = this.resultingLayout[rowNo];

      return row.findIndex(cell => {
        const parsedColNo = parseRange(cell.col);
        const start = parsedColNo.start;
        const end = parsedColNo.end;

        console.log(start, end, colNo);
        if (start <= colNo + 1 && colNo + 1 <= end) {
          return true;
        }
      });
    },

    /**
     * 找到上一个可编辑的单元格
     */
    findNearestEditableCellUp() {
      const position = this.cellPosition;
      let row = this.cellPosition.row;
      let rowIdx = 0;
      const rowsQnty = this.rowsQnty;

      if (row === 0) {
        row = rowsQnty - 1;
      }

      for (let i = row - 1; i >= 0; i--) {
        let cell = this.resultingLayout[i][position.col];

        if (cell.editable) {
          rowIdx = i;
          break;
        }

        if (i === 0) {
          i = rowsQnty;
        }
      }

      return {
        col: position.col,
        row: rowIdx
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.spread-table {
  /*width: 100%;*/
  border-collapse: collapse;
  table-layout: fixed;
}
</style>