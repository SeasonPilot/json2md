// 引入fs模块，用于操作文件系统
const fs = require("fs");

// 引入conversations.json文件，这是您导出的json数据
const data = require("./conversations.json");

// 定义一个异步函数，用于将导出数据转换成markdown并保存为文件
async function saveFile(exportData, dateStr) {
    // 将 dateStr 参数转换成 Date 对象
    const date = new Date(dateStr);

    // 使用 forEach 两层循环获取 conversationRecords 的值
    exportData.forEach((obj) => {
        // 将 sessionName 的值转换成 Date 对象
        const sessionDate = new Date(Date.parse(obj.sessionName));
        // 如果 sessionDate 晚于 date 参数，就继续调用 writeFile 函数
        if (sessionDate >= date) {

            // 定义一个空字符串，用于存储转换后的markdown内容
            let output = "";

            // 第一层循环遍历每个对象
            // 遍历导出数据中的conversationRecords数组，提取每一条对话的问题和答案
            obj.conversationRecords.forEach((data) => {
                // 第二层循环遍历每个对象的 conversationRecords 数组
                // 将问题和答案按照markdown的格式拼接到output字符串中，并加上分隔符
                output += `Question:\n\n${data.question}\n\nAnswer:\n\n${data.answer}\n\n<hr/>\n\n`;
            });
            writeFile(obj.sessionName, output)
        }
    });
}

function writeFile(sessionName, output) {
    // 将斜杠替换为短横线
    const hyphenString = sessionName.replace(/\//g, "-");

    // 将空格替换为下划线
    const outputString = hyphenString.replace(" ", "_");

    const fileName = "./chatgptbox/" + outputString + ".md";

    fs.writeFile(fileName, output, (err) => {
        // 如果发生错误，打印错误信息
        if (err) {
            console.error(err);
        } else {
            // 如果成功，打印成功信息
            console.log(`File saved as ${fileName}`);
        }
    });
}

// 调用异步函数，并传入data变量和一个日期字符串作为参数
// noinspection JSIgnoredPromiseFromCall
// use a comment to suppress the inspection
saveFile(data, '2023/4/23 22:47:11');
