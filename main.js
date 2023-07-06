// 引入fs模块，用于操作文件系统
const fs = require('fs');
// 引入process模块，用于获取命令行参数
const process = require('process');
// 引入path模块，用于处理文件路径
const path = require('path');

// 使用process.argv数组获取命令行参数，例如node jsonScript.js config.json
const configFile = process.argv[2] || 'config.json';
// 使用path.resolve函数将相对路径转换为绝对路径，例如path.resolve(__dirname, process.argv[2])
const configPath = path.resolve(__dirname, configFile);

// 使用require函数加载配置文件，例如const config = require(path.resolve(__dirname, process.argv[2]))
const config = require(configPath);

// 引入conversations.json文件，这是您导出的json数据
const data = require(config.data);

// 使用config.data和config.dateStr替换原来的硬编码参数，例如saveFile(config.data, config.dateStr)
saveFile(data, config.dateStr);

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
            let output = '';
            if (obj.question == null || obj.conversationRecords.length === 0) {
                return;
            }

            const lines = obj.question.split('\n');
            let text = lines[lines.length - 1];
            if (text.length > 100) {
                text = text.substring(0, 100); // 从第 0 个字符开始截取到第100个字符
            }

            // 将斜杠替换为空
            text = text.replace(/\//g, '');
            // 第一层循环遍历每个对象
            // 遍历导出数据中的conversationRecords数组，提取每一条对话的问题和答案
            obj.conversationRecords.forEach((data) => {
                // 第二层循环遍历每个对象的 conversationRecords 数组
                // 将问题和答案按照markdown的格式拼接到output字符串中，并加上分隔符
                output += `Question:\n\n${data.question}\n\nAnswer:\n\n${data.answer}\n\n<hr/>\n\n`;
            });
            writeFile(obj.sessionName, text, output);
        }
    });
}

function writeFile(sessionName, question, output) {
    // 将斜杠替换为短横线
    const hyphenString = sessionName.replace(/\//g, '-');
    // 将空格替换为中划线
    const outputString = hyphenString.replace(' ', '-');
    const fileName = `./chatgptbox/${outputString}${question}.md`;
    // 判断文件是否已经存在，如果已经存在则跳过
    fs.access(fileName, fs.constants.F_OK, (err) => {
        if (err) {
            // 如果文件不存在，就调用fs.writeFile函数写入文件
            fs.writeFile(fileName, output, (err) => {
                // 如果发生错误，打印错误信息
                if (err) {
                    console.error(`fs.writeFile ERR: ${err}`);
                    console.log(`Session name: ${sessionName}`);
                } else {
                    // 如果成功，打印成功信息
                    console.log(`File saved as ${fileName}`);
                }
            });
        } else {
            // 如果文件已经存在，就打印提示信息
            console.log(`File already exists: ${fileName}`);
        }
    });
}
