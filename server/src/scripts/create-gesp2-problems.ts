/**
 * 为 GESP 2 级所有课后挑战创建 75 道可评测题目
 * 运行：npx tsx src/scripts/create-gesp2-problems.ts
 */

import { prisma } from '../utils/prisma'

const TENANT_ID = '080ffa34-df87-4566-b1ef-555b88bfe5b8'

const starter = `#include <bits/stdc++.h>
using namespace std;

int main() {
    
    return 0;
}`

const problems = [
  // ===== 课程01：数学函数 =====
  {
    id: 'gesp2-01-01',
    title: '求绝对值',
    description: '<p>输入一个整数，输出它的绝对值。</p>',
    inputDesc: '一个整数 n',
    outputDesc: 'n 的绝对值',
    sampleInput: '-7',
    sampleOutput: '7',
    testCases: [
      { input: '-7', expectedOutput: '7', score: 34 },
      { input: '5', expectedOutput: '5', score: 33 },
      { input: '0', expectedOutput: '0', score: 33 },
    ],
  },
  {
    id: 'gesp2-01-02',
    title: '三个数的最大值',
    description: '<p>输入三个整数，输出其中最大的那个。</p>',
    inputDesc: '三个整数 a、b、c',
    outputDesc: '三个数中的最大值',
    sampleInput: '3 7 5',
    sampleOutput: '7',
    testCases: [
      { input: '3 7 5', expectedOutput: '7', score: 34 },
      { input: '-1 -5 -3', expectedOutput: '-1', score: 33 },
      { input: '8 8 8', expectedOutput: '8', score: 33 },
    ],
  },
  {
    id: 'gesp2-01-03',
    title: '整数平方根',
    description: '<p>输入一个非负整数 n，输出 <code>sqrt(n)</code> 的整数部分（向下取整）。</p>',
    inputDesc: '一个非负整数 n',
    outputDesc: 'sqrt(n) 的整数部分',
    sampleInput: '17',
    sampleOutput: '4',
    testCases: [
      { input: '17', expectedOutput: '4', score: 34 },
      { input: '16', expectedOutput: '4', score: 33 },
      { input: '0', expectedOutput: '0', score: 33 },
    ],
  },
  {
    id: 'gesp2-01-04',
    title: '四舍五入',
    description: '<p>输入一个浮点数，输出它四舍五入后的整数。</p>',
    inputDesc: '一个浮点数 x',
    outputDesc: 'x 四舍五入后的整数',
    sampleInput: '3.6',
    sampleOutput: '4',
    testCases: [
      { input: '3.6', expectedOutput: '4', score: 34 },
      { input: '3.4', expectedOutput: '3', score: 33 },
      { input: '3.5', expectedOutput: '4', score: 33 },
    ],
  },
  {
    id: 'gesp2-01-05',
    title: '生成随机数',
    description: '<p>输入两个整数 a 和 b（a ≤ b），生成并输出一个 [a, b] 范围内的随机整数。</p><p>注意：需要 <code>srand(time(0))</code> 设置种子。</p>',
    inputDesc: '两个整数 a 和 b',
    outputDesc: '一个 [a, b] 范围内的整数',
    sampleInput: '1 6',
    sampleOutput: '3',
    testCases: [
      { input: '1 6', expectedOutput: '3', score: 50 },
      { input: '10 10', expectedOutput: '10', score: 50 },
    ],
  },

  // ===== 课程02：自定义函数 =====
  {
    id: 'gesp2-02-01',
    title: '函数求最大值',
    description: '<p>定义函数 <code>int myMax(int a, int b)</code>，返回两个整数的较大值。在 main 中调用并输出。</p>',
    inputDesc: '两个整数 a 和 b',
    outputDesc: '两个整数的较大值',
    sampleInput: '4 9',
    sampleOutput: '9',
    testCases: [
      { input: '4 9', expectedOutput: '9', score: 50 },
      { input: '-2 -5', expectedOutput: '-2', score: 50 },
    ],
  },
  {
    id: 'gesp2-02-02',
    title: '函数判断奇偶',
    description: '<p>定义函数 <code>bool isEven(int n)</code>，如果 n 是偶数返回 1，否则返回 0。在 main 中调用并输出。</p>',
    inputDesc: '一个整数 n',
    outputDesc: '1 表示偶数，0 表示奇数',
    sampleInput: '8',
    sampleOutput: '1',
    testCases: [
      { input: '8', expectedOutput: '1', score: 34 },
      { input: '7', expectedOutput: '0', score: 33 },
      { input: '0', expectedOutput: '1', score: 33 },
    ],
  },
  {
    id: 'gesp2-02-03',
    title: '函数求阶乘',
    description: '<p>定义函数 <code>int factorial(int n)</code>，返回 n 的阶乘（1 ≤ n ≤ 10）。</p>',
    inputDesc: '一个整数 n',
    outputDesc: 'n 的阶乘',
    sampleInput: '5',
    sampleOutput: '120',
    testCases: [
      { input: '5', expectedOutput: '120', score: 34 },
      { input: '1', expectedOutput: '1', score: 33 },
      { input: '3', expectedOutput: '6', score: 33 },
    ],
  },
  {
    id: 'gesp2-02-04',
    title: '函数判断闰年',
    description: '<p>定义函数 <code>bool isLeap(int year)</code>，如果是闰年返回 1，否则返回 0。</p>',
    inputDesc: '一个整数 year',
    outputDesc: '1 表示闰年，0 表示平年',
    sampleInput: '2020',
    sampleOutput: '1',
    testCases: [
      { input: '2020', expectedOutput: '1', score: 34 },
      { input: '2021', expectedOutput: '0', score: 33 },
      { input: '1900', expectedOutput: '0', score: 33 },
    ],
  },
  {
    id: 'gesp2-02-05',
    title: '函数打印星号矩形',
    description: '<p>定义函数 <code>void printRect(int w, int h)</code>，打印 w 列、h 行的星号矩形。</p>',
    inputDesc: '两个整数 w 和 h',
    outputDesc: 'w×h 的星号矩形',
    sampleInput: '3 2',
    sampleOutput: '***\n***',
    testCases: [
      { input: '3 2', expectedOutput: '***\n***', score: 50 },
      { input: '2 1', expectedOutput: '**', score: 50 },
    ],
  },

  // ===== 课程03：练习课：数学函数与自定义函数 =====
  {
    id: 'gesp2-03-01',
    title: '函数求两数平方和',
    description: '<p>定义函数 <code>int sumOfSquares(int a, int b)</code>，返回 a² + b²。</p>',
    inputDesc: '两个整数 a 和 b',
    outputDesc: 'a² + b²',
    sampleInput: '3 4',
    sampleOutput: '25',
    testCases: [
      { input: '3 4', expectedOutput: '25', score: 50 },
      { input: '0 5', expectedOutput: '25', score: 50 },
    ],
  },
  {
    id: 'gesp2-03-02',
    title: '函数判断完全平方数',
    description: '<p>定义函数 <code>bool isPerfectSquare(int n)</code>，如果 n 是完全平方数返回 1，否则返回 0。</p>',
    inputDesc: '一个非负整数 n',
    outputDesc: '1 或 0',
    sampleInput: '16',
    sampleOutput: '1',
    testCases: [
      { input: '16', expectedOutput: '1', score: 34 },
      { input: '15', expectedOutput: '0', score: 33 },
      { input: '0', expectedOutput: '1', score: 33 },
    ],
  },
  {
    id: 'gesp2-03-03',
    title: '函数模拟掷骰子',
    description: '<p>定义函数 <code>int rollDice()</code>，返回一个 1~6 的随机整数。输入 n，调用 n 次并输出每次结果。</p>',
    inputDesc: '一个整数 n',
    outputDesc: 'n 个 1~6 的整数，空格分隔',
    sampleInput: '3',
    sampleOutput: '3 1 6',
    testCases: [
      { input: '3', expectedOutput: '3 1 6', score: 50 },
      { input: '1', expectedOutput: '4', score: 50 },
    ],
  },
  {
    id: 'gesp2-03-04',
    title: '函数求最大值与最小值之差',
    description: '<p>定义函数 <code>int range(int a, int b, int c)</code>，返回三个数中最大值与最小值之差。</p>',
    inputDesc: '三个整数',
    outputDesc: '最大值 - 最小值',
    sampleInput: '3 7 2',
    sampleOutput: '5',
    testCases: [
      { input: '3 7 2', expectedOutput: '5', score: 50 },
      { input: '5 5 5', expectedOutput: '0', score: 50 },
    ],
  },
  {
    id: 'gesp2-03-05',
    title: '函数求整数次幂',
    description: '<p>定义函数 <code>long long myPow(int base, int exp)</code>，返回 base^exp（exp ≥ 0，结果在 long long 范围内）。</p>',
    inputDesc: '两个整数 base 和 exp',
    outputDesc: 'base 的 exp 次幂',
    sampleInput: '2 10',
    sampleOutput: '1024',
    testCases: [
      { input: '2 10', expectedOutput: '1024', score: 34 },
      { input: '5 0', expectedOutput: '1', score: 33 },
      { input: '3 3', expectedOutput: '27', score: 33 },
    ],
  },

  // ===== 课程04：数据类型转换 =====
  {
    id: 'gesp2-04-01',
    title: '整数除法转小数',
    description: '<p>输入两个整数 a 和 b，输出 a 除以 b 的结果，保留 2 位小数。</p>',
    inputDesc: '两个整数 a 和 b（b ≠ 0）',
    outputDesc: 'a / b，保留 2 位小数',
    sampleInput: '5 2',
    sampleOutput: '2.50',
    testCases: [
      { input: '5 2', expectedOutput: '2.50', score: 50 },
      { input: '7 3', expectedOutput: '2.33', score: 50 },
    ],
  },
  {
    id: 'gesp2-04-02',
    title: '字符转 ASCII 码',
    description: '<p>输入一个字符，输出它的 ASCII 码。</p>',
    inputDesc: '一个字符 c',
    outputDesc: 'c 的 ASCII 码',
    sampleInput: 'A',
    sampleOutput: '65',
    testCases: [
      { input: 'A', expectedOutput: '65', score: 50 },
      { input: 'a', expectedOutput: '97', score: 50 },
    ],
  },
  {
    id: 'gesp2-04-03',
    title: '数字字符转整数',
    description: '<p>输入一个数字字符（'0'~'9'），输出它对应的整数。</p>',
    inputDesc: '一个数字字符',
    outputDesc: '对应的整数',
    sampleInput: '7',
    sampleOutput: '7',
    testCases: [
      { input: '7', expectedOutput: '7', score: 34 },
      { input: '0', expectedOutput: '0', score: 33 },
      { input: '9', expectedOutput: '9', score: 33 },
    ],
  },
  {
    id: 'gesp2-04-04',
    title: '四舍五入保留两位',
    description: '<p>输入一个浮点数，输出四舍五入保留两位小数的结果。</p>',
    inputDesc: '一个浮点数 x',
    outputDesc: '保留两位小数',
    sampleInput: '3.14159',
    sampleOutput: '3.14',
    testCases: [
      { input: '3.14159', expectedOutput: '3.14', score: 34 },
      { input: '2.71828', expectedOutput: '2.72', score: 33 },
      { input: '1.005', expectedOutput: '1.01', score: 33 },
    ],
  },
  {
    id: 'gesp2-04-05',
    title: '整数转字符',
    description: '<p>输入一个整数 n（65~122），输出对应的 ASCII 字符。</p>',
    inputDesc: '一个整数 n',
    outputDesc: '对应的字符',
    sampleInput: '66',
    sampleOutput: 'B',
    testCases: [
      { input: '66', expectedOutput: 'B', score: 50 },
      { input: '122', expectedOutput: 'z', score: 50 },
    ],
  },

  // ===== 课程05：多层循环语句 =====
  {
    id: 'gesp2-05-01',
    title: '打印数字矩形',
    description: '<p>输入 n，输出 n 行 n 列的数字矩形，第 i 行（从 1 开始）全是数字 i。</p>',
    inputDesc: '一个整数 n',
    outputDesc: 'n×n 数字矩形',
    sampleInput: '3',
    sampleOutput: '1 1 1\n2 2 2\n3 3 3',
    testCases: [
      { input: '3', expectedOutput: '1 1 1\n2 2 2\n3 3 3', score: 50 },
      { input: '2', expectedOutput: '1 1\n2 2', score: 50 },
    ],
  },
  {
    id: 'gesp2-05-02',
    title: '打印左下直角三角形',
    description: '<p>输入 n，输出 n 行的左下直角三角形，第 i 行有 i 个 <code>*</code>。</p>',
    inputDesc: '一个整数 n',
    outputDesc: 'n 行三角形',
    sampleInput: '4',
    sampleOutput: '*\n**\n***\n****',
    testCases: [
      { input: '4', expectedOutput: '*\n**\n***\n****', score: 50 },
      { input: '1', expectedOutput: '*', score: 50 },
    ],
  },
  {
    id: 'gesp2-05-03',
    title: '打印九九乘法表一行',
    description: '<p>输入一个整数 n，输出九九乘法表的第 n 行（1×n, 2×n, ..., 9×n）。</p>',
    inputDesc: '一个整数 n（1~9）',
    outputDesc: '九九乘法表第 n 行',
    sampleInput: '3',
    sampleOutput: '3 6 9 12 15 18 21 24 27',
    testCases: [
      { input: '3', expectedOutput: '3 6 9 12 15 18 21 24 27', score: 50 },
      { input: '5', expectedOutput: '5 10 15 20 25 30 35 40 45', score: 50 },
    ],
  },
  {
    id: 'gesp2-05-04',
    title: '打印空心正方形',
    description: '<p>输入 n，输出边长为 n 的空心正方形。</p>',
    inputDesc: '一个整数 n（n ≥ 2）',
    outputDesc: '空心正方形',
    sampleInput: '4',
    sampleOutput: '****\n*  *\n*  *\n****',
    testCases: [
      { input: '4', expectedOutput: '****\n*  *\n*  *\n****', score: 50 },
      { input: '3', expectedOutput: '***\n* *\n***', score: 50 },
    ],
  },
  {
    id: 'gesp2-05-05',
    title: '百钱买百鸡变式',
    description: '<p>公鸡 5 元一只，母鸡 3 元一只，小鸡 1 元三只。输入总钱数 m 和总鸡数 n，输出所有可能的买法数量。</p>',
    inputDesc: '两个整数 m 和 n',
    outputDesc: '方案数',
    sampleInput: '100 100',
    sampleOutput: '3',
    testCases: [
      { input: '100 100', expectedOutput: '3', score: 50 },
      { input: '10 10', expectedOutput: '0', score: 50 },
    ],
  },

  // ===== 课程06：练习课：多层分支结构 =====
  {
    id: 'gesp2-06-01',
    title: 'BMI 分类',
    description: '<p>输入身高 h（米）和体重 w（千克），计算 BMI = w / h²，按如下规则输出：</p><ul><li>BMI < 18.5：偏瘦</li><li>18.5 ≤ BMI < 24：正常</li><li>24 ≤ BMI < 28：偏胖</li><li>BMI ≥ 28：肥胖</li></ul>',
    inputDesc: '两个浮点数 h 和 w',
    outputDesc: '分类结果',
    sampleInput: '1.7 60',
    sampleOutput: '正常',
    testCases: [
      { input: '1.7 60', expectedOutput: '正常', score: 34 },
      { input: '1.6 40', expectedOutput: '偏瘦', score: 33 },
      { input: '1.75 90', expectedOutput: '肥胖', score: 33 },
    ],
  },
  {
    id: 'gesp2-06-02',
    title: '象限判断',
    description: '<p>输入一个点的坐标 (x, y)，输出它所在的象限（第一象限、第二象限、第三象限、第四象限、坐标轴）。</p>',
    inputDesc: '两个浮点数 x 和 y',
    outputDesc: '所在象限或坐标轴',
    sampleInput: '3 -4',
    sampleOutput: '第四象限',
    testCases: [
      { input: '3 -4', expectedOutput: '第四象限', score: 34 },
      { input: '0 5', expectedOutput: '坐标轴', score: 33 },
      { input: '-2 -3', expectedOutput: '第三象限', score: 33 },
    ],
  },
  {
    id: 'gesp2-06-03',
    title: '游乐园票价',
    description: '<p>输入年龄 age，输出票价：</p><ul><li>age < 6：免费</li><li>6 ≤ age < 18：半价 50 元</li><li>18 ≤ age < 60：全价 100 元</li><li>age ≥ 60：免费</li></ul>',
    inputDesc: '一个整数 age',
    outputDesc: '票价',
    sampleInput: '10',
    sampleOutput: '50',
    testCases: [
      { input: '10', expectedOutput: '50', score: 34 },
      { input: '70', expectedOutput: '0', score: 33 },
      { input: '30', expectedOutput: '100', score: 33 },
    ],
  },
  {
    id: 'gesp2-06-04',
    title: '成绩等级',
    description: '<p>输入一个整数分数 score（0~100），输出等级：</p><ul><li>90~100：A</li><li>80~89：B</li><li>70~79：C</li><li>60~69：D</li><li>0~59：E</li></ul>',
    inputDesc: '一个整数 score',
    outputDesc: '等级',
    sampleInput: '85',
    sampleOutput: 'B',
    testCases: [
      { input: '85', expectedOutput: 'B', score: 34 },
      { input: '59', expectedOutput: 'E', score: 33 },
      { input: '100', expectedOutput: 'A', score: 33 },
    ],
  },
  {
    id: 'gesp2-06-05',
    title: '判断三角形类型',
    description: '<p>输入三条边 a、b、c，判断能否组成三角形。如果能，进一步判断是等边、等腰还是普通三角形。</p><p>输出：不能组成三角形 / 等边三角形 / 等腰三角形 / 普通三角形</p>',
    inputDesc: '三个整数 a、b、c',
    outputDesc: '三角形类型',
    sampleInput: '3 4 5',
    sampleOutput: '普通三角形',
    testCases: [
      { input: '3 4 5', expectedOutput: '普通三角形', score: 34 },
      { input: '2 2 2', expectedOutput: '等边三角形', score: 33 },
      { input: '1 2 3', expectedOutput: '不能组成三角形', score: 33 },
    ],
  },

  // ===== 课程07：循环综合应用 =====
  {
    id: 'gesp2-07-01',
    title: '求因子个数',
    description: '<p>输入一个正整数 n，输出它的正因子个数。</p>',
    inputDesc: '一个正整数 n',
    outputDesc: '正因子个数',
    sampleInput: '12',
    sampleOutput: '6',
    testCases: [
      { input: '12', expectedOutput: '6', score: 34 },
      { input: '7', expectedOutput: '2', score: 33 },
      { input: '1', expectedOutput: '1', score: 33 },
    ],
  },
  {
    id: 'gesp2-07-02',
    title: '判断质数',
    description: '<p>输入一个正整数 n，如果是质数输出 YES，否则输出 NO。</p>',
    inputDesc: '一个正整数 n',
    outputDesc: 'YES 或 NO',
    sampleInput: '17',
    sampleOutput: 'YES',
    testCases: [
      { input: '17', expectedOutput: 'YES', score: 34 },
      { input: '18', expectedOutput: 'NO', score: 33 },
      { input: '1', expectedOutput: 'NO', score: 33 },
    ],
  },
  {
    id: 'gesp2-07-03',
    title: '判断完全数',
    description: '<p>输入一个正整数 n，如果它等于除自身外所有因子之和，输出 YES，否则输出 NO。</p>',
    inputDesc: '一个正整数 n',
    outputDesc: 'YES 或 NO',
    sampleInput: '28',
    sampleOutput: 'YES',
    testCases: [
      { input: '28', expectedOutput: 'YES', score: 34 },
      { input: '12', expectedOutput: 'NO', score: 33 },
      { input: '6', expectedOutput: 'YES', score: 33 },
    ],
  },
  {
    id: 'gesp2-07-04',
    title: '判断回文数',
    description: '<p>输入一个正整数 n，如果正读反读相同，输出 YES，否则输出 NO。</p>',
    inputDesc: '一个正整数 n',
    outputDesc: 'YES 或 NO',
    sampleInput: '12321',
    sampleOutput: 'YES',
    testCases: [
      { input: '12321', expectedOutput: 'YES', score: 34 },
      { input: '1234', expectedOutput: 'NO', score: 33 },
      { input: '7', expectedOutput: 'YES', score: 33 },
    ],
  },
  {
    id: 'gesp2-07-05',
    title: '鸡兔同笼',
    description: '<p>输入头数 h 和脚数 f，输出鸡和兔的数量。假设全是鸡和兔，且都有 4 只脚。如果无解，输出 NO。</p>',
    inputDesc: '两个整数 h 和 f',
    outputDesc: '鸡的数量和兔的数量，空格分隔；或 NO',
    sampleInput: '3 8',
    sampleOutput: '2 1',
    testCases: [
      { input: '3 8', expectedOutput: '2 1', score: 50 },
      { input: '3 7', expectedOutput: 'NO', score: 50 },
    ],
  },

  // ===== 课程08：图形打印1 =====
  {
    id: 'gesp2-08-01',
    title: '打印等腰三角形',
    description: '<p>输入 n，输出底边为 2n-1 个 <code>*</code> 的等腰三角形。</p>',
    inputDesc: '一个整数 n',
    outputDesc: '等腰三角形',
    sampleInput: '3',
    sampleOutput: '  *\n ***\n*****',
    testCases: [
      { input: '3', expectedOutput: '  *\n ***\n*****', score: 50 },
      { input: '2', expectedOutput: ' *\n***', score: 50 },
    ],
  },
  {
    id: 'gesp2-08-02',
    title: '打印右下直角三角形',
    description: '<p>输入 n，输出 n 行的右下直角三角形，第 i 行有 i 个 <code>*</code>，右侧对齐。</p>',
    inputDesc: '一个整数 n',
    outputDesc: '右下直角三角形',
    sampleInput: '4',
    sampleOutput: '   *\n  **\n ***\n****',
    testCases: [
      { input: '4', expectedOutput: '   *\n  **\n ***\n****', score: 50 },
      { input: '2', expectedOutput: ' *\n**', score: 50 },
    ],
  },
  {
    id: 'gesp2-08-03',
    title: '打印数字金字塔',
    description: '<p>输入 n，输出 n 行的数字金字塔，第 i 行输出 1 到 i 再输出 i-1 到 1。</p>',
    inputDesc: '一个整数 n',
    outputDesc: '数字金字塔',
    sampleInput: '3',
    sampleOutput: '  1\n 121\n12321',
    testCases: [
      { input: '3', expectedOutput: '  1\n 121\n12321', score: 50 },
      { input: '2', expectedOutput: ' 1\n121', score: 50 },
    ],
  },
  {
    id: 'gesp2-08-04',
    title: '打印菱形',
    description: '<p>输入 n，输出由 <code>*</code> 组成的菱形，上半部分 n 行。</p>',
    inputDesc: '一个整数 n',
    outputDesc: '菱形',
    sampleInput: '3',
    sampleOutput: '  *\n ***\n*****\n ***\n  *',
    testCases: [
      { input: '3', expectedOutput: '  *\n ***\n*****\n ***\n  *', score: 50 },
      { input: '2', expectedOutput: ' *\n***\n *', score: 50 },
    ],
  },
  {
    id: 'gesp2-08-05',
    title: '打印空心菱形',
    description: '<p>输入 n，输出由 <code>*</code> 组成的空心菱形，上半部分 n 行。</p>',
    inputDesc: '一个整数 n（n ≥ 2）',
    outputDesc: '空心菱形',
    sampleInput: '4',
    sampleOutput: '   *\n  * *\n *   *\n*     *\n *   *\n  * *\n   *',
    testCases: [
      { input: '4', expectedOutput: '   *\n  * *\n *   *\n*     *\n *   *\n  * *\n   *', score: 50 },
      { input: '3', expectedOutput: '  *\n * *\n*   *\n * *\n  *', score: 50 },
    ],
  },
]

async function main() {
  for (const p of problems) {
    await prisma.problem.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        description: p.description,
        inputDesc: p.inputDesc,
        outputDesc: p.outputDesc,
        sampleInput: p.sampleInput,
        sampleOutput: p.sampleOutput,
        starterCode: starter,
        tenantId: TENANT_ID,
        difficulty: 'easy',
        timeLimit: 1000,
        memoryLimit: 128,
        gespLevel: 2,
      },
      create: {
        id: p.id,
        title: p.title,
        description: p.description,
        inputDesc: p.inputDesc,
        outputDesc: p.outputDesc,
        sampleInput: p.sampleInput,
        sampleOutput: p.sampleOutput,
        starterCode: starter,
        tenantId: TENANT_ID,
        difficulty: 'easy',
        timeLimit: 1000,
        memoryLimit: 128,
        gespLevel: 2,
      },
    })

    await prisma.testCase.deleteMany({ where: { problemId: p.id } })

    for (let i = 0; i < p.testCases.length; i++) {
      const tc = p.testCases[i]
      await prisma.testCase.create({
        data: {
          problemId: p.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          score: tc.score,
          sortOrder: i,
          isHidden: false,
        },
      })
    }

    console.log(`✅ 题目 ${p.id} 创建/更新成功`)
  }

  console.log('\n🎉 第一批 GESP2 课后练习题创建完成')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
